const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
  // globe: true,
});
const scene = viewer.scene;
const clock = viewer.clock;

function icrf(scene, time) {
  if (scene.mode !== Cesium.SceneMode.SCENE3D) {
    return;
  }

  // when it's nothing, it's undefined. When it's the Earth, the _id is 'Earth'
  // Might have to change this to be neither undefined nor 'Sun'
  if (viewer.trackedEntity != undefined) {
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
  // Sandcastle.declare(viewInICRF);
  scene.postUpdate.addEventListener(icrf);
  // Sandcastle.highlight(viewInICRF);
}

function setupViewer() {
  scene.fog.enabled = false;
  scene.moon.show = false;
  scene.sun.show = false;
  scene.shadowMap.enabled = false;
  // scene.globe.enableLighting = false;
}

var start = Cesium.JulianDate.fromDate(new Date(Date.UTC(2000, 0, 1)));
var stop = Cesium.JulianDate.fromDate(new Date(Date.UTC(2001, 0, 1)));

function clockSetup() {
  //Set bounds of our simulation time
  //Make sure viewer is at the desired time.
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
  viewer.clock.multiplier = 10;

  //Set timeline to simulation bounds
  viewer.timeline.zoomTo(start, stop);
}

function addModel() {
  var earth_entity = viewer.entities.add({
    id: 'Earth',

    //Set the entity availability to the same interval as the simulation time.
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: start,
        stop: stop,
      }),
    ]),

    //Load the Cesium plane model to represent the entity
    model: {
      uri: '../../models/Earth_1_12756.glb',
      minimumPixelSize: 64,
    },

    //Show the path as a pink line sampled in 1 second increments.
  });
  console.log('created model');

  // earth_entity.position = positionProperty;
  earth_entity.position = Cesium.Cartesian3.fromDegrees(0, 0, 1000);
  // earth_entity.orientation = orientationProperty;

  viewer.trackedEntity = earth_entity;
  // console.log(earth_entity.position);
  // viewer.camera.flyTo(earth_entity.position);
}

function setEarthOrientations() {
  // console.log(viewer.dataSources);
  // var entity = viewer.entities.getById('Earth');
  // console.log(entity);

  var positionProperty = new Cesium.SampledPositionProperty();
  var orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);

  rotation_duration = 86400;
  seconds_in_yr = 31536000;

  // in degrees
  angle_increment = 30;
  cur_angle = 0;

  var file_path = '../../data/earth_helios_bgaiRcAjxg.lst';

  var days_in_orbit = 365;
  var orbital_resolution = 100;
  var au_to_m = 149597870700;
  var scale_factor = 1 / 10000;
  var day_to_sec = 86400;

  var stride = days_in_orbit / orbital_resolution;

  var t = 0;

  // console.log('start: ' + start);

  // TODO: modify this code to have two ts. One for the position and one for the orientation. If the orientation ts is ahead of the next position ts, we make sure to record our new o we need to wait until the next position ts is recorded, and ensure that the reference position is the most recent one.

  fetch(file_path)
    .then((response) => response.text())
    .then((data) => {
      var lines = data.split('\n');
      var num_points = 0;

      var orientations = [];
      var coords = [];

      for (var i = 1; i < lines.length; i++) {
        if ((i - 1) % Math.floor(stride) !== 0) {
          continue;
        }
        var time = Cesium.JulianDate.addSeconds(
          start,
          t,
          new Cesium.JulianDate()
        );

        console.log(time);

        num_points += 1;

        var line = lines[i].trim().split(/\s+/);
        // console.log('line: ' + line);
        // var yr = parseFloat(line[0]);
        // var day = parseFloat(line[1]);
        var x = parseFloat(line[2]) * au_to_m * scale_factor;
        var y = parseFloat(line[3]) * au_to_m * scale_factor;
        var z = parseFloat(line[4]) * au_to_m * scale_factor;
        // console.log('x: ' + x + ', y: ' + y + ', z: ' + z);
        // throw new Error('stop');

        var position = new Cesium.Cartesian3(x, y, z);
        // var position = new Cesium.Cartesian3(0, 0, 0);
        // var position = Cesium.Cartesian3.fromDegrees(100, 10, 1750);

        coords.push(t);
        coords.push(x);
        coords.push(y);
        coords.push(z);

        positionProperty.addSample(time, position);

        // console.log('new point: ' + x + ', ' + y + ', ' + z);
        // console.log('new point t: ' + t);

        // add the rotations until the next position update.
        next_position_at = t + day_to_sec * stride;

        console.log('next_position_at: ', next_position_at);
        for (
          t;
          t <= next_position_at;
          t += rotation_duration / (360 / angle_increment)
        ) {
          // console.log('t: ' + t);
          var time = Cesium.JulianDate.addSeconds(
            start,
            t,
            new Cesium.JulianDate()
          );

          console.log('cur_angle: ' + cur_angle);
          console.log('t: ' + t);
          // compute orientations
          var heading = Cesium.Math.toRadians(0);
          var pitch = Cesium.Math.toRadians(50);
          var roll = Cesium.Math.toRadians(cur_angle);
          var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
          // var orientation = Cesium.Transforms.headingPitchRollQuaternion(
          //   position,
          //   hpRoll
          // );
          var orientation = Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(0, 0, 1000),
            hpRoll
          );

          // console.log(orientation);
          // throw new Error('stop');

          orientations.push(t);
          orientations.push(orientation.x);
          orientations.push(orientation.y);
          orientations.push(orientation.z);
          orientations.push(orientation.w);

          time = Cesium.JulianDate.addSeconds(
            start,
            t,
            new Cesium.JulianDate()
          );

          orientationProperty.addSample(time, orientation);
          // console.log(orientation);

          cur_angle = (cur_angle + angle_increment) % 360;
        }

        console.log('actual t: ' + t);

        // throw new Error('stop');
      }
      console.log('num_points: ' + num_points);

      console.log('calculated points and orientations');

      positionProperty.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
      });

      console.log(coords);
      console.log(orientations);

      // console.log('about to add earth entity');

      // console.log('positionProperty: ', positionProperty);

      var earth_entity = viewer.entities.add({
        id: 'Earth',

        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),

        //Use our computed positions
        // position: positionProperty,
        // orientation: orientationProperty,

        //Load the Cesium plane model to represent the entity
        model: {
          // uri: '../../models/Earth_1_12756.glb',
          uri: '../../models/Earth_rot_around_x.glb',
          minimumPixelSize: 64,
        },

        //Show the path as a pink line sampled in 1 second increments.
        path: {
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Cesium.Color.YELLOW,
          }),
          width: 10,
        },
      });
      console.log('created model');

      console.log(positionProperty);
      console.log(orientationProperty);

      // earth_entity.position = positionProperty;
      earth_entity.position = Cesium.Cartesian3.fromDegrees(0, 0, 1000);
      earth_entity.orientation = orientationProperty;

      viewer.trackedEntity = earth_entity;
      console.log(earth_entity.position);
      // viewer.camera.flyTo(earth_entity.position);
    })
    .catch((error) => {
      console.error('Error reading file:', error);
    });
}

Sandcastle.addDefaultToolbarButton('Satellites', function () {
  // viewer.dataSources.add(
  //   Cesium.CzmlDataSource.load('../../data/filled_testing2.czml')
  //   // Cesium.CzmlDataSource.load('../../czml/testing2.czml')
  // );
  // console.log(viewer.entities.getById('Earth'));

  // todo: instead call these on load
  // viewInICRF();

  //setup the clock
  clockSetup();

  // for debugging orientations
  // createModel('../../models/Earth_1_12756.glb', 5000.0);

  setupViewer();

  setEarthOrientations();
  // addModel();

  viewer.camera.flyHome(0);
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
