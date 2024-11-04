"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface RiskProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  options: ApexOptions;
  ReactApexChart?: typeof ReactApexChart;
}

export class RiskChart extends React.Component<{}, RiskProps> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "risk",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      options: {
        colors: ["#be91fa", "#be91fa"],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [
            "10",
            "20",
            "30",
            "40",
            "50",
            "60",
            "70",
            "80",
            "90",
            "%",
          ],
        },
      },
    };
  }

  componentDidMount() {
    // Dynamically import ReactApexChart when the component mounts
    // import('react-apexcharts').then((ReactApexChartModule) => {
    //   const ReactApexChart = ReactApexChartModule.default;
    //   this.setState({ ReactApexChart });
    // });
  }

  render() {
    const { ReactApexChart, options, series } = this.state;

    if (!ReactApexChart) {
      // Return loading indicator or null while ReactApexChart is being loaded
      return null;
    }
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
