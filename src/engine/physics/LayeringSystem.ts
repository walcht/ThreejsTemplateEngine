class LayeringSystem {
  private static s_layers = new Map<string, number>();
  // TODO: NxN collision matrix

  public static AddLayers(layers: Array<string>) {
    for (let i = 0; i < layers.length; ++i) {
      LayeringSystem.s_layers.set(layers[i], i);
    }
  }

  public static AddLayer(layer: string) {
    const i = LayeringSystem.s_layers.size;
    LayeringSystem.s_layers.set(layer, i);
  }

  public static GetLayer(layer: string): number {
    return LayeringSystem.s_layers.get(layer) || -1;
  }

}

export { LayeringSystem };
