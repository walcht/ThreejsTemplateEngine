import { Behaviour } from "./Behaviour";
import type { GameObject } from "./GameObject";

class MonoBehaviour extends Behaviour {

  constructor(gameObject: GameObject, enabled: Boolean = true) {
    super(gameObject, enabled);
  }

  awake?: () => void;
  onEnable?: () => void;


  start?: () => void;

  /**
   * Called at a fixed update rate (i.e., not necessarily once per frame) to
   * update physics-related objects/properties. Consider adding code here that
   * interacts with the physics world (e.g., by adding forces) instead of doing
   * so in update().
   *
   * @param fixedDelta - fixed physics frame time in seconds.
   *
   */
  fixedUpdate?: (fixedDelta: number) => void;


  /**
   * Called once per frame and is the place where most tasks are
   * performed (e.g., position updates).
   *
   * @param delta - the frame time in seconds.
   *
   */
  update?: (delta: number) => void;

  /**
   * Called once per frame after the update() has finished. Camera
   * position updates are usually performed here to ensure that all GameObjects
   * have their position updated before the Camera's position.
   *
   * @param delta - the frame time in seconds.
   *
   */
  lateUpdate?: (delta: number) => void;

  /**
   * Called when another physics object (i.e., collider) gets in contact with
   * this GameObject. The point of contact is not necessarily the initial point
   * of contact.
   *
   * @param other - collision data with other object that came in contact with
   * this GameObject.
   *
   */
  onTriggerEnter?: (other: GameObject) => void;

  onTriggerExit?: () => void;


  onDisable?: () => void;
};

export { MonoBehaviour };
