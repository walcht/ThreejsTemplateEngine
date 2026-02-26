import { Group, LineBasicMaterial, Material, Vector3 } from "three";
import { BoxCollider } from "../engine/physics/BoxCollider";
import { MonoBehaviour } from "../engine/MonoBehaviour";
import type { GameObject } from "../engine/GameObject";
import { constructCubeLineMeshes } from "../engine/utils/constructCubeLineMeshes";

// @requiresComponent(BoxCollider)
class BoxColliderVisualizer extends MonoBehaviour {

  private _isDirty: boolean = true;
  private _group: Group;
  private _prevCenter: Vector3 = new Vector3();
  private _prevSize: Vector3 = new Vector3();
  private _boxCollider: BoxCollider;
  private _mat: Material = new LineBasicMaterial({ color: 0x000000 });

  constructor(gameObject: GameObject) {
    super(gameObject);
    this._group = new Group();
    this.gameObject.obj.add(this._group);
    const bx = this.gameObject.GetComponent(BoxCollider);
    if (!bx)
      throw new Error("BoxCollider component is expected to be added to the gameObject before adding this component");
    this._boxCollider = bx;
  }

  public update = (_: number) => {
    this._isDirty = (!this._boxCollider.center.equals(this._prevCenter))
      || (!this._boxCollider.size.equals(this._prevSize));

    if (this._isDirty) {
      this._isDirty = false;

      this._prevSize = this._boxCollider.size;
      this._prevCenter = this._boxCollider.center;

      this._onRegenerate();
    }
  }

  public destroy() {
    this._group.removeFromParent();
  }

  private _onRegenerate() {
    this._group.clear();
    this._group.add(...constructCubeLineMeshes(this._prevCenter, this._prevSize, this._mat));
  }

};

export { BoxColliderVisualizer };
