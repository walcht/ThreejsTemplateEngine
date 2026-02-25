import { BufferGeometry, Line, Material, Vector3 } from "three";
import { constructUnitLineModelMatrix } from "./constructUnitLineModelMatrix";

function constructLineMesh(
  pt0: Vector3,
  pt1: Vector3,
  UNIT_LINE_GEOMETRY: BufferGeometry,
  material: Material): Line {
  // it is fine to re-create materials as long as they are of the same type
  // const mat = new LineBasicMaterial({ color: color });
  const line = new Line(UNIT_LINE_GEOMETRY, material);
  line.matrixAutoUpdate = false;
  line.matrix = constructUnitLineModelMatrix(pt0, pt1);
  return line;
}

export { constructLineMesh };
