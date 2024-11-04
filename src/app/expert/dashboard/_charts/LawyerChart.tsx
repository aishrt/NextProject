"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  options: ApexOptions;
  ReactApexChart?: typeof ReactApexChart;
}

export class LawyerChart extends React.Component<{}, ChartProps> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
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
                // formatter: function () {
                //   // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                //   return 249;
                // },
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
  }
  componentDidMount() {
    // Dynamically import ReactApexChart when the component mounts
    import("react-apexcharts").then((ReactApexChartModule) => {
      const ReactApexChart = ReactApexChartModule.default;
      this.setState({ ReactApexChart });
    });
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
            type="radialBar"
            height={250}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
