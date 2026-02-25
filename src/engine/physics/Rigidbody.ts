import type { Quaternion, Vector3 } from "three";
import { Component } from "../Component";
import type { GameObject } from "../GameObject";

const MotionType = {
  STATIC: 0,
  DYNAMIC: 1,
  KINEMATIC: 2,
} as const;

type MotionType = (typeof MotionType)[keyof typeof MotionType];

/**
 * Provides controls for an object's position and rotation using underlying
 * real-time physics engine simulation.
 *
 */
class Rigidbody extends Component {

  private _physicsBody: any;

  constructor(
    gameObject: GameObject,
    mass: number = 1, motionType: MotionType = MotionType.DYNAMIC) {

    super(gameObject);

    this.mass = mass;
    this.position = this.gameObject.obj.position;
    this.rotation = this.gameObject.obj.quaternion;
    this._motionType = motionType;
  }

  /*
   * Object's mass in kilograms.
   */
  public mass: number;

  public position: Vector3;
  public rotation: Quaternion;

  public SetPhysicsBody(body: any) {
    this._physicsBody = body;
  }

  public GetPhysicsBody(): any {
    return this._physicsBody;
  }

  // TODO
  public AddForce() { }

  private _motionType: MotionType;
  public get motionType(): MotionType {
    return this._motionType;
  }
  public set motionType(value: MotionType) {
    this._motionType = value;
  }

};

export { Rigidbody, MotionType };
