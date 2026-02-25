import type { DoubleHoweTrussParams } from "./common";

function defaultDoubleHoweTrussParams(): DoubleHoweTrussParams {
  return {
    baseWidth: 20,
    pitchAngle: 17,
    maxVerticalDistance: 3,
  };
}

export { defaultDoubleHoweTrussParams };
