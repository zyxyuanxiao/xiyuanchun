// pages/classifyList/classifyList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 0,
    List: [],
    Cid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    let info = JSON.parse(options.info)
    wx.setNavigationBarTitle({
      title: info.title,
    })
    let Cid = info.id
    this.getList(Cid)
    this.setData({
      Cid
    })
  },
  getList(Cid) {
    let data = {
      classify_id: Cid,
      start_number: 10 * this.data.pages,
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }
    console.log(data)
    app._api.getClassifyList(data, res => {
      console.log(res)
      let oldList = this.data.List
      let newList = res.data
      if (newList.length == 0) {
        wx.showToast({
          title: '我也是有底线的',
          icon: "none"
        })
        return false
      }
      for (var i = 0; i < newList.length; i++) {
        newList[i].images = app._api.host + newList[i].images
      }
      let goodsList = oldList.concat(newList)
      console.log(goodsList)
      this.setData({
        goodsList
      })
    })
  },
  // 跳转到商品详情
  navToGoodsDetail: function(e) {
    const id = e.currentTarget.dataset.id
    let shop_id = e.currentTarget.dataset.shop_id
    wx.navigateTo({
      url: '/pages/commodity/commodity?goods_id=' + id + "&shop_id=" + shop_id,
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
    let pages = this.data.pages
    pages++
    this.setData({
      pages
    })
    console.log('到底啦')
    this.getList(this.data.Cid)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})