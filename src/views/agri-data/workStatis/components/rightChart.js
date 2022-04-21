import * as echarts from 'echarts';

const value = [233, 233, 200, 180, 199, 233, 210, 180]
export default {
  installOption2: {
    legend: {
      icon: 'line',
      top: '0',
      right: '5%',
      itemGap: 10,
      textStyle: {
        color: '#aac2d6'
      },
    },
    grid: {
      top: '23%',
      left: '14%',
      bottom: '30%',
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
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 1,
        end: 20
      },
    ],
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
          show:true,
          lineStyle: {
            color: "#243753"
          }
        },
        type: 'value',
        axisLabel: {
          show: true,
          margin: 12,
          textStyle: {
            color: '#d9d9d9'
          }
        },
        axisTick: {
          show: false
        },
        splitNumber: 2,
      }
    ],
    series: [{
      name: "作业面积（万亩）",
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
          width:2,
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
  },
  importAndexportOptions: {
    grid: {
      left: "10%",
      right: "10%",
      top: "20%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      textStyle: {
        fontSize: "16",
        color: '#fff'
      },
      showContent: true,
      backgroundColor: 'rgba(8,36,68,.7)',
      color: '#fff',
    },
    legend: {
      show: true,
      right: '10',
      "icon": "rect",
      "itemWidth": 13,
      "itemHeight": 13,
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    xAxis: [
      {
        type: "category",
        name: "",
        nameTextStyle: {
          fontSize: "16",
          color: "#ffffff",
          lineHeight: 90,
        },
        axisLabel: {
          color: "#80c5ff",
          fontSize: "14",
          margin: 30,
          interval: 0,
          formatter: function(value) {
            // return value + '\n{perce|95%}';
            return value;
          },
          rich: {
            perce: {
              color: '#29efb7',
              fontSize: "14",
            }
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#406A92",
            width: 3,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#195384",
          },
        },
        data: ["2017年", "2017年", "2017年","2017年", "2017年",],
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        nameTextStyle: {
          fontSize: "16",
          color: "#80c5ff",
        },
        nameGap: 30,
        axisLabel: {
          show: false,
          formatter: "{value}",
          margin: 20,
          textStyle: {
            color: "#80c5ff",
            fontSize: "16",
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#406A92",
            width: 3,
          },
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ["rgba(128,160,176,.1)", "rgba(250,250,250,0)"],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#406A92",
          },
        },
      },
    ],
    series: [
      {
        "name": "作业面积（万亩）",
        type: "pictorialBar",
        symbolSize: [36, 14],
        symbolOffset: [0, -8],
        symbolPosition: "end",
        z: 12,
        tooltip: {
          show: false,
        },
        "label": {
          "normal": {
            "show": true,
            "position": "top",
            fontSize: "16",
            color: "#fff",
            textShadowColor: "#fff",
            textShadowBlur: 15,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0,
          },
        },
        color: "#158bff",
        data: [298, 300, 430,298, 300,],
      },
      {
        "name": "作业面积（万亩）",
        type: "pictorialBar",
        tooltip: {
          show: false,
        },
        symbolSize: [57, 20],
        symbolOffset: [0, 13],
        z: 10,
        itemStyle: {
          normal: {
            color: "transparent",
            borderColor: "#1382f2",
            borderType: "solid",
            borderWidth: 5,
          },
        },
        data: [298, 300, 430,298, 300,],
      },
      {
        "name": "作业面积（万亩）",
        type: "pictorialBar",
        tooltip: {
          show: false,
        },
        symbolSize: [72, 27],
        symbolOffset: [0, 18],
        z: 10,
        itemStyle: {
          normal: {
            color: "transparent",
            borderColor: "#1382f2",
            borderType: 'dashed',
            borderWidth: 5,
          },
        },
        data: [298, 300, 430,298, 300,],
      },
      {
        "name": "作业面积（万亩）",
        type: "pictorialBar",
        symbolSize: [36, 14],
        tooltip: {
          show: false,
        },
        symbolOffset: [0, 8],
        z: 12,
        "color": "#158bff",
        data: [298, 300, 430,298, 300,],
      },
      {
        "name": "作业面积（万亩）",
        type: "bar",
        "barWidth": "36",
        barGap: "10%",
        barCateGoryGap: "10%",
        itemStyle: {
          normal: {
            color: "#0e4c8a",
            opacity: 1,
          },
        },
        data: [298, 300, 430,298, 300,],
      },
    ],
  },
  workStaticOption: {
    tooltip: {
      showContent: true,
      trigger: 'axis',
      backgroundColor: 'rgba(8,36,68,.7)',
      color: '#fff',
      textStyle: {
        color: '#fff'
      },
    },
    legend: {
      data: ["作业总面积（万亩）", "合格面积"],
      top: "5%",
      right: '10',
      "icon": "rect",
      "itemWidth": 13,
      "itemHeight": 13,
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    grid: {
      left: '20%',
      right: '30%',
      top: '18%'
    },
    barWidth: 15,
    xAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变x轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: { //  改变x轴字体颜色和大小
        show: false
      }
    },
    yAxis: [
      {
        type: 'category',
        data: ['2009年', '2010年', '2011年', '2012年','2013年','2009年', '2010年', '2011年', '2012年','2013年'],
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: { //  改变y轴颜色
          show: false
        },
        axisLabel: {
          color: '#A7D6F4',
          fontSize: 14,
          formatter: '{value}年'
        },
      },
    ],
    series: [
      {
      type: 'bar',
      name: "作业总面积（万亩）",
      showBackground: true,
      backgroundStyle: {
        color: "#0c3252"
      },
      barWidth: 7,
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: [250, 0], //在上方显示
            textStyle: { //数值样式
              color: "#fff",
              fontSize: 14,
            }
          },
          barBorderRadius: [0, 3, 3, 0], // 圆角（左上、右上、右下、左下）
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#0063ec'
          }, {
            offset: 1,
            color: '#00c1fa'
          }]),
        }
      },
      data: [19, 29, 39, 81,56,19, 29, 39, 81,56]
    },
    ]
  },
  workStaticOption2: {
    tooltip: {
      showContent: true,
      trigger: 'axis',
      backgroundColor: 'rgba(8,36,68,.7)',
      color: '#fff',
      textStyle: {
        color: '#fff'
      },
    },
    legend: {
      data: ["作业总面积（万亩）", "合格面积"],
      top: "5%",
      right: '10',
      "icon": "rect",
      "itemWidth": 13,
      "itemHeight": 13,
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    grid: {
      left: '20%',
      right: '30%',
      top: '18%'
    },
    barWidth: 15,
    xAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变x轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: { //  改变x轴字体颜色和大小
        show: false
      }
    },
    yAxis: [
      {
        type: 'category',
        data: ['2009年', '2010年', '2011年', '2012年','2013年','2009年', '2010年', '2011年', '2012年','2013年'],
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: { //  改变y轴颜色
          show: false
        },
        axisLabel: {
          color: '#A7D6F4',
          fontSize: 14,
          formatter: '{value}年'
        },
      },
    ],
    series: [
      {
        type: 'bar',
        name: "作业总面积（万亩）",
        showBackground: true,
        backgroundStyle: {
          color: "#0c3252"
        },
        barWidth: 7,
        itemStyle: {
          normal: {
            label: {
              show: false, //开启显示
              position: 'right', //在上方显示
              textStyle: { //数值样式
                color: "rgba(250,250,250,0.6)",
                fontSize: 16,
                fontWeight: 600
              }
            },
            barBorderRadius: [0, 3, 3, 0], // 圆角（左上、右上、右下、左下）
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: '#0063ec'
            }, {
              offset: 1,
              color: '#00c1fa'
            }]),
          }
        },
        data: [19, 29, 39, 81,56,19, 29, 39, 81,56]
      },
      {
        type: 'bar',
        name: "合格面积",
        showBackground: true,
        backgroundStyle: {
          color: "#0c3252"
        },
        barWidth: 7,
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              formatter: function(value) {
                return value.value + '{perce|（'+value.name+'）}';
              },
              rich: {
                perce: {
                  color: '#29efb7',
                }
              },
              position: [250, -7], //在上方显示
              textStyle: { //数值样式
                color: "#fff",
                fontSize: 14,
              }
            },
            barBorderRadius: [0, 3, 3, 0], // 圆角（左上、右上、右下、左下）
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: '#1b9972'
            }, {
              offset: 1,
              color: '#29de90'
            }]),
          }
        },
        data: [12, 23, 35, 100,45,12, 23, 35, 100,45]
      }
    ]
  },
  areaWorkOption: {
    tooltip: {
      showContent: true,
      trigger: 'axis',
      backgroundColor: 'rgba(8,36,68,.7)',
      color: '#fff',
      textStyle: {
        color: '#fff'
      },
    },
    legend: {
      top: "0%",
      right: '10',
      "icon": "rect",
      "itemWidth": 13,
      "itemHeight": 13,
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    grid: {
      left: '33%',
      right: '25%',
      top: '10%',
      bottom: "10%",
      width: 220,
    },
    xAxis: [{
      splitLine: {
        show: false
      },
      type: 'value',
      show: false,
    }],
    yAxis: [{
      splitLine: {
        show: false
      },
      axisLine: { //y轴
        show: false
      },

      type: 'category',
      axisTick: {
        show: false
      },
      inverse: true,
      data: ['武汉市', '黄冈市', '鄂州市', '黄石市', '武汉市', '黄冈市', '鄂州市', '黄石市','武汉市', '黄冈市', '鄂州市', '黄石市', '武汉市', '黄冈市', '鄂州市', '黄石市',],
      axisLabel: {
        color: '#A7D6F4',
        fontSize: 14,
        margin: 20,
      },

    }],
    series: [
      {
        name: '作业总面积（万亩）',
        type: 'bar',
        barWidth: 7, // 柱子宽度
        showBackground: true,
        MaxSize: 0,
        backgroundStyle: {
          color: "#0c3151"
        },
        label: {
          show: true,
          color: '#A7D6F4',
          fontSize: 14,
          distance: 20, // 距离
          formatter: '{c} ', // 这里是数据展示的时候显示的数据
          align: "center",
          position: [270, 0]
        }, // 柱子上方的数值
        itemStyle: {
          barBorderRadius: [0, 3, 3, 0], // 圆角（左上、右上、右下、左下）
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#159dd2'
          }, {
            offset: 0.5,
            color: '#2db6ce'
          }, {
            offset: 1,
            color: '#48d0ca'
          }

          ], false), // 渐变
        },
        data: [400, 380, 360, 340, 320, 300, 280, 260,400, 380, 360, 340, 320, 300, 280, 260]
      },]
  },
  progressBarOption: {
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        detail: {
          formatter: '{value}%',
          fontSize: 16,
          color: "#FFFFFF",
          offsetCenter: [0, 0],
          fontWeight: 500,
        },
        radius: '100%',
        center: ["52%", "50%"],

        data: [{
          value: 0,
          name: '离线'
        }],
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          width: 7,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 1,
                  color: '#1bafff', // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: '#0d54ff', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          }
        },
        axisLine: {
          lineStyle: {
            width: 7,
            color: [[1, "#0c3251"]]
          },
        },
        title: {
          offsetCenter: [0, '70%'],
          fontSize: 12,
          fontWeight: 900,
          color: "#1aaaff"
        }
      },
    ]
  }
}