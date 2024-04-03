import json
import math

file_path = "data\earth_helios_bgaiRcAjxg.lst"
# lines = []

au_to_m = 149597870700
day_to_sec = 86400
scale_factor = 1 / 10000
# number of points in an orbit
orbital_resolution = 365

days_in_orbit = 365

cartesian_coords = []

with open(file_path, "r") as file:
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

        t += day_to_sec * stride

# for some strange reason the geoeye satellite is missing from the image when making this change.

# TODO: for each new orbit have a new trailing orbit and leading orbit timestamp generation
# Can start with a basic trail and leading time being the time period of one orbit, then could have interpolated trailing times to draw new orbit only after completoin of old one rather than in real time.

# Load the JSON from testing2.czml
with open("czml/testing2.czml", "r") as czml_file:
    czml_data = json.load(czml_file)

# Add the cartesian coordinates to the JSON
czml_data[-1]["position"]["cartesian"] = cartesian_coords

# Write the updated JSON to a new czml file
output_file_path = "data/filled_testing2.czml"
with open(output_file_path, "w") as output_file:
    json.dump(czml_data, output_file)
