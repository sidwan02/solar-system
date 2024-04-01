const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
