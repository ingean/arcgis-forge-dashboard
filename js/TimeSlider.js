import TimeSlider from 'https://js.arcgis.com/4.26/@arcgis/core/widgets/TimeSlider.js'

export const initTimeSlider = (view, start, end, unit, steps = 1) => {
 
  const units = {
    "years": start.getYear(),
    "months": start.getMonth(),
    "days": start.getDate(),
    "hours": start.getHours()
  }
    
  let endExtent = new Date(start.getTime())
  endExtent = endExtent.setDate(units[unit] + steps)
    
  return  new TimeSlider({
    container: "timeSlider",
    view: view,
    timeVisible: true, 
    loop: true,
    fullTimeExtent: {
      start: start,
      end: end,
    },
    timeExtent: {
      start: start, 
      end: endExtent
    },
    stops: { 
      interval: {
        value: steps,
        unit: unit
      }
    }
  })
}
