"use client";

import { DashboardData } from "@/types/Dashboard";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface StatusProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  options: ApexOptions;
  ReactApexChart?: typeof ReactApexChart;
}
interface TypeProps {
  data: DashboardData | undefined;
}
export class StatusType extends React.Component<TypeProps, StatusProps> {
  constructor(props: TypeProps | Readonly<TypeProps>) {
    super(props);
    this.state = {
      series: this.props?.data?.statusType,
      options: {
        colors: [
          "#4393FF",
          "#FFD56D",
          "#A2CCD6",
          "#FF8743",
          "#B8E0D2",
          "#1CCAB8",
        ],
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
                 show: false,
                },
              },
            },
          },
        },
        labels: [
          "In-Progress",
          "Prelitigation",
          "Litigation",
          "Resolved Cases",
          "Closed Cases",
          "Submitted Claims",
        ],
        dataLabels: {
          enabled:false,
          dropShadow: {
            blur: 3,
            opacity: 0.8,
          },
        },
        fill: {
          type: "donut",
          opacity: 1,
          pattern: {
            //enabled: false,
            style: [
              "verticalLines",
              "squares",
              "horizontalLines",
              "circles",
              "slantedLines",
            ],
          },
        },
        states: {
          hover: {
            //  filter: "none",
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
            type="donut"
            width={380}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
