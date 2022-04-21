import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import { appendParams } from "ol/uri";
import { Tile as TileLayer } from "ol/layer";
import { transformExtent } from "ol/proj";

import { DEFAULT_PROJECTION } from "../common";
import DxGeoServerImageLayer from "./geoserverImageLayer";
import LAYER_DATA_TYPE from './layerDataType';

/**
 * @param  {Object} options
 * @param {string} options.url - WMTS服务
 * @param {string} options.layers - 服务Identifier
 * @param {string} options.matrixSet
 * @param {string} options.projection
 * @param {string} [options.style]
 * @param {string} [options.format]
 * @param {boolean} [crossOrigin] - 跨域，跨域访问时需配置
 * @property {Object} [imageOptions] - ol/layer/image其他参数，用于扩展
 */
export async function getGeoServerLayer(options) {
  options = { ...options };

  if (!options.url || !options.layers) {
    return null;
  }

  let layer = null;
  if (options.matrixSet) {
    let info = await getWMTSLayerInfo(options);
    if (info) {
      info.urls = [options.url]; // 采用代理地址
      layer = new TileLayer({
        source: new WMTS(info),
        layerDateType:LAYER_DATA_TYPE.TILE,
      });

      if (layer) {
        layer.defaultExtent = transformExtent(
          info.tileGrid.extent_,
          info.projection,
          DEFAULT_PROJECTION
        );
      }
    }
  } else {
    layer = new DxGeoServerImageLayer({
      ...options,
      restOption: { styles: options.style, format: options.format }
    });
  }
  return layer;
}

/**
 * @param  {Object} options
 * @param {string} options.url - WMTS服务
 * @param {string} options.layers - 服务Identifier
 * @param {string} [options.matrixSet]
 * @param {string} [options.projection]
 * @param {string} [options.style]
 * @param {string} [options.format]
 */
export async function getWMTSLayerInfo(options) {
  options = { ...options };

  let url = options.url;

  let layers = options.layers;

  let metaXmlUrl = appendParams(url, {
    Service: "WMTS",
    request: "GetCapabilities"
  });

  try {
    let response = await fetch(metaXmlUrl);
    let text = await response.text();

    let result = new WMTSCapabilities().read(text);
    let info = optionsFromCapabilities(result, {
      layer: layers,
      matrixSet: options.matrixSet,
      format: options.format
    });
    return info;
  } catch (error) {
    return null;
  }
}
