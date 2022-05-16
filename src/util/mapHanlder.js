import {getCenterByFeature} from "@map/js/feature";

let styleCache = {};

const machineTypeIcon2 = {
    1: {online: 'img/machineType/icon-machine-3.png', offline: 'img/machineOffline/icon-machine-3.png'},
    2: {online: 'img/machineType/icon-machine-4.png', offline: 'img/machineOffline/icon-machine-4.png'},
    3: {online: 'img/machineType/icon-machine-9.png', offline: 'img/machineOffline/icon-machine-9.png'},
    4: {online: 'img/machineType/icon-machine-5.png', offline: 'img/machineOffline/icon-machine-5.png'},
    5: {online: 'img/machineType/icon-machine-10.png', offline: 'img/machineOffline/icon-machine-10.png'},
    6: {online: 'img/machineType/icon-machine-11.png', offline: 'img/machineOffline/icon-machine-11.png'},
    7: {online: 'img/machineType/icon-machine-7.png', offline: 'img/machineOffline/icon-machine-7.png'},
    8: {online: 'img/machineType/icon-machine-8.png', offline: 'img/machineOffline/icon-machine-8.png'},
    9: {online: 'img/machineType/icon-machine-6.png', offline: 'img/machineOffline/icon-machine-6.png'},
    20: {online: 'img/machineType/icon-machine-2.png', offline: 'img/machineOffline/icon-machine-2.png'},
    21: {online: 'img/machineType/icon-machine-1.png', offline: 'img/machineOffline/icon-machine-1.png'},
}

const machineTypeIcon = {
    1: 'img/machineType/icon-machine-3.png',
    2: 'img/machineType/icon-machine-4.png',
    3: 'img/machineType/icon-machine-9.png',
    4: 'img/machineType/icon-machine-5.png',
    5: 'img/machineType/icon-machine-10.png',
    6: 'img/machineType/icon-machine-11.png',
    7: 'img/machineType/icon-machine-7.png',
    8: 'img/machineType/icon-machine-8.png',
    9: 'img/machineType/icon-machine-6.png',
    20: 'img/machineType/icon-machine-2.png',
    21: 'img/machineType/icon-machine-1.png'
}

// 湖北行政区划数据
export function getRegionData() {
    let item = {
        id: "region",
        name: "行政区划",
        isFit: false,
        visible: true,
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
        parameters
    }) {
    if (!component || !Array.isArray(data)) {
        return;
    }
    let dataSource = {
        type: "1",
        data: data.map((x) => {
            if (x.machineStatus) {
                x.status = x.machineStatus;
            }
            return {
                ...x,
                geometryType: "Point",
                coordinates: [parseFloat(x[lonKey]), parseFloat(x[latKey])],
                dialogType: parameters.type,
            };
        }),
        geometryKey: "geometryType",
    };
    let vectorData = parameters.isCluster ? 'vectorClusterDataSource' : 'vectorDataSource';
    if (!component[vectorData][parameters.type]) {
        let item = Object.assign({}, parameters, {
            dataSource: dataSource,
            fitOption: {padding: [100, 100, 100, 100]},
            styles: styles,
            clusterStyles: parameters.clusterStyleType === 1 ? clusterStyles1 : clusterStyles2
        })
        component.$set(component[vectorData], parameters.type, item)
    } else {
        let child = component.$refs[parameters.type];
        child.clear();
        child.addData(dataSource);
    }

    //非聚合样式
    function styles(feature, resolution) {
        return oneStyles(feature, resolution, icon, parameters.iconScale,true)
    }

    /*聚合图层样式1*/
    function clusterStyles1(feature, resolution) {
        return MoreClusterStyles(feature, resolution, icon, parameters.iconScale, 1)
    }

    /*聚合图层样式2*/
    function clusterStyles2(feature, resolution) {
        return MoreClusterStyles(feature, resolution, icon, parameters.iconScale, 2)
    }

}

export function oneStyles(feature, resolution, icon, scale, showname = false) {
    let isShowName = (showname) || (resolution < 80 ? true : false);
    let name = feature.values_.plateNumber;
    let machineIcon = '';
    if (feature.values_.machineType) {
        let machineStatus = feature.values_.status;
        if (machineStatus == '离线') {
            machineIcon = machineTypeIcon2[feature.values_.machineType].offline;
        } else {
            machineIcon = machineTypeIcon2[feature.values_.machineType].online;
        }
    } else {
        machineIcon = icon;
    }
    let styles = [{
        icon: {
            src: machineIcon,
            scale: scale,
        }
    }];
    if (name && isShowName) {
        styles.push({
            text: {
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
}

export function MoreClusterStyles(feature, resolution, icon, scale, clusterType) {

    //聚合并且显示聚合数字
    if (clusterType === 1) {
        var size = feature.get("features").length;
        var style = styleCache[size];
        let sizeImg = ''
        if (size < 10) {
            var features = feature.get('features')
            features.forEach((val) => {
                //const oneFeature = feature.get('features')[0];
                style = oneStyles(val, resolution, icon, scale,size===1)
            })
        } else if (size < 500) {
            sizeImg = 'img/cluster_1.png'
        } else if (size >= 500 && size < 2000) {
            sizeImg = 'img/cluster_3.png'
        } else {
            sizeImg = 'img/cluster_4.png'
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
        //聚合，但只用图标展示
    } else if (clusterType === 2) {
        let styles = [{
            icon: {
                src: icon,
                scale: scale,
            }
        }];
        return styles;
    }
}

//生产资源地图上加点标记
export function addPointsProduct(
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
            styles: styles,
            /*聚合图层样式*/
            clusterStyles: clusterStyles,
        };
        component.$set(component.vectorDataSource, id, item)
    } else {
        let child = component.$refs[id][0];
        child.clear();
        child.addData(dataSource);
    }

    //非聚合样式
    function styles(feature, resolution) {
        return oneStyles(feature, resolution, icon, scale)
    }

    /*聚合图层样式*/
    function clusterStyles(feature, resolution) {
        return MoreClusterStyles(feature, resolution, icon, scale)
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
    if (id) {
        feature = map.getFeatureById(id);
    } else {
        feature = map.getFeatureByCoordinate(coordinates, "id", data.id);
    }
    //console.log(feature, 'lllllll')
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