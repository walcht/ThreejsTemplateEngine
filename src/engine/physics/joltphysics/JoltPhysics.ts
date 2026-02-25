import type { IPhysicsEngine } from "../PhysicsEngine";
import initJolt from "jolt-physics";
import joltWasmUrl from "jolt-physics/jolt-physics.wasm.wasm?url";

import { MotionType, type Rigidbody } from "../Rigidbody";
import { Engine } from "../../engine";
import { Quaternion, Vector3 } from "three";
import { Collider, ColliderType } from "../Collider";
import type { BoxCollider } from "../BoxCollider";
import type Jolt from "jolt-physics";

const LAYER_MOVING = 0;
const LAYER_NON_MOVING = 1;
const NUM_OBJECT_LAYERS = 2;

class JoltPhysics implements IPhysicsEngine {

  private _jolt?: typeof initJolt;
  private _physicsEngine?: Jolt.JoltInterface;
  private _physicsSystem?: Jolt.PhysicsSystem;
  private _physicsBodyInterface?: Jolt.BodyInterface;

  // to avoid error-prone memory management
  private _tmpVec3?: Jolt.Vec3;
  private _tmpRVec3?: Jolt.RVec3;
  private _tmpQuat?: Jolt.Quat;

  private _rigidBodies: Map<number, Rigidbody> = new Map<number, Rigidbody>();

  public wrapRVec3(v: Jolt.RVec3): Vector3 { return new Vector3(v.GetX(), v.GetY(), v.GetZ()); }
  public wrapQuat(q: Jolt.Quat): Quaternion { return new Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW()); }
  // wrapVec3(v: Jolt.Vec3): Vector3 { return new Vector3(v.GetX(), v.GetY(), v.GetZ()); }

  public async init() {
    this._jolt = await initJolt({ locateFile: () => joltWasmUrl });

    // construct caching elements to avoid manual memory management
    this._tmpVec3 = new this._jolt.Vec3();
    this._tmpRVec3 = new this._jolt.RVec3();
    this._tmpQuat = new this._jolt.Quat();

    {
      const settings = new this._jolt.JoltSettings();
      settings.mMaxWorkerThreads = 1;
      this.setupCollisionFiltering(settings);
      this._physicsEngine = new this._jolt.JoltInterface(settings);
      this._jolt.destroy(settings);
    }
    this._physicsSystem = this._physicsEngine.GetPhysicsSystem();
    this._physicsBodyInterface = this._physicsSystem.GetBodyInterface();
  }

  public step() {
    // make sure to call fixedUpdate on all MonoBehaviours that have it (has to
    // be done before physics.step() because forces are potentially added here).
    // TODO: call fixedUpdate from physics engine
    // for (const [_, go] of this._monoBehaviours) {

    //   if (go.fixedUpdate) go.fixedUpdate(Engine.fixedUpdateDelta);

    // }

    // step the physics world once
    this._physicsEngine!.Step(Engine.fixedUpdateDelta, 1);

    // console.log(`[physics] step - delta: ${Engine.fixedUpdateDelta * 1000}ms`);

    setTimeout(this.step.bind(this), Engine.fixedUpdateDelta * 1000);
  }

  public sync() {

    // console.log(`[physics] ${this._rigidBodies.size} object(s) to sync`);

    // for each physics object, get the latest updated physics position and
    // rotation, and update their ThreeJS object representations.
    for (const [_, rb] of this._rigidBodies) {

      const body: initJolt.Body = rb.GetPhysicsBody();

      rb.gameObject.obj.position.copy(this.wrapRVec3(body.GetPosition()));
      rb.gameObject.obj.quaternion.copy(this.wrapQuat(body.GetRotation()));

    }
  }


  /**
   * Creates the JoltPhysics body (via CreateBody() function).
   */
  private _createBody(shape: initJolt.BoxShape, pos: initJolt.RVec3, rot: initJolt.Quat, motionType: MotionType,
    layer: number): initJolt.Body | undefined {

    const settings = new this._jolt!.BodyCreationSettings(shape, pos, rot, this._jolt!.EMotionType_Dynamic, layer);
    switch (motionType) {
      case MotionType.DYNAMIC:
        settings.mMotionType = this._jolt!.EMotionType_Dynamic;
        break;
      case MotionType.STATIC:
        settings.mMotionType = this._jolt!.EMotionType_Static;
        break;
      case MotionType.KINEMATIC:
        settings.mMotionType = this._jolt!.EMotionType_Kinematic;
        break;
    }

    settings.mRestitution = 0.5;

    let body = this._physicsBodyInterface?.CreateBody(settings);
    this._jolt!.destroy(settings);
    return body;

  }


  public add(rb: Rigidbody): number {

    // if the Rigidbody does not have any attached colliders => return
    const collider = rb.gameObject.GetComponent<Collider>(Collider);
    if (collider == undefined) return -1;

    switch (collider.type) {

      case ColliderType.BOX_COLLIDER:
        {
          const bx = collider as BoxCollider;
          // get half extent from collider
          this._tmpVec3!.SetX(bx.size.x / 2);
          this._tmpVec3!.SetY(bx.size.y / 2);
          this._tmpVec3!.SetZ(bx.size.z / 2);
          const shape = new this._jolt!.BoxShape(this._tmpVec3!);

          const _pos = new Vector3().copy(bx.center);
          rb.gameObject.obj.localToWorld(_pos);

          this._tmpRVec3!.SetX(_pos.x);
          this._tmpRVec3!.SetY(_pos.y);
          this._tmpRVec3!.SetZ(_pos.z);

          const _rot = new Quaternion();
          rb.gameObject.obj.getWorldQuaternion(_rot);

          this._tmpQuat!.SetX(_rot.x);
          this._tmpQuat!.SetY(_rot.y);
          this._tmpQuat!.SetZ(_rot.z);
          this._tmpQuat!.SetW(_rot.w);

          const body = this._createBody(shape, this._tmpRVec3!, this._tmpQuat!, rb.motionType, rb.gameObject.layer);
          if (body) {
            rb.SetPhysicsBody(body);
            this._physicsBodyInterface!.AddBody(body.GetID(), this._jolt!.EActivation_Activate);
          }

          // cleanup
          // shape.Release();

          if (!body) {
            console.warn(`[physics] failed to create Jolt body for BoxCollider`);
            return -1;
          }

          break;
        }

      default:
        return -1;
    }

    const id = this._rigidBodies.size;
    this._rigidBodies.set(id, rb);

    return id;
  }

  public del(objId: number) {
    return this._rigidBodies.delete(objId);
  }

  private setupCollisionFiltering(settings: Jolt.JoltSettings) {
    // Layer that objects can be in, determines which other objects it can collide with
    // Typically you at least want to have 1 layer for moving bodies and 1 layer for static bodies, but you can have more
    // layers if you want. E.g. you could have a layer for high detail collision (which is not used by the physics simulation
    // but only if you do collision testing).
    let objectFilter = new this._jolt!.ObjectLayerPairFilterTable(NUM_OBJECT_LAYERS);
    objectFilter.EnableCollision(LAYER_NON_MOVING, LAYER_MOVING);
    objectFilter.EnableCollision(LAYER_MOVING, LAYER_MOVING);

    // Each broadphase layer results in a separate bounding volume tree in the broad phase. You at least want to have
    // a layer for non-moving and moving objects to avoid having to update a tree full of static objects every frame.
    // You can have a 1-on-1 mapping between object layers and broadphase layers (like in this case) but if you have
    // many object layers you'll be creating many broad phase trees, which is not efficient.
    const BP_LAYER_NON_MOVING = new this._jolt!.BroadPhaseLayer(0);
    const BP_LAYER_MOVING = new this._jolt!.BroadPhaseLayer(1);
    const NUM_BROAD_PHASE_LAYERS = 2;
    let bpInterface = new this._jolt!.BroadPhaseLayerInterfaceTable(NUM_OBJECT_LAYERS, NUM_BROAD_PHASE_LAYERS);
    bpInterface.MapObjectToBroadPhaseLayer(LAYER_NON_MOVING, BP_LAYER_NON_MOVING);
    bpInterface.MapObjectToBroadPhaseLayer(LAYER_MOVING, BP_LAYER_MOVING);

    settings.mObjectLayerPairFilter = objectFilter;
    settings.mBroadPhaseLayerInterface = bpInterface;
    settings.mObjectVsBroadPhaseLayerFilter = new this._jolt!.ObjectVsBroadPhaseLayerFilterTable(settings.mBroadPhaseLayerInterface, NUM_BROAD_PHASE_LAYERS, settings.mObjectLayerPairFilter, NUM_OBJECT_LAYERS);

    // cleanup
    this._jolt!.destroy(BP_LAYER_MOVING);
    this._jolt!.destroy(BP_LAYER_NON_MOVING);
  }
};

export { JoltPhysics };
