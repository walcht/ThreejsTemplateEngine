import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import DoubleHoweTrussParamsGUI from './DoubleHoweTrussParamsGUI.tsx';
import type { DoubleHoweTrussParams } from '../common.ts';

function createGUI(options: { container: HTMLDivElement, doubleHoweTrussParams: DoubleHoweTrussParams }) {
  createRoot(options.container).render(
    <StrictMode>
      <DoubleHoweTrussParamsGUI
        baseWidth={options.doubleHoweTrussParams.baseWidth}
        pitchAngle={options.doubleHoweTrussParams.pitchAngle}
        maxVerticalDistance={options.doubleHoweTrussParams.maxVerticalDistance} />
    </StrictMode>,
  );
}

export { createGUI };

