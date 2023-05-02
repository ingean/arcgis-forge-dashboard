import WebScene from 'https://js.arcgis.com/4.26/@arcgis/core/WebScene.js'
import SceneView from 'https://js.arcgis.com/4.26/@arcgis/core/views/SceneView.js'
import TimeExtent from 'https://js.arcgis.com/4.26/@arcgis/core/TimeExtent.js'
import ActionBar from './ActionBar.js'
import MapTheme from './MapTheme.js'
import * as OAuth2 from './OAuth2.js'
import * as SlidesWidget from './slidesWidget.js'
import * as BIMViewer from './BIMViewer.js'
import { addMaskinLayer, addMaskinLayer2, addVolumeLayer } from './streamLayers.js'
import { onTimeExtentChange, onSectionChange } from './changeSelection.js'
import { updateVolumeVisualizations } from './dashboard/visualizations/VolumeData.js'
import { updateDitioVisualizations, getDitioDataPage } from './dashboard/visualizations/DitioData.js'
import { onDashboardAccordionItemClick, onTabChange, onTimesliderAccordionItemClick } from './dashboard/dashboard.js'
import { addVoxelLayer, initVoxelSlices } from './voxelLayer.js'
import { initTimeSlider } from './TimeSlider.js'
import { phaseToDay } from './config.js'

let maskinLayer
let maskinLayer2
let volumeLayer
let ditioLayer 

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
const theme = new MapTheme(view, false) // Contains light and dark basemap
const actionBar = new ActionBar(view)

const timeSlider = initTimeSlider(view, new Date(2020, 5, 11), new Date(2020, 5, 23), 'days')
timeSlider.watch("timeExtent", (timeExtent) => {
  onTimeExtentChange(timeExtent)
})

export const currentTimeExtent = () => {
  return timeSlider.timeExtent
} 

export const zoomToSlide = (slideNr) => {
  let slide = scene.presentation.slides.getItemAt(slideNr)
  slide.applyTo(view)
}

export const zoomTo = (extent) => {
  view.goTo(extent)
}

export const basemapOpacity = (opacity) => {
  view.map.basemap.baseLayers.at(0).opacity = opacity
}

export const onPhaseChange = () => {
  let phase = Number(document.getElementById('phase-select').value)
  let day = phaseToDay[phase]
  let timeExtent = new TimeExtent(
    { 
      start: new Date(2020, 5, day), 
      end: new Date(2020, 5, day + 1)
    })
  timeSlider.timeExtent = timeExtent
}

BIMViewer.init()
maskinLayer = addMaskinLayer(maskinLayer, view)
addVoxelLayer(view)
initVoxelSlices(view)
updateVolumeVisualizations()

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
  let tab = document.getElementById('db-tab-title-stream')
  if (e.currentTarget.checked === true ) {
    maskinLayer = addMaskinLayer(maskinLayer, view)
    tab.removeAttribute('disabled')
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

document.getElementById('db-tab-nav')
.addEventListener('calciteTabsActivate', onTabChange)

document.getElementById('dashboard-accordion-item')
.addEventListener('calciteInternalAccordionItemSelect', onDashboardAccordionItemClick)

document.getElementById('timeslider-accordion-item')
.addEventListener('calciteInternalAccordionItemSelect', onTimesliderAccordionItemClick)