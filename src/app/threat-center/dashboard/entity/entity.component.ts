import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { Project, Entity, User, ProjectEdge } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { AuthenticationService } from '@app/security/services';
import { ChartDB } from '../../../fack-db/chart-data';
import { ApexChartService } from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { TaskService } from '@app/threat-center/shared/task/task.service';
import { NextConfig } from "@app/app-config";




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
  public projects: TreeNode[];
  public componentsEntity: Entity;
  public uniqueLicenses = [];
  activeTab: string;
  columns = [
    { field: 'projectId', header: 'ProjectId' },
    { field: 'name', header: 'Name' },
    { field: 'created', header: 'Created' }
  ];
  activeScanCount: number;
  checkRunningScans: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    public authService: AuthenticationService,
    private coreHelperService: CoreHelperService,
    private taskService: TaskService
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
    this.activeScanCount = 0;
  }

  navigateToProject(projectId) {
    const entityId = this.route.snapshot.paramMap.get('entityId')
    const url = "dashboard/entity/" + entityId + '/project/' + projectId;
    this.router.navigate([url]);
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
    this.getLastTabSelected();
    this.checkRunningScans = true;
    this.getRunningScansCount(entityId);
  }

  ngOnDestroy() {
    this.checkRunningScans = false;
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
      this.coreHelperService.settingProjectBreadcum("Entity", entity.name, entity.entityId, false);
      //this.stateService.selectedScan = project.scans[0];
      this.buildProjectTree(entity);

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

      if (entity.entityMetrics) {
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

        // // set vulnerabilityChart data
        // this.vulnerabilityChart.series.push({ name: 'Critical', data: critical });
        // this.vulnerabilityChart.series.push({ name: 'High', data: high });
        // this.vulnerabilityChart.series.push({ name: 'Medium', data: medium });
        
        // this.vulnerabilityChart.series.push({ name: 'Low', data: low });
        // this.vulnerabilityChart.series.push({ name: 'Info', data: info });

        // // set licenseChart data
        // this.licenseChart.series.push({ name: 'CL Strong', data: copyleftStrong });
        // this.licenseChart.series.push({ name: 'CL Weak', data: copyleftWeak });
        // this.licenseChart.series.push({ name: 'CL Partial', data: copyleftPartial });
        // this.licenseChart.series.push({ name: 'CL Limited', data: copyleftLimited });
        // this.licenseChart.series.push({ name: 'Copyleft', data: copyleft });
        // this.licenseChart.series.push({ name: 'Custom', data: custom });
        // this.licenseChart.series.push({ name: 'Dual', data: dual });
        // this.licenseChart.series.push({ name: 'Permissive', data: permissive });

        // // set componentChart data
        // this.componentChart.series.push({ name: 'Not Latest', data: notLatest });
        // this.componentChart.series.push({ name: 'Vulnerabilities', data: vulnerabilities });
        // this.componentChart.series.push({ name: 'Risky Licenses', data: riskyLicenses });

        // // set assetChart data
        // this.assetChart.series.push({ name: 'Analyzed', data: analyzed });
        // this.assetChart.series.push({ name: 'Skipped', data: skipped });
        // this.assetChart.series.push({ name: 'Embedded', data: embedded });

        // // set source code Leak data
        // this.sourceCodeLeakChart.series.push({ name: 'Partial Asset Leaks', data: partialAsset });
        // this.sourceCodeLeakChart.series.push({ name: 'Asset Leaks', data: asset })
        // this.sourceCodeLeakChart.series.push({ name: 'Project Leaks', data: projectAsset });



        // set vulnerabilityChart data
      this.vulnerabilityChart.series.push({ name: 'Critical', data: critical, colorClass: "red", hover: false });
      this.vulnerabilityChart.series.push({ name: 'High', data: high, colorClass: "orange", hover: false });
      this.vulnerabilityChart.series.push({ name: 'Medium', data: medium, colorClass: "yellow", hover: false });
      this.vulnerabilityChart.series.push({ name: 'Low', data: low, colorClass: "lgt-blue", hover: false });
      this.vulnerabilityChart.series.push({ name: 'Info', data: info, colorClass: "green", hover: false });

      // set licenseChart data
      this.licenseChart.series.push({ name: 'CL Strong', data: copyleftStrong, colorClass: "red", hover: false });
      this.licenseChart.series.push({ name: 'CL Weak', data: copyleftWeak, colorClass: "orange", hover: false });
      this.licenseChart.series.push({ name: 'CL Partial', data: copyleftPartial, colorClass: "yellow", hover: false });
      this.licenseChart.series.push({ name: 'CL Limited', data: copyleftLimited, colorClass: "lgt-blue", hover: false });
      this.licenseChart.series.push({ name: 'Copyleft', data: copyleft, colorClass: "green", hover: false });
      this.licenseChart.series.push({ name: 'Custom', data: custom, colorClass: "pink", hover: false });
      this.licenseChart.series.push({ name: 'Dual', data: dual, colorClass: "white", hover: false });
      this.licenseChart.series.push({ name: 'Permissive', data: permissive, colorClass: "blue", hover: false });

      // set componentChart data
      this.componentChart.series.push({ name: 'Not Latest', data: notLatest, colorClass: "red", hover: false });
      this.componentChart.series.push({ name: 'Vulnerabilities', data: vulnerabilities, colorClass: "orange", hover: false });
      this.componentChart.series.push({ name: 'Risky Licenses', data: riskyLicenses, colorClass: "yellow", hover: false });

      // set assetChart data
      this.assetChart.series.push({ name: 'Analyzed', data: analyzed, colorClass: "green", hover: false });
      this.assetChart.series.push({ name: 'Skipped', data: skipped, colorClass: "lgt-blue", hover: false });
      this.assetChart.series.push({ name: 'Embedded', data: embedded, colorClass: "yellow", hover: false });

        // set categories on bar charts
        this.xaxis.categories = categories;
      }

    });
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

  changeEntity(entityId: string) {
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.loadEntity(entityId);
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
    this.activeTab = $event.nextId;
    this.coreHelperService.settingUserPreference("Entity", this.activeTab);
  }

  private getLastTabSelected() {
    this.activeTab = !!this.coreHelperService.getLastTabSelectedNameByModule("Entity") ? this.coreHelperService.getLastTabSelectedNameByModule("Entity") : this.activeTab;
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
      columnWidth: '15%',
      distributed: false
    },
  };
  legend = {
    show:false,
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
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };
  public licenseChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    // colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#11c15b'],
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'],
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };
  public componentChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396'],//,'#11c15b'
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };
  public assetChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#11c15b', '#4680ff', '#ffa21d'],
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
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

  getAdditionData(data) {
    if (!!data && data.length >= 1) {
      // return data[0];
      return data.reduce((prev, next) => prev + (+next), 0);
    } else {
      return 0;
    }
  }

  // Fetch active scan count
  getRunningScansCount(entityId) {
    if (!this.checkRunningScans) {
      return;
    }
    this.taskService.getRunningScanTasksCount(entityId)
        .pipe(map(countData => countData.data.running_scan_tasks_count))   
        .subscribe(count => {
            this.activeScanCount = count;
            setTimeout(() => {
                this.getRunningScansCount(entityId);
            }, NextConfig.config.delaySeconds);
        }, err => {
            setTimeout(() => {
                this.getRunningScansCount(entityId);
            }, NextConfig.config.delaySeconds);
        });
}

}
