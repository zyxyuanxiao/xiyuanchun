// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: "/images/user/avatar.jpg",
      nickName: '姓名',
      province: '四川成都'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    let mid = app.globalData.mid || wx.getStorageSync('mid')
    let type = app.globalData.type || wx.getStorageSync('type')
    self.setData({
      userInfo,
      app,
      mid,
      type
    })
  },
  // 跳转到购物车
  navToMyCart() {
    wx.navigateTo({
      url: '/pages/mycart/mycart',
    })
  },
  // 跳转到我的订单(用户)
  navToNav: function(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/order/order?type=${type}`,
    })
  },
  // 跳转到我的订单（员工）
  navToMyorder() {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  // 跳转到我的业绩
  navToMyAchieve() {
    wx.navigateTo({
      url: '/pages/achievement/achievement',
    })
  },
  // 调转到我的评价列表
  navToAssessList: function() {
    wx.navigateTo({
      url: '/pages/assessList/assessList',
    })
  },
  // 跳转到申请专服
  navToApply: function() {
    wx.navigateTo({
      url: '/pages/apply/apply',
    })
  },
  // 跳转到常见问题
  navToQuestion: function() {
    wx.navigateTo({
      url: '/pages/question/question',
    })
  },
  // 跳转到问题反馈
  navToFeedBack: function() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  // 跳转到我的钱包
  navToWallent() {
    wx.navigateTo({
      url: '/pages/myWallet/myWallet',
    })
  },
  // 跳转到我的预约
  navToMySub() {
    wx.navigateTo({
      url: '/pages/subscribe/subscribe',
    })
  },
  // 跳转到用户的设置
  navToSetted() {
    wx.navigateTo({
      url: '/pages/setted/setted',
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