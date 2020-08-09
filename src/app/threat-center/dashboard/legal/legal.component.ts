import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { ChartDB } from './chart-data';
import {ApexChartService} from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';

@Component({
  selector: 'legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalComponent implements OnInit {
  public chartDB: any;
  public dailyVisitorStatus: string;
  public dailyVisitorAxis: any;
  public deviceProgressBar: any;

  public licensePieChart1 = {
      chart: {
        height: 175,
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      stroke: {
        width: 3,
      },
      series: [144, 55, 41, 17, 15],
      labels: ["Division 1","Division 2","Division 3","Division 4","Division 5"],
      theme: {
        monochrome: {
          enabled: true,
          color: '#747b8a',
          shadeTo: 'light',
          shadeIntensity: 1
        }
      },
      tooltip: {
          enabled: false
      },
      legend: {
        show: false
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false,
        dropShadow: {
          enabled: true,
        }
      }
    };
   public licensePieChart2 = {
        chart: {
          height: 175,
          type: 'donut',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        stroke: {
          width: 3,
        },
        series: [55, 35, 5, 10, 47],
        labels: ["Division 1","Division 2","Division 3","Division 4","Division 5"],
        theme: {
          monochrome: {
            enabled: true,
            color: '#747b8a',
            shadeTo: 'light',
            shadeIntensity: 1
          }
        },
        tooltip: {
            enabled: false
        },
        legend: {
          show: false
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true
                },
                value: {
                  show: true
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false,
          dropShadow: {
            enabled: true,
          }
        }
      };
   public licensePieChart3 = {
        chart: {
          height: 175,
          type: 'donut',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        stroke: {
          width: 3,
        },
        series: [12, 255, 141, 67, 25],
        labels: ["Division 1","Division 2","Division 3","Division 4","Division 5"],
        theme: {
          monochrome: {
            enabled: true,
            color: '#747b8a',
            shadeTo: 'light',
            shadeIntensity: 1
          }
        },
        tooltip: {
            enabled: false
        },
        legend: {
          show: false
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true
                },
                value: {
                  show: true
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false,
          dropShadow: {
            enabled: true,
          }
        }
      };
   public licensePieChart4 = {
        chart: {
          height: 175,
          type: 'donut',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        stroke: {
          width: 1,
        },
        series: [845, 155, 141, 217, 45,33,73],
        labels: ["China","UK","Bangalore","Japan","Santa Clara","Boston","Germany"],
        /*theme: {
          monochrome: {
            enabled: true,
            color: '#747b8a',
            shadeTo: 'light',
            shadeIntensity: 1
          }
        },*/
        tooltip: {
            enabled: false
        },
        legend: {
          show: false
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true
                },
                value: {
                  show: true
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false,
          dropShadow: {
            enabled: true,
          }
        }
      };

  constructor(public apexEvent: ApexChartService) {
    this.chartDB = ChartDB;
    //this.licensePieChart.legend.show=true;
    this.dailyVisitorStatus = '1y';

    this.deviceProgressBar = [
      {
        type: 'success',
        value: 66
      }, {
        type: 'primary',
        value: 26
      }, {
        type: 'danger',
        value: 8
      }
    ];
  }

  dailyVisitorEvent(status) {
    this.dailyVisitorStatus = status;
    switch (status) {
      case '1m':
        this.dailyVisitorAxis = {
          min: new Date('28 Jan 2013').getTime(),
          max: new Date('27 Feb 2013').getTime(),
        };
        break;
      case '6m':
        this.dailyVisitorAxis = {
          min: new Date('27 Sep 2012').getTime(),
          max: new Date('27 Feb 2013').getTime()
        };
        break;
      case '1y':
        this.dailyVisitorAxis = {
          min: new Date('27 Feb 2012').getTime(),
          max: new Date('27 Feb 2013').getTime()
        };
        break;
      case 'ytd':
        this.dailyVisitorAxis = {
          min: new Date('01 Jan 2013').getTime(),
          max: new Date('27 Feb 2013').getTime()
        };
        break;
      case 'all':
        this.dailyVisitorAxis = {
          min: undefined,
          max: undefined
        };
        break;
    }

    setTimeout(() => {
      this.apexEvent.eventChangeTimeRange();
    });
  }

  ngOnInit() {}

}
