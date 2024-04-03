# solar-system

Simulation of the solar system using using CesiumJS.

Getting started:

- https://sandcastle.cesium.com/?src=CZML.html
- https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/
- https://github.com/CesiumGS/cesium/tree/main/Apps

CZML:

- https://community.cesium.com/t/leadtime-and-trailtime-in-simple-czml/2749/2
- https://stackoverflow.com/questions/24823310/cesium-czml-using-lat-long-alt
- https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/Packet
  - For position, the array is time lat long alt for cartographic or time x y z for cartesian
- https://support.esri.com/en-us/gis-dictionary/geocentric-coordinate-system#:~:text=The%20x%2Daxis%20is%20in,positive%20toward%20the%20north%20pole.

Heliocentric position of planets:

- http://www.stargazing.net/kepler/ellipse.html
- https://ssd.jpl.nasa.gov/planets/approx_pos.html
- https://omniweb.gsfc.nasa.gov/coho/helios/heli.html
  - Select solar ecliptic since that's heloiocentric coordinates. Then, either download the file which will give cartographic coords, or download the x y z coordaintes which will give cartograhpic ones.

Importing 3D models:

- https://sandcastle.cesium.com/index.html#c=jVPfb5swEP5XLF4CUmTSdVrWhkaLsikvnbYpWp94ueALeDU2sg1ROu1/r4GQQMqmISTju+9+fHcfFWiigfHSkAfy7v3dfDabLWIZhmfjh9v5x5vbuTPGsnLoiuMBtXNIPJA1Gl7m9Kmx+ZOkua6VtMAl6smU/I4lcY/JVCnYSvIcLJJ7sgdhcHryPR9XNlemyFDj0JVD8V2rX5hYruR9v+IGVaqhyHhyAfg9/xcheGEUZ35LZDo4giCWf4KG0hYkS8BYgVSjQeuI7UvZ5gu69lvOlIGFrSq1o0mBMf9Ua/2Si89nFxUKmD+hNHTvFvJCYO0MDa8/aeLAk6Cu3SR2A8Wu1eFM3zAgw7Ntv0uSCrXDYYJNbfLP2S/4BktRwk7gI08zy2Va064Hv+hD3NYOG61KyS4L6gEv1V3VsYVc9TO2spH2TsM2CUqkHa/mXPwNQHdgcK2EqnXZbaW+0tWPn6vxzHuVnmbArsgPYLlSshnEv0Cm/A9MBkwdvkIxUtWpceFNvcjYo8BlG/zJ6UVpS0otfKcki04+7ucx4a5MntHSxDQSiMIuKGK8Ipw9xN7Vbxh7JBFgjPPsSyG2/AVjbxmFDj8Iq4XrpPCtQi3gWEOym+Vja6SURqG7vo2ySokd6F7GVw
- https://sandcastle.cesium.com/?src=3D%20Models.html
- https://github.com/epn-vespa/cesium/tree/planetary/Apps/PlanetaryCesiumViewer
