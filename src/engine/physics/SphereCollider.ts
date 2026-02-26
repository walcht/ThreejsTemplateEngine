import type { GameObject } from "../GameObject";
import { ColliderType, Collider } from "./Collider";
import { Vector3 } from "three";

type SphereColliderOptions = {
  /* Local box center (x, y, z) - defaults to (0, 0, 0) */
  center?: Vector3;

  /* Radius (i.e., half diameter) - defaults to 1 */
  radius?: number;
};

class SphereCollider extends Collider {
  /* Local sphere center (x, y, z) */
  public center: Vector3 = new Vector3(0, 0, 0);

  /* Local radius */
  public radius: number = 1;

  constructor(gameObject: GameObject, options?: SphereColliderOptions) {
    super(gameObject, ColliderType.SPHERE_COLLIDER);
    this.center = options?.center || new Vector3(0, 0, 0);
    this.radius = options?.radius || 1;
  }
}

export { SphereCollider, type SphereColliderOptions };
