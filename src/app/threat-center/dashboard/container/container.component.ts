import { Component, OnInit } from '@angular/core';
import {ApexChartService} from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';


@Component({
  selector: 'tc-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

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
      series: [845, 155, 141, 217, 15,35,17,19,55,54],
      labels: ["Division 1","Division 2","Division 3","Division 4","Division 5","Division 6","Division 7","Division 8","Div 9","Division 10"],

      tooltip: {
          enabled: false

      },
      legend: {
        show: true,
         labels: {
            colors: ['#fff'],
            useSeriesColors: false
        },
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

    public bar2CAC = {
        chart: {
          height: 200,
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: false
        },
        /*theme: {
            monochrome: {
              enabled: true,
              color: '#747b8a',
              shadeTo: 'light',
              shadeIntensity: 1
            }
         },*/
         stroke: {
           width: 1,
           colors: ['#fff']
         },
        //colors: ['#4680ff', '#0e9e4a', '#ffa21d', '#ff5252','#ff3252', '#ff2252'],
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '45%',
            distributed: false
          },
        },
        series: [{
          name: 'PRODUCT A',
          data: [44, 55, 41, 67,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
        }, {
          name: 'PRODUCT B',
          data: [13, 23, 20, 8,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
        }, {
          name: 'PRODUCT C',
          data: [11, 17, 15, 15,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
        }, {
          name: 'PRODUCT D',
          data: [21, 7, 25, 13,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
        }],
        xaxis: {
          type: 'category',
          categories: ['v1.0.1_RC1', 'v1.0.1_RC2', 'v1.0.1_RC3', 'v1.0.1_RC4','','','','','','','','','','','','','','','',''],
        },
        legend: {
          show: false
        },
        fill: {
          opacity: 1
        },
      };

  constructor(public apexEvent: ApexChartService) { }

  ngOnInit() {

  }
}
