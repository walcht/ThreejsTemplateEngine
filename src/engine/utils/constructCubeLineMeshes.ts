import { Line, Material, Vector3 } from "three";
import { constructLineMesh } from "./constructLineMesh";
import { Engine } from "../engine";

function constructCubeLineMeshes(center: Vector3, size: Vector3, mat: Material): Array<Line> {
  const res = new Array<Line>();
  const he = new Vector3(size.x / 2.0, size.y / 2.0, size.z / 2.0);

  /**
   *       p8
   *        .+------+ p7
   *   p5.' \ p6 .' \  
   *    +---+--+'   \  
   *    \ p4\  \    \  
   *    \  ,+--+----+ p3
   *    \.'    \  .'   
   *    +------+'      
   *    p1     p2
   *
   */
  const p1 = new Vector3(center.x - he.x, center.y - he.y, center.z + he.z);
  const p2 = new Vector3(p1.x + size.x, p1.y, p1.z)
  const p3 = new Vector3(p2.x, p2.y, p2.z - size.z);
  const p4 = new Vector3(p3.x - size.x, p3.y, p3.z);

  const p7 = new Vector3(center.x + he.x, center.y + he.y, center.z - he.z);
  const p8 = new Vector3(p7.x - size.x, p7.y, p7.z);
  const p6 = new Vector3(p7.x, p7.y, p7.z + size.z);
  const p5 = new Vector3(p6.x - size.x, p6.y, p6.z);

  // bottom
  res.push(constructLineMesh(p1, p2, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p2, p3, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p3, p4, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p4, p1, Engine.UNITY_LINE_GEOMETRY, mat));

  // top
  res.push(constructLineMesh(p5, p6, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p6, p7, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p7, p8, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p8, p5, Engine.UNITY_LINE_GEOMETRY, mat));

  // connecting edges
  res.push(constructLineMesh(p1, p5, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p2, p6, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p3, p7, Engine.UNITY_LINE_GEOMETRY, mat));
  res.push(constructLineMesh(p4, p8, Engine.UNITY_LINE_GEOMETRY, mat));

  return res;
}

export { constructCubeLineMeshes };
