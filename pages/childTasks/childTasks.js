// pages/childTasks/childTasks.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    childOrder: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let orderId = options.orderId;
    let serverid = options.serverid;
    this.setData({
      orderId,
      serverid,
      options
    })
    this.getParentOrder(orderId)
    this.getChildTasks(orderId)
  },
  // 获取订单下面的子订单的状态
  getChildTasks(orderId) {
    app._api.getChildOrder({
      order_id: orderId
    }, res => {
      console.log(res)
      let childOrder = res.data
      this.setData({
        childOrder
      })
    })
  },
  //获取订单详情
  getParentOrder(orderId) {
    app._api.getOrderDetail({
      order_id: orderId
    }, res => {
      // console.log(res)
      let order = res.data
      // console.log(order)
      this.setData({
        order
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