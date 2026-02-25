type TrussBaseWidthEventData = {
  /* truss base width in meters */
  baseWidth: number;
};

type TrussPitchAngleEventData = {
  /* truss pitch angle in degrees */
  pitchAngle: number;
};

type TrussMaxVerticalMemberDistance = {
  /* max vertical member distance in meters */
  value: number;
};

declare global {
  interface GlobalEventHandlersEventMap {
    TRUSS_BASE_WIDTH_VIEW: CustomEvent<TrussBaseWidthEventData>,
    TRUSS_BASE_WIDTH_MODEL: CustomEvent<TrussBaseWidthEventData>,

    TRUSS_PITCH_ANGLE_VIEW: CustomEvent<TrussPitchAngleEventData>,
    TRUSS_PITCH_ANGLE_MODEL: CustomEvent<TrussPitchAngleEventData>,

    TRUSS_MAX_VERTICAL_MEMBER_DISTANCE_VIEW: CustomEvent<TrussMaxVerticalMemberDistance>,
    TRUSS_MAX_VERTICAL_MEMBER_DISTANCE_MODEL: CustomEvent<TrussMaxVerticalMemberDistance>,
  }
}

export type { TrussBaseWidthEventData, TrussPitchAngleEventData, TrussMaxVerticalMemberDistance };
