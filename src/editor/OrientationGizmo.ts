import { LineBasicMaterial, Mesh, MeshBasicMaterial, Quaternion, Vector3, type Group } from "three";
import type { GameObject } from "../engine/GameObject";
import { MonoBehaviour } from "../engine/MonoBehaviour";
import { Engine } from "../engine/engine";
import { constructLineMesh } from "../engine/utils/constructLineMesh";

class OrientationGizmo extends MonoBehaviour {

  private _grp: Group;

  constructor(gameObject: GameObject) {

    super(gameObject);
    this._grp = this.gameObject.obj as Group;
    // TODO: set depth testing off for this material and enable depth writing

    this._generate();

  }

  update = (_: number) => {

    // we update the orientation each frame because camera change events are expected to occur very frequently
    //  Engine.mainCamera.getWorldQuaternion(this._grp.quaternion);
    const iz = 1.0 / Engine.mainCamera.zoom;
    const newPos = new Vector3((Engine.mainCamera.right - 0.125) * iz,
      (Engine.mainCamera.top - 0.125) * iz, (-Engine.mainCamera.near - (Engine.mainCamera.near + Engine.mainCamera.far) / 2.0));
    Engine.mainCamera.localToWorld(newPos);
    this._grp.position.copy(newPos);
    this._grp.scale.setScalar(iz * 0.075);

    const wp = new Vector3();
    Engine.mainCamera.getWorldPosition(wp);

    this._xCircle!.lookAt(wp);
    this._yCircle!.lookAt(wp);
    this._zCircle!.lookAt(wp);

    // this._grp.position.setX(Engine.mainCamera.right * Engine.mainCamera.zoom);
    // this._grp.position.setZ(-Engine.mainCamera.near - (Engine.mainCamera.near + Engine.mainCamera.far) / 2.0);

  }

  private _xCircle!: Mesh;
  private _yCircle!: Mesh;
  private _zCircle!: Mesh;

  // generates the cube, the arrows, and the text
  private _generate() {
    this._grp.clear();

    const xMat = new MeshBasicMaterial({ color: 0XC0392B, depthTest: false, transparent: true });
    const yMat = new MeshBasicMaterial({ color: 0X27AE60, depthTest: false, transparent: true });
    const zMat = new MeshBasicMaterial({ color: 0X2980B9, depthTest: false, transparent: true });

    const xAxisMat = new LineBasicMaterial({ color: 0XC0392B, depthTest: false, transparent: true });
    const yAxisMat = new LineBasicMaterial({ color: 0X27AE60, depthTest: false, transparent: true });
    const zAxisMat = new LineBasicMaterial({ color: 0X2980B9, depthTest: false, transparent: true });

    this._xCircle = new Mesh(Engine.UNIT_CIRCLE_GEOMETRY, xMat);
    this._xCircle.position.setX(1);
    this._xCircle.scale.setScalar(0.2);
    this._yCircle = new Mesh(Engine.UNIT_CIRCLE_GEOMETRY, yMat);
    this._yCircle.position.setY(1);
    this._yCircle.scale.setScalar(0.2);
    this._zCircle = new Mesh(Engine.UNIT_CIRCLE_GEOMETRY, zMat);
    this._zCircle.position.setZ(1);
    this._zCircle.scale.setScalar(0.2);


    const xAxis = constructLineMesh(new Vector3(0, 0.0, 0), new Vector3(1, 0, 0), Engine.UNITY_LINE_GEOMETRY, xAxisMat);
    const yAxis = constructLineMesh(new Vector3(0, 0.0, 0), new Vector3(0, 1, 0), Engine.UNITY_LINE_GEOMETRY, yAxisMat);
    const zAxis = constructLineMesh(new Vector3(0, 0.0, 0), new Vector3(0, 0, 1), Engine.UNITY_LINE_GEOMETRY, zAxisMat);

    // this._xCircle.renderOrder = this._yCircle.renderOrder = this._zCircle.renderOrder = 10_999;
    // xAxis.renderOrder = yAxis.renderOrder = zAxis.renderOrder = 9_999;
    this._grp.renderOrder = Number.MAX_SAFE_INTEGER;


    this._grp.add(this._xCircle, this._yCircle, this._zCircle, xAxis, yAxis, zAxis);

  }

};

export { OrientationGizmo };
