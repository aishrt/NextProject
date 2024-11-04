"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";

export class LitigationCases extends React.Component {
  state: any = {
    series: [
      {
        name: "Active",
        data: [28, 29, 33, 36, 32, 32, 33],
      },
      {
        name: "Registered",
        data: [12, 11, 14, 18, 17, 13, 13],
      },
      {
        name: "Resolved",
        data: [1, 32, 66, 18, 45, 17, 20],
      },
      {
        name: "Un-resolved",
        data: [22, 41, 14, 28, 4, 18, 33],
      },
    ],
    options: {
      chart: {
        height: 300,
        width: '100%',
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#feb019", "#00e396", "#008ffb", "#ff4560"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "Month",
        },
      },
      yaxis: {
        title: {
          text: "Cases",
        },
        min: 5,
        max: 90,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  };

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={300}
            width="100%"
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
