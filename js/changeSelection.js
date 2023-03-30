import { isolatePhase, loadDocument } from './BIMViewer.js'
import { updateVolumeVisualizations } from './VolumeVisualizations.js'
import { zoomToSlide } from './main.js'
import { updateBIMTiles } from './BIMVisualizations.js'
import { sections } from './config.js'

export const onSectionChange = () => {
  let section = Number(document.getElementById('section-select').value)
  loadDocument(section) // Change model in BIM-viewer
  updateVolumeVisualizations() // Update volumes in dashboard
  
  // Go to section slide in GIS-viewer
  let slideNr = sections?.[section]?.slide ?? 0
  zoomToSlide(slideNr) 
}

export const onPhaseChange = () => {
  let section = Number(document.getElementById('section-select').value)
  let phase = Number(document.getElementById('phase-select').value)   
  isolatePhase()
  updateVolumeVisualizations() //
  updateBIMTiles()
  
  // Go to phase slide in GIS-viewer
  let slideNr = sections?.[section]?.phases?.[phase]?.slide
  if (slideNr) zoomToSlide(slideNr) 
}