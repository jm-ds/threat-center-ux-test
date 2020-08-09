export class ChartDB {

  public static projectSummaryCard = {
    chart: {
      type: 'area',
      height: 95,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#00e396', '#feb019'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      name: 'Total',
      data: [1, 5, 15, 16, 18, 22, 30]
    }, {
      name: 'Scans',
      data: [1, 7, 19, 29, 34, 52, 74]
    }],
    xaxis: {
       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
       labels: {
         show: true,
         style: {
            colors: ['#adb7be'],
         }
        },
     },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: true
      },
      marker: {
        show: false
      }
    }
  };

  public static licenseSummaryCard = {
      chart: {
        type: 'area',
        height: 95,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#008ffb', '#ff5252','#fff'],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      series: [{
        name: 'Total',
        data: [100, 140, 128, 151, 142, 109, 100]
      }, {
        name: 'Threats',
        data: [41, 39, 45, 29, 34, 52, 41]
      }, {
        name: 'Copyrights',
        data: [65, 67, 71, 74, 73, 86, 102]
      }],
      xaxis: {
         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
         labels: {
           show: true,
           style: {
              colors: ['#adb7be'],
           }
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#fff',
            height: 6,
            offsetX: -0,
            offsetY: -10
          },
       },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: true
        },
        marker: {
          show: false
        }
      }
   };

  public static assetsSummaryCard = {
    chart: {
      type: 'area',
      height: 95,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#775dd0', '#f5f12c'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      name: 'Total',
      data: [123, 280, 489, 555, 750, 1019, 2700]
    }, {
      name: 'Embedded',
      data: [4, 15, 35, 49, 54, 73, 145]
    }],
    xaxis: {
       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
       labels: {
         show: true,
         style: {
            colors: ['#adb7be'],
         }
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#1c82ff',
          height: 6,
          offsetX: -0,
          offsetY: -10
        },
     },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: true
      },
      marker: {
        show: false
      }
    }
  };

  public static librarySummaryCard = {
    chart: {
      type: 'area',
      height: 95,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#feb019'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      name: 'Total',
      data: [1023, 2805, 2957, 3243, 4150, 5578, 9578]
    }],
    xaxis: {
       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
       labels: {
         show: true,
         style: {
            colors: ['#adb7be'],
         }
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#1c82ff',
          height: 6,
          offsetX: -0,
          offsetY: -10
        },
     },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: true
      },
      marker: {
        show: false
      }
    }
  };


public static licenseHistoryBySource = {
     chart: {
       height: 350,
       stacked: true,
       type: 'bar',
       foreColor: '#adb7be',
        animations: {
          enabled: false
        }
     },
     plotOptions: {
       bar: {
         horizontal: false,
         columnWidth: '55%',
       },
     },
     legend: {
       position: 'top',
       horizontalAlign: 'center',
       offsetX: 0,
       offsetY: 5,
       fontSize: '12px',
       //width: 500,
       itemMargin: {
        horizontal: 10,
        vertical: 0
       },
     },
     dataLabels: {
       enabled: false
     },
     //colors: ['#4680ff', '#11c15b', '#ffa21d','#00acc1'],
     stroke: {
       show: true,
       width: 1,
       colors: ['#fff']
     },
     series: [{
       name: 'Libraries',
       data: [44, 55, 57, 56, 61, 58, 63,25,56,78,33,43]
     }, {
       name: 'Source',
       data: [76, 85, 101, 98, 87, 105, 91,17,88,44,23,12]
     }, {
       name: 'Embedded',
       data: [35, 41, 36, 26, 45, 48, 52,66,44,55,33,22]
     }, {
       name: 'Repository',
       data: [15, 21, 26, 12, 25, 28, 32,36,14,25,23,42]
     }],
     xaxis: {
       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'],
       labels: {
         show: true,
         style: {
            colors: ['#adb7be'],
         }
        },
     },
   };

   public static licenseHistoryByCategory = {
    chart: {
      height: 350,
      stacked: true,
      type: 'bar',
      foreColor: '#adb7be',
       animations: {
         enabled: false
       }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      fontSize: '12px',
      //width: 500,
      itemMargin: {
       horizontal: 10,
       vertical: 0
      },
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#ff2b2b','#ff5252', '#ffa21d','#00acc1','#00e396' ],//,'#11c15b'
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    series: [{
      name: 'Viral',
      data: [44, 55, 57, 56, 61, 58, 63,25,56,78,33,43]
    }, {
      name: 'Conflicted',
      data: [76, 85, 101, 98, 87, 105, 91,17,88,44,23,12]
    }, {
      name: 'Custom',
      data: [35, 41, 36, 26, 45, 48, 52,66,44,55,33,22]
    }, {
      name: 'Dual',
      data: [15, 21, 26, 12, 25, 28, 32,36,14,25,23,42]
    }, {
      name: 'Permissive',
      data: [15, 21, 26, 12, 25, 28, 32,36,14,25,23,42]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'],
      labels: {
        show: true,
        style: {
           colors: ['#adb7be'],
        }
       },
    },
  };

  public static licensesByCatByBU = {
    chart: {
      height: 350,
      type: 'bar',
      stacked: true,
      stackType: 'normal',
      foreColor: '#adb7be',
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: ['#4680ff', '#00acc1', '#0e9e4a', '#ffa21d', '#ff5252'],
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    series: [{
      name: 'Viral',
      data: [44, 55, 41, 37, 22, 43, 21]
    }, {
      name: 'Conflcited',
      data: [53, 32, 33, 52, 13, 43, 32]
    }, {
      name: 'Dual',
      data: [12, 17, 11, 9, 15, 11, 20]
    }, {
      name: 'Custom',
      data: [9, 7, 5, 8, 6, 9, 4]
    }, {
      name: 'Permissive',
      data: [25, 12, 19, 32, 25, 24, 10]
    }],
    title: {
      text: '',
    },
    xaxis: {
      categories: ['China', 'UK', 'Bangalore', 'Japan', 'Santa Clara', 'Boston','Germany'],
    },

    tooltip: {
      y: {
        formatter: (val) => val + 'K'
      }
    },
    fill: {
      opacity: .75
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      fontSize: '14px',
      //width: 500,
      itemMargin: {
       horizontal: 10,
       vertical: 0
      },
      markers: {
         width: 12,
         height: 12,
         strokeWidth: 0,
         strokeColor: '#fff',
         fillColors: undefined,
         radius: 2,
         customHTML: undefined,
         onClick: undefined,
         //offsetX: 15,
         //offsetY: 15
     },
    },
  };

  public static licensesBySourceByBU = {
    chart: {
      height: 350,
      type: 'bar',
      stacked: true,
      stackType: 'normal',
      foreColor: '#adb7be',
      animations: {
        enabled: false,
        easing: 'linear',
        speed: 5,
         animateGradually: {
              enabled: true,
              delay: 10
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      colors: ['#4680ff', '#00acc1', '#0e9e4a', '#ffa21d'],
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      series: [
        {
          name: 'Library',
          data: [44, 55, 41, 37, 22, 43, 21]
        }, {
          name: 'Source',
          data: [53, 32, 33, 52, 13, 43, 32]
        }, {
          name: 'Embedded',
          data: [12, 17, 11, 9, 15, 11, 20]
        }, {
          name: 'Repository',
          data: [9, 7, 5, 8, 6, 9, 4]
        }
      ],
      xaxis: {
        categories: ['China', 'UK', 'Bangalore', 'Japan', 'Santa Clara', 'Boston','Germany'],
      },

      tooltip: {
        y: {
          formatter: (val) => val + 'K'
        }
      },
      fill: {
        opacity: .75
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        fontSize: '14px',
        //width: 500,
        itemMargin: {
         horizontal: 10,
         vertical: 0
        },
        markers: {
           width: 12,
           height: 12,
           strokeWidth: 0,
           strokeColor: '#fff',
           fillColors: undefined,
           radius: 2,
           customHTML: undefined,
           onClick: undefined,
           //offsetX: 15,
           //offsetY: 15
       },
      },
    };
/*
  public static licenseHistoryBySource = {
    chart: {
      height: 350,
      type: 'column',
      stacked: true,
      stackType: 'normal',
      foreColor: '#adb7be',
      animations: {
        enabled: false,
        easing: 'linear',
        speed: 5,
         animateGradually: {
              enabled: true,
              delay: 10
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      colors: ['#4680ff', '#00acc1', '#0e9e4a', '#ffa21d', '#ff5252'],
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      series: [{
        name: 'Viral',
        data: [44, 55, 41, 37, 22, 43, 21]
      }, {
        name: 'Conflcited',
        data: [53, 32, 33, 52, 13, 43, 32]
      }, {
        name: 'Dual',
        data: [12, 17, 11, 9, 15, 11, 20]
      }, {
        name: 'Custom',
        data: [9, 7, 5, 8, 6, 9, 4]
      }, {
        name: 'Low Threat',
        data: [25, 12, 19, 32, 25, 24, 10]
      }],
      title: {
        text: '',
      },
      xaxis: {
        categories: ['China', 'UK', 'Bangalore', 'Japan', 'Santa Clara', 'Boston','Germany'],
      },

      tooltip: {
        y: {
          formatter: (val) => val + 'K'
        }
      },
      fill: {
        opacity: .75
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        fontSize: '14px',
        //width: 500,
        itemMargin: {
         horizontal: 10,
         vertical: 0
        },
        markers: {
           width: 12,
           height: 12,
           strokeWidth: 0,
           strokeColor: '#fff',
           fillColors: undefined,
           radius: 2,
           customHTML: undefined,
           onClick: undefined,
           //offsetX: 15,
           //offsetY: 15
       },
      },
    };*/


  public static userAACC = {
      chart: {
        type: 'line',
        height: 30,
        sparkline: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      series: [{
        data: [3, 0, 1, 2, 1, 1, 2]
      }],
      yaxis: {
        min: -2,
        max: 5
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: (seriesName) => ''
          }
        },
        marker: {
          show: false
        }
      },
      colors: ['#FF9800'],
    };
    public static pageViewAACC = {
      chart: {
        type: 'line',
        height: 30,
        sparkline: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      series: [{
        data: [3, 0, 1, 2, 1, 1, 2]
      }],
      yaxis: {
        min: -2,
        max: 5
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: (seriesName) => ''
          }
        },
        marker: {
          show: false
        }
      },
      colors: ['#ff5252'],
    };
    public static pageSessionAACC = {
      chart: {
        type: 'bar',
        height: 30,
        sparkline: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      series: [{
        data: [2, 1, 2, 1, 1, 3, 0]
      }],
      yaxis: {
        min: -2,
        max: 5
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: (seriesName) => ''
          }
        },
        marker: {
          show: false
        }
      },
      colors: ['#7759de'],
    };
    public static dailyVisitorAACC = {
      chart: {
        type: 'area',
        height: 285,
        stacked: true,
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            customIcons: []
          },
          autoSelected: 'zoom'
        },
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: 'Viral',
        data: [
          [1327618800000, 21],
          [1327878000000, 27],
          [1327964400000, 26],
          [1328050800000, 41],
          [1328137200000, 40],
          [1328223600000, 61],
          [1328482800000, 50],
          [1328569200000, 29],
          [1328655600000, 36],
          [1328742000000, 27],
          [1328828400000, 28],
          [1329087600000, 58],
          [1329174000000, 34],
          [1329260400000, 54],
          [1329346800000, 66],
          [1329433200000, 24],
          [1329778800000, 23],
          [1329865200000, 22],
          [1329951600000, 21],
          [1330038000000, 25],
          [1330297200000, 23],
          [1330383600000, 22],
          [1330470000000, 58],
          [1330556400000, 27],
          [1330642800000, 23]
        ]
      },

      {
        name: 'Conflcited',
        data: [
          [1327618800000, 31],
          [1327878000000, 37],
          [1327964400000, 16],
          [1328050800000, 31],
          [1328137200000, 50],
          [1328223600000, 31],
          [1328482800000, 10],
          [1328569200000, 19],
          [1328655600000, 56],
          [1328742000000, 47],
          [1328828400000, 58],
          [1329087600000, 48],
          [1329174000000, 24],
          [1329260400000, 24],
          [1329346800000, 56],
          [1329433200000, 54],
          [1329778800000, 53],
          [1329865200000, 52],
          [1329951600000, 51],
          [1330038000000, 45],
          [1330297200000, 43],
          [1330383600000, 42],
          [1330470000000, 38],
          [1330556400000, 37],
          [1330642800000, 33]
          ]
        },

        {
        name: 'Dual',
        data: [
          [1327618800000, 25],
          [1327878000000, 16],
          [1327964400000, 17],
          [1328050800000, 45],
          [1328137200000, 27],
          [1328223600000, 61],
          [1328482800000, 15],
          [1328569200000, 26],
          [1328655600000, 28],
          [1328742000000, 32],
          [1328828400000, 63],
          [1329087600000, 45],
          [1329174000000, 46],
          [1329260400000, 47],
          [1329346800000, 15],
          [1329433200000, 19],
          [1329778800000, 44],
          [1329865200000, 32],
          [1329951600000, 38],
          [1330038000000, 35],
          [1330297200000, 31],
          [1330383600000, 27],
          [1330470000000, 29],
          [1330556400000, 1],
          [1330642800000, 55]
          ]
        },

        {
        name: 'Permissive',
        data: [
          [1327618800000, 35],
          [1327878000000, 62],
          [1327964400000, 14],
          [1328050800000, 45],
          [1328137200000, 27],
          [1328223600000, 25],
          [1328482800000, 15],
          [1328569200000, 16],
          [1328655600000, 28],
          [1328742000000, 32],
          [1328828400000, 56],
          [1329087600000, 45],
          [1329174000000, 46],
          [1329260400000, 34],
          [1329346800000, 23],
          [1329433200000, 23],
          [1329778800000, 56],
          [1329865200000, 77],
          [1329951600000, 55],
          [1330038000000, 23],
          [1330297200000, 18],
          [1330383600000, 10],
          [1330470000000, 19],
          [1330556400000, 15],
          [1330642800000, 35]
          ]
        },

      ],
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      markers: {
        size: 0,
        style: 'hollow',
      },
      colors: ['#4680ff','#11c15b','#00acc1'],
      xaxis: {
        type: 'datetime',
        min: new Date('01 Mar 2012').getTime(),
        tickAmount: 1,
        labels: {
          offsetY: 5,
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
        //offsetX: -20,
        //offsetY: -20,
      },
      grid: {
        borderColor: '#cccccc42',
        padding: {
          left: 0,
          right: 0,
          bottom: 30
        }
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          align: 'left',
          offsetX: -18,
          maxWidth: 40,
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      plotOptions: {
         bar: {
           horizontal: false,
           columnWidth: '55%',
         },
       },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.0,
          stops: [0, 100]
        }
      },

    };
}
