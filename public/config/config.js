window.globalUrl = {
  HOME_API: '/', // api后缀要带 /
  DETAIL_API: 'api_detail', //农机详情
}


window.global = {
  view: {
    zoom: 7.5,
    center: [112.23180806, 31.03476383]
  },
  layers: [
    // {
    //   name: "矢量",
    //   icon: "",
    //   data: [
    //     {
    //       type: "xyz",
    //       url:
    //         "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
    //       projection: "EPSG:3857"
    //     },
    //     {
    //       type: "xyz",
    //       url:
    //         "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
    //       projection: "EPSG:3857"
    //     }
    //   ]
    // },
    {
      name: "栅格",
      icon: "",
      data: [
        {
          type: "xyz",
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=c96efe76d453095433f941beb574e921 ",
          projection: "EPSG:3857"
        },
        {
          type: "xyz",
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=c96efe76d453095433f941beb574e921 ",
          projection: "EPSG:3857"
        }
      ]
    }
  ],
  xzqh:{
    type: "arcgis",
    url:
      "/arcgis/rest/services/nongjiProject/boundary/MapServer",
    sheng: 0,
    shi: 1,
    xian: 2,
    adcode:"adcode",
  }
};