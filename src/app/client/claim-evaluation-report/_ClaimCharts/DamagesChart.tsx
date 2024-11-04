"use client";

import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from "react-apexcharts";

interface DamagesChartState {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  options: ApexOptions;
  ReactApexChart?: typeof ReactApexChart;
}

export class DamagesChart extends React.Component<{}, DamagesChartState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {

      series: [{
        name: 'Percent',
        data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
      }],
      options: {
        colors: ['#000428', '#000428', '#000428'],
        annotations: {
          points: [{
            x: 'Damage',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0',
              },
              text: '',
            }
          }]
        },
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: '50%',
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 0
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: ['35.098k', '10.900k', '8k', '40k', '90k', '96k',
            '40k', '34k', '22k', '70k', '55k', '3k', '68k'
          ],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Percent',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          },
        }
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
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
