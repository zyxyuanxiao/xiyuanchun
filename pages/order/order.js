const app = getApp()
Page({
  data: {
    orderList: [],
    type: 0,
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    appointmentList: []
  },
  onLoad: function(options) {
    // console.log(options)
    let type = options.type
    console.log(type)
    this.setData({
      currentTab: type,
      scrollLeft: type
    })
    this.getOrderList(parseInt(type) + 2 || 2)
  },
  // 用户的确认收货
  receive(e) {
    let self = this;
    let order_id = e.currentTarget.dataset.order_id
    app._api.receiveGoods({
      order_id
    }, res => {
      if (res.status == 1) {
        wx.showToast({
          title: '收货成功',
        })
        setTimeout(() => {
          let currentTab = self.data.currentTab
          self.getOrderList(parseInt(currentTab) + 2)
        }, 2000)
      }
    })
  },
  // 用户取消订单
  cancel(e) {
    let self = this;
    let order_id = e.currentTarget.dataset.order_id
    app._api.cancelGoods({
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      order_id
    }, res => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '取消订单成功',
        })
        setTimeout(() => {
          let currentTab = self.data.currentTab
          self.getOrderList(parseInt(currentTab) + 2)
        }, 2000)
      }
      if (res.status == 3) {
        wx.showToast({
          title: res.msg,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
    console.log(e.detail.current)
    let status = 2
    if (e.detail.current == 1) {
      status = 3
    }
    if (e.detail.current == 2) {
      status = 4
    }
    if (e.detail.current == 3) {
      status = 5
    }
    // if (e.detail.current == 4) {
    //   status = 6
    // }
    console.log(status)

    this.getOrderList(status)
  },
  // 获取订单列表
  getOrderList(type) {
    let that = this;
    let status = type
    // console.log(mid,status)
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      status
    }
    console.log(data)
    app._api.getOrderList(data, res => {
      console.log(res)
      let orderList = res.data
      orderList.forEach((val, index) => {
        val.goods.forEach((val2, index) => {
          // console.log(val2)
          val2.images = app._api.host + val2.images
        })
      })
      console.log(orderList)
      this.setData({
        orderList: res.data
      })
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    let self = this;
    var cur = e.target.dataset.current;
    console.log(cur, self.data.currentTab)
    if (self.data.currentTab == cur) {
      return false;
    } else {
      self.setData({
        currentTab: cur
      })
    }
    // 获取订单列表
    // this.requireList(cur)
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  footerTap: app.footerTap,
  // 跳转到我的订单详情界面
  navToDetail: function(e) {
    console.log(e)
    let orderId = e.currentTarget.dataset.orderid;
    let serverid = e.currentTarget.dataset.serverid || ""
    wx.navigateTo({
      url: '/pages/childTasks/childTasks?orderId=' + orderId + '&serverid=' + serverid,
    })
  },

  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    let currentTab = this.data.currentTab
    this.getOrderList(parseInt(currentTab) + 2)
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})