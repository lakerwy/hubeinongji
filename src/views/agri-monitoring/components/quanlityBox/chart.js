import * as echarts from 'echarts'

export default {
  legend: {
    icon: 'line',
    top: '5%',
    right: '5%',
    itemGap: 10,
    textStyle: {
      color: '#aac2d6',
      fontSize: 12,
      padding: [2, 0, 0, 0]
    },
  },
  tooltip: {
    showContent: true,
    trigger: 'axis',
    backgroundColor: '#455363',
    color: '#455363',
    axisPointer: {
      lineStyle: {
        color: '#455363'
      },
    },
    textStyle: {
      color: '#fff'
    },
  },
  grid: {
    top: '18%',
    left: '14%',
    bottom: '22%',
    right: '5%'
  },
  dataZoom: [{
    type: 'inside',
    xAxisIndex: [0],
    start: 98,
    end: 100,
    zoomLock: true,
  }],
  xAxis: [
    {
      type: 'category',
      // data: _that.timeList,
      // data:['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00', '0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00','20:00', '24:00'],
      axisLine: {
        lineStyle: {
          color: '#24d4aa', //x轴颜色
          opacity: 0.2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        // interval: 0,
        rotate: '45',
        textStyle: {
          color: '#ffffff' //坐标轴字颜色
        },
        margin: 15
      },
      boundaryGap: false
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      // max: 40,
      // name: '温度（℃）',
      // splitNumber: 1,
      splitLine: {
        show: false,
        lineStyle: {
          color: '#24d4aa',
          opacity: 0.2
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#24d4aa',
          opacity: 0.2
        }
      },
      axisLabel: {
        show: true,
        margin: 12,
        textStyle: {
          color: '#d9d9d9'
        }
      },
      axisTick: {
        show: false
      }
    },
  ],
  series: [
    {
      name:'平均作业深度（cm）',
      type: 'line',
      // showSymbol: false,
      lineStyle: {
          normal: {
              color: "#1fb496",
              width: 1
          },
      },
      label: {
          show: false,
          position: 'top',
          textStyle: {
              color: '#A582EA',
          }
      },
      itemStyle: {
          color: "#1fb496",
          background: '#1fb496',
          borderColor: "#1fb496",
          borderWidth: 2,
      },
      areaStyle: {
          normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                      offset: 0,
                      color: 'RGBA(153, 204, 255, 1)'
                  },
                  {
                      offset: 1,
                      color: 'RGBA(153, 204, 255, 0)'
                  }
              ], false),
          }
      },
      // data: _that.wenduList//data.values
      // data: [100,95,130,159,121,220,240,250,280,300,280,290,330,320,350,300]
    },
  ]
}


/*
installOption: {
  legend: {
    icon: 'line',
        top: '0',
        right: '3%',
        itemGap: 10,
        textStyle: {
      color: '#aac2d6',
          fontSize: 14,
          padding: [2, 0, 0, 0]
    },
  },
  grid: {
    top: '23%',
        left: '14%',
        bottom: '20%',
        right: '10%'
  },
  tooltip: {
    showContent: true,
        trigger: 'axis',
        backgroundColor: 'rgba(8,36,68,.7)',
        color: '#fff',
        textStyle: {
      color: '#fff'
    },
  },
  xAxis: [{
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#24d4aa', //x轴颜色
        opacity: 0.2
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#ffffff' //坐标轴字颜色
      },
      margin: 15
    },
    boundaryGap: false,
    data: value
  }],
      yAxis: [
    {
      splitLine: {
        show: true,
        lineStyle: {
          color: "#243753"
        }
      },
      type: 'value',
      min: 0,
      axisLabel: {
        show: true,
        margin: 12,
        textStyle: {
          color: '#d9d9d9'
        }
      },
      axisTick: {
        show: false
      }
    }
  ],
      series: [{
    name: "安装趋势(台)",
    type: "line",
    smooth: true,
    showSymbol: false,
    itemStyle: {
      color: "#1fb496",
      background: '#1fb496',
      borderColor: "#1fb496",
      borderWidth: 2,
    },
    lineStyle: {
      normal: {
        width: 2,
        color: "#1fb496",
      }
    },
    areaStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [{
              offset: 0,
              color: "rgba(88,255,255,0.2)"
            },
              {
                offset: 0.8,
                color: "rgba(88,255,255,0)"
              }
            ],
            false
        ),
      }
    },
    data: value
  }]
},*/
