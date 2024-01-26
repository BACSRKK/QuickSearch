import * as React from "react";
import { Pie } from "react-chartjs-2";
import { ChartOptions } from "chart.js";


//? FUNCTIONAL COMPONENT. BUT CANT USE .JS TAG
const PieChart = props => {
    const dataObj = {
      labels: props.data.map(a => a.title),
      datasets: [
        {
          /*
          ? Can use RGBA format for colors as well.
          ? e.g: => backgroundColor: 'rgba(255,99,132,0.2)'
          */
          label: "Overall Process",
          backgroundColor: [
            "rgb(9, 126, 56)",
            "rgb(240, 186, 11)",
            "rgb(231, 15, 15)",
            "rgba(0, 255, 0, 0.4)",
            "rgba(134, 136, 138, 0.60)"
          ],
          hoverBackgroundColor: [
            "rgb(9, 126, 56)",
            "rgb(240, 186, 11)",
            "rgb(231, 15, 15)",
            "rgba(0, 255, 0, 0.4)",
            "rgba(134, 136, 138, 0.60)"
          ],
          data: props.data.map(a => a.chartData)
        }
      ]
    };
  
    let options: ChartOptions = {
        title: {
            display: true,
            text: "Overall Business",
            fontSize: 18
        },
        legend: {
            position: "bottom"
        },
        maintainAspectRatio: false
    };
  
    return <Pie data={dataObj} options={options} width={100} height={300}/>;
  };
  
  export default PieChart;