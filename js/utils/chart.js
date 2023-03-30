import { mergeDeep } from './object.js'

const defaultChartOptions = {
  options: {
    //maintainAspectRatio: false,
    //responsive: false,
    title: {
      text: "title",
      display: true,
      position: "top",
      fontSize: 16,
      fontFamily: "'Avenir Next W01','Avenir Next W00','Avenir Next','Avenir','Helvetica Neue','sans-serif'",
      fontStyle: 'normal',
      fontColor: 'rgba(241, 241, 241, 1)'
    },
    legend: {
      display: false
    }
  }
}

const pieChartOptions = {
  type: 'doughnut',
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
      label: 'Antall deler',
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

const drawChart = (chartOptions, id, title, labels, data) => {
  let options = mergeDeep(defaultChartOptions, chartOptions)
  options.data.datasets[0].data = data
  options.data.labels = labels
  options.options.title.text = title

  const chartElement = document.getElementById(id)
  const chart = new Chart(chartElement, options)
}

export const drawPieChart = (id, title, labels, data) => {
  drawChart(pieChartOptions, id, title, labels, data)
}

export const drawBarChart = (id, title, labels, data) => {
  drawChart(barChartOptions, id, title, labels, data)
}