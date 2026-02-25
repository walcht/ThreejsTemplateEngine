import type { GameObject } from "../GameObject";
import { Collider, ColliderType } from "./Collider";
import { Vector3 } from "three";

type BoxColliderOptions = {
  /* Local box center (x, y, z) - defaults to (0, 0, 0) */
  center?: Vector3;

  /* Full extent local size (width, height, depth) */
  extent?: Vector3;
};

class BoxCollider extends Collider {

  public center: Vector3;
  public size: Vector3;

  constructor(gameObject: GameObject, options: BoxColliderOptions) {
    super(gameObject, ColliderType.BOX_COLLIDER);
    this.center = options.center || new Vector3(0, 0, 0);
    this.size = options.extent || new Vector3(1, 1, 1);
  }

}

export { BoxCollider };
