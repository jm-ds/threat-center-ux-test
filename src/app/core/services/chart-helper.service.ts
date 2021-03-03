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

    getSupplyChartConfig() {
        return {
            series: [76, 67],
            chart: {
                height: 260,
                type: "radialBar"
            },
            fill: {
                type: "gradient",
                gradient: {
                  shade: "dark",
                  type: "horizontal",
                  shadeIntensity: 0.5,
                  gradientToColors: ["#ff5252","#ffa21d"],
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: "30%",
                        background: "transparent",
                        image: undefined
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            show: false
                        }
                    }
                }
            },
            colors: ["#11c15b", "#4680ff"],
            labels: ["Risk", "Quality"],
            legend: {
                show: true,
                floating: true,
                fontSize: "20px",
                position: "left",
                offsetX: -20,
                offsetY: 30,
                labels: {
                    useSeriesColors: true
                },
                formatter: function (seriesName, opts) {
                    return seriesName;
                    // + ":  " + opts.w.globals.series[opts.seriesIndex];
                },
                itemMargin: {
                    horizontal: 6
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }
            ]
        }
        // return {
        //     series: [45, 25],
        //     chart: {
        //         height: 390,
        //         type: "radialBar"
        //     },
        //     plotOptions: {
        //         radialBar: {
        //             inverseOrder: false,
        //             startAngle: 0,
        //             endAngle: 270,
        //             offsetX: 0,
        //             offsetY: 0,
        //             hollow: {
        //                 margin: 5,
        //                 size: '30%',
        //                 background: 'transparent',
        //                 image: undefined,
        //                 imageWidth: 150,
        //                 imageHeight: 150,
        //                 imageOffsetX: 0,
        //                 imageOffsetY: 0,
        //                 imageClipped: true,
        //                 position: 'front',
        //                 dropShadow: {
        //                     enabled: false,
        //                     top: 0,
        //                     left: 0,
        //                     blur: 3,
        //                     opacity: 0.5
        //                 }
        //             },
        //             track: {
        //                 show: true,
        //                 startAngle: undefined,
        //                 endAngle: undefined,
        //                 background: '#f2f2f2',
        //                 strokeWidth: '97%',
        //                 opacity: 1,
        //                 margin: 5,
        //                 dropShadow: {
        //                     enabled: false,
        //                     top: 0,
        //                     left: 0,
        //                     blur: 3,
        //                     opacity: 0.5
        //                 }
        //             },
        //             dataLabels: {
        //                 show: false,
        //                 name: {
        //                     show: true,
        //                     fontSize: '16px',
        //                     fontFamily: undefined,
        //                     fontWeight: 600,
        //                     color: undefined,
        //                     offsetY: -10
        //                 },
        //                 value: {
        //                     show: true,
        //                     fontSize: '14px',
        //                     fontFamily: undefined,
        //                     fontWeight: 400,
        //                     color: undefined,
        //                     offsetY: 16,
        //                     formatter: function (val) {
        //                         return val + '%'
        //                     }
        //                 },
        //                 total: {
        //                     show: true,
        //                     label: 'Total',
        //                     color: '#373d3f',
        //                     fontSize: '16px',
        //                     fontFamily: undefined,
        //                     fontWeight: 600,
        //                     formatter: function (w) {
        //                         return w.globals.seriesTotals.reduce((a, b) => {
        //                             return a + b
        //                         }, 0) / w.globals.series.length + '%'
        //                     }
        //                 }
        //             }
        //         }
        //     },

        //     colors: ["#ff5252", "#39539E"],
        //     labels: ["Risk", "Quality"],
        //     legend: {
        //         show: true,
        //         floating: true,
        //         fontSize: '16px',
        //         position: 'left',
        //         offsetX: 50,
        //         offsetY: 10,
        //         labels: {
        //             useSeriesColors: true,
        //         },
        //         markers: {
        //             size: 0
        //         },
        //         formatter: function (seriesName, opts) {
        //             return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
        //         },
        //         itemMargin: {
        //             vertical: 0
        //         }
        //     },
        //     responsive: [
        //         {
        //             breakpoint: 480,
        //             options: {
        //                 // chart: {
        //                 //     width: 200,
        //                 // },
        //                 legend: {
        //                     show: false
        //                 }
        //             }
        //         }
        //     ]
        // }
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