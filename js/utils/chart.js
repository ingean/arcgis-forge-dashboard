import { mergeDeep, copyDeep } from './object.js'

const defaultChartOptions = {
  options: {
    title: {
      text: "title",
      display: true,
      position: "top",
      fontSize: 16,
      fontFamily: "'Avenir Next W01','Avenir Next W00','Avenir Next','Avenir','Helvetica Neue','sans-serif'",
      fontStyle: 'normal',
      fontColor: 'rgba(241, 241, 241, 1)'
    },
    legend: { display: false },
    animation: false
  }
}

const pieChartOptions = {
  type: 'doughnut',
  options: {
    legend: { 
      display: true,
      position: 'bottom' 
    }
  },
  data: {
    datasets: [{
      backgroundColor: [
        'rgba(90, 189, 249, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(90, 189, 249, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }],
    
  }
}

const barChartOptions = {
  type: 'bar',
  data: {
    datasets: [{
      backgroundColor: 'rgba(90, 189, 249, 0.2)',
      borderColor: 'rgba(90, 189, 249, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
}

const createChart = (chartOptions, id, params) => {
  let options = mergeDeep(copyDeep(defaultChartOptions), copyDeep(chartOptions))
  options.data.datasets[0].data = params.data
  options.data.datasets[0].label = params.label
  options.data.labels = params.labels
  options.options.title.text = params.title

  if (params.bgColor) {
    options.data.datasets[0].backgroundColor = params.bgColor
    options.data.datasets[0].borderColor = params.bgColor 
  }
  
  const chartElement = document.getElementById(id)
  return new Chart(chartElement, options)
}

export const updateChart = (chart, labels, data) => {
  chart.data.datasets[0].data = data
  chart.data.labels = labels
  chart.update()
} 

export const createPieChart = (id, params) => {
  return createChart(pieChartOptions, id, params)
}

export const createBarChart = (id, params) => {
  return createChart(barChartOptions, id, params)
}