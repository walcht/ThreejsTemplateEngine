import type { GameObject } from "../GameObject";
import { ColliderType, Collider } from "./Collider";
import { Vector3 } from "three";

class SphereCollider extends Collider {
  /* Local sphere center (x, y, z) */
  public center: Vector3 = new Vector3(0, 0, 0);

  /* Local radius */
  public radius: number = 1;

  constructor(gameObject: GameObject) {
    super(gameObject, ColliderType.SPHERE_COLLIDER);
  }
}

export { SphereCollider };
