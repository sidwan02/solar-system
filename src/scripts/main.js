const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
});
const scene = viewer.scene;
const clock = viewer.clock;

function icrf(scene, time) {
  if (scene.mode !== Cesium.SceneMode.SCENE3D) {
    return;
  }

  const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
  if (Cesium.defined(icrfToFixed)) {
    const camera = viewer.camera;
    const offset = Cesium.Cartesian3.clone(camera.position);
    const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
    camera.lookAtTransform(transform, offset);
  }
}

function viewInICRF() {
  Sandcastle.declare(viewInICRF);

  viewer.camera.flyHome(0);

  clock.multiplier = 3 * 60 * 60;
  scene.postUpdate.addEventListener(icrf);
  scene.globe.enableLighting = false;
}

Sandcastle.addDefaultToolbarButton('Satellites', function () {
  viewer.dataSources.add(
    Cesium.CzmlDataSource.load('../../data/filled_testing2.czml')
    // Cesium.CzmlDataSource.load('../../czml/testing2.czml')
  );

  viewInICRF();

  // viewer.camera.flyHome(0);
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
