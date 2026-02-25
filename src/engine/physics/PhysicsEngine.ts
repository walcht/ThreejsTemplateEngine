import type { Rigidbody } from "./Rigidbody";

interface IPhysicsEngine {

  /**
   * Adds provided MonoBehaviour to this physics engine's simulation.
   */
  add: (obj: Rigidbody) => number;

  /**
   * Deletes provided object from this physics engine's simulation.
   */
  del: (objId: number) => Boolean;

  /**
   * Initializes the physics engine.
   */
  init: () => Promise<void>;

  /**
   * Steps the physics world simulation once.
   */
  step: () => void;

  /**
   * Called each frame to synchronize the physics simulation objects with their
   * actual mesh representations.
   */
  sync: () => void;

};

export { type IPhysicsEngine }
