// Manipulate model ----->
var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;

var degreesToRadians = function (val) {
  return (val * Math.PI) / 180;
};

var lon = -60;
var lat = -52;
var alt = 100;
var heading = 0;
var pitch = 0;
var roll = 0;

var primitives = scene.primitives;
var ellipsoid = viewer.scene.globe.ellipsoid;

var positionModel = function (model, lon, lat, alt, heading, pitch, roll) {
  var point = Cesium.Cartographic.fromDegrees(lon, lat, alt / 3);
  var epoint = ellipsoid.cartographicToCartesian(point);

  var heading = degreesToRadians(heading);
  var pitch = degreesToRadians(pitch);
  var roll = degreesToRadians(roll);

  var currentTranslation = new Cesium.Cartesian3();
  var currentRotation = new Cesium.Matrix3();

  var eastNorthUp = Cesium.Transforms.eastNorthUpToFixedFrame(epoint);
  var p = new Cesium.Cartesian3(lon, lat, alt);

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

var positionCamera = function (model) {
  // Zoom to model
  var center = Cesium.Matrix4.multiplyByPoint(
    model.modelMatrix,
    model.boundingSphere.center,
    new Cesium.Cartesian3()
  );
  var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  var camera = scene.camera;
  camera.transform = transform;
  var controller = scene.screenSpaceCameraController;
  var r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
  controller.minimumZoomDistance = r * 0.5;
  camera.lookAt(
    new Cesium.Cartesian3(r, r, r),
    Cesium.Cartesian3.ZERO,
    Cesium.Cartesian3.UNIT_Z
  );
};

var createModel = async function (lon, lat, alt, heading, pitch, roll) {
  try {
    var model = await Cesium.Model.fromGltfAsync({
      url: '../SampleData/models/CesiumAir/Cesium_Air.glb',
    });

    scene.primitives.add(model);

    model.readyEvent.addEventListener(function (model) {
      // Play and loop all animations at half-spead
      model.activeAnimations.addAll({
        speedup: 0.5,
        loop: Cesium.ModelAnimationLoop.REPEAT,
      });

      viewer.clock.onTick.addEventListener(function () {
        positionModel(model, lon, lat, alt, heading, pitch, roll);

        const modelMatrix = model.modelMatrix;
        const position = Cesium.Matrix4.getTranslation(
          modelMatrix,
          new Cesium.Cartesian3()
        );
        viewer.camera.flyTo(position);

        //lon = lon+0.00001;
        //lat = lat+0.000005;
        //alt = alt+0.01;
        heading += 0.01;
        pitch += 0.05;
        roll += 0.1;
      });
    });
  } catch (error) {
    console.log(`Failed to load model. ${error}`);
  }
};

createModel(lon, lat, alt, heading, pitch, roll);
//<---- Manipulate model
