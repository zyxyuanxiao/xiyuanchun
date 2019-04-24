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
    app._api.getMyOrderLists(data, res => {
      console.log(res.data)
      let info = res.data;
      for (var i = 0; i < info.length; i++) {
        info[i].images = app._api.host + info[i].images
      }
      this.setData({
        orderList: info
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
    // console.log(e)
    let self = this;
    let status = e.currentTarget.dataset.status;
    let type = app.globalData.type || wx.getStorageSync("type")
    let refuse = status === "refuse" ? "2" : "1";
    let orderId = e.currentTarget.dataset.orderid;
    let currentTab = self.data.currentTab;

    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      status: refuse,
      order_detail_id: orderId
    }
    console.log(data)
    app._api.getAnticipate(data, res => {
      console.log(res)
      if (res.status == 0 || res.status == 2) {
        wx.showToast({
          title: '操作失败',
          icon: "none"
        })
      } else if (res.status == 1 && status == "accept") {
        wx.showToast({
          title: '接单成功',
        })
        setTimeout(() => {
          self.onShow()
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
  // 跳转到我的订单详情界面
  toStart: function(e) {
    console.log(e)
    let self = this;
    let orderId = e.currentTarget.dataset.orderid;
    let type = e.currentTarget.dataset.type;
    let lat = e.currentTarget.dataset.lat;
    let lng = e.currentTarget.dataset.lng;
    let status = e.currentTarget.dataset.status
    let distance = e.currentTarget.dataset.distance
    let location = {
      lat,
      lng
    }
    let aim_address = e.currentTarget.dataset.aim_address

    let toLocation = {
      lat: e.currentTarget.dataset.aimlat,
      lng: e.currentTarget.dataset.aimlng
    }
    location = JSON.stringify(location)
    toLocation = JSON.stringify(toLocation)
    let currentTab = self.data.currentTab;
    let address = e.currentTarget.dataset.address
    console.log(type)
    // return false
    //跳转到目的地
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?orderId=' + orderId + '&type=' + type + '&location=' + location + '&currentTab=' + currentTab + "&toLocation=" + toLocation + "&status=" + status + "&distance=" + distance + '&aim_address=' + aim_address,
      })
    } else {
      wx.navigateTo({
        url: '/pages/startTask/startTask?orderId=' + orderId + '&type=' + type + "&status=" + status + '&distance=' + distance,
      })
    }


    return false


    //待接收选项
    if (currentTab == 0) {
      wx.showModal({
        title: '提示',
        content: '是否接受任务',
        confirmText: "接受任务",
        success: res => {
          if (res.confirm) {
            app._api.getAnticipate({
              mid: app.globalData.mid || wx.getStorageSync('mid'),
              refuse: ""
            }, res => {
              if (res.status == 0) {
                wx.showToast({
                  title: '参数错误',
                  icon: "none"
                })
              } else if (res.status == 1) {
                wx.showToast({
                  title: '抢单成功',
                })
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/orderDetail/orderDetail?orderId=' + orderId + '&type=' + type + '&location=' + location + '&currentTab=' + currentTab,
                  })
                }, 2000)
              }
            })
          } else {
            app._api.getAnticipate({
              mid: app.globalData.mid || wx.getStorageSync('mid'),
              refuse: 1
            }, res => {
              if (res.status == 0) {
                wx.showToast({
                  title: '参数错误',
                  icon: "none"
                })
              } else if (res.status == 1) {
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
          }
        }
      })
    }
    if (currentTab == 1) {
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?orderId=' + orderId + '&currentTab=' + currentTab + '&location=' + location + '&address=' + address + '&type=' + type,
      })
    }
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