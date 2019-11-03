# NZ-caves

## An exploratory web map using npm

### Steps

* Two shapefiles were used to create this project. The New Zealand regions shapefile, statsnzregional-council-2015-v1-00-clipped-SHP, was downloaded from: [Stats NZ](https://datafinder.stats.govt.nz/search/?q=statsnzregional-council-2015-v1-00-clipped-SHP). The caves shapfile, Caves.shp, was obtained from [ArcGIS Hub](https://hub.arcgis.com/datasets/eaglelabs::caves)

* Created a remote [github repository](https://github.com/efano/NZ-caves). This repository was then cloned down locally, and the npm init was used to create the package.json file

* The shapefile, Caves.shp, was reprojected to WGS84, filtered fields to the Name field, reduced precision, and converted to GeoJSON using the command $: `mapshaper Caves.shp -filter-fields Name -o precision=.000001 format=geojson ../data/caves.json`

* The shapefile, regional-council-2015-v1-00-clipped.shp, was simplified to 3% of its original geometry (I determined the percentage using Mapshaper.org), reprojected to WGS84, filtered fields to the REGC2015_1 field, and converted to GeoJSON using the command $: `mapshaper regional-council-2015-v1-00-clipped.shp -filter-fields REGC2015_1 -simplify dp 3% -o precision=.0001 format=geojson ../data/regions.json`
