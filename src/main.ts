import { Group } from "three";
import { Engine } from "./engine/engine";
import { GridBehaviour } from "./engine/gameObjects/GridBehaviour";
import { GameObject } from "./engine/GameObject";

async function main(): Promise<void> {
  // gui-root is expected to hold overlay-GUI elements
  // const guiContainer = document.querySelector<HTMLDivElement>("#gui-root");
  // if (!guiContainer)
  //   throw new Error("#gui-root not found in DOM.");

  // scene-container container is expected in index
  const worldContainer = document.querySelector<HTMLCanvasElement>("#scene-container");
  if (!worldContainer)
    throw new Error("#scene-container not found in DOM.");

  // generate default values (default params and the such...)
  // const _defaultDoubleHoweTrussParams = defaultDoubleHoweTrussParams();

  // initialize the overlay GUI (in our case, this is just a call to React's
  // renderRoot function)
  // createGUI({ container: guiContainer, doubleHoweTrussParams: _defaultDoubleHoweTrussParams });

  // create and init the 3D engine (i.e., start the game loop)
  const engine = new Engine({ container: worldContainer });
  await engine.init();
  engine.start();

  engine.loadDefaultCubeScene();

  // create the truss object updatable (i.e., GameObject)
  // const trussUpdatable = new TrussDoubleHoweUpdatable(_defaultDoubleHoweTrussParams);
  // engine.addUpdatable(trussUpdatable);

  const grid = new GameObject(new Group());
  const gridBehaviour = grid.AddComponent(GridBehaviour);
  engine.addMonoBehaviour(gridBehaviour);
}

main();
