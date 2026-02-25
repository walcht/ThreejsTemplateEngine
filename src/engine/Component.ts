import type { GameObject } from "./GameObject";

class Component {
  /*
   * GameObject that this component is attached to. A component is always
   * attached to some game object.
   */
  public readonly gameObject: GameObject;

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

};

export { Component };
