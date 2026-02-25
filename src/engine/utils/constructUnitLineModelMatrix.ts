import { Quaternion, Vector3, Matrix4 } from "three";

/**
 * Constructs the Model transformation matrix for the Unit Line (i.e, defined
 * by 2 points (0, 0, 0) and (1, 0, 0)) so that it ends up representing the
 * given two points.
 */
function constructUnitLineModelMatrix(pt0: Vector3, pt1: Vector3): Matrix4 {
  const d = (new Vector3(pt1.x, pt1.y, pt1.z)).sub(pt0);
  const l = d.length();
  // TODO: avoid normalizing the direction vector?
  const q = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), d.normalize());

  const sm = new Matrix4().makeScale(l, 0, 0);
  const rm = new Matrix4().makeRotationFromQuaternion(q);
  const tm = new Matrix4().makeTranslation(pt0);
  return tm.multiply(rm).multiply(sm);
}

export { constructUnitLineModelMatrix };
