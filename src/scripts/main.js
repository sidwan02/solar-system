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
    console.log('not icrf');
    return;
  } else {
    console.log('icrf');
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
  // scene.sun.show = false;
  scene.shadowMap.enabled = false;
  scene.globe.enableLighting = false;
  // scene.highDynamicRange = false;

  viewer.li;
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

// TODO: need to add capability to incremement i in the file fetch based on the diff in days from the data file (eg if the pluto datasheet has data of every 10 days then must account for that when dealing with orbital resolution).

const day_to_sec = 86400;
const hr_to_sec = 3600;

const earthParams = new Map([
  ['id', 'Earth'],
  ['name', 'Earth'],
  ['model_path', '../models/Earth_1_12756.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/earth_helios_bgaiRcAjxg.lst'],
  // days
  ['revolution_period', 365],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 23.9 * hr_to_sec],
  ['axial_tilt', 23.5],
  ['heading', -90],
]);

const secs_in_yr = 31536000;

const sunParams = new Map([
  ['id', 'Sun'],
  ['name', 'Sun'],
  ['model_path', 'models/Sun_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', null],
  // days
  ['revolution_period', null],
  // number of data points in each revolution
  ['orbital_resolution', null],
  // seconds
  ['rotation_period', day_to_sec * 26.6],
  ['axial_tilt', 90 - 7.25],
  ['heading', 0],
]);

const mercuryParams = new Map([
  ['id', 'Mercury'],
  ['name', 'Mercury'],
  ['model_path', 'models/Mercury_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/mercury_helios_Mp1LCBc0KB.lst'],
  // days
  ['revolution_period', 88],
  // number of data points in each revolution
  ['orbital_resolution', 88],
  // seconds
  ['rotation_period', 1407.6 * hr_to_sec],
  ['axial_tilt', 0.01],
  ['heading', -90],
]);
// TODO: need to do venus mars and jupiter
const venusParams = new Map([
  ['id', 'Venus'],
  ['name', 'Venus'],
  ['model_path', 'models/Venus_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/venus_helios_gnv2GCHrIo.lst'],
  // days
  ['revolution_period', 224],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 5832.5 * hr_to_sec],
  ['axial_tilt', 177.4],
  ['heading', -90],
]);

const marsParams = new Map([
  ['id', 'Mars'],
  ['name', 'Mars'],
  ['model_path', 'models/Mars_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/mars_helios_TUWUmyIbQB.lst'],
  // days
  ['revolution_period', 687],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 24.6 * hr_to_sec],
  ['axial_tilt', 25.2],
  ['heading', -90],
]);
const jupiterParams = new Map([
  ['id', 'Jupiter'],
  ['name', 'Jupiter'],
  ['model_path', 'models/Jupiter_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/jupiter_helios_Lo61p_mGMD.lst'],
  // days
  ['revolution_period', 4331],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 9.9 * hr_to_sec],
  ['axial_tilt', 3.1],
  ['heading', -90],
]);
const saturnParams = new Map([
  ['id', 'Saturn'],
  ['name', 'Saturn'],
  ['model_path', 'models/Saturn_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/saturn_helios_w__aG_TW9W.lst'],
  // days
  ['revolution_period', 10747],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 10.7 * hr_to_sec],
  ['axial_tilt', 26.7],
  ['heading', -90],
]);
const uranusParams = new Map([
  ['id', 'Uranus'],
  ['name', 'Uranus'],
  ['model_path', 'models/Uranus_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/uranus_helios_9gBjTz_lJA.lst'],
  // days
  ['revolution_period', 30589],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 17.2 * hr_to_sec],
  ['axial_tilt', 97.8],
  ['heading', -90],
]);
const neptuneParams = new Map([
  ['id', 'Neptune'],
  ['name', 'Neptune'],
  ['model_path', 'models/Neptune_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/neptune_helios_Uk1SK6w8f_.lst'],
  // days
  ['revolution_period', 59800],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 16.1 * hr_to_sec],
  ['axial_tilt', 28.3],
  ['heading', -90],
]);
const plutoParams = new Map([
  ['id', 'Pluto'],
  ['name', 'Pluto'],
  ['model_path', 'models/Pluto_rot_around_x.glb'],
  ['availability', '2000-01-01T00:00:00Z/2001-01-01T00:00:00Z'],
  ['description', ''],
  ['helio_path', 'data/pluto_helios_B61wAOJLdE.lst'],
  // days
  ['revolution_period', 90560],
  // number of data points in each revolution
  ['orbital_resolution', 100],
  // seconds
  ['rotation_period', 153.3 * hr_to_sec],
  ['axial_tilt', 119.5],
  ['heading', -90],
]);

const au_to_m = 149597870700;
const scale_factor = 1 / 20000;

function setPlanetProperties(planet_entity, planet_params) {
  // planet_entity.enableLighting = false;

  console.log('ibl', planet_entity._model);
  // planet_entity._model.imageBasedLightingFactor = new Cesium.Cartesian2(2, 2);
  // planet_entity._model.luminanceAtZenith = 10;

  // console.log('planet_entity: ', planet_entity);
  // console.log('planet_params: ', planet_params);
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

  if (planet_params.get('id') === 'Sun') {
    var orientation_t = 0;

    var orientations = [];

    var num_orientations_per_pos = 0;
    while (orientation_t <= secs_in_yr) {
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
      // var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      //   position,
      //   hpRoll
      // );
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        new Cesium.Cartesian3(0, 0, -6378137),
        hpRoll
      );

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

    console.log(orientations);

    planet_entity.position = Cesium.Cartesian3.fromDegrees(0, 0, -6378137);

    planet_entity.orientation = orientationProperty;
  } else {
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

        // number of days incremented in each line.
        day_incr =
          parseInt(lines[2].trim().split(/\s+/)[1]) -
          parseInt(lines[1].trim().split(/\s+/)[1]);

        console.log('day_incr: ' + day_incr);

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
          // var position = new Cesium.Cartesian3(0, 0, -6378137 );
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
            //   new Cesium.Cartesian3(0, 0, -6378137 ),
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

          // console.log('num_orientations_per_pos: ' + num_orientations_per_pos);

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
        //     // uri: 'models/Earth_1_12756.glb',
        //     uri: 'models/Earth_rot_around_x.glb',
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

        var fadedLine = new Cesium.StripeMaterialProperty({
          // The newest part of the line is bright yellow.
          evenColor: Cesium.Color.YELLOW,
          // The oldest part of the line is yellow with a low alpha value.
          oddColor: Cesium.Color.YELLOW.withAlpha(0.2),
          repeat: 1,
          offset: 0.25,
          orientation: Cesium.StripeOrientation.VERTICAL,
        });

        planet_entity.path.material = fadedLine;

        console.log(positionProperty);
        console.log(orientationProperty);

        planet_entity.position = positionProperty;
        // planet_entity.position = Cesium.Cartesian3.fromDegrees(0, 0, -6378137 );

        planet_entity.orientation = orientationProperty;

        // planet_entity.path.leadTime = new Cesium.ConstantProperty(
        //   Math.min((revolution_period * day_to_sec) / 2, 2 * secs_in_yr)
        // );
        planet_entity.path.leadTime = new Cesium.ConstantProperty(0);
        planet_entity.path.trailTime = new Cesium.ConstantProperty(
          Math.min(revolution_period * day_to_sec, 2 * secs_in_yr)
        );

        // viewer.trackedEntity = planet_entity;
        console.log('lead time: ', planet_entity.path.leadTime);
        // viewer.camera.flyTo(planet_entity.position);
      })
      .catch((error) => {
        console.error('Error reading file:', error);
      });
  }
}

const planetEntityIds = [
  'Sun',
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
];

const planetParams = new Map([
  ['Sun', sunParams],
  ['Mercury', mercuryParams],
  ['Venus', venusParams],
  ['Earth', earthParams],
  ['Mars', marsParams],
  ['Jupiter', jupiterParams],
  ['Saturn', saturnParams],
  ['Uranus', uranusParams],
  ['Neptune', neptuneParams],
  ['Pluto', plutoParams],
]);

Sandcastle.addDefaultToolbarButton('Satellites', function () {
  // TODO: make this a relative path cuz github otherwise loads https://sidwan02.github.io/data/template.czml
  var dataSource = Cesium.CzmlDataSource.load('data/template.czml');

  viewer.dataSources.add(dataSource);

  dataSource.then(function (ds) {
    console.log('created datasource');
    planetEntityIds.forEach((entityId) => {
      setPlanetProperties(
        ds.entities.getById(entityId),
        planetParams.get(entityId)
      );
    });
  });

  scene.skyBox.destroy();
  scene.skyBox = undefined;
  scene.sun.destroy();
  scene.sun = undefined;
  // scene.sunbloom = false;
  // var sunLight = new Cesium.SunLight();
  // sunLight.intensity = 0.01;
  // sunLight.direction = new Cartesian3(0, 0, 0);

  // TODO: play around with this.
  const customLight = new Cesium.DirectionalLight({
    direction: new Cesium.Cartesian3(0, 0, -10000000),
    color: Cesium.Color.fromCssColorString('#FFFFFF'),
    intensity: 2,
  });

  scene.light = customLight;
  // scene.light = sunLight;

  console.log('scene: ', scene);

  // todo: instead call these on load
  // viewInICRF();

  //setup the clock
  clockSetup();

  // for debugging orientations
  // createModel('models/Earth_1_12756.glb', 5000.0);

  setupViewer();

  // addModel();

  viewer.camera.flyHome(0);
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
