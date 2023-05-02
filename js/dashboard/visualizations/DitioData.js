import { element } from "../../utils/html.js"
import { zoomTo } from "../../main.js"
import { format, parseISO } from 'https://esm.run/date-fns'

const updateDitioList = (features) => {
  document.getElementById('ditio-images-list').innerHTML = "" // Empty existing list
  
  features.forEach(feature => {
    let attr = feature.attributes
    
    let imageItem = element(
      'img', 
      {
        class: "ditio-image",
        src: attr.fileUrlThumbnail
      }
    )
    
    
    let item = element(
      'calcite-block', 
      {
        heading: `${attr.taskName}`,
        description: formatDate(attr.createdDateTime),
        collapsible: true
      }, 
      [
        element(
          'calcite-icon',
          {
            icon: 'camera',
            slot: 'icon'
          }
          
        ),
        imageItem
      ])
    document.getElementById('ditio-images-list').appendChild(item)
    item.addEventListener('calciteBlockToggle', e => {
      zoomTo(feature.geometry)
    })
    imageItem.addEventListener('click', e => {
      let modal = document.getElementById('ditio-image-modal')
      let title = document.getElementById('ditio-image-modal-title')
      let image = document.getElementById('ditio-image-preview')

      image.setAttribute('src', attr.fileUrlMedium)
      title.innerHTML = attr.taskName
      modal.fullScreen = true
      modal.open = true
    })
  })
} 

const updateDitioTiles = (count) => {
  document.getElementById('ditio-images-count').innerHTML = count
}

const getDitioDataCount = (ditioLayer) => {
  ditioLayer.queryFeatureCount()
    .then(count => {
      updateDitioTiles(count)
      document.getElementById("ditio-images-list-pager")
      .setAttribute("total-items", count)
    })
    .catch(error => console.error(`Failed to get ditio layer feature count: ${error}`))
}

const formatDate = (d) => {
  d = parseISO(d)
  return format(d, 'dd.MM.yyyy HH:mm:ss')
}

export const getDitioDataPage = (ditioLayer, page) => {
  const query = {
    start: page,
    num: 4,
    outFields: ["*"],
    returnGeometry: true,
    orderByFields: ["createdDateTime DESC"]
  }

  ditioLayer.queryFeatures(query)
    .then((featureSet) => updateDitioList(featureSet.features))
}

export const updateDitioVisualizations = (ditioLayer) => {
   getDitioDataCount(ditioLayer)
   getDitioDataPage(ditioLayer, 0) 
}