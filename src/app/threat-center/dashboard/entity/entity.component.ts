import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { Project, Entity, User } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { AuthenticationService } from '@app/security/services';
import { ChartDB } from '../../../fack-db/chart-data';
import { ApexChartService } from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';
import { TableModule } from 'primeng/table';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {
  public chartDB: any;
  public dailyVisitorStatus: string;
  public dailyVisitorAxis: any;
  public deviceProgressBar: any;

  //public entityId:string;
  public obsEntity: Observable<Entity>;
  public componentsEntity: Entity;
  public uniqueLicenses = [];

  columns = [
    { field: 'projectId', header: 'ProjectId' },
    { field: 'name', header: 'Name' },
    { field: 'created', header: 'Created' }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    public authService: AuthenticationService
  ) {
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

  ngOnInit() {
    let entityId = this.route.snapshot.paramMap.get('entityId');
    // if an entityId isn't provided in params, use User defaultEntityId
    if (!entityId) {
      entityId = this.authService.currentUser.defaultEntityId;
    }
    console.log(entityId);
    console.log("Loading Entity");
    this.loadEntity(entityId);
    this.loadVulnerabilities(entityId);
  }

  loadVulnerabilities(entityId: any) {
    console.log("Loading entity components:", entityId);
    this.apiService.getEntityComponents(entityId)
      .pipe(map(result => result.data.entity))
      .subscribe(entity => {
        this.componentsEntity = entity;
        let uniqueLicenseNames = [];
        if (this.componentsEntity.entityComponents) {
          this.componentsEntity.entityComponents.edges.forEach(component => {
            let licenses = component.node.entityComponentLicenses;
            if (licenses) {
              licenses.edges.forEach(license => {
                if (uniqueLicenseNames.indexOf(license.node.name) === -1) {
                  uniqueLicenseNames.push(license.node.name);
                  this.uniqueLicenses.push(license.node);
                }
              });
            }
          });
        }
      });
  }

  loadEntity(entityId: string) {
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.obsEntity = this.apiService.getEntity(entityId)
      .pipe(map(result => result.data.entity));


    this.obsEntity.subscribe(entity => {
      //this.stateService.selectedScan = project.scans[0];
      let critical = [];
      let high = [];
      let medium = [];
      let low = [];
      let info = [];
      let categories = [];

      let copyleftStrong = [];
      let copyleftWeak = [];
      let copyleftPartial = [];
      let copyleftLimited = [];
      let copyleft = [];
      let custom = [];
      let dual = [];
      let permissive = [];

      let notLatest = [];
      let vulnerabilities = [];
      let riskyLicenses = [];

      let embedded = [];
      let analyzed = [];
      let skipped = [];

      let partialAsset = [];
      let asset = [];
      let projectAsset = [];

      if(entity.entityMetrics) {
          let vulnerabilityMetrics = entity.entityMetrics.vulnerabilityMetrics;
          let licenseMetrics = entity.entityMetrics.licenseMetrics;
          let componentMetrics = entity.entityMetrics.componentMetrics;
          let assetMetrics = entity.entityMetrics.assetMetrics;

          // Vulnerability chart data
          critical.push(vulnerabilityMetrics.critical);
          high.push(vulnerabilityMetrics.high);
          medium.push(vulnerabilityMetrics.medium);
          low.push(vulnerabilityMetrics.low);
          info.push(vulnerabilityMetrics.info);

          // License chart data
          copyleftStrong.push(licenseMetrics.copyleftStrong);
          copyleftWeak.push(licenseMetrics.copyleftWeak);
          copyleftPartial.push(licenseMetrics.copyleftPartial);
          copyleftLimited.push(licenseMetrics.copyleftLimited);
          copyleft.push(licenseMetrics.copyleft);
          custom.push(licenseMetrics.custom);
          dual.push(licenseMetrics.dual);
          permissive.push(licenseMetrics.permissive);

          // Component chart data
          notLatest.push(componentMetrics.notLatest);
          vulnerabilities.push(componentMetrics.vulnerabilities);
          riskyLicenses.push(componentMetrics.riskyLicenses);

          // Asset chart data
          embedded.push(assetMetrics.embedded);
          analyzed.push(assetMetrics.analyzed);
          skipped.push(assetMetrics.skipped);

          // Source code leak data
          partialAsset.push(6);
          asset.push(10);
          projectAsset.push(20);

          // categories for bar charts
          //let cat = scan.branch.concat(' ').concat(formatDate(scan.created,'dd/MM/yyyy','en-US'));
          categories.push('Current');


          this.vulnerabilityChart.series = [];
          this.licenseChart.series = [];
          this.componentChart.series = [];
          this.assetChart.series = [];
          this.sourceCodeLeakChart.series = [];

          // set vulnerabilityChart data
          this.vulnerabilityChart.series.push({ name: 'Critical', data: critical });
          this.vulnerabilityChart.series.push({ name: 'High', data: high });
          this.vulnerabilityChart.series.push({ name: 'Medium', data: medium });
          this.vulnerabilityChart.series.push({ name: 'Low', data: low });
          this.vulnerabilityChart.series.push({ name: 'Info', data: info });

          // set licenseChart data
          this.licenseChart.series.push({ name: 'CL Strong', data: copyleftStrong });
          this.licenseChart.series.push({ name: 'CL Weak', data: copyleftWeak });
          this.licenseChart.series.push({ name: 'CL Partial', data: copyleftPartial });
          this.licenseChart.series.push({ name: 'CL Limited', data: copyleftLimited });
          this.licenseChart.series.push({ name: 'Copyleft', data: copyleft });
          this.licenseChart.series.push({ name: 'Custom', data: custom });
          this.licenseChart.series.push({ name: 'Dual', data: dual });
          this.licenseChart.series.push({ name: 'Permissive', data: permissive });

          // set componentChart data
          this.componentChart.series.push({ name: 'Not Latest', data: notLatest });
          this.componentChart.series.push({ name: 'Vulnerabilities', data: vulnerabilities });
          this.componentChart.series.push({ name: 'Risky Licenses', data: riskyLicenses });

          // set assetChart data
          this.assetChart.series.push({ name: 'Analyzed', data: analyzed });
          this.assetChart.series.push({ name: 'Skipped', data: skipped });
          this.assetChart.series.push({ name: 'Embedded', data: embedded });

          // set source code Leak data
          this.sourceCodeLeakChart.series.push({ name: 'Partial Asset Leaks', data: partialAsset });
          this.sourceCodeLeakChart.series.push({ name: 'Asset Leaks', data: asset })
          this.sourceCodeLeakChart.series.push({ name: 'Project Leaks', data: projectAsset });

          // set categories on bar charts
          this.xaxis.categories = categories;
      }

    });
  }

  changeEntity(entityId: string) {
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.loadEntity(entityId);
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
  }

  chart = {
    height: 200,
    parentHeightOffset: 0,
    stacked: true,
    type: 'bar',
    foreColor: '#adb7be',
    animations: {
      enabled: false
    },
    toolbar: {
      show: false,
    }
  };
  plotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '60%',
    },
  };
  legend = {
    position: 'top',
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: 5,
    fontSize: '11px',
    //width: 500,
    itemMargin: {
     horizontal: 5,
     vertical: 0
    },
  };
  
  dataLabels = {
    enabled: false
  };
  stroke = {
    show: true,
    width: 1,
    colors: ['#fff']
  };
  xaxis = {
    categories: [],
    labels: {
      show: true,
      rotate: -45,
    },
  };

  public vulnerabilityChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396'],//,'#11c15b'
    series: [],
    xaxis: this.xaxis
  };
  public licenseChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#11c15b'],
    series: [],
    xaxis: this.xaxis
  };
  public componentChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396'],//,'#11c15b'
    series: [],
    xaxis: this.xaxis
  };
  public assetChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#11c15b', '#4680ff', '#ffa21d'],
    series: [],
    xaxis: this.xaxis
  };
  public sourceCodeLeakChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#11c15b', '#4680ff', '#ffa21d'],
    series: [],
    xaxis: this.xaxis
  };
























  cols = [
    { field: 'vin', header: 'Vin' },
    { field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' }
  ];

  public cars = [
    { "brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff" },
    { "brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345" },
    { "brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr" },
    { "brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh" },
    { "brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34" },
    { "brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj" },
    { "brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr" },
    { "brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34" },
    { "brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5" },
    { "brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s" }
  ];
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];


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
      width: 2,
    },
    series: [144, 55, 41, 17, 15],
    labels: ["Division 1", "Division 2", "Division 3", "Division 4", "Division 5"],
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
      width: 2,
    },
    series: [55, 35, 5, 10, 47],
    labels: ["Division 1", "Division 2", "Division 3", "Division 4", "Division 5"],
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
    labels: ["Division 1", "Division 2", "Division 3", "Division 4", "Division 5"],
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
      width: 3,
    },
    series: [845, 155, 141, 217, 15],
    labels: ["Division 1", "Division 2", "Division 3", "Division 4", "Division 5"],
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


}
