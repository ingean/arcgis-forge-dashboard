import WebScene from 'https://js.arcgis.com/4.26/@arcgis/core/WebScene.js'
import SceneView from 'https://js.arcgis.com/4.26/@arcgis/core/views/SceneView.js'
import ActionBar from './ActionBar.js'
import MapTheme from './MapTheme.js'
import * as OAuth2 from './OAuth2.js'
import * as SlidesWidget from './slidesWidget.js'
import * as BIMViewer from './BIMViewer.js'
import { addMaskinLayer, addMaskinLayer2, addVolumeLayer } from './streamService.js'
import { onPhaseChange, onSectionChange } from './changeSelection.js'
import { updateVolumeVisualizations } from './dashboard/VolumeVisualizations.js'
import { updateDitioVisualizations, getDitioDataPage } from './dashboard/DitioVisualizations.js'
import { sections } from './config.js'

let maskinLayer
let maskinLayer2
let volumeLayer 

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

export const zoomTo = (extent) => {
  view.goTo(extent)
}


const theme = new MapTheme(view, false) // Contains light and dark basemap
const actionBar = new ActionBar(view)

BIMViewer.init()
maskinLayer = addMaskinLayer(maskinLayer, view)
updateVolumeVisualizations()

let ditioLayer 

scene.when(() => {
  SlidesWidget.init(view, 'slides-container')
  document.querySelector("calcite-shell").hidden = false
  document.querySelector("#main-loader").hidden = true
  ditioLayer = view.map.allLayers.find((layer) => {
    return layer.title === "DitioBilder"
   })
  updateDitioVisualizations(ditioLayer)
})

document.querySelector("#header-title").textContent = "E16 Åsbygda - Olum"

document.getElementById('section-select')
.addEventListener('calciteSelectChange', onSectionChange)

document.getElementById('phase-select')
.addEventListener('calciteSelectChange', onPhaseChange)

document.getElementById("ditio-images-list-pager")
.addEventListener("calcitePaginationChange", (event) => {
  let page = (event.target.startItem === 1) ? 0 : event.target.startItem            
  getDitioDataPage(ditioLayer, page)
})

document.getElementById('stream-check-skanska')
.addEventListener('calciteSwitchChange', e => {
  let tab = document.getElementById('tab-tile-live')
  if (e.currentTarget.checked === true ) {
    maskinLayer = addMaskinLayer(maskinLayer, view)
    tab.setAttribute('disabled', false)
  } else {
    view.map.remove(maskinLayer)
    tab.setAttribute('disabled', true)
  }
})

document.getElementById('stream-check-volume')
.addEventListener('calciteSwitchChange', e => {
  if (e.currentTarget.checked === true ) {
    volumeLayer = addVolumeLayer(volumeLayer, view)
  } else {
    view.map.remove(volumeLayer)
  }
})

document.getElementById('stream-check-other')
.addEventListener('calciteSwitchChange', e => {
  if (e.currentTarget.checked === true ) {
    maskinLayer2 = addMaskinLayer2(maskinLayer2, view)
  } else {
    view.map.remove(maskinLayer2)
  }
})
