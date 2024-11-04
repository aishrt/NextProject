"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";

export class StatusType extends React.Component {
  state: any = {
    series: [44, 55, 41],
    options: {
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
      labels: ["Active cases", "Priority Cases", "Total Revenue"],
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 0.8,
        },
      },
      fill: {
        type: "pattern",
        opacity: 1,
        pattern: {
          enabled: true,
          style: ["verticalLines", "squares", "horizontalLines"],
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      theme: {
        palette: "palette2",
      },
      title: {
        text: "",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="donut"
            width={380}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
