"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";

export class CasesChart extends React.Component {
  state: any = {
    series: [
      {
        name: "Cases",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#fff"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "Number of cases",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return "$ " + val + " thousands";
          },
        },
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
            type="bar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
