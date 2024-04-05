// Manipulate model ----->
var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;

var degreesToRadians = function (val) {
  return (val * Math.PI) / 180;
};

var x = -123.0744619;
var y = 44.0503706;
var z = 5000;
var heading = 0;
var pitch = 0;
var roll = 0;

var ellipsoid = viewer.scene.globe.ellipsoid;

var positionModel = function (model, x, y, z, heading, pitch, roll) {
  var epoint = Cesium.Cartesian3.fromDegrees(x, y, z / 3);

  var heading = degreesToRadians(heading);
  var pitch = degreesToRadians(pitch);
  var roll = degreesToRadians(roll);

  var currentTranslation = new Cesium.Cartesian3();
  var currentRotation = new Cesium.Matrix3();

  var eastNorthUp = Cesium.Transforms.eastNorthUpToFixedFrame(epoint);

  Cesium.Matrix4.getRotation(eastNorthUp, currentRotation);
  Cesium.Matrix4.getTranslation(eastNorthUp, currentTranslation);

  var headingQuaternion = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_Z,
    -heading
  );
  var pitchQuaternion = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_Y,
    -pitch
  );
  var rollQuaternion = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_X,
    -roll
  );

  var headingPitchQuaternion = Cesium.Quaternion.multiply(
    headingQuaternion,
    pitchQuaternion,
    new Cesium.Quaternion()
  );
  var finalQuaternion = new Cesium.Quaternion();
  Cesium.Quaternion.multiply(
    headingPitchQuaternion,
    rollQuaternion,
    finalQuaternion
  );

  var rM = new Cesium.Matrix3();
  Cesium.Matrix3.fromQuaternion(finalQuaternion, rM);

  Cesium.Matrix3.multiply(currentRotation, rM, currentRotation);

  var modelMatrix = new Cesium.Matrix4();

  Cesium.Matrix4.fromRotationTranslation(
    currentRotation,
    currentTranslation,
    modelMatrix
  );

  model.modelMatrix = modelMatrix;
};

var createModel = function (x, y, z, heading, pitch, roll) {
  const position = Cesium.Cartesian3.fromDegrees(
    -123.0744619,
    44.0503706,
    5000
  );
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
  );

  const entity = viewer.entities.add({
    name: '../SampleData/models/CesiumAir/Cesium_Air.glb',
    position: position,
    orientation: orientation,
    model: {
      uri: '../SampleData/models/CesiumAir/Cesium_Air.glb',
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
  });
  viewer.trackedEntity = entity;

  window.setInterval(function () {
    positionModel(entity, x, y, z, heading, pitch, roll);
    console.log(entity.modelMatrix);

    x = x + 1;
    y = y + 10;
    z = z + 10;
    heading += 0.1;
    pitch += 0.5;
    roll += 0.1;
  }, 4000);

  viewer.clock.onTick.addEventListener(function () {});
};

createModel(x, y, z, heading, pitch, roll);
//<---- Manipulate model
