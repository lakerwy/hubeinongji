/**
 *  函数防抖
 *  @param {Function} func  包装的函数
 *  @param {num} delay      延迟时间
 *  @param {boolean} immediate 第一次滚动会执行两次  开始滚动和结束滚动的时候
 *  @return {*}
 */

export function debounce(func, delay, immediate = false) {
  let timer, context = this
  return (...args) => {
    if (immediate) {
      func.apply(context, args)
      immediate = false
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

//节流
export function throttle(func, wait) {
  let previous = 0;
  return function() {
    let now = Date.now();
    let context = this;
    let args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}