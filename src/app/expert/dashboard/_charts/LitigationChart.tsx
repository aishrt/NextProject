"use client";

import { DashboardData } from "@/types/Dashboard";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  options: ApexOptions;
  ReactApexChart?: typeof ReactApexChart;
}

interface LitigationProps {
  data: DashboardData | undefined;
}

export class LitigationChart extends React.Component<
  LitigationProps,
  ChartProps
> {
  constructor(props: LitigationProps | Readonly<LitigationProps>) {
    super(props);

    this.state = {
      series: this.props?.data?.litigationType,
      options: {
        chart: {
          width: "100%",
          type: "pie",
        },
        legend: {
          position: "bottom",
        },
        colors: ["#FF8743", "#C2DBE3"],
        labels: ["Success", "Failed"],
        dataLabels: {
          enabled: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%",
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
            type="pie"
            width={280}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
