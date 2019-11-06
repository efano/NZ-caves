# Invasive Water Buttercup

## An exploratory web map using npm

### Steps

* Two shapefiles were used to create this project. The New Zealand regions shapefile, statsnzregional-council-2015-v1-00-clipped-SHP, was downloaded from: [Stats NZ](https://datafinder.stats.govt.nz/search/?q=statsnzregional-council-2015-v1-00-clipped-SHP). The Water Buttercup shapfile, freshwater-pests-water-buttercup.shp, was obtained from [MfE Data Service](https://data.mfe.govt.nz/layer/52742-freshwater-pests-water-buttercup/)

* Created a remote [github repository](https://github.com/efano/Invasive Water Buttercup). This repository was then cloned down locally, and the npm init was used to create the package.json file

* The shapefile, freshwater-pests-water-buttercup.shp, was filtered fields to the Species_na and Common_nam field, reduced precision, and converted to GeoJSON using the command $: `mapshaper freshwater-pests-water-buttercup.shp -filter-fields Species_na,Common_nam -o precision=.000001 format=geojson ../data/water-buttercup.json`

* The shapefile, regional-council-2015-v1-00-clipped.shp, was simplified to 3% of its original geometry (percentage determined using Mapshaper.org), reprojected to WGS84, filtered fields to the REGC2015_1 and REGC2015_C fields, and converted to GeoJSON using the command $: `mapshaper regional-council-2015-v1-00-clipped.shp -filter-fields REGC2015_1,REGC2015_C -simplify dp 3% -o precision=.000001 format=geojson ../data/regions.json`. The Chatman Islands record was removed from the original shapefile using QGIS because its coordinates crossed over the International Data Line and therefore would not display at the zoom level. The REGC2015_C field was added using QGIS.
