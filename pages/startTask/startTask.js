// pages/startTask/startTask.js
const app = getApp()
const util = require('../../utils/util.js')

const priceTJS = 500 //(按等级分))
const priceZF = 50 //免费时间内
const priceZF2 = 60
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 2,
    buttStatus: false,
    order_id: 17,
    nowPrice: 0,
    stop: false,
    hidden: false,
    callTime: 0,
    nowTimes: '',
    endStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    console.log(options)
    app.globalData.otherPage = true
    self.getOrderList(2)
    let type = app.globalData.type || wx.getStorageSync('type')
    let order_id = options.orderId
    let distance = options.distance
    let status = options.status
    self.setData({
      type,
      distance,
      order_id
    })
    if (status == 4) {
      self.setData({
        buttStatus: true,
        hidden: false
      })
    }
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
      that.setData({
        orderList: info
      })
      if (info.length == 0) {
        return void 0
      }
      if (info[0].status_number == 4) {
        setInterval(() => {
          let endStatus = that.data.endStatus
          if (endStatus) {
            return false
          }
          app._api.getMyOrderLists(data, res => {
            console.log(res.data)
            let info = res.data
            if (info.length == 0) {
              return false
            }
            let time_money = info[0].time_price
            console.log(time_money)
            that.setData({
              nowPrice: time_money
            })
          })
          let startTimes = info[0].begin_time //开始时间
          startTimes = new Date(startTimes).getTime() //开始时间的时间戳
          let nowTime = new Date().getTime() //当前时间的时间戳 (毫秒级)
          // console.log(nowTime)
          // 当前时间的具体格式
          let nowTimes = util.formatTime(nowTime / 1000)
          // console.log(nowTimes)
          let between = parseInt((nowTime - startTimes) / 1000)
          // console.log(between)
          let type = info[0].type
          that.setData({
            nowTimes
          })

          return false
          if (type == 2) {
            // 调酒师的价钱
            let degree = info[0].degree //调酒师的等级
            let nowPrice = priceTJS * parseFloat(degree) * (between / (60 * 60))
            this.setData({
              nowPrice: nowPrice.toFixed(2)
            })
          } else if (type == 3) {
            let zfprice = 0
            if (between <= 60 * 60) {
              zfprice = 50
            } else if ((60 * 60) < between <= 2 * 60 * 60) {
              zfprice = 100
            } else if (between > 2 * 60 * 60) {
              zfprice = 100 + (between - 2 * 60 * 60) * (priceZF2 / (60 * 60))
            }
            let nowPrice = zfprice.toFixed(2)
            this.setData({
              nowPrice
            })
          }


        }, 1000)
      }
    })

  },
  // 业务员开始操作（记录时间）
  startTask(e) {
    // console.log(e)
    let self = this
    let type = e.currentTarget.dataset.type
    let distance = self.data.distance
    if (type == 'start' || distance <= 1000) {

      let status = self.data.status
      let data = {
        mid: app.globalData.mid || wx.getStorageSync("mid"), //   服务人员用户id
        status: 3, // 1接受订单  2拒绝订单 3开始服务 4结束服务
        order_detail_id: self.data.order_id, //  子订单id
      }
      console.log(data, type)
      // return false
      app._api.getAnticipate(data, res => {
        console.log(res)
        if (res.status == 1) {
          wx.showToast({
            title: '开始计费',
            icon: "none"
          })
          self.getOrderList(2)
          let startTime = util.formatTime(res.data)
          self.setData({
            buttStatus: true,
            status: 4,
            startTime,
            times: res.data
          })
        }
      })


    }
    if (type == 'end') {
      let status = self.data.status
      let data = {
        mid: app.globalData.mid || wx.getStorageSync("mid"), //   服务人员用户id
        status: 4, // 1接受订单  2拒绝订单 3开始服务 4结束服务
        order_detail_id: self.data.order_id, //  子订单id
      }
      console.log(data)
      app._api.getAnticipate(data, res => {
        console.log(res)
        if (res.status == 1) {
          wx.showToast({
            title: '结束成功',
            // icon: "none"
          })
          let endTime = util.formatTime(res.data)
          self.setData({
            endTime,
            endStatus: true
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            })
          }, 3000)
        }
      })
    } else {
      wx.showToast({
        title: '距离服务点太远，不能操作',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.otherPage = null
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})