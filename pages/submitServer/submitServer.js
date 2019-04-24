// pages/submitServer/submitServer.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let server_id = options.sifu
    this.setData({
      server_id
    })
  },
  //获取预约时间
  bindTjsTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 选择预约地点
  chooseStart(e) {
    let self = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        self.setData({
          address: res.address,
          lat: res.latitude,
          lng: res.longitude
        })
      },
    })
  },
  // 提交申请
  submitSub(e) {
    console.log(e)
    let {
      name,
      phone,
      startAd,
      startTime
    } = e.detail.value
    let data = {
      member_id: app.globalData.mid || wx.getStorageSync('mid'), //  消费用户id
      receive_name: name, // 下单人姓名
      receive_tel: phone, // 下单人电话
      receive_address: startAd, // 下单人地址,
      goods_id: 0, //     商品id
      buy_number: 0 // 购买数量
    }
    app._api.redictToBuy(data, res => {
      // console.log(res)
      let order_id = res.data
      let month = util.formatYear(new Date())
      let time3 = new Date(month + ' ' + startTime); // 将指定日期转换为标准日期格式。
      time3 = (time3.getTime()) / 1000
      console.log(time3)

      let tjsinfo = {
        mid: app.globalData.mid || wx.getStorageSync('mid'), //  下单人用户id
        order_id, // 订单id
        time2: time3, //              预约时间(10位时间戳)
        server_ids: this.data.server_id, //         出发地址, 多个用逗号隔开
      }
      if (tjsinfo.time2 == '') {
        wx.showToast({
          title: '请选择调酒师预约时间',
          icon: "none"
        })
        return false
      }
      console.log(tjsinfo)
      app._api.addTjsOrder(tjsinfo, res => {
        console.log('调酒师返回的信息:', res)
        if (res.status == 1) {
          wx.showToast({
            title: res.msg,
            // icon: "none"
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            })
          }, 2000)
          // return false
        }
      })
    })
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