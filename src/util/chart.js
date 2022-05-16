import * as echarts from 'echarts';

export const initEcharts = (id, options, reszie = false) => {
    let dom = document.getElementById(id)
    if (!dom) {
        return
    }
    let echart = echarts.init(dom);
    echart.setOption(options, true);
    window.addEventListener('resize', () => {
        echart.resize();
    })
    if (reszie === true) {
        echart.resize();
    }
    return echart
}