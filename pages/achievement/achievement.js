import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
  },
  onLoad() {
    app._api.getAchievement({
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }, res => {
      // console.log(res)
      let chart = res.data
      console.log(chart)
      this.init(chart)
    })
  },
  onReady: function() {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');

  },

  // 点击按钮后初始化图表
  init: function(datas) {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, datas);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
});

function setOption(chart, datas) {
  const option = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: datas.xaxis_data,
      axisTick: {
        alignWithLabel: true
      }
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
      name: '当月收入',
      type: 'bar',
      barWidth: '50%',
      data: datas.series_data
    }]
  };

  chart.setOption(option);
}