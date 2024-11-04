"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SeriesData {
  x: string;
  y: [number, number];
}

interface ChartSeries {
  data: SeriesData[];
}

interface ActiveCasesState {
  series: ChartSeries[];
  options: ApexOptions;
}

export class ActiveCases extends React.Component<{}, ActiveCasesState> {
  state: ActiveCasesState = {
    series: [
      {
        data: [
          {
            x: "Team A",
            y: [1, 5],
          },
          {
            x: "Team B",
            y: [4, 6],
          },
          {
            x: "Team C",
            y: [5, 8],
          },
          {
            x: "Team D",
            y: [3, 11],
          },
        ],
      },
      {
        data: [
          {
            x: "Team A",
            y: [2, 6],
          },
          {
            x: "Team B",
            y: [1, 3],
          },
          {
            x: "Team C",
            y: [7, 8],
          },
          {
            x: "Team D",
            y: [5, 9],
          },
        ],
      },
    ],
    options: {
      chart: {
        type: "rangeBar",
        height: 350,
      },
      colors: ["#017EFA", "#51CBFF"],
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: true,
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
            type="rangeBar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
