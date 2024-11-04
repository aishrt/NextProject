"use client";

import { colors } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

export class LawyerChart extends React.Component {
  state: any = {
    series: [44, 55, 67, 83],
    options: {
      chart: {
        height: 250,
        type: "radialBar",
      },
      colors: ["#075482", "#67D0DA", "#E2495B", "#34B1E7"],
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function () {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return 249;
              },
            },
          },
        },
      },
      labels: [
        "Request Shared",
        "Request Declined",
        "Request Accepted",
        "Request Pending",
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
            type="radialBar"
            height={250}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}