import { Injectable } from "@angular/core";
import { NextConfig } from "@app/app-config";

@Injectable({
    providedIn: 'root'
})

export class ChartHelperService {
    constructor() {
    }

    public initDonutChartConfiguration() {
        return {
            stroke: {
                width: 1
            },
            dataLabels: {
                enabled: true,
                formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                    return w.config.series[seriesIndex];
                },
                textAnchor: 'middle',
                style: {
                    fontSize: '16px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    // fontWeight: 'bold',
                    colors: undefined
                }
            },
            // fill: {
            //   type: "gradient"
            // },
            legend: {
                show: false
            },
            tooltip: {
                enabled: false,
            },
            chart: {
                type: "donut",
                sparkline: {
                    enabled: true
                },
                height: 200,
                events: {
                    click: function (event, chartContext, config) {
                        // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ],
            plotOptions: this.getPloatoptions()
        }
    }

    private getPloatoptions() {
        return {
            pie: {
                startAngle: 0,
                endAngle: 360,
                expandOnClick: true,
                offsetX: 0,
                offsetY: 0,
                customScale: 1,

                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10
                },
                donut: {
                    size: '50%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: false,
                            fontSize: '20px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 600,
                            color: undefined,
                            offsetY: -10,
                            formatter: function (val) {
                                return val
                            }
                        },
                        value: {
                            show: true,
                            fontSize: '32px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 500,
                            color: undefined,
                            offsetY: 10,
                            formatter: function (val) {
                                return val
                            }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: '',
                            fontSize: '32px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 500,
                            color: '#373d3f',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                },
            }
        }
    }

    getStackedChartCommonConfiguration() {
        return {
            stroke: {
                width: 2,
            },
            chart: {
                toolbar: {
                    show: false
                },
                type: NextConfig.config.stackedChartType,
                height: 200,
                stacked: true,
                events: {
                    selection: function (chart, e) {
                        console.log(new Date(e.xaxis.min));
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: "gradient",
                gradient: {
                    opacityFrom: 0.6,
                    opacityTo: 0.8
                }
            },
            legend: {
                show: false,
            },
            xaxis: {
                type: "datetime"
            }
        }
    }

    sparkLineChartCommonConfiguration() {
        return {
            chart: {
                type: "line",
                width: 100,
                height: 24,
                sparkline: {
                    enabled: true
                }
            },
            colors: ['#F44336'],
            labels: [],
            series: [
                {
                    name: "",
                    data: this.randomizeArray([
                        47,
                        45,
                        54,
                        38,
                        10,
                        200,
                        300,
                        500,
                        45,
                        8,
                        1
                    ].slice(0, 10))
                }
            ], // will come dynamically
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (seriesName) {
                            return "";
                        }
                    }
                },
                marker: {
                    show: false
                }
            }
        }
    }

    public randomizeArray(arg): number[] {
        var array = arg.slice();
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}