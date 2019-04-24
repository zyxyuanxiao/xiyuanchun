// pages/show/show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: [{
        id: '1',
        cover: '/images/show/01.jpg',
        name: '卢卡斯',
        assess: 5,
        goodfor: '鸡尾酒，起泡酒，果酒',
        price: '200-500'
      },
      {
        id: '2',
        cover: '/images/show/02.jpg',
        name: '托尼',
        assess: 3,
        goodfor: '鸡尾酒，起泡酒，果酒',
        price: '200-500'
      }
    ],
    pages: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    self.getList()
  },
  getList() {
    app._api.getServicesList({}, res => {
      console.log(res)
      let list = res.data
      for(var i =0;i<list.length;i++){
        list[i].photo = app._api.host + list[i].photo
      }
      this.setData({
        showList:list
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