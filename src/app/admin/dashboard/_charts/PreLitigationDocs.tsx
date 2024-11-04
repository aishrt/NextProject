"use client"
import React from "react";
import ReactApexChart from "react-apexcharts";

export class PrelitigationDocs extends React.Component {
    state:any = {
      
        series: [
          {
            name: "Signed (Approved)",
            data: [18, 34, 53, 36, 72, 22, 33]
          },
          {
            name: "Purchased",
            data: [12, 11, 14, 18, 17, 13, 13]
          },
          {
            name: "Rejected",
            data: [10, 32, 54, 18, 45, 17, 20]
          },
          {
            name: "Pending",
            data: [22, 81, 14, 68, 4, 18, 33]
          },
        ],
        options: {
          chart: {
            height: 300,
            type: 'line',
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2
            },
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#8181ff', '#00e396' , '#008ffb', '#ff4560'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: '',
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            title: {
              text: 'Month'
            }
          },
          yaxis: {
            title: {
              text: 'Cases'
            },
            min: 5,
            max: 90
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          }
        },
      
      
      };
    

  

    render() {
      return (
        <div>
          <div id="chart">
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={300} />
          </div>
          <div id="html-dist"></div>
        </div>
      );
    }
  }
