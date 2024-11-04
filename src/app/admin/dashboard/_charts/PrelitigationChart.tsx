"use client";


import React from "react";
import ReactApexChart from "react-apexcharts";

export class PrelitigationChart extends React.Component {
  

    state:any = {
      series: [
        {
          name: 'Total Prelitigation Cases Resolved',
          data: [42]
        },
        {
          name: 'Total Prelitigation Cases Un-resolved',
          data: [2]
        },
        {
          name: 'Total Litigation Cases Resolved',
          data: [14]
        },
        {
          name: 'Total Litigation Cases Un-resolved',
          data: [26]
        }
      ],
      options: {
        chart: {
          type: 'donut',
          height: 200,
          width: 200
        },
        legend: {
          position: 'bottom'
        },
     
       
        labels: ['Category A', 'Category B', 'Category C', 'Category D'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }],
        plotOptions: {
          pie: {
            donut: {
              size: '70%' // Adjust the size of the donut
            }
          }
        }
      }
    };
  

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series.map((item: { data: any[]; }) => item.data[0])} // Flatten the series array
            type="donut"
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
