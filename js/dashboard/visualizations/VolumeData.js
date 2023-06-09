import { createPieChart, createBarChart } from "../../utils/chart.js"
import { currentPhase, currentSection } from "../../changeSelection.js";

const volumeFSUrl = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Volumberegninger/FeatureServer/0';
let volumeData = {}


const getVolumeData = (section) => {
  
  return new Promise((resolve, reject) => {
    fetch(`${volumeFSUrl}/query?where=Parsell=${section}&f=json&outFields=*`)
    .then(res => {
      res.json()
      .then(r => {
        volumeData[section] = {}
        r.features.forEach(feature => {
          volumeData[section][feature.attributes.Fase] = feature.attributes  
        })
        resolve(volumeData)
      })
    })
    .catch(error => {
      console.error(`Not able to fetch volume data for section ${section} from AGOL: ${error}`)
      reject(volumeData)
    })
  })
}

const updateVolumeTiles = (section, phase) => {
  phase -= 1
  let plannedVol = getVolumeValue(section, phase, 'Prosjektert')
  let removedVol = getVolumeValue(section, phase, 'Fjernet')
  let addedVol = getVolumeValue(section, phase, 'Lagt_til')
  let progress = (removedVol / plannedVol) * 100
  let remainingVol = plannedVol - removedVol;
  
  document.getElementById('volume-remaining').innerHTML = Math.round(remainingVol).toLocaleString() + ' m<sup>3</sup>';
  document.getElementById('volume-removed').innerHTML = Math.round(removedVol).toLocaleString() + ' m<sup>3</sup>';
  document.getElementById('volume-added').innerHTML = Math.round(addedVol).toLocaleString() + ' m<sup>3</sup>';
  document.getElementById('volume-progress').innerHTML = Math.round(progress) + ' %';
}

const updateVolumeChart = (section, phase) => {
  let d = volumeData[section][phase - 1]
  let data = [d['Prosjektert'] - d['Fjernet'], d['Fjernet'] , d['Lagt_til']]
  let labels = ['Gjenstår', 'Utgravd', 'Fylt ut']
  let bgColor = ['rgb(0,92,230,0.5)', 'rgb(255,255,255,0.5)', 'rgb(137,205,102,0.5)']
  createPieChart('volume-chart', {title: 'Fremdrift, grunnarbeid', label: "Volum", labels, data, bgColor})
}

const updateVolumeRemovedChart = (section) => {
  let labels = [], data = [], bgColor = []
  
  for (let i = 0; i < 7; i++) {
    labels.push('Fase ' + (i + 1))
    data.push(volumeData[section][i]['Fjernet'])
    bgColor.push('rgb(255,255,255,0.5)')
  } 
  createBarChart('volume-chart-removed', {title: 'Masse, fjernet', label: "Volum", labels, data, bgColor})
}

const updateVolumeAddedChart = (section) => {
  let labels = [], data = [], bgColor = []
  
  for (let i = 0; i < 7; i++) {
    labels.push('Fase ' + (i + 1))
    data.push(volumeData[section][i]['Lagt_til'])
    bgColor.push('rgb(137,205,102,0.5)')
  }
  createBarChart('volume-chart-added', {title: 'Masse, lagt til', label: "Volum", labels, data, bgColor})
}

const getVolumeValue = (section, phase, key) => {
  let value = volumeData?.[section]?.[phase]?.[key]
  return value ? value : 0
}

export const updateVolumeVisualizations = async (section, phase) => { 
  section = (section) ? section : currentSection()
  phase = (phase) ? phase : currentPhase()

  if (!(section in volumeData)) await getVolumeData(section)
  updateVolumeTiles(section, phase)
  updateVolumeChart(section, phase)
  updateVolumeRemovedChart(section)
  updateVolumeAddedChart(section)
}

