import { modelProperties } from "../BIMViewer.js"
import { createBarChart } from "../utils/chart.js"

const updateCountBarChart = () => {
  let parts = modelProperties?.parts
  let labels = [], data = []
  
  for (let i = 1; i < 8; i++) {
    labels.push('Fase ' + i)
    data.push(parts[i].length)
  }
  createBarChart('bim-parts-count-chart', {title: 'Deler pr fase', label: "Antall", labels, data})
}

const updateVolumeBarChart = () => {
  let volume = modelProperties.volume
  let labels = [], data = []
  
  for (let i = 1; i < 8; i++) {
    labels.push('Fase ' + i)
    data.push(volume[i])
  }
  createBarChart('bim-parts-volume-chart', {title: 'Volum pr fase', label: "Volum", labels, data})
}

export const updateBIMTiles = () => {
  let phase = Number(document.getElementById('phase-select').value)
  //phase -= 1
  
  let count = modelProperties?.parts?.[phase]
  count = count ? count.length : 0 
  let vol = modelProperties?.volume?.[phase] ?? 0

  document.getElementById('bim-parts-count').innerHTML = count
  document.getElementById('bim-parts-volume').innerHTML = `${Math.round(vol)} m<SUP>3</SUP>`
}

export const updateBIMVisualizations = () => {
  updateBIMTiles()
  updateCountBarChart()
  updateVolumeBarChart()
}