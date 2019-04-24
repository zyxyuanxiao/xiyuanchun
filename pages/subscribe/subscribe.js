const app = getApp()
Page({
  data: {
    orderList: [],
    type: 1,
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    appointmentList: []
  },
  onLoad: function(options) {
    console.log(options)
    let type = options.type
    // console.log(type)
    if (type) {
      this.setData({
        currentTab: type,
        scrollLeft: type
      })
    }
    this.getOrderList(this.data.type)
    app.globalData.otherPage = true
  },
  // 拨打电话
  makePhone(e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone + '',
    })
  },
  // 用户取消预约单
  cancel(e) {
    let self = this;
    let order_detail_id = e.currentTarget.dataset.order_detail_id
    let type = e.currentTarget.dataset.type
    app._api.cancelServer({
      order_detail_id,
      type
    }, res => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '取消订单成功',
        })
        setTimeout(() => {
          let currentTab = self.data.currentTab
          self.getOrderList(parseInt(currentTab) + 1)
        }, 2000)
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
    // console.log(e.detail.current)
    let status = 1
    if (e.detail.current == 1) {
      status = 2
    }
    if (e.detail.current == 2) {
      status = 3
    }
    if (e.detail.current == 3) {
      status = 4
    }
    this.getOrderList(status)
  },
  // 获取订单列表
  getOrderList(status) {
    let that = this;
    let type = status || that.data.status
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      status: type
    }
    console.log(data)
    app._api.getUserSubOrder(data, res => {
      console.log(res.data)
      let info = res.data;
      // for (var i = 0; i < info.length; i++) {
      //   info[i].images = app._api.host + info[i].images
      // }
      let length = info.barman.length + info.driver.length + info.server.length + info.order.length
      this.setData({
        orderList: info,
        length
      })
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
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
  // 进行接单的操作
  operation(e) {
    console.log(e)
    let self = this;
    let status = e.currentTarget.dataset.status;
    let type = app.globalData.type || wx.getStorageSync("type")
    let refuse = status === "refuse" ? "1" : "";

    let orderId = e.currentTarget.dataset.orderid;
    let lat = e.currentTarget.dataset.lat;
    let lng = e.currentTarget.dataset.lng;
    let location = {
      lat,
      lng
    }
    location = JSON.stringify(location)
    let currentTab = self.data.currentTab;
    let address = e.currentTarget.dataset.address

    app._api.getAnticipate({
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      refuse
    }, res => {
      console.log(res)
      if (res.status == 0 || res.status == 2) {
        wx.showToast({
          title: '操作失败',
          icon: "none"
        })
      } else if (res.status == 1 && status == "accept") {
        wx.showToast({
          title: '抢单成功',
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?orderId=' + orderId + '&type=' + type + '&location=' + location + '&currentTab=' + currentTab,
          })
        }, 2000)
      } else if (res.status == 1 && status == "refuse") {
        wx.showToast({
          title: '拒绝成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: -1
          })
        }, 2000)
      }
    })
  },
  // 取消待派单的预约单
  cancelyy(e) {
    let self = this;
    let order_id = e.currentTarget.dataset.order_id
    let type = e.currentTarget.dataset.type
    let data = {
      order_id,
      type
    }
    console.log(data)
    app._api.cancelyy(data, res => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '取消成功',
        })
        setTimeout(() => {
          let currentTab = self.data.currentTab
          self.getOrderList(parseInt(currentTab) + 1)
        }, 2000)
      } else {
        wx.showToast({
          title: '取消失败',
          icon: "none"
        })
      }
    })
  },
  // 用户确认业务员的订单
  confirmTasks(e) {
    // console.log(e)
    let self = this
    let order_id = e.currentTarget.dataset.order_id
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      type: e.currentTarget.dataset.type,
      order_detail_id: order_id
    }
    app._api.confirmOrder(data, res => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '确认成功',
        })
        setTimeout(() => {
          self.getOrderList(3)
        }, 1000)
      }
    })
  },
  //用户去评价
  toAssess(e) {
    console.log(e)
    let server_mid = e.currentTarget.dataset.serverid;
    let orderid = e.currentTarget.dataset.order_id
    wx.navigateTo({
      url: '/pages/assess/assess?servermid=' + server_mid + '&orderid=' + orderid,
    })
  },
  // 未支付的订单进行支付
  payOrder(e) {
    // console.log(e)
    let that = this
    let order_id = e.currentTarget.dataset.order_id
    let type = e.currentTarget.dataset.type
    app._api.userPay({
      order_detail_id: order_id,
      type,
      mid: app.globalData.mid || wx.getStorageSync('mid')

    }, res => {
      console.log(res)
      let payParam = res.data.arr;
      wx.requestPayment({
        'timeStamp': payParam.timeStamp,
        'nonceStr': payParam.nonceStr,
        'package': payParam.package,
        'signType': payParam.signType,
        'paySign': payParam.paySign,
        success: function(res) {
          // console.log(res)
          if (res.errMsg == 'requestPayment:ok') {
            wx.showToast({
              title: '支付成功',
            })
            app._api.userResult({
              order_detail_id: order_id,
              type
            }, res => {
              console.log(res)
              if (res.status == 1) {
                that.getOrderList(3)
              }
            })
            // this.onLoad()
          }
        },
        fail: function(err) {
          // console.log(err)
          wx.showToast({
            title: '支付失败',
            icon: "none"
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            })
          }, 2000)
        }
      })
    })
  },

  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    let currentTab = this.data.currentTab
    this.getOrderList(parseInt(currentTab) + 1)
  },
  onHide: function() {
    // 页面隐藏
    // console.log('页面隐藏')
  },
  onUnload: function() {
    // 页面关闭
    // console.log('页面隐藏2')
    app.globalData.otherPage = null
  }
})