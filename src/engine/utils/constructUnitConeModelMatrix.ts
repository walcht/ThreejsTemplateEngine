import { Matrix4 } from "three";

function constructUnitConeModelMatrix(radius: number, height: number): Matrix4 {
  return new Matrix4().makeScale(radius, radius, height);
}

export { constructUnitConeModelMatrix };
