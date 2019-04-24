// pages/commodity/commodity.js
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js')
Page({

  data: {
    loading: true,
    buyNow: false,
    btnText: '加入购物车',
    imgUrls: "/images/detail/01.jpg",
    // 模拟商品数据
    commodity: {},
    goodsNum: 1
  },

  onLoad(options) {
    let that = this;
    let goods_id = options.goods_id
    let shop_id = options.shop_id
    /**获取商品详情 */
    app._api.getGoodsDetail({
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      goods_id,
      shop_id
    }, res => {
      console.log(res)
      if (res.status == 2) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
        // return false
        setTimeout(() => {
          wx.navigateBack({
            delta: -1
          })
        }, 2000)
        return false
      }
      let goodsDetail = res.data.goods
      // let type = res.data.type
      // console.log(goodsDetail)
      goodsDetail.images = app._api.host + goodsDetail.images
      for (let i = 0; i < goodsDetail.images_all.length; i++) {
        goodsDetail.images_all[i] = app._api.host + goodsDetail.images_all[i]
      }
      that.setData({
        goodsDetail,
        // type,
        info: res.data,
        goods_id
      })
      const article = goodsDetail.content_web
      WxParse.wxParse('article', 'html', article, that, 10)
    })
  },

  // 立即预约下单
  takeOrder: function() {
    let type = this.data.info
    type = JSON.stringify(type)
    wx.navigateTo({
      url: '/pages/takeOrder/takeOrder?type=' + type,
    })
  },
  // 
  onShow: function() {

  },
  //选择规格
  chooseSize(e) {
    // console.log(e)
    let sizeId = e.currentTarget.dataset.id
    this.setData({
      sizeId
    })
  },

  //操作
  operation(e) {
    const operation = e.target.dataset.operation
    switch (operation) {
      case 'delete':
        this.deleteNum(e)
        break
      case 'add':
        this.addNum(e)
        break
      default:
        return false
    }
  },

  // 减少数量
  resuceNum: function() {
    let goodsNum = this.data.goodsNum;

    if (goodsNum == 1) {
      wx.showToast({
        title: '至少为1件',
        icon: "none"
      })
      return false
    }
    if (goodsNum == 0) {
      return false
    }
    goodsNum--
    this.setData({
      goodsNum: goodsNum,
    })
  },
  // 增加数量
  addNum: function() {
    let goodsDetail = this.data.goodsDetail
    let inventory = goodsDetail.inventory //获取详情里面的库存
    let goodsNum = this.data.goodsNum;
    goodsNum++
    if (goodsNum > inventory) {
      wx.showToast({
        title: '库存不足',
        icon: "none"
      })
      return false
    }
    this.setData({
      goodsNum: goodsNum,
    })
  },

  //加入购物车显示
  addToCartText() {
    this.setData({
      buyNow: true,
      btnText: '加入购物车'
    })
  },

  //直接购买显示
  singleBuyText() {
    this.setData({
      buyNow: true,
      btnText: '直接购买'
    })
  },

  //关闭购物弹框
  closeBox() {
    this.setData({
      buyNow: false
    })
  },

  //显示
  showBox() {
    this.setData({
      buyNow: true
    })
  },

  //直接购买
  singleBuy() {
    let self = this;
    // console.log(self.data.goodsDetail)
    let details = self.data.goodsDetail
    let size = self.data.goodsNum
    let price = parseFloat(self.data.goodsDetail.price) * (self.data.goodsNum)
    details['buy_number'] = size
    details['total_price'] = price
    let goods = self.data.goodsDetail
    goods.content_web = ''
    goods.images_all = ''
    // console.log(goods)
    goods = [goods]
    // console.log(goods, price)

    // return false

    wx.navigateTo({
      url: '/pages/buyconfirm/buyconfirm?goods=' + JSON.stringify(goods) + '&price=' + price + '&type=' + 1,
    })
  },

  //跳转到购物车
  navToCart: function() {
    wx.navigateTo({
      url: '/pages/mycart/mycart',
    })
  },

  //加入购物车
  addToCart() {
    let self = this;
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      goods_id: self.data.goods_id,
      buy_number: self.data.goodsNum, //数量,
      shop_id: self.data.goodsDetail.shop_id
    }
    console.log(data)
    app._api.addToCart(data, res => {
      console.log(res)
      if (res.status === 1) {
        wx.showToast({
          title: '添加购物车成功',
          image: '/images/icon/success.png'
        })
        setTimeout(function() {
          self.setData({
            buyNow: false
          })
        }, 1000)
      }
    })
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