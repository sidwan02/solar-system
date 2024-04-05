const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
  globe: false,
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
  scene.globe.enableLighting = false;
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

const day_to_sec = 86400;

const earthParams = new Map([
  ['id', 'Earth'],
  ['name', 'Earth'],
  ['model_path', '../models/Earth_1_12756.glb'],
  ['availability', '2021-01-01T00:00:00Z/2022-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', '../../data/earth_helios_bgaiRcAjxg.lst'],
  // days
  ['revolution_period', 365],
  // number of data points in each revolution
  ['orbital_resolution', 365],
  // seconds
  ['rotation_period', day_to_sec],
  ['axial_tilt', 23.5],
  ['heading', -50],
]);

const au_to_m = 149597870700;
const scale_factor = 1 / 10000;

function setPlanetProperties(planet_entity, planet_params) {
  // console.log(viewer.dataSources);
  // var entity = viewer.entities.getById('Earth');
  // console.log(entity);

  console.log('planet_params: ', planet_params);

  var positionProperty = new Cesium.SampledPositionProperty();
  var orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);

  var rotation_period = planet_params.get('rotation_period');

  // in degrees
  angle_increment = 30;
  cur_angle = 0;

  var file_path = planet_params.get('helio_path');

  var revolution_period = planet_params.get('revolution_period');
  var orbital_resolution = planet_params.get('orbital_resolution');

  var stride = revolution_period / orbital_resolution;

  var orientation_t = 0;
  var position_t = 0;
  // console.log('start: ' + start);

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
          position_t,
          new Cesium.JulianDate()
        );

        // console.log(time);

        num_points += 1;

        var line = lines[i].trim().split(/\s+/);
        // console.log('line: ' + line);
        // var yr = parseFloat(line[0]);
        // var day = parseFloat(line[1]);
        var x = parseFloat(line[2]) * au_to_m * scale_factor;
        var y = parseFloat(line[3]) * au_to_m * scale_factor;
        var z = parseFloat(line[4]) * au_to_m * scale_factor;
        // var x = 0;
        // var y = 0;
        // var z = 0;
        // console.log('x: ' + x + ', y: ' + y + ', z: ' + z);
        // throw new Error('stop');

        var position = new Cesium.Cartesian3(x, y, z);
        // var position = new Cesium.Cartesian3(0, 0, 0);
        // var position = Cesium.Cartesian3.fromDegrees(100, 10, 1750);

        coords.push(position_t);
        coords.push(x);
        coords.push(y);
        coords.push(z);

        positionProperty.addSample(time, position);

        // console.log('new point: ' + x + ', ' + y + ', ' + z);
        // console.log('new point t: ' + t);

        // add the rotations until the next position update.
        next_position_t = position_t + day_to_sec * stride;

        // console.log('next_position_t: ', next_position_t);

        var num_orientations_per_pos = 0;
        while (orientation_t < next_position_t) {
          // console.log('t: ' + t);
          var time = Cesium.JulianDate.addSeconds(
            start,
            orientation_t,
            new Cesium.JulianDate()
          );

          // console.log('cur_angle: ' + cur_angle);
          // console.log('orientation_t: ' + orientation_t);
          // compute orientations
          // depending on the scale factor, may need to change the heading.
          var heading = Cesium.Math.toRadians(planet_params.get('heading'));
          var pitch = Cesium.Math.toRadians(planet_params.get('axial_tilt'));
          var roll = Cesium.Math.toRadians(cur_angle);
          var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
          var orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpRoll
          );
          // var orientation = Cesium.Transforms.headingPitchRollQuaternion(
          //   new Cesium.Cartesian3(0, 0, 0),
          //   hpRoll
          // );

          // console.log(orientation);
          // throw new Error('stop');

          orientations.push(orientation_t);
          orientations.push(orientation.x);
          orientations.push(orientation.y);
          orientations.push(orientation.z);
          orientations.push(orientation.w);

          time = Cesium.JulianDate.addSeconds(
            start,
            orientation_t,
            new Cesium.JulianDate()
          );

          orientationProperty.addSample(time, orientation);
          // console.log(orientation);

          cur_angle = (cur_angle + angle_increment) % 360;

          orientation_t += rotation_period / (360 / angle_increment);

          num_orientations_per_pos += 1;
        }

        console.log('num_orientations_per_pos: ' + num_orientations_per_pos);

        position_t = next_position_t;
        // console.log('next_position_t: ' + position_t);

        // console.log('actual t: ' + t);
        // if (position_t >= 630720) {
        //   throw new Error('stop');
        // }
      }
      console.log('num_points: ' + num_points);

      console.log('calculated points and orientations');

      positionProperty.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
      });

      orientationProperty.setInterpolationOptions({
        interpolationDegree: 1,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });

      console.log(coords);
      console.log(orientations);

      // console.log('about to add earth entity');

      // console.log('positionProperty: ', positionProperty);

      // var planet_entity = viewer.entities.add({
      //   id: 'Earth',

      //   //Set the entity availability to the same interval as the simulation time.
      //   availability: new Cesium.TimeIntervalCollection([
      //     new Cesium.TimeInterval({
      //       start: start,
      //       stop: stop,
      //     }),
      //   ]),

      //   //Use our computed positions
      //   // position: positionProperty,
      //   // orientation: orientationProperty,

      //   //Load the Cesium plane model to represent the entity
      //   model: {
      //     // uri: '../../models/Earth_1_12756.glb',
      //     uri: '../../models/Earth_rot_around_x.glb',
      //     minimumPixelSize: 64,
      //   },

      //   //Show the path as a pink line sampled in 1 second increments.
      //   path: {
      //     resolution: 1,
      //     material: new Cesium.PolylineGlowMaterialProperty({
      //       glowPower: 0.1,
      //       color: Cesium.Color.YELLOW,
      //     }),
      //     width: 10,
      //   },
      // });
      // console.log('created model');

      console.log(positionProperty);
      console.log(orientationProperty);

      planet_entity.position = positionProperty;
      // planet_entity.position = Cesium.Cartesian3.fromDegrees(0, 0, 0);
      planet_entity.orientation = orientationProperty;

      viewer.trackedEntity = planet_entity;
      // console.log(planet_entity.position);
      // viewer.camera.flyTo(planet_entity.position);
    })
    .catch((error) => {
      console.error('Error reading file:', error);
    });
}

const planetEntityIds = [
  // 'Sun',
  // 'Mercury',
  // 'Venus',
  'Earth',
  // 'Mars',
  // 'Jupiter',
  // 'Saturn',
  // 'Uranus',
  // 'Neptune  ',
  // 'Pluto',
];

const planetParams = new Map([
  // ['Sun', sunParams],
  // ['Mercury', mercuryParams],
  // ['Venus', venusParams],
  ['Earth', earthParams],
  // ['Mars', marsParams],
  // ['Jupiter', jupiterParams],
  // ['Saturn', saturnParams],
  // ['Uranus', uranusParams],
  // ['Neptune', neptuneParams],
  // ['Pluto', plutoParams]
]);

Sandcastle.addDefaultToolbarButton('Satellites', function () {
  var dataSource = Cesium.CzmlDataSource.load(
    '../../data/filled_testing2.czml'
  );

  viewer.dataSources.add(
    // Cesium.CzmlDataSource.load('../../czml/testing2.czml')
    dataSource
  );

  dataSource.then(function (ds) {
    console.log('created datasource');
    planetEntityIds.forEach((entityId) => {
      setPlanetProperties(
        ds.entities.getById(entityId),
        planetParams.get(entityId)
      );
    });
  });

  // todo: instead call these on load
  viewInICRF();

  //setup the clock
  clockSetup();

  // for debugging orientations
  // createModel('../../models/Earth_1_12756.glb', 5000.0);

  setupViewer();

  // addModel();

  viewer.camera.flyHome(0);
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
