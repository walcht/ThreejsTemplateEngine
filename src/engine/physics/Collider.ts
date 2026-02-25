import { Component } from "../Component";
import type { GameObject } from "../GameObject";

const ColliderType = {
  BOX_COLLIDER: 0,
  SPHERE_COLLIDER: 1,
  PLANE_COLLIDER: 2,
} as const;

type ColliderType = (typeof ColliderType)[keyof typeof ColliderType];

class Collider extends Component {

  public type: ColliderType;

  constructor(gameObject: GameObject, colliderType: ColliderType) {
    super(gameObject);
    this.type = colliderType;
  }

};

export { Collider, ColliderType };
