import { isolatePhase, loadDocument } from './BIMViewer.js'
import { updateVolumeVisualizations } from './dashboard/visualizations/VolumeData.js'
import { zoomToSlide, currentTimeExtent } from './main.js'
import { updateBIMTiles } from './dashboard/visualizations/BIMData.js'
import { sections, dayToPhase } from './config.js'

export const onSectionChange = () => {
  let section = currentSection()
  let phase = currentPhase()

  loadDocument(section) // Change model in BIM-viewer
  updateVolumeVisualizations(section, phase) // Update volumes in dashboard
  
  // Go to section slide in GIS-viewer
  let slideNr = sections?.[section]?.slide ?? 0
  zoomToSlide(slideNr) 
}




/* export const onPhaseChange = () => {
  let section = Number(document.getElementById('section-select').value)
  let phase = Number(document.getElementById('phase-select').value)   
  isolatePhase()
  updateVolumeVisualizations() //
  updateBIMTiles()
  updateTimeExtent(phase)
  
  // Go to phase slide in GIS-viewer
  let slideNr = sections?.[section]?.phases?.[phase]?.slide
  if (slideNr) zoomToSlide(slideNr) 
} */

export const onTimeExtentChange = (timeExtent) => {
  let section = currentSection()
  let phase = timeExtentToPhase(timeExtent)
  
  setPhaseDropDownValue(phase)
  isolatePhase(section, phase)
  updateVolumeVisualizations(section, phase) //
  updateBIMTiles(phase)
  
  // Go to phase slide in GIS-viewer
  let slideNr = sections?.[section]?.phases?.[phase]?.slide
  if (slideNr) zoomToSlide(slideNr)
}

export const timeExtentToPhase = (timeExtent) => {
  let day = timeExtent.start.getDate()
  return dayToPhase?.[day] || 1 
}

export const currentPhase = () => {
  return timeExtentToPhase(currentTimeExtent())
}

export const currentSection = () => {
  return Number(document.getElementById('section-select').value)
}

const setPhaseDropDownValue = (phase) => {
  document.getElementById('phase-select').value = phase
}