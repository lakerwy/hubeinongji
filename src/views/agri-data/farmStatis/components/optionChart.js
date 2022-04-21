import * as echarts from 'echarts';

const value = [233, 233, 200, 180, 199, 233, 210, 180]
export default {
  LeftOption: {
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
        center: ["18%", "50%"],

        data: [{
          value: 0,
          name: '在线'
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
                  color: '#1b9571', // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: '#29e091', // 100% 处的颜色
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
          color: "#5ed9a3"
        }
      },
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
        center: ["84%", "50%"],
        data: [{
          value: 0,
          name: '报警'
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
                  color: '#ff846d', // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: '#ff626a', // 100% 处的颜色
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
          color: "#e97467"
        }
      }],
  },
  agriculOption: {
    tooltip: {
      trigger: 'item',
      showContent: true,
      backgroundColor: 'rgba(8,36,68,.7)',
      color: '#fff',
      textStyle: {
        color: '#fff'
      },
    },
    legend: {
      top: 0,
      with: 30,
      orient: 'vertical',
      fontSize: 50,
      right: 10,
      align: "left",
      textStyle: { //图例文字的样式
        color: '#aac2d6',
        fontSize: 14
      },
      icon: "square",
      itemStyle: {
        borderCap: "butt"
      },
      itemHeight: 12,
      itemWidth: 12,
      borderRadius: 0,
    },
    title: {
      show: true,
      text: "农机分类\n   详情",
      top: "38%",
      left: "32.7%",
      textStyle: {
        color: "#FFFFFF",
        fontSize: 15,
        lineHeight: 18
      }
    },
    series: [
      {
        name: '农机分类详情',
        type: 'pie',
        radius: ['40%', '55%'],
        center: ["40%", "45%"],
        avoidLabelOverlap: false,
        label: {
          trigger: "mousemove",
          normal: {
            show: true,
            // triggerOn: 'mousemove',
            formatter: params => {
              return (
                params.name + '' + params.percent.toFixed(0) + '%'
              )
            },
            textStyle: {
              // fontSize: this.standSize / 150,
              // color: "#fff"
              color: "inherit",
            },
            // padding: [0, 0, -20, 0],

          },
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            // length: 20,
            length2: 20
            // length: this.standSize / 50,
            // length2: this.standSize / 100,
          }
        },
        data: [
          {value: 1048, name: '无人机'},
          {value: 735, name: '玉米收割机'},
          {value: 580, name: '烘干机'},
          {value: 484, name: '喷杆喷雾机'},
          {value: 300, name: '拖拉机'},
          {value: 300, name: '插秧机'},
          {value: 300, name: '稻麦收割机'},
          {value: 300, name: '其他收割机'},
        ],
        itemStyle: {
          color: function(params){
            var colorlist = ['#00e8f0',"#6357fc","#c3c24a","#08c29c","#2a61e4","#8267f8","#9ee655","#00a2ff"]
            return colorlist[params.dataIndex]
          }
        }
      }
    ]
  },
  machToolOption: {
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
      show: false
    },
    grid: {
      left: '25%',
      right: '20%',
      top: '6%',
      bottom: "10%",
      width: 230,
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
      data: ['拖拉机机具', '松深机', '旋耕机', '灭茬机', '播种机', '耕地犁', '翻转犁', '打捆机'],
      axisLabel: {
        color: '#A7D6F4',
        fontSize: 14,
        margin: 20,
      },

    }],
    series: [
      {
        name: '农机数量',
        type: 'bar',
        barWidth: 10, // 柱子宽度
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
          // position:"right"
          position: [260, 0]
        }, // 柱子上方的数值
        itemStyle: {
          barBorderRadius: [0, 0, 0, 0], // 圆角（左上、右上、右下、左下）
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#005BB1'
          }, {
            offset: 0.8,
            color: '#51C5FD'
          }, {
            offset: 1,
            color: '#51C5FD'
          }

          ], false), // 渐变
        },
        data: [400, 380, 360, 340, 320, 300, 280, 260]
      },]
  },
  areaOption: {
    tooltip: {
      showContent: true,
      trigger: 'axis',
      backgroundColor: 'rgba(8,36,68,.7)',
      color: '#fff',
      textStyle: {
        color: '#fff'
      },
    },
    textStyle: {
      "color": "#c0c3cd",
      "fontSize": 14
    },
    legend: {
      "top": "4%",
      left: '75%',
      "itemWidth": 13,
      "itemHeight": 13,
      itemStyle: {
        color: "#24C384"
      },
      "icon": "rect",
      "padding": 0,
      textStyle: {
        "color": "#c0c3cd",
        fontSize: 14,
        "padding": [2, 0, 0, 0]
      }
    },
    grid: {
      top: '23%',
      left: '14%',
      bottom: '20%',
      right: '10%'
    },
    xAxis: {
      nameTextStyle: {
        "color": "#c0c3cd",
        "padding": [0, 0, -10, 0],
        "fontSize": 14
      },
      axisLabel: {
        interval: 0,
        rotate: '45',
        textStyle: {
          color: '#639FD2' //坐标轴字颜色
        },
        margin: 15
      },
      axisTick: {
        show: false //隐藏X轴刻度
      },
      splitLine: {     //网格线
        "show": false
      },
      data: ["武汉", "恩施", "十堰", "宜昌", "黄石", "黄冈", "鄂州", "随州"],
      type: "category"
    },
    yAxis: {
      axisLine: {
        show: false, //隐藏X轴轴线
        lineStyle: {
          color: '#11417a'
        }
      },
      axisTick: {
        show: false //隐藏X轴刻度
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {     //网格线
        "show": false
      }
    },
    series: [
      {
        name: '农机数量(辆)',
        data: [200, 85, 112, 275, 305, 415, 741, 405],
        "type": "bar",
        "showBackground": true,
        backgroundStyle: {
          color: "#0c3252"
        },
        "barMaxWidth": "auto",
        "barWidth": 7,
        "itemStyle": {
          barBorderRadius: [7, 7, 0, 0], // 圆角（左上、右上、右下、左下）
          "color": {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
              "offset": 0,
              "color": "#0b9eff"
            }, {
              "offset": 1,
              "color": "#63caff"
            }]
          }
        },
        "label": {
          "show": false,
          "position": "top",
          "distance": 10,
          "color": "#fff"
        }
      },
    ],
  },
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
      name: "作业面积(亩)",
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
  },
  terminalOption: {
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
      top: "4%",
      right: '5%',
      itemWidth: 13,
      itemHeight: 13,
      itemStyle: {
        color: "#24C384"
      },
      icon: "rect",
      padding: 0,
      textStyle: {
        color: "#c0c3cd",
        fontSize: 14,
        padding: [2, 0, 0, 0]
      }
    },
    grid: [
      // 左边柱子
      {
        show: false,
        left: '12%',
        top: '20%',
        bottom: '0',
        width: '28%'
      },
      // 右边柱子
      {
        show: false,
        left: '62%',
        top: '20%',
        bottom: '0',
        width: '28%'
      }
    ],
    xAxis: [
      {
        gridIndex: 0,
        show: false,
      },
      {
        gridIndex: 1,
        show: false,
        max: 100,
      }
    ],
    yAxis: [
      {
        gridIndex: 0,
        type: 'category',
        inverse: true,
        position: 'left',
        offset: 30,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          align: 'left',
          textStyle: {
            color: '#66cc00',

          },
          formatter: function (value, index) {
            var num = ''
            var str = '';
            num = (index + 1);
            if (index === 0) {
              str = '{num1|' + num + '}'
            } else if (index === 1) {
              str = '{num2|' + num + '}'
            } else if (index === 2) {
              str = '{num3|' + num + '}'
            } else {
              str = '{num|' + num + '}'
            }
            return str;

          },
          rich: {
            num: {
              color: '#fff',
              backgroundColor: {
                image: 'img/icon_terminal4.png'
              },
              width: 24,
              height: 24,
              fontSize: 16,
              align: 'center',
            },
            num1: {
              color: '#fff',
              backgroundColor: {
                image: 'img/icon_terminal1.png'
              },
              width: 24,
              height: 24,
              fontSize: 16,
              align: 'center',
              borderRadius: 100
            },
            num2: {
              color: '#fff',
              backgroundColor: {
                image: 'img/icon_terminal2.png'
              },
              width: 24,
              height: 24,
              fontSize: 16,
              align: 'center',
              borderRadius: 100
            },
            num3: {
              color: '#fff',
              backgroundColor: {
                image: 'img/icon_terminal3.png'
              },
              width: 24,
              height: 24,
              fontSize: 16,
              align: 'center',
              borderRadius: 100
            },
          }
        },
        data: ['2', '3', '4', '5',]
      },
      {
        gridIndex: 1,
        type: 'category',
        inverse: true,
        position: 'left',
        offset: 30,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          align: 'left',
          textStyle: {
            color: '#66cc00',
          },
          formatter: function (value, index) {
            var num = ''
            var str = '';
            num = (index + 5);
            str = '{num|' + num + '}'

            return str;

          },
          rich: {
            num: {
              color: '#fff',
              backgroundColor: {
                image: 'img/icon_terminal4.png'
              },
              width: 24,
              height: 24,
              fontSize: 16,
              align: 'center',
            },
          }
        },
        data: ['1', '2', '3', '4',]
      }
    ],
    series: [
      {
        name: '终端数量(个)',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        barWidth: 5,
        showBackground: true,
        backgroundStyle: {
          color: '#073461',
        },
        itemStyle: {
          normal: {
            color: '#26d18a'
          }
        },
        label: {
          normal: {
            show: true,
            formatter: (series) => {
              // return '品牌' + series.name;
              return '{name|'+series.name+'}'+'{value|'+series.value+'}'
            },
            rich: {
              name: {
                width: 140,
                padding: [-18,0,0,0]
              },
              value: {
                padding: [18,0,0,0],
              }
            },
            position: 'insideTopLeft',
            textStyle: {
              color: '#80c5ff',
              fontSize: 12
            },
            offset: [0, -25]
          }
        },
        data: [
          {value: 50,name: 1234566},
          {value: 50,name: 12345},
          {value: 50,name: 12345},
          {value: 50,name: 12345},
        ]
      },
      {
        name: '终端数量(个)',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        showBackground: true,
        backgroundStyle: {
          color: '#073461',
        },
        barWidth: 5,
        label: {
          normal: {
            show: true,
            formatter: series => {
              return '{name|'+series.name+'}'+'{value|'+series.value+'}'
            },
            rich: {
              name: {
                width: 140,
                padding: [-18,0,0,0]
              },
              value: {
                padding: [18,0,0,0],
              }
            },
            position: 'insideTopLeft',
            textStyle: {
              color: '#80c5ff',
              fontSize: 12
            },
            offset: [0, -25]
          }
        },
        itemStyle: {
          normal: {
            color: '#26d18a'
          }
        },
        data: [
          {value: 50,name: 1234566},
          {value: 50,name: 12345},
          {value: 50,name: 12345},
          {value: 50,name: 12345},
        ]
      }
    ]
  },
}