import { useEffect, useState } from "react";
import type { DoubleHoweTrussParams } from "../common";
import type { TrussBaseWidthEventData, TrussMaxVerticalMemberDistance, TrussPitchAngleEventData } from "../events";
import { Stack, TextField } from "@mui/material";

function DoubleHoweTrussParamsGUI(defaultParams: DoubleHoweTrussParams) {
  const [baseWidth, setBaseWidth] = useState<number>(defaultParams.baseWidth);
  const [pitchAngle, setPitchAngle] = useState<number>(defaultParams.pitchAngle);
  const [maxVerticalDistance, setMaxVerticalDistance] = useState<number>(defaultParams.maxVerticalDistance);

  const handleTrussBaseWidth = (e: CustomEvent<TrussBaseWidthEventData>) => { setBaseWidth(e.detail.baseWidth); };
  const handleTrussPitchAngle = (e: CustomEvent<TrussPitchAngleEventData>) => { setPitchAngle(e.detail.pitchAngle); };
  const handleTrussMaxVerticalDistance = (e: CustomEvent<TrussMaxVerticalMemberDistance>) => {
    setMaxVerticalDistance(e.detail.value);
  };

  useEffect(() => {
    // on mount
    window.addEventListener("TRUSS_BASE_WIDTH_MODEL", handleTrussBaseWidth);
    window.addEventListener("TRUSS_PITCH_ANGLE_MODEL", handleTrussPitchAngle);
    window.addEventListener("TRUSS_MAX_VERTICAL_MEMBER_DISTANCE_MODEL", handleTrussMaxVerticalDistance);

    // on cleanup (i.e., unmount)
    return () => {
      window.removeEventListener("TRUSS_BASE_WIDTH_MODEL", handleTrussBaseWidth);
      window.removeEventListener("TRUSS_PITCH_ANGLE_MODEL", handleTrussPitchAngle);
      window.removeEventListener("TRUSS_MAX_VERTICAL_MEMBER_DISTANCE_MODEL", handleTrussMaxVerticalDistance);
    };
  }, []);

  return (
    <Stack direction={"row"} spacing={2}>
      <TextField
        label="base width (m)"
        value={baseWidth}
        size="small"
        type="number"
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value);
          if (Number.isNaN(v)) {
            setBaseWidth(0);
            return;
          }
          window.dispatchEvent(new CustomEvent<TrussBaseWidthEventData>(
            "TRUSS_BASE_WIDTH_VIEW", { detail: { baseWidth: v } }));
          // the state is updated via events
        }}
      />
      <TextField
        label="pitch angle (°)"
        value={pitchAngle}
        size="small"
        type="number"
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value);
          if (Number.isNaN(v)) {
            setPitchAngle(0);
            return;
          }
          window.dispatchEvent(new CustomEvent<TrussPitchAngleEventData>(
            "TRUSS_PITCH_ANGLE_VIEW", { detail: { pitchAngle: v } }));
        }}
      />
      <TextField
        label="max vertical member distance (m)"
        value={maxVerticalDistance}
        size="small"
        type="number"
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value);
          if (Number.isNaN(v)) {
            setMaxVerticalDistance(0);
            return;
          }
          window.dispatchEvent(new CustomEvent<TrussMaxVerticalMemberDistance>(
            "TRUSS_MAX_VERTICAL_MEMBER_DISTANCE_VIEW", { detail: { value: v } }));
        }}
      />
    </Stack>
  )
}

export default DoubleHoweTrussParamsGUI;
