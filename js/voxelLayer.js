import VoxelLayer from "https://js.arcgis.com/4.26/@arcgis/core/layers/VoxelLayer.js"
import VoxelDynamicSection from "https://js.arcgis.com/4.26/@arcgis/core/layers/voxel/VoxelDynamicSection.js"
import VoxelSlice from "https://js.arcgis.com/4.26/@arcgis/core/layers/voxel/VoxelSlice.js"
import { basemapOpacity } from "./main.js"

let voxelLayer;

const createVoxelLayer = () => {
  voxelLayer = new VoxelLayer({
    title: "Volummodell",
    //url: "https://tiles.arcgis.com/tiles/2JyTvMWQSnM2Vi8q/arcgis/rest/services/P05_volummodell/SceneServer",
    url: "https://tiles.arcgis.com/tiles/2JyTvMWQSnM2Vi8q/arcgis/rest/services/P03_Volummodell/SceneServer",
    visible: false
  })
}

export const addVoxelLayer = (view) => {
  createVoxelLayer()
  view.map.add(voxelLayer)
  return voxelLayer
}

export const showVoxelLayer = (view) => {
  voxelLayer.visible = true
  basemapOpacity(0.5)
}

export const hideVoxelLayer = (view) => {
  voxelLayer.visible = false
  basemapOpacity(1)
}

export const initVoxelSlices = (view) => {
  view.whenLayerView(voxelLayer).then((voxelLayerView) => {
    voxelLayer.renderMode = "volume"

    const vxlVolume = voxelLayer.getVolume(null)
    const volSize = vxlVolume.sizeInVoxels
    const volType = vxlVolume.volumeType
    let xSlice, ySlice, zSlice;

    const sliceXAxisSlider = document.getElementById("sliceXAxisSlider");
    const sliceYAxisSlider = document.getElementById("sliceYAxisSlider");
    const sliceZAxisSlider = document.getElementById("sliceZAxisSlider");

    xSlice = new VoxelSlice({ orientation: 270, tilt: 90, point: [volSize[0], 0, 0] });
    ySlice = new VoxelSlice({ orientation: 180, tilt: 90, point: [0, 0, 0] });
    zSlice = new VoxelSlice({ orientation: 0, tilt: 0, point: [0, 0, volSize[2]] });
    voxelLayer.getVolumeStyle(null).slices = [xSlice, ySlice, zSlice];


    sliceXAxisSlider.max = volSize[0];
    sliceXAxisSlider.value = volSize[0];
    sliceXAxisSlider.addEventListener("calciteSliderInput", () => {
      const newPoint = [sliceXAxisSlider.value, 0, 0];
      const xslc = voxelLayer.getVolumeStyle(null).slices.getItemAt(0);
      xslc.point = newPoint;
    });

    sliceYAxisSlider.max = volSize[1];
    sliceYAxisSlider.value = 0;
    sliceYAxisSlider.addEventListener("calciteSliderInput", () => {
      const newPoint = [0, sliceYAxisSlider.value, 0];
      const yslc = voxelLayer.getVolumeStyle(null).slices.getItemAt(1);
      yslc.point = newPoint;
    });

    sliceZAxisSlider.max = volSize[2];
    sliceZAxisSlider.value = volSize[2];
    sliceZAxisSlider.addEventListener("calciteSliderInput", () => {
      const newPoint = [0, 0, sliceZAxisSlider.value];
      const zslc = voxelLayer.getVolumeStyle(null).slices.getItemAt(2);
      zslc.point = newPoint;
    });
  });
}

