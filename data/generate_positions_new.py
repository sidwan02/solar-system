import json
import math
from calc_quaternion import calc_quaternion
import numpy as np


au_to_m = 149597870700
day_to_sec = 86400
scale_factor = 1 / 10000
# number of points in an orbit
orbital_resolution = 100

Earth_data = {
    "id": "Earth",
    "name": "Earth",
    "model_path": "../models/Earth_1_12756.glb",
    "availability": "2021-01-01T00:00:00Z/2022-01-01T00:00:00Z",
    "description": "",
    "helio_path": "data\earth_helios_bgaiRcAjxg.lst",
    "days_in_orbit": 365,
    "full_rotation_duration": day_to_sec,
    "axial_tilt": 23.5,
}


cartesian_coords = []
end_t = 0

for data in [Earth_data]:
    coords = data["helio_path"]
    days_in_orbit = data["days_in_orbit"]

    with open(coords, "r") as file:
        next(file)
        stride = days_in_orbit / orbital_resolution
        t = 0

        for i, line in enumerate(file):
            if i % math.floor(stride) != 0:
                continue

            yr, day, x, y, z = line.strip().split()
            x = float(x) * au_to_m * scale_factor
            y = float(y) * au_to_m * scale_factor
            z = float(z) * au_to_m * scale_factor

            cartesian_coords.append(t)
            cartesian_coords.append(x)
            cartesian_coords.append(y)
            cartesian_coords.append(z)

            end_t = t
            t += day_to_sec * stride

    quaternion_vals = []

    full_rotation_duration = data["full_rotation_duration"]

    # number of points per rotation
    # if you reduce this there's an array lenght error? might be because the sqrt square of the vals is no longer close enough to 1, since I'm flooring values of 16 sf to 0. This issue only happens if w is ever rounded.
    angle_granularity = np.pi / 16

    cur_angle = 0
    t = 0

    axial_tilt = data["axial_tilt"] / 180 * np.pi

    while t <= end_t:
        # TODO: later on these direction cosine angles will be replaced for different planets depending on their axial tilt
        x, y, z, w = calc_quaternion(cur_angle, [0, np.pi / 2, np.pi / 2])
        quaternion_vals.append(t)
        quaternion_vals.append(x)
        quaternion_vals.append(y)
        quaternion_vals.append(z)
        quaternion_vals.append(w)

        # seconds in day / number of angles to complete one rotation
        t += full_rotation_duration / ((2 * np.pi) / angle_granularity)
        cur_angle = (cur_angle + angle_granularity) % (2 * np.pi)

    # TODO: for each new orbit have a new trailing orbit and leading orbit timestamp generation
    # Can start with a basic trail and leading time being the time period of one orbit, then could have interpolated trailing times to draw new orbit only after completoin of old one rather than in real time.

    # Load the JSON from testing2.czml
    with open("czml/testing2.czml", "r") as czml_file:
        czml_data = json.load(czml_file)

    # Add the cartesian coordinates to the JSON
    czml_data[-1]["position"]["cartesian"] = cartesian_coords
    czml_data[-1]["orientation"]["unitQuaternion"] = quaternion_vals

    # Write the updated JSON to a new czml file
    output_coords = "data/filled_testing2.czml"
    with open(output_coords, "w") as output_file:
        json.dump(czml_data, output_file)

    # TODO: there is some issue with the interpolated path not looking good.
