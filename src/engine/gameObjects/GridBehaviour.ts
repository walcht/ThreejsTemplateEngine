import { Box3, LineBasicMaterial, Material, Vector3 } from "three";
import { Engine } from "../engine";
import { constructLineMesh } from "../utils/constructLineMesh";
import { MonoBehaviour } from "../MonoBehaviour";
import type { GameObject } from "../GameObject";

class GridOptions {
  public extent?: Box3;
  public spacing0?: number;
};

const EPSILON: number = 0.0001;


/**
 * Represents the BIM editor grid (i.e., the gray lines that help in measuring).
 * Currently only updated once but ideally it should react to the cameras
 * position.
 */
class GridBehaviour extends MonoBehaviour {
  private isDirty: Boolean = true;
  public enabled: Boolean = true;

  private readonly gridLinesMat: Material = new LineBasicMaterial({ color: 0x7F8C8D });
  private readonly xAxisMat: Material = new LineBasicMaterial({ color: 0XC0392B });
  private readonly yAxisMat: Material = new LineBasicMaterial({ color: 0X27AE60 });
  private readonly zAxisMat: Material = new LineBasicMaterial({ color: 0X2980B9 });

  private _extent: Box3;
  private _spacing0: number;

  private _generateXZGrid: boolean = true;
  private _generateXYGrid: boolean = true;
  private _generateYZGrid: boolean = true;

  private _currCamLookDir: Vector3;

  constructor(gameObject: GameObject, options?: GridOptions) {

    super(gameObject, true);

    this._extent = options?.extent || new Box3(new Vector3(-25, -25, -25), new Vector3(25, 25, 25));
    this._spacing0 = options?.spacing0 || 5;

    this._currCamLookDir = new Vector3();
  }

  public update = (_: number) => {

    Engine.mainCamera.getWorldDirection(this._currCamLookDir);

    let generateXYGrid: boolean = this._generateXYGrid;
    let generateXZGrid: boolean = this._generateXZGrid;
    let generateYZGrid: boolean = this._generateYZGrid;

    // if camera is looking directly at XY plane, then regenerate
    if (Math.abs(this._currCamLookDir.y) <= EPSILON && Math.abs(this._currCamLookDir.x) <= EPSILON) {

      generateXYGrid = true;
      generateXZGrid = false;
      generateYZGrid = false;
      console.log("[grid] locked to XY plane");

    } else if (Math.abs(this._currCamLookDir.y) <= EPSILON && Math.abs(this._currCamLookDir.z) <= EPSILON) {

      generateXYGrid = false;
      generateXZGrid = false;
      generateYZGrid = true;

      console.log("[grid] locked to YZ plane");

    } else {

      generateXYGrid = false;
      generateXZGrid = true;
      generateYZGrid = false;

    }

    // set dirty in case any plane subgrid has to be regenerated
    if ((this._generateXYGrid != generateXYGrid) ||
      (this._generateXZGrid != generateXZGrid) ||
      (this._generateYZGrid != generateYZGrid)) {

      this._generateXYGrid = generateXYGrid;
      this._generateXZGrid = generateXZGrid;
      this._generateYZGrid = generateYZGrid;
      this.isDirty = true;

    }

    if (this.isDirty) {

      this._regenerateGrid();
      this.isDirty = false;

    }
  }


  private _regenerateGrid(): void {
    this.gameObject.obj.clear();

    // X axis
    this.gameObject.obj.add(constructLineMesh(new Vector3(this._extent.min.x, 0.0, 0),
      new Vector3(this._extent.max.x, 0.0, 0), Engine.UNITY_LINE_GEOMETRY, this.xAxisMat));


    // Y axis
    this.gameObject.obj.add(constructLineMesh(new Vector3(0.0, this._extent.min.y, 0),
      new Vector3(0.0, this._extent.max.y, 0), Engine.UNITY_LINE_GEOMETRY, this.yAxisMat));

    // Z axis
    this.gameObject.obj.add(constructLineMesh(new Vector3(0.0, 0.0, this._extent.min.z),
      new Vector3(0.0, 0.0, this._extent.max.z), Engine.UNITY_LINE_GEOMETRY, this.zAxisMat));


    // XZ grid (floor)
    if (this._generateXZGrid) {

      {
        // major X-Axis-parrallel lines
        for (let d = this._extent.min.z; d <= this._extent.max.z; d += this._spacing0) {
          if (d == 0) continue;
          this.gameObject.obj.add(constructLineMesh(
            new Vector3(this._extent.min.x, 0.0, d),
            new Vector3(this._extent.max.x, 0.0, d),
            Engine.UNITY_LINE_GEOMETRY, this.gridLinesMat));
        }
      }

      // major Z-Axis-parrallel lines
      {
        for (let d = this._extent.min.x; d <= this._extent.max.x; d += this._spacing0) {
          if (d == 0) continue;
          this.gameObject.obj.add(constructLineMesh(
            new Vector3(d, 0.0, this._extent.min.z),
            new Vector3(d, 0.0, this._extent.max.z),
            Engine.UNITY_LINE_GEOMETRY, this.gridLinesMat));
        }
      }

    }


    // XY grid
    if (this._generateXYGrid) {

      // major X-Axis-parrallel lines over Y-Axis
      {
        for (let d = this._extent.min.y; d <= this._extent.max.y; d += this._spacing0) {
          if (d == 0) continue;
          this.gameObject.obj.add(constructLineMesh(
            new Vector3(this._extent.min.x, d, 0.0),
            new Vector3(this._extent.max.x, d, 0.0),
            Engine.UNITY_LINE_GEOMETRY,
            this.gridLinesMat));
        }
      }

      // major Y-Axis-parrallel
      {
        for (let d = this._extent.min.y; d <= this._extent.max.y; d += this._spacing0) {
          if (d == 0) continue;
          this.gameObject.obj.add(constructLineMesh(
            new Vector3(d, this._extent.min.y, 0.0),
            new Vector3(d, this._extent.max.y, 0.0),
            Engine.UNITY_LINE_GEOMETRY, this.gridLinesMat));
        }
      }

    }

    // YZ grid
    if (this._generateYZGrid) {

      // major Z-Axis-parrallel lines over Y-Axis
      {
        for (let d = this._extent.min.y; d <= this._extent.max.y; d += this._spacing0) {
          if (d == 0) continue;
          this.gameObject.obj.add(constructLineMesh(
            new Vector3(0.0, d, this._extent.min.z),
            new Vector3(0.0, d, this._extent.max.z),
            Engine.UNITY_LINE_GEOMETRY, this.gridLinesMat));
        }
      }

      // major Y-Axis-parrallel
      {
        for (let d = this._extent.min.y; d <= this._extent.max.y; d += this._spacing0) {
          if (d == 0) continue;
          this.gameObject.obj.add(constructLineMesh(
            new Vector3(0.0, this._extent.min.y, d),
            new Vector3(0.0, this._extent.max.y, d),
            Engine.UNITY_LINE_GEOMETRY, this.gridLinesMat));
        }
      }

    }

  }
}


export { GridBehaviour, type GridOptions };
