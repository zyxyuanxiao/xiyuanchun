const app = getApp()

Page({

  data: {
    curIndex: 0,
    toView: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    let that = this;
    that.getClassifyList()
  },
  /**
   * 获取列表
   */
  getClassifyList: function(fid) {
    let self = this;
    wx.getLocation({
      success: function(res) {
        console.log(res)
        let lat = res.latitude;
        let lng = res.longitude;
        app._api.manuList({
          mid: app.globalData.mid || wx.getStorageSync('mid'),
          lat,
          lng
        }, res => {
          console.log(res)
          let allData = res.data
          if (res.data == "") {
            return false
          }
          let menu = allData.map(item => {
            return item.name
          })
          // return false
          allData.forEach((val, index) => {
            val.goods.forEach((value, index) => {
              value.images = app._api.host + value.images
            })
          })
          // console.log(allData)
          try {
            let goods = allData['0'].goods;
            // console.log(goods)
            self.setData({
              menu,
              goods,
              allData
            })
          } catch (err) {
            console.log(err)
          }
        })
      },
    })

  },
  // 滑动改变左侧
  getIndex(e) {
    // console.log(e)
    let index = e.detail.current;
    this.setData({
      curIndex: index,
      goods: []
    })
    let fid = e.currentTarget.dataset.id;
    let goods = this.data.allData[e.detail.current].goods
    // console.log(goods)
    this.setData({
      goods: goods
    })
  },
  /**
   * 选择分类的处理
   */
  switchCategory(e) {
    this.setData({
      goods: [],
      curIndex: e.currentTarget.dataset.index ? e.currentTarget.dataset.index : 0,
      toView: e.currentTarget.dataset.index,
    })
    let fid = e.currentTarget.dataset.id;
    let goods = this.data.allData[e.currentTarget.dataset.index].goods
    // console.log(goods)
    this.setData({
      goods: goods
    })
  },
  /**
   * 跳转到商品详情
   */
  productDetails(e) {
    let id = e.currentTarget.dataset.id;
    let shop_id = e.currentTarget.dataset.shop_id
    console.log(id)
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
    let that = this;
    that.getClassifyList()
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
})