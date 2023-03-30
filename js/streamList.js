import { element } from "./utils/html.js"

export const updateStreamList = (featureSet) => {
  console.log(`Får data fra streamLayeret`)
  let loadSum = 0
  let speedMax = 0

  featureSet.features.forEach(feature => {
    let a = feature.attributes
    let item  = document.getElementById(a.LoaderDriverId)

    if (item) { updateListItem(item, a) } else { newListItem(a) }
    loadSum += a.Quantity;
    if (a.Speed > speedMax) speedMax = a.Speed
  })
  updateIndicators(featureSet.features.length, loadSum, speedMax)
}

const newListItem = (attr) => {
  let item = element(
    'calcite-list-item', 
    {
      id: attr.LoaderDriverId,
      label: "Loading...",
      description: "Loading...",
      value: "Loading..."
    }, 
    element(
      'calcite-action', 
      {
        slot: "actions-end",
        icon: "car",
        text: "Gå til kjøretøyet i kartet"
      }
  ))

  updateListItem(item, attr)
  document.getElementById('vehicles-list').appendChild(item)
}

const updateListItem = (item, attr) => {
  item.setAttribute('label', `${attr["LoaderMachineTypeId"]} ${Math.round(attr["Speed"])} km/h`)
  item.setAttribute('description', `${attr["Quantity"]} m3 ${attr["TaskDescription_1"].toLowerCase()}`)
  //item.setAttribute('disabled', (attr.Idling === 'true'))
}

const updateIndicators = (count, loadSum, speedMax) => {
  document.getElementById('vehicles-count').innerHTML = `${count}`
  document.getElementById('vehicles-volume-sum').innerHTML = `${Math.round(loadSum)} m<SUP>3</SUP>`
  document.getElementById('vehicles-speed-max').innerHTML = `${Math.round(speedMax)} km/h`
}