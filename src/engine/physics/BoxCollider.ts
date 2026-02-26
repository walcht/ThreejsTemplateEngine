import { GameObject } from "../GameObject";
import { Collider, ColliderType } from "./Collider";
import { Vector3 } from "three";

type BoxColliderOptions = {
  /* Local box center (x, y, z) - defaults to (0, 0, 0) */
  center?: Vector3;

  /* Full extent local size (width, height, depth) - defaults to (1, 1, 1) */
  extent?: Vector3;
};

class BoxCollider extends Collider {

  private _center: Vector3;
  private _size: Vector3;
  private _centerListeners = new Map<number, (center: Vector3) => void>();
  private _sizeListeners = new Map<number, (size: Vector3) => void>();

  public get center(): Vector3 {
    return this._center;
  }
  public set center(value: Vector3) {
    console.log(`set to ${value}`);
    this._center = value;
    for (const [_, listener] of this._centerListeners) {
      listener(this._center);
    }
  }

  public get size(): Vector3 {
    return this._size;
  }

  public set size(value: Vector3) {
    this._size = value;
    for (const [_, listener] of this._sizeListeners) {
      listener(this._size);
    }
  }

  constructor(gameObject: GameObject, options?: BoxColliderOptions) {
    super(gameObject, ColliderType.BOX_COLLIDER);
    this._center = options?.center || new Vector3(0, 0, 0);
    this._size = options?.extent || new Vector3(1, 1, 1);
  }

  public registerCenterListener(listener: (center: Vector3) => void) {
    const id = this._centerListeners.size;
    this._centerListeners.set(id, listener);
  }

  public deregisterCenterListener(listenerId: number): boolean {
    return this._centerListeners.delete(listenerId);
  }

  public registerSizeListener(listener: (size: Vector3) => void) {
    const id = this._sizeListeners.size;
    this._sizeListeners.set(id, listener);
  }

  public deregisterSizeListener(listenerId: number): boolean {
    return this._sizeListeners.delete(listenerId);
  }

}

export { BoxCollider, type BoxColliderOptions };
