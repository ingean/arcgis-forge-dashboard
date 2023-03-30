import WebScene from 'https://js.arcgis.com/4.26/@arcgis/core/WebScene.js'
import SceneView from 'https://js.arcgis.com/4.26/@arcgis/core/views/SceneView.js'
import ActionBar from './ActionBar.js'
import MapTheme from './MapTheme.js'
import * as OAuth2 from './OAuth2.js'
import * as SlidesWidget from './slidesWidget.js'
import * as BIMViewer from './BIMViewer.js'
import { addStreamLayers } from './streamService.js'
import { onPhaseChange, onSectionChange } from './changeSelection.js'
import { updateVolumeVisualizations } from './VolumeVisualizations.js'
import { sections } from './config.js'


const portal = await OAuth2.authenticate() //Authenticate with named user using OAuth2
const webmapId = '6633c8f8fe0643d0a23e46447bc5339b' // Publicly available webmap

const scene = new WebScene({
  portalItem: {
    id: webmapId
  }
})

const view = new SceneView({
  map: scene,
  container: 'GISviewDiv',
  qualityProfile: 'high',
  environment: {
    atmosphere: {
      quality: 'high'
    },
    lighting: {
      date: new Date(),
      directShadowsEnabled: true
    }
  },
  padding: {
    left: 49
  }
})

export const zoomToSlide = (slideNr) => {
  let slide = scene.presentation.slides.getItemAt(slideNr)
  slide.applyTo(view)
}


const theme = new MapTheme(view, false) // Contains light and dark basemap
const actionBar = new ActionBar(view)

BIMViewer.init()
addStreamLayers(view)
updateVolumeVisualizations()

scene.when(() => {
  SlidesWidget.init(view, 'slides-container')
  document.querySelector("#header-title").textContent = "E16 Åsbygda - Olum"
  document.querySelector("calcite-shell").hidden = false
  document.querySelector("#main-loader").hidden = true
})

document.getElementById('section-select')
.addEventListener('calciteSelectChange', onSectionChange)

document.getElementById('phase-select')
.addEventListener('calciteSelectChange', onPhaseChange)