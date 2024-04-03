from poliastro.czml.extract_czml import CZMLExtractor
from poliastro.examples import molniya
from poliastro.bodies import Mars


# TODO: have not tested this yet

start_epoch = molniya.epoch
end_epoch = molniya.epoch + molniya.period
N = 80

print(f"start_epoch: {start_epoch}")
print(f"end_epoch: {end_epoch}")

extractor = CZMLExtractor(start_epoch, end_epoch, N)

extractor.add_orbit(
    Mars,
    id_name="MarsOrbit",
    path_width=2,
    label_text="Mars",
    label_fill_color=[125, 80, 120, 255],
)

with open("mars.czml", "w") as file:
    # Use json.dump to write the data to the file
    # print(extractor.packets)
    file.write(str(extractor.packets))
