import { Component } from "./Component";
import { type GameObject } from "./GameObject";

/**
 * A Behaviour is a Component that can be enabled/disabled.
 */
class Behaviour extends Component {
  public enabled: Boolean;

  constructor(gameObject: GameObject, enabled: Boolean = true) {
    super(gameObject);
    this.enabled = enabled;
  }

};

export { Behaviour };
