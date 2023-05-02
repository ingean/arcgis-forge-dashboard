import { showVoxelLayer, hideVoxelLayer } from "../voxelLayer.js"
import { resizeBIMViewer } from "../BIMViewer.js"

let timesliderMaximized = true
let dashboardMaximized = false

export const onTabChange = (event) => {
  if (event.target.id === 'db-tab-title-volume') {
    showVoxelLayer()
  } else {
    hideVoxelLayer()
  }
}

const changeFooterContainerSize = (state, heightChange) => {
  let container = document.getElementById('footer-container')
  let height = container.clientHeight

  if (!state) {
    container.style.height = `${height + heightChange}px`
  } else {
    container.style.height = `${height - heightChange}px`
  }
  resizeBIMViewer()
}

export const onTimesliderAccordionItemClick = (event) => {
  changeFooterContainerSize(timesliderMaximized, 100)
  timesliderMaximized = !timesliderMaximized
}

export const onDashboardAccordionItemClick = (event) => {
  changeFooterContainerSize(dashboardMaximized, 345)
  dashboardMaximized = !dashboardMaximized
}