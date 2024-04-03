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
  scene.postUpdate.addEventListener(icrf);
  Sandcastle.highlight(viewInICRF);
}

function setupViewer() {
  scene.fog.enabled = false;
  scene.moon.show = false;
  scene.sun.show = false;
  scene.shadowMap.enabled = false;
  scene.globe.enableLighting = false;
}

function createModel(url, height) {
  viewer.entities.removeAll();

  const position = Cesium.Cartesian3.fromDegrees(
    -123.0744619,
    44.0503706,
    height
  );
  const heading = Cesium.Math.toRadians(135);
  const pitch = 0;
  const roll = 0;
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
  );

  const entity = viewer.entities.add({
    name: url,
    position: position,
    orientation: orientation,
    model: {
      uri: url,
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
  });
  viewer.trackedEntity = entity;
}

Sandcastle.addDefaultToolbarButton('Satellites', function () {
  viewer.dataSources.add(
    Cesium.CzmlDataSource.load('../../data/filled_testing2.czml')
    // Cesium.CzmlDataSource.load('../../czml/testing2.czml')
  );

  // todo: instead call these on load
  // viewInICRF();
  setupViewer();

  viewer.camera.flyHome(0);
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
