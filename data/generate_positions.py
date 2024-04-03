file_path = "data\earth_helios_bgaiRcAjxg.lst"
# lines = []

au_to_m = 149597870700
day_to_sec = 86400

cartesian_coords = []

with open(file_path, "r") as file:
    next(file)
    t = 0
    for line in file:
        yr, day, x, y, z = line.strip().split()
        x = float(x) * au_to_m
        y = float(y) * au_to_m
        z = float(z) * au_to_m
        t += day_to_sec

        cartesian_coords.append(t)
        cartesian_coords.append(x)
        cartesian_coords.append(y)
        cartesian_coords.append(z)

# TODO: for each new orbit have a new trailing orbit and leading orbit timestamp generation
# Can start with a basic trail and leading time being the time period of one orbit, then could have interpolated trailing times to draw new orbit only after completoin of old one rather than in real time.
# TODO: inset this into template czml
