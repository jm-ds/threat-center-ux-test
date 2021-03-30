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
            labels: [], series: [], colors: [],
            noData: {
                text: "There's no data",
                align: 'center',
                verticalAlign: 'middle',
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: undefined,
                    fontSize: '22px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '300'
                }
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
                    fontWeight: '300',
                    colors: undefined
                },
                distributed: false,
                offsetX: 0,
                offsetY: 0,
            },
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
            series: [],
            chart: {
                height: 260,
                type: "radialBar"
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "vertical",
                    // shadeIntensity: 0.5,
                    // gradientToColors: ["#11c15b", "#4680ff"],
                    gradientToColors: ["#ff5252", "#ffa21d"],
                    // inverseColors: true,
                    // opacityFrom: 1,
                    // opacityTo: 1,
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
            // colors: ["#ff5252", "#ffa21d"],
            colors: ["#11c15b", "#4680ff"],
            labels: [],
            legend: {
                show: true,
                floating: true,
                fontSize: "18px",
                position: "left",
                offsetX: -22,
                offsetY: 10,
                labels: {
                    useSeriesColors: true
                },
                formatter: function (seriesName, opts) {
                    return seriesName;
                    // + ":  " + opts.w.globals.series[opts.seriesIndex];
                },
                markers: {
                    width: 0,
                    height: 0,
                    strokeWidth: 0,
                    strokeColor: '',
                    fillColors: undefined,
                    radius: 0,
                    customHTML: undefined,
                    onClick: undefined,
                    offsetX: 0,
                    offsetY: 0
                },
                itemMargin: {
                    horizontal: 3
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

    }

    getStackedChartCommonConfiguration() {
        return {
            stroke: {
                width: 2
            },
            noData: {
                text: 'Loading...'
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
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                    showDuplicates: false,
                    trim: false,
                    minHeight: undefined,
                    maxHeight: 120,
                    style: {
                        colors: [],
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 300,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
                type: "datetime"
            },

            yaxis: {
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                    showDuplicates: false,
                    trim: false,
                    minHeight: undefined,
                    maxHeight: 120,
                    style: {
                        colors: [],
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 300,
                        cssClass: 'apexcharts-xaxis-label',
                    },

                }
            }

        }
    }

    getAreaChartCommonConfiguration() {
        return {
            chart: {
                toolbar: {
                    show: false
                },
                height: 200,
                type: "area"
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: 2
            },
            xaxis: {
                type: "datetime",
                categories: []
            },
            tooltip: {
                x: {
                    format: "dd/MM/yy HH:mm"
                }
            }
        };
    }

    sparkLineChartCommonConfiguration() {
        return {
            stroke: {
                width: 2,
            },
            noData: {
                text: 'Loading...'
            },
            chart: {
                type: "line",
                width: 100,
                height: 24,
                sparkline: {
                    enabled: true
                },
                animations: {
                    enabled: false
                }
            },
            colors: ['#F44336'],
            labels: [],
            series: [],
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

    getColorByLabel(label: string) {
        let color = '';
        switch (label) {
            case 'UNDEFINED':
            case 'PROPRIETARY':
            case 'COPYLEFT_STRONG':
            case 'COPYLEF':
                color = "#FF0000";
                break;
            case 'PROPRIETARY_FREE':
            case 'PUBLIC_DOMAIN':
            case 'PERMISSIVE':
            case 'COPYLEF':
                color = "#11c15b";
                break;
            case 'COPYLEFT_WEAK':
            case 'COPYLEFT_PARTIAL':
            case 'COPYLEFT_LIMITED':
                color = "#ffa21d";
                break;
            case 'CRITICAL':
                color = "#ff2b2b";
                break;
            case 'HIGH':
                color = "#ffa21d";
                break;
            case 'MEDIUM':
                color = "#e6e600";
                break;
            case 'LOW':
                color = "#11c15b";
                break;
            case 'INFO':
                color = "#4680ff";
                break;
            default:
                break;
        }

        return color;
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
                            fontSize: '28px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 300,
                            color: undefined,
                            offsetY: 10,
                            formatter: function (val) {
                                return val
                            }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'dddd',
                            fontSize: '20px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 300,
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
}