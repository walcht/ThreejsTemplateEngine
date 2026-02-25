import type { Object3D } from "three";
import type { Component } from "./Component";
import { Engine } from "./engine";

interface IConstructor<T> {
  new(...args: any[]): T;
}

interface IGameObject {

  obj: Object3D;
  enabled: Boolean;
  layer: number;

  /**
   * Adds the provided component to this GameObject and constructs it in place.
   *
   * @param type - this is simply provided to overcome TS->JS type limitations.
   * When transpiling TS to JS, all type information is lost hence why we can't
   * simply just call this with the generic type parameter without any
   * additional concrete object.
   *
   */
  AddComponent: <T extends Component>(type: IConstructor<T>, ...args: any[]) => void;

  /**
   * Gets the first component attached to this game object that has the provided
   * type. Consider caching the result of this as fetching a component might be
   * at worst O(N) with N being the number of components attached to this game
   * object.
   *
   * @param type - this is simply provided to overcome TS->JS type limitations.
   * When transpiling TS to JS, all type information is lost hence why we can't
   * simply just call this with the generic type parameter without any
   * additional concrete object.
   */
  GetComponent: <T extends Component>(type: IConstructor<T>) => Component | undefined
};

/**
 * GameObjects without attached MonoBehaviours are usually static objects
 * (i.e., their transform properties are usually not updated after creation).
 */
class GameObject implements IGameObject {

  public obj: Object3D;
  public enabled: Boolean;
  public layer: number;

  private _components: Array<Component> = new Array<Component>;

  constructor(threeObj: Object3D, layer: number = 0) {
    this.obj = threeObj;
    this.enabled = true;
    this.layer = layer;

    // TODO: refactor this - a GameObject may not necessarily have a
    // correspondent Threejs Object (i.e., it may not be attached to the scene).
    Engine.scene.add(this.obj);
  }

  public AddComponent<T extends Component>(type: IConstructor<T>, ...args: any[]): T {
    // holyshit - TS do fucking suck, this is the ugliest piece of garbage code
    // I have ever fucking seen...
    const cmp = new type(this, args);
    this._components.push(cmp);
    return cmp;
  };

  public GetComponent<T extends Component>(type: IConstructor<T>): T | undefined {
    for (const component of this._components) {
      if (component instanceof type)  // fuckin typescript sucks ...
        return component;
    }
    return undefined;
  };
}

export { GameObject };
