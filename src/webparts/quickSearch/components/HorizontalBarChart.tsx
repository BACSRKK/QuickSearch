import * as React from "react";
import { HorizontalBar } from 'react-chartjs-2';

const HBarChart = props => {
  const options = {
      scales: {
        yAxes: [{
          ticks: { beginAtZero: true, min: 0 },
          stacked: true,

        }],
        xAxes: [{
          ticks: { beginAtZero: true},
          stacked: true,
     
        }]
      },
  }
  const dataHorBar = {
    labels: props.data.map(a => a.business),
    datasets: [
      {
        barPercentage: 0.5,
        barThickness: 14,
        maxBarThickness: 14,
        minBarLength: 10,
        label: "Pending",
        data: props.data.map(a => a.data),
        backgroundColor: 'yellow',
        borderWidth: 1,
        stack: 'Stack 0', 
      },

      {
        barPercentage: 0.5,
        barThickness: 14,
        maxBarThickness: 14,
        minBarLength: 10,
        label: "OverDue",
        data: props.data.map(b => b.data2),
        backgroundColor: 'red',
        borderWidth: 1,
        stack: 'Stack 0'

      },
      {
        barPercentage: 0.5,
        barThickness: 14,
        maxBarThickness: 14,
        minBarLength: 10,
        label: "Published",
        data: props.data.map(c => c.data3),
        backgroundColor: 'green',
        borderWidth: 1,
        stack: 'Stack 0'
      }

    ],
  

    

  };

  return (
    <div>
      <HorizontalBar data={dataHorBar} options={options}/>
    </div>
  );
};

export default HBarChart;

