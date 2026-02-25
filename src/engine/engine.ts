import { AmbientLight, BoxGeometry, BufferGeometry, Color, DirectionalLight, Mesh, OrthographicCamera, PlaneGeometry, Scene, Timer, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { MeshPhongMaterial } from "three";
import type { MonoBehaviour } from "./MonoBehaviour";
import type { IPhysicsEngine } from "./physics/PhysicsEngine";
import { JoltPhysics } from "./physics/joltphysics/JoltPhysics";
import { GameObject } from "./GameObject";
import { BoxCollider } from "./physics/BoxCollider";
import { MotionType, Rigidbody } from "./physics/Rigidbody";

type EngineOptions = {
  container: HTMLCanvasElement;
  maxPixelCount?: number;
}

const LAYER_MOVING = 0;
const LAYER_NON_MOVING = 1;
// const NUM_OBJECT_LAYERS = 2;

/**
* Holds all elements related to a 3D ThreeJS world. E.g., the main scene, the
* camera, the renderers, etc. This is essentially the engine that starts the
* game loop.
* */
class Engine {

  readonly container: HTMLCanvasElement;
  readonly clock: Timer;

  ////////////////////////////////// 3D PRIMITIVES /////////////////////////////

  public static readonly UNITY_LINE_GEOMETRY: BufferGeometry = new BufferGeometry()
    .setFromPoints([new Vector3(0, 0, 0), new Vector3(1, 0, 0)]);

  //////////////////////////////////////////////////////////////////////////////

  private gameObjects: Map<number, MonoBehaviour>;

  public static mainCamera: OrthographicCamera;
  public static mainCameraController: OrbitControls;

  public static readonly scene: Scene = new Scene();
  private requestID: number | null = null;
  private isInitialized: Boolean = false;

  private directionalLight: DirectionalLight = new DirectionalLight(0xf0f0f0, 1);

  public static fixedUpdateDelta: number = 1.0 / 30.0;

  private _physicsEngine?: IPhysicsEngine;

  private renderer: WebGLRenderer;

  private maxPixelCount: number = 3840 * 2160;

  constructor(options: EngineOptions) {
    this.container = options.container;
    this.gameObjects = new Map<number, MonoBehaviour>();
    this.clock = new Timer();

    // initialize the renderer
    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.container });

    // initialize the scene and its default settings (e.g., light, grid, etc.)
    Engine.scene.background = new Color().setHex(0xf0f0f0);
    this._defaultLightSetting();

    // initialize the main camera (settings will be reset on _onResize())
    Engine.mainCamera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
    Engine.mainCameraController = new OrbitControls(Engine.mainCamera, this.container);
    Engine.mainCamera.position.z = 50;
    Engine.mainCameraController.zoomToCursor = true;
    Engine.mainCameraController.minZoom = 0.01;
    Engine.mainCameraController.maxZoom = 5;
    Engine.mainCamera.zoom = 0.05;

    // responsiveness (i.e., set renderer and camera params according to window
    // size)
    addEventListener("resize", () => {
      this._onResize();
    });
    this._onResize();
  }

  private initGraphics() { }

  private async initPhysics() {
    this._physicsEngine = new JoltPhysics();
    await this._physicsEngine.init();

    // synchronize with latest state from physics engine
    this._physicsEngine.step();
  }

  /**
   * Initializes the ThreeJS World (e.g., by loading assets)
   */
  public async init(): Promise<void> {

    // load resources here (and await them all with the renderer initialization)
    // ...

    // this is only valid for WebGPU backend
    // await this.renderer.init();
    this.initGraphics();
    await this.initPhysics();

    console.log("[physics] Jolt physics engine initialized");

    this.isInitialized = true;
  }


  /**
   * Pauses the engine (i.e., pauses the game loop). Does nothing if engine is
   * already paused.
   */
  public pause(): void {
    if (this.requestID != null) {
      cancelAnimationFrame(this.requestID);
      this.requestID = null;
    }
  }


  /**
   * Starts/resumes the engine (i.e., the game loop). Does nothing if engine
   * is already running.
   */
  public start(): void {
    if (this.isInitialized && this.requestID == null) {
      this._animate();
    }
  }


  /**
   * Adds the given GameObject to this engine. This causes the GameObject's
   * defined event functions to be called.
   */
  public addMonoBehaviour(monoBehaviour: MonoBehaviour): void {
    const id = this.gameObjects.size;
    this.gameObjects.set(id, monoBehaviour);
  }


  /**
   * Sets up the scene for the "default cube" scene (similar to the one in
   * Blender). This is only here for testing purposes.
   */
  public loadDefaultCubeScene(): void {
    if (!this.isInitialized)
      return;

    {
      const geometry = new BoxGeometry(1, 1, 1, 1);
      const material = new MeshPhongMaterial({ color: 0x00ff00 });
      const cube = new Mesh(geometry, material);
      cube.position.setY(2);

      const go = new GameObject(cube, LAYER_MOVING);
      go.AddComponent<BoxCollider>(BoxCollider);
      const rb = go.AddComponent(Rigidbody);
      this._physicsEngine!.add(rb);
    }

    // create floor
    {
      const geometry = new PlaneGeometry(10, 10);
      const material = new MeshPhongMaterial({ color: 0Xecf0f1 });
      const plane = new Mesh(geometry, material);
      plane.rotateX(-90 * Math.PI / 180);

      const go = new GameObject(plane, LAYER_NON_MOVING);
      go.AddComponent<BoxCollider>(BoxCollider);
      const rb = go.AddComponent(Rigidbody);
      rb.motionType = MotionType.STATIC;
      this._physicsEngine!.add(rb);
    }
  }


  private _animate(): void {
    // block until we receive a frame (swapchain image - somewhat) from browser
    this.requestID = requestAnimationFrame(this._animate.bind(this));

    // compute time delta between this call and the last _animate()
    const delta = this.clock.getDelta();

    // sync physics engine objects with their ThreeJS objects
    this._physicsEngine?.sync();

    // call update for all registered GameObjects
    for (const [_, go] of this.gameObjects) {

      if (go.update)
        go.update(delta);

      if (go.lateUpdate)
        go.lateUpdate(delta);

    }

    // render the scene using current main camera
    this.renderer.render(Engine.scene, Engine.mainCamera);
  }

  private _defaultLightSetting() {
    {
      // ambient light
      const light = new AmbientLight(0xf0f0f0, 0.65);
      Engine.scene.add(light);
    }

    {
      this.directionalLight.position.set(-3, 5, 2);
      // this.directionalLight.add(new AxesHelper());
      Engine.scene.add(this.directionalLight);
    }
  }


  private _onResize(): void {
    // TODO: check if size has actually changed
    let width = Math.floor(this.container.clientWidth * devicePixelRatio);
    let height = Math.floor(this.container.clientHeight * devicePixelRatio);

    const aspect = width / height;

    const pixelCount = width * height;
    const scale = pixelCount > this.maxPixelCount ? Math.sqrt(this.maxPixelCount / pixelCount) : 1;

    width = Math.floor(width * scale);
    height = Math.floor(height * scale);

    this.renderer.setSize(width, height, false);
    Engine.mainCamera.left = -aspect;
    Engine.mainCamera.right = aspect;
    Engine.mainCamera.updateProjectionMatrix();
    Engine.mainCameraController.update();
  }

}

export { Engine, type EngineOptions };
