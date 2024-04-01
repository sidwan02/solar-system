const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
});

Sandcastle.addDefaultToolbarButton('Satellites', function () {
  viewer.dataSources.add(Cesium.CzmlDataSource.load('../../czml/simple.czml'));

  viewer.camera.flyHome(0);
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
