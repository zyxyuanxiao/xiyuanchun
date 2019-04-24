const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const map = new QQMapWX({
  key: 'EUNBZ-MIEKW-LPMR7-ODGYY-IKEIH-Y3B4O'
});
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    video: true,
    bannerList: ['/images/index/banner.jpg'],
    goodsList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    let mids;
    if (options.mid) {
      mids = options.mid
    }
    self.getGoodsList()
    app.globalData.otherPage = null
    self.getIndexPage()
    let voice = '/images/7499.wav'

  },
  // 跳转到商品详情
  navToGoodsDetail: function(e) {
    const id = e.currentTarget.dataset.id
    let shop_id = e.currentTarget.dataset.shop_id
    wx.navigateTo({
      url: '/pages/commodity/commodity?goods_id=' + id + "&shop_id=" + shop_id,
    })
  },
  // 手动获取定位
  navToCity: function() {
    this.getLocation()
  },
  // 跳转到产品列表
  navToAbout() {
    wx.switchTab({
      url: '/pages/classify/classify',
    })
  },
  // 查看列表
  navToJoin(e) {
    console.log(e)
    let info = {
      id: e.currentTarget.dataset.id,
      title: e.currentTarget.dataset.title
    }
    wx.navigateTo({
      url: '/pages/classifyList/classifyList?info=' + JSON.stringify(info),
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
    let self = this;
    self.setData({
      video: true
    })
    self.getIndexPage()
    let mid = app.globalData.mid || wx.getStorageSync('mid') || ''
    if (mid == '') {
      app.getUserInfo(res => {
        console.log(res)
        app.globalData.mid = res.data.mid
        wx.setStorageSync('mid', res.data.mid)

        app.globalData.type = res.data.type
        wx.setStorageSync('type', res.data.type)
      })
    }
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
  // 获取首页的商品数据
  getIndexPage: function() {
    let self = this;
    let mid = app.globalData.mid || wx.getStorageSync('mid') || 'none'
    // console.log(Object.prototype.toString.call(mid))
    wx.getLocation({
      success: function(res) {
        // console.log(res)
        let lat = res.latitude;
        let lng = res.longitude;

        if (mid == 'none') {
          app.getUserInfo(res => {
            let mids = res.data.mid
            app._api.getIndexGoods({
              mid: mids,
              lat,
              lng
            }, res => {
              console.log(res)
              let goodsList = res.data
              for (let i = 0; i < res.data.length; i++) {
                goodsList[i].images = app._api.host + goodsList[i].images
              }
              console.log(goodsList)
              self.setData({
                goodsList
              })
            })
          })
          return false
        }
        app._api.getIndexGoods({
          mid,
          lat,
          lng
        }, res => {
          // console.log(res)
          let goodsList = res.data
          for (let i = 0; i < res.data.length; i++) {
            goodsList[i].images = app._api.host + goodsList[i].images
          }
          console.log(goodsList)
          self.setData({
            goodsList
          })
        })
      },
    })

  },
  // 获取首页的banner和视频
  getGoodsList: function() {
    app._api.getIndexBanner(res => {
      // console.log(res)
      let data = res.data
      data['banner_video'] = app._api.host + data['banner_video']

      for (let i = 0; i < data.banner.length; i++) {
        data.banner[i] = app._api.host + data.banner[i]
      }
      for (let i = 0; i < data.classify.length; i++) {
        data.classify[i].icon = app._api.host + data.classify[i].icon
      }
      // console.log(data)
      this.setData({
        data
      })
      // console.log(data)
    })
  },
  // 切换视频播放
  showVideo() {
    let self = this
    wx.showLoading({
      title: '请稍后...',
    })
    setTimeout(() => {
      wx.hideLoading()
      self.setData({
        video: !self.data.video
      })
    }, 500)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '',
      path: '',
      imageUrl: ""
    }
  }
})