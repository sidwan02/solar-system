from poliastro.czml.extract_czml import CZMLExtractor
from poliastro.examples import molniya

# TODO: have not tested this yet

start_epoch = molniya.epoch
end_epoch = molniya.epoch + molniya.period
N = 80

extractor = CZMLExtractor(start_epoch, end_epoch, N)

extractor.add_orbit(
    molniya,
    id_name="MolniyaOrbit",
    path_width=2,
    label_text="Molniya",
    label_fill_color=[125, 80, 120, 255],
)

with open("data.czml", "w") as outfile:
    # Use json.dump to write the data to the file
    json.dump(extractor.packets, outfile)
