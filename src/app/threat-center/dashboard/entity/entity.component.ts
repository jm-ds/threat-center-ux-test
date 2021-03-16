import { Component, OnInit, ChangeDetectionStrategy, HostListener, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { Project, Entity, User, ProjectEdge, EntityMetrics, Period } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { AuthenticationService } from '@app/security/services';
import { ChartDB } from '../../../fack-db/chart-data';
import { ApexChartService } from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { ScanHelperService } from '../services/scan.service';
import * as _ from 'lodash';
import { EntityService } from '@app/admin/services/entity.service';
import { ChartHelperService } from '@app/core/services/chart-helper.service';


@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})

export class EntityComponent implements OnInit, OnDestroy {
  public chartDB: any;
  public dailyVisitorStatus: string;
  public dailyVisitorAxis: any;
  public deviceProgressBar: any;

  //public entityId:string;
  public obsEntity: Observable<Entity>;
  public projects: TreeNode[];
  public componentsEntity: Entity;
  public uniqueLicenses = [];
  activeTab: string;
  columns = [
    { field: 'projectId', header: 'ProjectId' },
    { field: 'name', header: 'Name' },
    { field: 'created', header: 'Created' }
  ];

  vulnerabilityDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
  licenseDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
  assetDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());

  componentVulnerabilityRiskChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
  componentLicenseRiskChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
  componentLicenseCategory = Object.assign(this.chartHelperService.initDonutChartConfiguration());
  componentLicense = Object.assign(this.chartHelperService.initDonutChartConfiguration());

  licenseCategoryChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
  licenseRiskChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());

  stackedChartCommonOptions: Partial<any> = {};
  lineChartOptions: any;

  selectedDonut: string = "Vulnerability";
  lineChartActiveTab: string = "Week";

  weekSeriesOverTime: any = {};
  monthSeriesOverTime: any = { series: [], colors: [] };
  quarterSeriesOverTime: any = {};
  yearSeriesOverTime: any = {};


  entityPageBreadCums: Array<any> = [];
  entityNewBreadCum: Array<any> = [];
  recursionHelperArray = new Array();
  recursivehelperArrayForIrgTree = new Array();

  entityTreeModel: TreeNode | any = { data: [] };
  organizationTreeModel = [];

  isShowComponentdropdown: boolean = false;
  componentChartDropValues = [
    { id: this.coreHelperService.uuidv4(), name: "Vulnerabilities", isActive: true },
    // { id: this.coreHelperService.uuidv4(), name: "License Risk", isActive: false },
    { id: this.coreHelperService.uuidv4(), name: "License Category", isActive: false },
    { id: this.coreHelperService.uuidv4(), name: "License Name", isActive: false }
  ];
  selectedComponentChartDropvalue = "Vulnerabilities";
  isShowLicensedropdown: boolean = false;
  licenseChartDropValues = [
    { id: this.coreHelperService.uuidv4(), name: "License Name", isActive: true },
    { id: this.coreHelperService.uuidv4(), name: "License Category", isActive: false },
    // { id: this.coreHelperService.uuidv4(), name: "Risk", isActive: false },
  ];
  selectedlicenseChartDropValue = "License Name";
  commonLineSparklineOptions: any = {};

  currentEntityId: string = "";
  isShowStackedChart: boolean = true;

  supplyChainChart: Partial<any>;
  isTreeProgressBar: boolean = false;

  entityMetricList: Array<EntityMetrics> = new Array<EntityMetrics>();

  requestObjectPageSubscriptions: Subscription;
  areaChartCommonOption: any = Object.assign(this.chartHelperService.getAreaChartCommonConfiguration());

  constructor(
    private router: Router,
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    public authService: AuthenticationService,
    private coreHelperService: CoreHelperService,
    private scanHelperService: ScanHelperService,
    private entityService: EntityService,
    private chartHelperService: ChartHelperService,
    private modalService: NgbModal,
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

    this.requestObjectPageSubscriptions = this.scanHelperService.isRefreshObjectPageObservable$
      .subscribe(x => {
        if (x == true) {
          this.obsEntity.subscribe(entity => {
            entity.entityMetricsGroup.entityMetrics = null;
            if (!!entity && !entity.entityMetricsGroup.entityMetrics) {
              //refresh Object page..
              this.loadEntityPage();
            }
          });
        }
      });
    this.supplyChainChart = this.chartHelperService.getSupplyChartConfig();
  }


  ngOnDestroy(): void {
    sessionStorage.removeItem('EntityBreadCums');
    this.requestObjectPageSubscriptions.unsubscribe();
  }



  initStackedChartAccordingToDonut(value: string) {
    // let properties = [];
    let activeTabVar: string = "";
    // check active tab as well..
    switch (this.lineChartActiveTab) {
      case 'Month':
        activeTabVar = 'monthSeriesOverTime';
        break;
      case 'Week':
        activeTabVar = 'weekSeriesOverTime';
        break;
      case 'Quarter':
        activeTabVar = 'quarterSeriesOverTime'
        break;
      case 'Year':
        activeTabVar = 'yearSeriesOverTime';
        break;
      default:
        break;
    }
    this[activeTabVar].series = [];
    // let aciveTabMetricsArray: string = "";
    if (this.isShowStackedChart) {
      this.selectedDonut = value;
      this.stackedChartCommonOptions = Object.assign(this.chartHelperService.getStackedChartCommonConfiguration());
      switch (this.selectedDonut) {
        case 'Vulnerability':
          this[activeTabVar].colors = [];
          const vulproperties = this.getProperties('vulnerabilityMetrics', 'severityMetrics');
          for (var index in vulproperties) {
            const obj = { name: vulproperties[index], data: this.getStackChartLogicalData(vulproperties[index], this.selectedDonut) }
            this[activeTabVar].series.push(obj);
            this[activeTabVar].colors.push(this.chartHelperService.getColorByLabel(vulproperties[index]));
          }
          break;
        case 'Assets':
          this[activeTabVar].series = [];
          const assetproperties = this.getProperties('assetMetrics', 'assetCompositionMetrics');
          for (var index in assetproperties) {
            const obj = { name: assetproperties[index], data: this.getStackChartLogicalData(assetproperties[index], this.selectedDonut) }
            this[activeTabVar].series.push(obj);
          }
          this[activeTabVar].colors = ['#11c15b', '#4680ff', '#ffa21d'];
          break;
        case 'SupplyChain':
          this[activeTabVar].series = [];
          let dateLists = [];
          const supplyProperties = this.getProperties('supplyChainMetrics', 'supplyChainMetrics');
          for (var index in supplyProperties) {
            const obj = { name: supplyProperties[index], data: this.getStackChartLogicalData(supplyProperties[index], this.selectedDonut) }
            this[activeTabVar].series.push(obj);
          }
          this.areaChartCommonOption.xaxis['categories'] = dateLists;
          break;
        case 'Licenses':
          this.licenseStackedChartConfig(this.selectedlicenseChartDropValue, activeTabVar);
          break;
        case 'Components':
          this.componentStackedChartConfig(this.selectedComponentChartDropvalue, activeTabVar);
          break;

        default:
          break;
      }
    }
    this.isShowStackedChart = !this.isShowStackedChart ? true : this.isShowStackedChart;
  }

  // this method is for get stacked chart logical data form vul,supplychain,and assets stacked charts
  private getStackChartLogicalData(catName, chartName) {
    let data = [];
    switch (chartName) {
      case 'Vulnerability':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.vulnerabilityMetrics['severityMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;
      case 'SupplyChain':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.supplyChainMetrics['supplyChainMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;
      case 'Assets':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.assetMetrics['assetCompositionMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;

      default:
        break;
    }

    return data;
  }


  //Helper function to initialize Component stacked chart configuration
  private componentStackedChartConfig(nameOfChart, activeTabVar) {
    this[activeTabVar].series = [];
    // let properties = [];
    switch (nameOfChart) {
      case 'Vulnerabilities':
        this[activeTabVar].colors = [];
        const vulProp = this.getProperties('componentMetrics', 'vulnerabilityMetrics');
        for (var index in vulProp) {
          this[activeTabVar].series.push({ name: vulProp[index], data: this.getStackChartLogicalForComponentData(vulProp[index], nameOfChart) });
          this[activeTabVar].colors.push(this.chartHelperService.getColorByLabel(vulProp[index]));
        }
        break;
      case 'License Risk':
        const licenseRiskprop = this.getProperties('componentMetrics', 'licenseFamilyMetrics');
        for (var index in licenseRiskprop) {
          this[activeTabVar].series.push({ name: licenseRiskprop[index], data: this.getStackChartLogicalForComponentData(licenseRiskprop[index], nameOfChart) });
        }
        break;
      case 'License Category':
        this[activeTabVar].colors = [];
        const licenseCatProp = this.getProperties('componentMetrics', 'licenseCategoryMetrics');
        for (var index in licenseCatProp) {
          this[activeTabVar].series.push({ name: licenseCatProp[index], data: this.getStackChartLogicalForComponentData(licenseCatProp[index], nameOfChart) });
          this[activeTabVar].colors.push(this.chartHelperService.getColorByLabel(licenseCatProp[index]));
        }
        break;
      case 'License Name':
        const licenseNameProp = this.getProperties('componentMetrics', 'licenseNameMetrics');
        for (var index in licenseNameProp) {
          this[activeTabVar].series.push({ name: licenseNameProp[index], data: this.getStackChartLogicalForComponentData(licenseNameProp[index], nameOfChart) });
        }
        this[activeTabVar].colors = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'];
        break;
      default:
        break;
    }
  }

  //this method is for get stacked chart logical data for Component charts (dropdown)
  private getStackChartLogicalForComponentData(catName, chartName) {
    let data = [];
    switch (chartName) {
      case 'Vulnerabilities':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.componentMetrics['vulnerabilityMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;
      case 'License Risk':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.componentMetrics['licenseFamilyMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;
      case 'License Category':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.componentMetrics['licenseCategoryMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), !!mainObj[catName] ? mainObj[catName] : null]);
        });
        break;
      case 'License Name':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.componentMetrics['licenseNameMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), !!mainObj[catName] ? mainObj[catName] : null]);
        });
        break;
      default:
        break;
    }
    return data;
  }

  //Helper function to initialize License stacked chart configuration
  private licenseStackedChartConfig(nameOfChart, activeTabVar) {
    this[activeTabVar].series = [];
    switch (nameOfChart) {
      case 'License Name':
        const licenseNameProperties = this.getProperties('licenseMetrics', 'licenseNameMetrics');
        for (var index in licenseNameProperties) {
          this[activeTabVar].series.push({ name: licenseNameProperties[index], data: this.getStackChartLogicalForLicenseData(licenseNameProperties[index], nameOfChart) });
        }
        this[activeTabVar].colors = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'];
        break;
      case 'License Category':
        this[activeTabVar].colors = [];
        const licenseCatProperties = this.getProperties('licenseMetrics', 'licenseCategoryMetrics');
        for (var index in licenseCatProperties) {
          this[activeTabVar].series.push({ name: licenseCatProperties[index], data: this.getStackChartLogicalForLicenseData(licenseCatProperties[index], nameOfChart) });
          this[activeTabVar].colors.push(this.chartHelperService.getColorByLabel(licenseCatProperties[index]));
        }
        break;
      case 'Risk':
        const riskProperties = this.getProperties('licenseMetrics', 'licenseFamilyMetrics');
        for (var index in riskProperties) {
          this[activeTabVar].series.push({ name: riskProperties[index], data: this.getStackChartLogicalForLicenseData(riskProperties[index], nameOfChart) });
        }
        break;
      default:
        break;
    }
  }

  //this method is for get stacked chart logical data for Liceses charts (dropdown)
  private getStackChartLogicalForLicenseData(catName, chartName) {
    let data = [];
    switch (chartName) {
      case 'License Name':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.licenseMetrics['licenseNameMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;
      case 'License Category':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.licenseMetrics['licenseCategoryMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), mainObj[catName]]);
        });
        break;
      case 'Risk':
        _.each(this.entityMetricList, metrics => {
          const mainObj = metrics.licenseMetrics['licenseFamilyMetrics'];
          data.push([new Date(metrics.measureDate).getTime(), !!mainObj[catName] ? mainObj[catName] : null]);
        });
        break;
      default:
        break;
    }

    return data;
  }

  //fired when changing License chart dropdown from donut chart
  changeLincesChartDropdown() {
    // this.isShowStackedChart = false;
    let activeTabVar: string = "";
    // check active tab as well..
    switch (this.lineChartActiveTab) {
      case 'Month':
        activeTabVar = 'monthSeriesOverTime';
        break;
      case 'Week':
        activeTabVar = 'weekSeriesOverTime';
        break;
      case 'Quarter':
        activeTabVar = 'quarterSeriesOverTime'
        break;
      case 'Year':
        activeTabVar = 'yearSeriesOverTime';
        break;
      default:
        break;
    }
    if (this.selectedDonut === 'Licenses') {
      this.weekSeriesOverTime['series'] = [];
      this.licenseStackedChartConfig(this.selectedlicenseChartDropValue, activeTabVar);
    }
  }

  //fired when changing component chart dropdown from donut chart
  changeComponentChartDropdown() {
    // this.isShowStackedChart = false;
    let activeTabVar: string = "";
    // check active tab as well..
    switch (this.lineChartActiveTab) {
      case 'Month':
        activeTabVar = 'monthSeriesOverTime';
        break;
      case 'Week':
        activeTabVar = 'weekSeriesOverTime';
        break;
      case 'Quarter':
        activeTabVar = 'quarterSeriesOverTime'
        break;
      case 'Year':
        activeTabVar = 'yearSeriesOverTime';
        break;
      default:
        break;
    }
    if (this.selectedDonut === 'Components') {
      this.weekSeriesOverTime['series'] = [];
      this.componentStackedChartConfig(this.selectedComponentChartDropvalue, activeTabVar);
    }
  }

  onStackedChartTabChange($event: NgbTabChangeEvent) {
    let period: Period;
    this.lineChartActiveTab = $event.nextId;
    let entityId = this.route.snapshot.paramMap.get('entityId');
    if (!entityId) {
      entityId = this.authService.currentUser.defaultEntityId;
    }
    // stacked area chart tab chages..
    switch (this.lineChartActiveTab) {
      case 'Month':
        this.monthSeriesOverTime['series'] = [];
        this.monthSeriesOverTime['colors'] = [];
        period = Period.MONTH;
        break;
      case 'Quarter':
        this.quarterSeriesOverTime['series'] = [];
        this.quarterSeriesOverTime['colors'] = [];
        period = Period.QUARTER;
        break;
      case 'Year':
        this.yearSeriesOverTime['series'] = [];
        this.yearSeriesOverTime['colors'] = [];
        period = Period.YEAR;
        break;
      case 'Week':
        this.weekSeriesOverTime['series'] = [];
        this.weekSeriesOverTime['colors'] = [];
        period = Period.WEEK;
        break;
      default:
        break;
    }

    this.apiService.getEntityMetricsPeriod(this.authService.currentUser.orgId, entityId, period)
      .pipe(map(result => result))
      .subscribe((res: any) => {
        if (!!res.data && !!res.data.entityMetricsPeriod && res.data.entityMetricsPeriod.entityMetrics.length >= 1) {
          this.entityMetricList = res.data.entityMetricsPeriod['entityMetrics'];
          this.initStackedChartAccordingToDonut(this.selectedDonut);
        } else {
          this.entityMetricList = [];
        }
      });
  }

  public generateDayWiseTimeSeries = function (baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  };

  navigateToProject(projectId) {
    const entityId = this.route.snapshot.paramMap.get('entityId')
    const url = "dashboard/entity/" + entityId + '/project/' + projectId;
    this.router.navigate([url]);
  }

  ngOnInit() {
    this.loadEntityPage();
  }

  loadEntityPage() {
    let entityId = this.route.snapshot.paramMap.get('entityId');
    // if an entityId isn't provided in params, use User defaultEntityId
    if (!entityId) {
      entityId = this.authService.currentUser.defaultEntityId;
    }
    console.log(entityId);
    console.log("Loading Entity");
    let isPush = true;
    if (!!sessionStorage.getItem('EntityBreadCums')) {
      isPush = false;
      this.entityPageBreadCums = JSON.parse(sessionStorage.getItem('EntityBreadCums'));
    }
    this.loadEntity(entityId, isPush);
    //this.loadVulnerabilities(entityId);
    this.getLastTabSelected();
    this.commonLineSparklineOptions = Object.assign(this.chartHelperService.sparkLineChartCommonConfiguration());
  }

  initSparkLineChart(data, str) {
    let dataToReturn = [];
    const vul = ['critical', 'high', 'medium', 'low', 'info'];
    const lic = ['copyleftStrong', 'copyleftWeak', 'copyleftPartial', 'copyleftLimited', 'copyleft', 'custom', 'dual', 'permissive'];
    const supply = ['risk', 'quality'];
    const asset = ['embedded', 'openSource', 'unique'];
    switch (str) {
      case 'vulnerabilityMetrics':
        _.each(vul, value => {
          if (data.entityMetricsSummaryGroup.entityMetricsSummaries.length >= 1) {
            dataToReturn.push({ name: value, data: data.entityMetricsSummaryGroup.entityMetricsSummaries.map(val => { return val.vulnerabilityMetrics[value] }) });
          } else {
            dataToReturn.push({ name: value, data: [] });
          }
        });
        break;
      case 'licenseMetrics':
        _.each(lic, value => {
          if (data.entityMetricsSummaryGroup.entityMetricsSummaries.length >= 1) {
            dataToReturn.push({ name: value, data: data.entityMetricsSummaryGroup.entityMetricsSummaries.map(val => { return val.licenseMetrics[value] }) });
          } else {
            dataToReturn.push({ name: value, data: [] });
          }
        });
        break;
      case 'supplyChainMetrics':
        _.each(supply, value => {
          if (data.entityMetricsSummaryGroup.entityMetricsSummaries.length >= 1) {
            dataToReturn.push({ name: value, data: data.entityMetricsSummaryGroup.entityMetricsSummaries.map(val => { return val.supplyChainMetrics[value] }) });
          } else {
            dataToReturn.push({ name: value, data: [] });
          }
        });
        break;
      case 'assetMetrics':
        _.each(asset, value => {
          if (data.entityMetricsSummaryGroup.entityMetricsSummaries.length >= 1) {
            dataToReturn.push({ name: value, data: data.entityMetricsSummaryGroup.entityMetricsSummaries.map(val => { return val.assetMetrics[value] }) });
          } else {
            dataToReturn.push({ name: value, data: [] });
          }
        });
        break;
      default:
        break;
    }

    return dataToReturn;
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

  private initCharts() {
    this.vulnerabilityDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.licenseDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.assetDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());

    this.componentVulnerabilityRiskChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.componentLicenseRiskChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.componentLicenseCategory = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.componentLicense = Object.assign(this.chartHelperService.initDonutChartConfiguration());

    this.licenseCategoryChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.licenseRiskChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
    this.supplyChainChart = this.chartHelperService.getSupplyChartConfig();

    this.weekSeriesOverTime = {};
    this.monthSeriesOverTime = {};
    this.quarterSeriesOverTime = {};
    this.yearSeriesOverTime = {};

    this.selectedDonut = "Vulnerability";
    this.lineChartActiveTab = "Week";
    this.selectedComponentChartDropvalue = "Vulnerabilities";
    this.selectedlicenseChartDropValue = "License Name";

  }

  loadEntity(entityId: string, isPush: boolean = false) {
    this.initCharts();
    this.currentEntityId = entityId;
    this.entityTreeModel = { data: [] };
    this.organizationTreeModel = [];
    this.selectedDonut = 'Vulnerability';
    this.isTreeProgressBar = true;
    this.entityNewBreadCum = [];
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.obsEntity = this.apiService.getEntity(entityId)
      .pipe(map(result => result.data.entity));


    this.obsEntity.subscribe((entity: any) => {
      if (!!entity.parents && entity.parents.length >= 1) {
        for (var i = entity.parents.length - 1; i >= 0; i--) {
          this.entityNewBreadCum.push({ id: entity.parents[i].entityId, name: entity.parents[i].name });
        }
      }
      this.entityNewBreadCum.push({ id: entity.entityId, name: entity.name });
      this.coreHelperService.settingProjectBreadcum("Entity", entity.name, entity.entityId, false);
      this.buildProjectTree(entity);

      if (isPush) {
        this.entityPageBreadCums.push({ id: entityId, name: entity.name });
        this.setEntityBreadcumToSession();
      }
      console.log("ENTITY: ", entity);
      if (entity.entityMetricsGroup && entity.entityMetricsGroup.entityMetrics.length >= 1) {
        // NOTES:
        // Metrics are ordered by date DESC (most recent to least recent)
        // Period defaults to week, so you'll get 7 days worth of data for stack chart
        // The data is all stored in Maps. I suggest that we use the map key for the chart label and value for the series.
        //    This data will change over time and this will allow the server side to drive the chart data without
        //    any changes needing to be made in the UX. If this approach is time consuming, let's work on it later
        //    as it's critical that we have the UX complete by Tuesday evening your time as we need to still work
        //    on an updated demonstration.

        const entityMetrics = entity.entityMetricsGroup.entityMetrics;
        this.entityMetricList = entity.entityMetricsGroup.entityMetrics;

        //Vul donut chart
        this.initVulDonutChartData(entityMetrics[0].vulnerabilityMetrics.severityMetrics);

        //License Donut charts
        this.initLicenseDonut(entityMetrics[0].licenseMetrics);

        //Component donut charts
        this.initComponentDonutChart(entityMetrics[0].componentMetrics);

        //Asset donut chart
        this.initAssetDonut(entityMetrics[0].assetMetrics.assetCompositionMetrics);

        //Supply chain chart
        this.initSupplyChainChart(entityMetrics[0].supplyChainMetrics.supplyChainMetrics);

        this.initStackedChartAccordingToDonut(this.selectedDonut);
      }
      if (!!entity) {
        this.entityTreeLogic(entity);
      } else {
        this.isTreeProgressBar = false;
      }
    });
  }

  async entityTreeLogic(entity: any) {
    this.recursionHelperArray = [];
    this.recursivehelperArrayForIrgTree = [];
    if (!!entity && !!entity.childEntities && entity.childEntities.edges.length >= 1) {
      await this.populateChildernRecusivaly(entity.childEntities.edges, null);
      let w = {};
      this.entityTreeModel.data = [
        {
          "data": entity,
          "children": this.list_to_tree(this.recursionHelperArray, false),
          expanded: true,
          visible: false
        }
      ];
      this.organizationTreeModel = [
        {
          data: entity,
          expanded: true,
          name: entity.name,
          styleClass: 'p-person',
          type: "entity",
          children: this.list_to_tree(this.recursivehelperArrayForIrgTree, true)
        }
      ];
      this.isTreeProgressBar = false;
    }
  }

  buildProjectTree(entity: Entity) {
    let edges = entity.projects.edges;

    let nodes: TreeNode[] = edges.map(projectEdge => {
      let node: TreeNode = {
        label: projectEdge.node.name,
        data: projectEdge.node,
        expandedIcon: "fa fa-folder-open",
        collapsedIcon: "fa fa-folder",
        children: []
      };
      this.buildProjectTreeHier(projectEdge, node);
      return node;
    });
    this.projects = nodes;
  }

  buildProjectTreeHier(projectEdge: ProjectEdge, treeNode: TreeNode) {
    if (projectEdge.node.childProjects) {
      projectEdge.node.childProjects.edges.forEach(edge => {
        let childNode: TreeNode = {
          label: edge.node.name,
          data: edge.node,
          expandedIcon: "fa fa-folder-open",
          collapsedIcon: "fa fa-folder",
          children: []
        };
        treeNode.children.push(childNode);
        this.buildProjectTreeHier(edge, childNode);
      });
    }
  }

  changeEntity(entityId: string, name: string, isPush: boolean) {
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.loadEntity(entityId, isPush);
    if (!isPush) {
      this.entityPageBreadCums.pop();
      this.setEntityBreadcumToSession();
    }
  }

  setEntityBreadcumToSession() {
    sessionStorage.setItem('EntityBreadCums', JSON.stringify(this.entityPageBreadCums));
  }

  goBackfromBreadcum(entityId, currentIndex) {
    const startIndexToRemove = currentIndex + 1;
    this.entityNewBreadCum.splice(startIndexToRemove, this.entityNewBreadCum.length - (startIndexToRemove));
    // this.setEntityBreadcumToSession();
    this.loadEntity(entityId);
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
    this.activeTab = $event.nextId;
    this.coreHelperService.settingUserPreference("Entity", $event.activeId, this.activeTab);
  }


  //Called when component deactivate or destrory
  canDeactivate(): Observable<boolean> | boolean {
    //Need to check here is browser back button clicked or not if clicked then do below things..
    if (this.coreHelperService.getBrowserBackButton()) {
      this.coreHelperService.setBrowserBackButton(false);
      if (!!this.coreHelperService.getPreviousTabSelectedByModule("Entity")) {
        this.activeTab = this.coreHelperService.getPreviousTabSelectedByModule("Entity", true);
        this.coreHelperService.settingUserPreference("Entity", null, this.activeTab);
        return false;
      } else {
        this.coreHelperService.settingUserPreference("Entity", "", null);
        return true;
      }
    } else {
      this.coreHelperService.settingUserPreference("Entity", "", null);
      return true;
    }
  }

  //Below method will fire when click on browser back button.
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.coreHelperService.setBrowserBackButton(true);
    if (!!this.coreHelperService.getPreviousTabSelectedByModule("Entity")) {
      history.pushState(null, null, window.location.href);
    }
  }

  newParentChildDataPush = [];
  onEntityTreeNameSelect(rowData, rowNode) {
    if (!!rowNode.parent) {
      if (this.entityPageBreadCums.length == 1) {
        const defaultEntity = this.entityPageBreadCums[0];
        this.entityPageBreadCums = [];
        this.entityPageBreadCums.push(defaultEntity);
      }
      this.newParentChildDataPush = [];

      this.recursiveArrayPopulate(rowNode.parent, { id: rowNode.node.id, name: rowNode.node.name });
      for (var i = this.newParentChildDataPush.length - 1; i >= 0; i--) {
        this.entityPageBreadCums.push(this.newParentChildDataPush[i]);
      }
      this.setEntityBreadcumToSession();
      this.router.navigateByUrl('dashboard/entity/' + rowData.entityId);
      this.loadEntity(rowData.entityId, false);
    }
  }

  recursiveArrayPopulate(parent, dataToPush) {
    if (!!parent.parent) {
      this.newParentChildDataPush.push(dataToPush);
      this.recursiveArrayPopulate(parent.parent, { id: parent.id, name: parent.name });
    } else {
      this.newParentChildDataPush.push(dataToPush);
    }
  }

  getAdditionData(data) {
    if (!!data && data.length >= 1) {
      // return data[0];
      return data.reduce((prev, next) => prev + (+next), 0);
    } else {
      return 0;
    }
  }

  getSum(obj) {
    var sum = 0;
    for (var el in obj) {
      if (obj.hasOwnProperty(el) && typeof obj[el] == "number") {
        sum += parseFloat(obj[el]);
      }
    }
    return sum;
  }

  onNodeSelect($event) {
  }

  showAndHideRow(rowData) {
    return this.currentEntityId !== rowData.entityId;
  }

  private getLastTabSelected() {
    this.activeTab = !!this.coreHelperService.getLastTabSelectedNameByModule("Entity") ? this.coreHelperService.getLastTabSelectedNameByModule("Entity") : this.activeTab;
  }

  private async populateChildernRecusivaly(childData, prId) {
    if (childData.length >= 1) {
      for (let i = 0; i < childData.length; i++) {
        if (!!childData[i].node) {
          let cData: any = await this.entityService.getTreeEntity(childData[i].node.entityId).toPromise();
          let d = {};
          cData.data.entity['vulSericeData'] = this.initSparkLineChart(cData.data.entity, 'vulnerabilityMetrics');
          cData.data.entity['licSericeData'] = this.initSparkLineChart(cData.data.entity, 'licenseMetrics');
          cData.data.entity['supplySericeData'] = this.initSparkLineChart(cData.data.entity, 'supplyChainMetrics');
          cData.data.entity['assetSericeData'] = this.initSparkLineChart(cData.data.entity, 'assetMetrics');
          d['id'] = childData[i].node.entityId;
          d['data'] = cData.data.entity;
          d['parentId'] = prId;
          d['name'] = childData[i].node.name;
          d['children'] = null;
          this.recursionHelperArray.push(d);
          this.recursivehelperArrayForIrgTree.push({ parentId: prId, id: childData[i].node.entityId, name: childData[i].node.name, children: null, data: cData.data.entity, type: 'entity', expanded: false, styleClass: 'p-person' });
          if (!!cData.data && !!cData.data.entity && !!cData.data.entity.childEntities
            && cData.data.entity.childEntities.edges.length >= 1) {
            await this.populateChildernRecusivaly(cData.data.entity.childEntities.edges, cData.data.entity.entityId);
          }
        }
      }
    } else {
      this.recursionHelperArray = new Array();
    }
  }

  private list_to_tree(list, isFromOrg: boolean = false) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    let j = 0;
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== "0" && !!node.parentId) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentId]].children.push(node);
        list[map[node.parentId]].expanded = true;
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  private initVulDonutChartData(vulData) {
    this.vulnerabilityDonutChart['colors'] = [];
    Object.keys(vulData).forEach(key => {
      this.vulnerabilityDonutChart['colors'].push(this.chartHelperService.getColorByLabel(key));
      const pascalCasestr = _.upperFirst(_.camelCase(key));
      this.vulnerabilityDonutChart['labels'].push(pascalCasestr);
      this.vulnerabilityDonutChart['series'].push(vulData[key]);
    });
  }

  private initAssetDonut(assetData) {
    this.assetDonutChart['colors'] = ['#11c15b', '#4680ff', '#ffa21d'];
    Object.keys(assetData).forEach(key => {
      const pascalCasestr = _.upperFirst(_.camelCase(key));
      this.assetDonutChart['labels'].push(pascalCasestr);
      this.assetDonutChart['series'].push(assetData[key]);
    });
  }

  private initLicenseDonut(licensedonutData) {
    if (!!licensedonutData) {
      if (!!licensedonutData.licenseNameMetrics) {
        Object.keys(licensedonutData.licenseNameMetrics).forEach(key => {
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          this.licenseDonutChart['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'];
          this.licenseDonutChart['labels'].push(pascalCasestr);
          this.licenseDonutChart['series'].push(licensedonutData.licenseNameMetrics[key]);
        });
      } else {
        //If no data then?
      }

      if (!!licensedonutData.licenseFamilyMetrics) {
        Object.keys(licensedonutData.licenseFamilyMetrics).forEach(key => {
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          this.licenseRiskChart['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'];
          this.licenseRiskChart['labels'].push(pascalCasestr);
          this.licenseRiskChart['series'].push(licensedonutData.licenseFamilyMetrics[key]);
        });
      } else {
        //if no data...
      }

      if (!!licensedonutData.licenseCategoryMetrics) {
        this.licenseCategoryChart['colors'] = [];
        Object.keys(licensedonutData.licenseCategoryMetrics).forEach(key => {
          this.licenseCategoryChart['colors'].push(this.chartHelperService.getColorByLabel(key));
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          this.licenseCategoryChart['labels'].push(pascalCasestr);
          this.licenseCategoryChart['series'].push(licensedonutData.licenseCategoryMetrics[key]);
        });
      } else {
        //if no data...
      }

    } else {
      // if no data In license then?
    }
  }

  private initComponentDonutChart(componentData) {
    if (!!componentData) {
      if (!!componentData.licenseCategoryMetrics) {
        this.componentLicenseCategory['colors'] = [];
        Object.keys(componentData.licenseCategoryMetrics).forEach(key => {
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          this.componentLicenseCategory['colors'].push(this.chartHelperService.getColorByLabel(key));
          this.componentLicenseCategory['labels'].push(pascalCasestr);
          this.componentLicenseCategory['series'].push(componentData.licenseCategoryMetrics[key]);
        });
      } else {

      }

      if (!!componentData.licenseFamilyMetrics) {
        Object.keys(componentData.licenseFamilyMetrics).forEach(key => {
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          this.componentLicenseRiskChart['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d']
          this.componentLicenseRiskChart['labels'].push(pascalCasestr);
          this.componentLicenseRiskChart['series'].push(componentData.licenseFamilyMetrics[key]);
        });
      } else {

      }

      if (!!componentData.licenseNameMetrics) {
        Object.keys(componentData.licenseNameMetrics).forEach(key => {
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          this.componentLicense['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'];
          this.componentLicense['labels'].push(pascalCasestr);
          this.componentLicense['series'].push(componentData.licenseNameMetrics[key]);
        });
      } else {

      }

      if (!!componentData.vulnerabilityMetrics) {
        Object.keys(componentData.vulnerabilityMetrics).forEach(key => {
          const pascalCasestr = _.upperFirst(_.camelCase(key));
          // this.componentVulnerabilityRiskChart['colors'] = ['#ff2b2b', '#ffa21d', '#e6e600', '#11c15b', '#4680ff'];
          this.componentVulnerabilityRiskChart['colors'].push(this.chartHelperService.getColorByLabel(key));
          this.componentVulnerabilityRiskChart['labels'].push(pascalCasestr);
          this.componentVulnerabilityRiskChart['series'].push(componentData.vulnerabilityMetrics[key]);
        });
      } else {

      }
    } else {
      //No data then ?
    }
  }

  private initSupplyChainChart(supplyChainData) {
    if (!!supplyChainData) {
      Object.keys(supplyChainData).forEach(key => {
        const pascalCasestr = _.upperFirst(_.camelCase(key));
        this.supplyChainChart['labels'].push(pascalCasestr);
        this.supplyChainChart['series'].push(supplyChainData[key]);
      });
    }
  }

  //Get properties from metrics object condition wise..
  private getProperties(objArray, metricsObjName) {
    let properties = [];
    this.entityMetricList.forEach(d => {
      if (d[objArray]) {
        const obj = d[objArray];
        if (!!obj[metricsObjName]) {
          Object.keys(obj[metricsObjName]).forEach(p => {
            if (!properties.includes(p)) {
              properties.push(p);
            }
          });
        }
      }
    });
    return properties;
  }

  //clicking on any where in the screen below method will fire
  onClick(event) {
    this.isShowComponentdropdown = (!!event.target.className && event.target.className !== 'chart-opt-selected' && event.target.parentNode.className !== 'chart-opt-selected') ? false : this.isShowComponentdropdown;
    this.isShowLicensedropdown = (!!event.target.className && event.target.className !== 'chart-opt-selected' && event.target.parentNode.className !== 'chart-opt-selected') ? false : this.isShowLicensedropdown;
  }
}
