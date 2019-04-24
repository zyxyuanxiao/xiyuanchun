// pages/shopDetail/assessList/assessList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assessList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAssessList()
  },
  // 获取商店的评价列表
  getAssessList: function() {
    app._api.getAssessList({
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }, res => {
      console.log(res)
      let assessList = res.data
      this.setData({
        assessList: res.data
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