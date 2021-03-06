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
                enabled: true,
                style: {
                    fontSize: '18px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                },
                marker: {
                    show: false,
                },
                items: {
                    display: 'flex',
                },
                fixed: {
                    enabled: false,
                    position: 'topRight',
                    offsetX: 0,
                    offsetY: 0,
                },
            },
            chart: {
                type: "donut",
                sparkline: {
                    enabled: true
                },
                height: '220px',
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
                    enabled: false,
                    position: 'topRight',
                    offsetX: -50,
                    offsetY: -150,
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (seriesName) {
                            return seriesName;
                        }
                    }
                },
                items: {
                    display: 'flex',
                },
                marker: {
                    show: true
                }
            }
        }
    }

    getColorByLabel(label: string) {
        let color = '';
        switch (label) {
            case 'COPYLEFT':
            case 'copyleft':
            case 'Copyleft':
            case 'COPYLEF':
                color = "#ff5252";
                break;
            case 'Proprietary':
            case 'PROPRIETARY':
            case 'proprietary':
                color = "#c71585";
                break;
            case 'Undefined':
            case 'UNDEFINED':
                color = "#8305eb";
                break;
            case 'Copyleft Strong':
            case 'COPYLEFT_STRONG':
            case 'copyleftStrong':
                color = "#ff2b2b";
                break;
            case 'PROPRIETARY_FREE':
            case 'PERMISSIVE':
            case 'permissive':
                color = "#11c15b";
                break;
            case 'COPYLEFT_WEAK':
            case 'copyleftWeak':
            case 'Copyleft Weak':
                color = "#ebe305";
                break;
            case 'COPYLEFT_LIMITED':
            case 'copyleftLimited':
            case 'Copyleft Limited':
                color = "#c1bb00";
                break;
            case 'COPYLEFT_PARTIAL':
            case 'Copyleft Partial':
            case 'copyleftPartial':
                color = "#ffa21d";
                break;
            case 'Proprietary Free':
            case 'ProprietaryFree':
            case 'proprietaryFree':
            case 'Proprietary_Free':
            case 'PROPRIETARY_FREE':
                color ='#00e396'
                break;
            case 'PUBLIC_DOMAIN':
            case 'Public Domain':
            case 'publicDomain':
            case 'Public_Domain':
            case 'PublicDomain':
                color = '#00acc1'
                break;
            case 'CRITICAL':
            case 'critical':
                color = "#ff2b2b";
                break;
            case 'HIGH':
            case 'high':
                color = "#ffa21d";
                break;
            case 'MEDIUM':
            case 'medium':
                color = "#e6e600";
                break;
            case 'LOW':
            case 'low':
                color = "#11c15b";
                break;
            case 'INFO':
            case 'info':
                color = "#4680ff";
                break;
            case 'custom':
                color = "#ff2b2b";
                break;
            case 'dual':
                color = "#ff5252";
                break;
            case 'embedded':
                color = "#11c15b";
                break;
            case 'openSource':
                color = "#4680ff";
                break;
            case 'unique':
                color = "#ffa21d";
                break;
            default:
                color = '#696969'
                break;
        }

        return color;
    }

    getProjectPageColorCodeByLabel(label: string) {
        let color = null;
        switch (label) {
            case 'CRITICAL':
            case 'critical':
                color = "red";
                break;
            case 'HIGH':
            case 'high':
                color = "pink";
                break;
            case 'MEDIUM':
            case 'medium':
                color = "orange";
                break;
            case 'LOW':
            case 'low':
                color = "yellow";
                break;
            case 'UNIQUE':
            case 'unique':
                color = "green";
                break;
            case 'OPEN_SOURCE':
            case 'OPENSOURCE':
            case 'openSource':
                color = "yellow";
                break;
            case 'EMBEDDED':
            case 'embedded':
                color = "light-blue";
                break;


            case 'COPYLEFT':
            case 'copyleft':
            case 'Copyleft':
            case 'COPYLEF':
                color = "copyLeft";
                break;
            case 'Proprietary':
            case 'PROPRIETARY':
            case 'proprietary':
                color = "proprietary";
                break;
            case 'Undefined':
            case 'UNDEFINED':
                color = "undefined";
                break;
            case 'Copyleft Strong':
            case 'COPYLEFT_STRONG':
            case 'copyleftStrong':
                color = "copyleftstrong";
                break;
            case 'PROPRIETARY_FREE':
            case 'PERMISSIVE':
            case 'permissive':
                color = "permissive";
                break;
            case 'COPYLEFT_WEAK':
            case 'copyleftWeak':
            case 'Copyleft Weak':
                color = "copyleftWeak";
                break;
            case 'COPYLEFT_LIMITED':
            case 'copyleftLimited':
            case 'Copyleft Limited':
                color = "copyleftLimited";
                break;
            case 'COPYLEFT_PARTIAL':
            case 'Copyleft Partial':
            case 'copyleftPartial':
                color = "copyleftPartial";
                break;
            case 'Proprietary Free':
            case 'ProprietaryFree':
            case 'proprietaryFree':
            case 'Proprietary_Free':
            case 'PROPRIETARY_FREE':
                color = 'proprietaryFree'
                break;
            case 'PUBLIC_DOMAIN':
            case 'Public Domain':
            case 'publicDomain':
            case 'Public_Domain':
            case 'PublicDomain':
                color = 'publicdomain'
                break;
            default:
                color = null
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