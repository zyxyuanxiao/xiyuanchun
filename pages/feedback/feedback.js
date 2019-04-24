// pages/feedback/feedback.js
const app = getApp()
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

  },
  // 提交反馈内容
  submitFeedBack(e) {
    // console.log(e)
    if (e.detail.value.feedback === '') {
      wx.showToast({
        title: '提交内容为空',
        icon: "none"
      })
      return false
    }
    app._api.submitFeedBack({
      feedback: e.detail.value.feedback,
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }, res => {
      // console.log(res)
      switch (res.status) {
        case 1:
          wx.showToast({
            title: '提交成功,谢谢您的反馈',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            })
          }, 2000)
          break
        case 2:
          wx.showToast({
            title: '请填写反馈信息',
            icon: "none"
          })
          break
        case 3:
          wx.showToast({
            title: '提交失败,请稍后重试',
            icon: "none"
          })
          break
      }
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