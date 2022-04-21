import { getCenterByFeature } from "@map/js/feature";

let styleCache = {};

const machineTypeIcon = {
  1: 'img/machineType/icon-拖拉机.png',
  2: 'img/machineType/icon-插秧机.png',
  3: 'img/machineType/icon-稻麦收割机.png',
  4: 'img/machineType/icon-无人机.png',
  5: 'img/machineType/icon-穴直播机.png',
  6: 'img/machineType/icon-装载机.png',
  7: 'img/machineType/icon-玉米收割机.png',
  8: 'img/machineType/icon-甘蔗收割机.png',
  9: 'img/machineType/icon-烘干机.png',
  20: 'img/machineType/icon-喷雾机.png',
  21: 'img/machineType/icon-其他收割机.png'
}

// 湖北行政区划数据
export function getRegionData() {
  let item = {
    id: "region",
    name: "行政区划",
    isFit: false,
    dataSource: {
      type: "4",
      data: "data/hubei.geojson",
    },
    styles: (feature) => {
      // let name = feature.get("name");
      let styles = [
        {
          stroke: {
            color: "rgba(55, 232, 205, 1)",
            width: 2,
          },
          fill: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      ];
      return styles;
    },
  };
  return item;
}

//地图上加点标记
export function addPointsOnMap(
  {
    component,
    data,
    lonKey = "lon",
    latKey = "lat",
    icon,
    hoverIcon,
    dialogType,
  }) {
  if (!component || !Array.isArray(data)) {
    return;
  }
  let id = dialogType;
  let dataSource = {
    type: "1", // List
    data: data.map((x) => {
      return {
        ...x,
        geometryType: "Point",
        coordinates: [parseFloat(x[lonKey]), parseFloat(x[latKey])],
        dialogType: dialogType,
      };
    }),
    geometryKey: "geometryType",
  };
  let scale = dialogType == '农机' ? 1 : 0.9;

  if (!component.vectorDataSource[id]) {
    let item = {
      id: id,
      dataSource: dataSource,
      zindex: 99999,
      isFit: false,
      fitOption: {padding: [100, 100, 100, 100]},
      styles: (feature) => {
        let name = feature.values_.plateNumber;
        let machineIcon = '';
        if(feature.values_.machineType){
          machineIcon = machineTypeIcon[feature.values_.machineType];
        } else {
          machineIcon = icon;
        }
        let styles = [{
          icon:{
            src: machineIcon,
            scale: scale,
          }
        }];
        if(name){
          styles.push({
            text:{
              text: name.toString(),
              font: "normal 14px 微软雅黑",
              stroke: {
                color: "blue",
                width: 2
              },
              fill: {
                color: "white"
              },
              offsetX: 0,
              offsetY: -30
            }
          })
        }
        return styles;
      },
      // hoverStyles: (feature) => {
      //   let name = feature.values_.plateNumber;
      //   let styles = [{
      //     icon:{
      //       src: hoverIcon,
      //     }
      //   }];
      //   if(name){
      //     styles.push({
      //       text:{
      //         text: name.toString(),
      //         fill: {
      //           color: "#000"
      //         }
      //       }
      //     })
      //   }
      //   return styles;
      // },
      /*聚合图层样式*/
      clusterStyles: (feature) => {
        var size = feature.get("features").length;
        var style = styleCache[size];
        let sizeImg = ''
        if (size < 500) {
          sizeImg = 'img/cluster_1.png'
        } else if (size >= 500 && size < 2000) {
          sizeImg = 'img/cluster_2.png'
        } else {
          sizeImg = 'img/cluster_3.png'
        }
        if (!style) {
          style = {
            icon: {
              src: sizeImg,
            },
            text: {
              text: size.toString(),
              fill: {
                color: "#fff"
              },
              font: "normal 16px 思源黑体",
            }
          };
          styleCache[size] = style;
        }
        return style;
      }
    };
    component.$set(component.vectorDataSource, id, item)
    // component.vectorDataSource[id] = item;
  } else {
    let child = component.$refs[id][0];
    child.clear();
    child.addData(dataSource);
  }
}

//选项卡定位地图点信息
export function viewDmOnMap(
  {
    component,
    data,
    lonKey = "lon",
    latKey = "lat",
    id,
    isClick = false,
  }) {
  if (!component) {
    return;
  }
  let map = component;
  let coordinates = map.inputCoordinate([
    parseFloat(data[lonKey]),
    parseFloat(data[latKey]),
  ]);
  let feature;
  if(id) {
    feature = map.getFeatureById(id);
  } else {
    feature = map.getFeatureByCoordinate(coordinates, "id", data.id);
  }
  console.log(feature, 'lllllll')
  if (feature) {
    component.selectFeature = feature;
    let coordinate = getCenterByFeature(feature);
    if (coordinate && isClick) {
      // 弹窗
      component.$refs.popup.show(coordinate);
      // 视图居中
      map.getView().setCenter(coordinate);
    }
  }
}

//选项卡定位地图点信息弹出弹窗
export function viewOnMapPopup(
  {
    component,
    data,
    lonKey = "lon",
    latKey = "lat",
    isClick = false,
  }) {
  if (!component) {
    return;
  }
  let map = component.getMap();
  let coordinates = map.inputCoordinate([
    parseFloat(data[lonKey]),
    parseFloat(data[latKey]),
  ]);
  let feature = map.getFeatureByCoordinate(coordinates, "id", data.id);
  if (feature) {
    component.selectFeature = feature;
    let coordinate = getCenterByFeature(feature);
    if (coordinate && isClick) {
      // 弹窗
      // 视图居中
      // map.getView().setCenter(coordinate);
      map.getView().fit(feature.getGeometry(), {
        maxZoom: 15,
        duration: 500,
        callback: () => {
            // 弹出要素事件
            // this.handleClick({ coordinate: c }, feature);
          component.$refs.popup.show(coordinate);
        },
      });
    }
  }
}