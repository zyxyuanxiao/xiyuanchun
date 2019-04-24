// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.getUserInfo(res => {
      console.log(res)
      app.globalData.mid = res.data.mid
      wx.setStorageSync('mid', res.data.mid)

      app.globalData.type = res.data.type
      wx.setStorageSync('type', res.data.type)
      // 进行全局userInfo设置
      wx.switchTab({
        url: '/pages/index/index',
      })
    })
  },
  // 登录
  bindgetuserinfo(e) {
    console.log(e)
    let that = this;
    that.getLogin(e)
  },
  getLogin: function(info) {
    let that = this;
    console.log(app)
    app.getUserInfo(res => {
      console.log(res)
      app.globalData.mid = res.data.mid
      wx.setStorageSync('mid', res.data.mid)

      app.globalData.type = res.data.type
      wx.setStorageSync('type', res.data.type)
      // 进行全局userInfo设置
      wx.switchTab({
        url: '/pages/index/index',
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