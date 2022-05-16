import * as echarts from 'echarts';

export default {
  todayInstall: {
    backgroundColor: '#0e325f',
    grid: {
      top:70,
      left:60,
      bottom:50,
      right:25,
    },
    textStyle: {
      fontSize: 0,
    },
    color: ['#00FCFF', '#FFDF1C', '#5AB72C', '#FF715A', '#2F9BFF'],
    dataZoom: [
      {
        type: 'inside',
        // disabled:true,
        xAxisIndex: [0],
        start: 90,
        end: 100
      },
    ],
    xAxis: {
      nameTextStyle: {
        color: '#c0c3cd',
        padding: [0, 0, -30, 0],
        fontSize: 14,
      },
      axisLabel: {
        color: '#c0c3cd', //X轴文字
        fontSize: 14,
        interval: 2,
        rotate:60,
      },
      axisTick: {
        lineStyle: {
          color: '#0B1535',
          width: 1,
        },
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#384267',
          width: 1,
          type: 'dashed',
        },
        show: true,
      },
      data: [],
      type: 'category',
    },
    yAxis: {
      type: 'value',
      name: '当日新增安装量（台）',
      nameTextStyle: {
        color: '#ffffff',
        padding: [0, -80, 10, 0],
        fontSize: 14,
      },
      axisLabel: {
        color: '#c0c3cd', //Y轴文字
        fontSize: 14,
      },
      axisTick: {
        lineStyle: {
          color: '#384267',
          width: 1,
        },
        show: true,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#384267',
          type: 'line',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#fff',
          width: 1,
          type: 'line',
        },
        show: false,
      },
    },
    series: [{
        data: [],
        type: 'bar',
        barMaxWidth: 'auto',
        barWidth: 16,
        itemStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: 'linear',
            global: false,
            colorStops: [{
                offset: 0,
                color: '#49d5b0',
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)',
              },
            ],
          },
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 14,
          fontWeight: 'bold',
          itemStyle: {
            normal: {
              color: "#FFF"
            },
          },
          formatter: "{c}",
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      show: true,
    },
  },
  cumulativeArea:{
    backgroundColor: '#0e325f',
    grid: {
      top:70,
      left:60,
      bottom:50,
      right:25,
    },
    textStyle: {
      fontSize: 0,
    },
    color: ['#00FCFF', '#FFDF1C', '#5AB72C', '#FF715A', '#2F9BFF'],
    // dataZoom: [
    //   {
    //     type: 'inside',
    //     xAxisIndex: [0],
    //     start: 90,
    //     end: 100
    //   },
    // ],
    xAxis: {
      nameTextStyle: {
        color: '#c0c3cd',
        padding: [0, 0, -30, 0],
        fontSize: 14,
      },
      axisLabel: {
        color: '#c0c3cd', //X轴文字
        fontSize: 14,
        // interval: 2,
        // rotate:60,
      },
      axisTick: {
        lineStyle: {
          color: '#0B1535',
          width: 1,
        },
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#384267',
          width: 1,
          type: 'dashed',
        },
        show: true,
      },
      data: [],
      type: 'category',
    },
    yAxis: {
      type: 'value',
      name: '累计作业面积（亩）',
      nameTextStyle: {
        color: '#ffffff',
        padding: [0, -80, 10, 0],
        fontSize: 14,
      },
      axisLabel: {
        color: '#c0c3cd', //Y轴文字
        fontSize: 14,
      },
      axisTick: {
        lineStyle: {
          color: '#384267',
          width: 1,
        },
        show: true,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#384267',
          type: 'line',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#fff',
          width: 1,
          type: 'line',
        },
        show: false,
      },
    },
    series: [{
      type: 'line',
      showAllSymbol: true,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
          normal: {
              color: '#03c3e0',
              width: 2,
          },
      },
      tooltip: {
          show: false,
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
                          color: 'rgba(3, 195, 224, 0.4)',
                      },
                      {
                          offset: 1,
                          color: 'rgba(3, 195, 224,0)',
                      },
                  ],
                  false
              ),
          },
      },
        // label: {
        //   show: true,
        //   position: 'top',
        //   fontSize: 14,
        //   fontWeight: 'bold',
        //   itemStyle: {
        //     normal: {
        //       color: "#FFF"
        //     },
        //   },
        //   formatter: "{c}",
        // },
        tooltip:{
          show:true,
          // formatter:"{b}:{c}"
        },
      data: []
  }, ],
    // series: [{
    //     type: 'line',
    //     barMaxWidth: 'auto',
    //     barWidth: 16,
    //     itemStyle: {
    //       color: {
    //         x: 0,
    //         y: 0,
    //         x2: 0,
    //         y2: 1,
    //         type: 'linear',
    //         global: false,
    //         colorStops: [{
    //             offset: 0,
    //             color: '#49d5b0',
    //           },
    //           {
    //             offset: 1,
    //             color: 'rgba(255, 255, 255, 0)',
    //           },
    //         ],
    //       },
    //     },
    //     label: {
    //       show: true,
    //       position: 'top',
    //       fontSize: 14,
    //       fontWeight: 'bold',
    //       itemStyle: {
    //         normal: {
    //           color: "#FFF"
    //         },
    //       },
    //       formatter: "{c}",
    //     },
    //   },
    // ],
    tooltip: {
      trigger: 'axis',
      show: true,
    },
  }
}