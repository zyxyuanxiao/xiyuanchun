// pages/commodity/commodity.js
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js')
Page({

  data: {
    imgUrls: [],
    loading: true,
    buyNow: false,
    btnText: '加入购物车',

    //购买商品的数据
    waittingBuy: {
      final_num: 1,
      goodsNum: 1
    },

    //规格表
    standardList: {},

    //规格判断
    feature: [],

    currentCommdity: null,
    //接口数据
    commodity: {},
    tmpTitle: [],
    priceItem: {},
    goods_id: '',
    statusLists: {},
    num: '',
    priceAll: 0,
    wholePrice: 0,
    goodsNum: 1
  },

  onLoad(options) {
    const that = this
    const id = options.id
    console.log(options)
    that.setData({
      goods_id: id,
      options
    })

    let uid = app.globalData.uid;
    console.log(uid)
    let agent_id = options.agent_id || ""
    //判断有无登陆显示分享按钮
    if (uid) {
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }
    //在agent_id存在的情况下进行登陆
    if (agent_id != '') {
      app.getUserInfo(agent_id, res => {
        console.log(res)
        // 进行全局userInfo设置
        app.globalData.userInfo = res.userInfo
        app.globalData._token = res._token
        app.globalData.type = res.type
        app.globalData.agent_id = agent_id
        /**获取商品详情 */
        app._api.getCommodity({
          access_token: res._token,
          goods_id: id,
          title: ''
        }, res => {
          console.log(res)
          let banner = res.data.details.banner
          if (banner != null) {
            for (let i = 0; i < banner.length; i++) {
              banner[i] = app._api.host + banner[i]
            }
          }
          if (res.data.details.cover.substring(0, 5) != "https") {
            res.data.details.cover = app._api.host + res.data.details.cover
          }
          // console.log(banner)
          that.setData({
            commodity: res.data.details,
            imgUrls: banner,
            loading: false,
            imgUrl: res.data.details.cover
          })
          const article = res.data.details.content
          WxParse.wxParse('article', 'html', article, that, 10)
        })
        app._api.myCart({
          access_token: res._token
        }, res => {
          console.log(res)
          let num = res.data.length
          that.setData({
            num: num
          })
        })
      })
      return false
    }

    /**获取商品详情 */
    app._api.getCommodity({
      access_token: app.globalData._token,
      goods_id: id,
      title: ''
    }, res => {
      console.log(res)
      let banner = res.data.details.banner
      if (banner != null) {
        for (let i = 0; i < banner.length; i++) {
          banner[i] = app._api.host + banner[i]
        }
      }
      if (res.data.details.cover.substring(0, 5) != "https") {
        res.data.details.cover = app._api.host + res.data.details.cover
      }
      // console.log(banner)
      that.setData({
        commodity: res.data.details,
        imgUrls: banner,
        loading: false,
        imgUrl: res.data.details.cover
      })
      const article = res.data.details.content
      WxParse.wxParse('article', 'html', article, that, 10)
    })
    app._api.myCart({
      access_token: app.globalData._token
    }, res => {
      console.log(res)
      let num = res.data.length
      that.setData({
        num: num
      })
    })
  },
  onShow: function() {
    this.onLoad(this.data.options)
  },
  preImg(e) {
    const img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img,
      urls: this.data.imgUrls,
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

  //选择标准
  chooseStandard(e) {
    console.log(e)
    var standard_id = e.currentTarget.dataset.standard_id //规格分类的ID
    const id = e.currentTarget.dataset.id //具体的规格ID
    const title = e.currentTarget.dataset.title
    const price = e.currentTarget.dataset.price
    let imgUrl = e.currentTarget.dataset.imgurl
    console.log(price)
    let statusList = this.data.standardList
    let tmpTitle = this.data.tmpTitle
    let tmpArr = []
    this.setData({
      standard_id: standard_id,
    })
    if (standard_id == 1) {
      this.setData({
        imgUrl: app._api.host + imgUrl
      })
    }
    // console.log(app._api.host + imgUrl)
    let priceItem = this.data.priceItem
    let statusLists = this.data.statusLists
    let priceArr = []
    if (priceItem[standard_id] == id) {
      priceItem[standard_id] = ''
      for (let it in priceItem) {
        if (priceItem[it]) {
          priceArr.push(priceItem[it])
        }
      }
      this.setData({
        priceArr: priceArr,
        priceItem: priceItem
      })
      console.log(priceArr)
    } else {
      priceItem[standard_id] = title
      for (let key in priceItem) {
        if (priceItem[key]) {
          priceArr.push(priceItem[key])
        }
      }
      this.setData({
        priceArr: priceArr,
        priceItem: priceItem
      })
      console.log(priceArr)
      console.log(priceItem)
    }

    if (statusList[standard_id] == id) {
      statusList[standard_id] = ''
      for (let it in statusList) {
        if (statusList[it]) {
          tmpArr.push(statusList[it])
        }
      }
      let index = tmpTitle.indexOf(title)
      // console.log(index)
      tmpTitle.splice(index, 1)
      console.log(tmpArr)
      // console.log(tmpTitle)
      console.log(statusList)
      this.setData({
        standardList: statusList,
        feature: tmpArr,
        tmpTitle: tmpTitle
      })
    } else {
      // console.log("之前的：" + tmpTitle)
      tmpTitle.push(title)
      // statusLists[standard_id] = {
      //   vid:id,price:price
      // }
      statusLists[standard_id] = {};
      statusLists[standard_id].vid = id;
      statusLists[standard_id].price = price;

      console.log(statusLists)
      statusList[standard_id] = id
      for (let it in statusList) {
        if (statusList[it]) {
          tmpArr.push(statusList[it])
        }
      }
      console.log(tmpArr)
      console.log(statusLists)

      let cartId = Object.keys(statusLists)
      let wholePrice = this.data.wholePrice
      for (var i = 0; i < cartId.length; i++) {
        wholePrice = wholePrice + parseFloat(statusLists[cartId[i]].price)
      }
      // console.log(wholePrice)
      this.setData({
        standardList: statusList,
        feature: tmpArr,
        tmpTitle: tmpTitle,
        statusLists: statusLists,
        priceAll: wholePrice + parseFloat(this.data.commodity.price)
      })
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
    let goodsNum = this.data.goodsNum;
    goodsNum++
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
    let attributes_list = self.data.statusLists
    console.log(attributes_list)
    let data = {
      access_token: app.globalData._token,
      goods_id: self.data.goods_id,
      attributes_list: attributes_list,
      num: self.data.goodsNum
    }
    console.log(data)
    app._api.addGoodsCart(data, res => {
      console.log(res)
      if (res.data.id > 0) {
        wx.navigateTo({
          url: '/pages/buyconfirm/buyconfirm?cartId=' + res.data.id + '&price=' + res.data.total_price,
        })
      }
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
    let attributes_list = self.data.statusLists
    console.log(attributes_list)
    let data = {
      access_token: app.globalData._token,
      goods_id: self.data.goods_id,
      attributes_list: attributes_list,
      num: self.data.goodsNum
    }
    console.log(data)
    app._api.addGoodsCart(data, res => {
      console.log(res)
      if (res.data.id > 0) {
        wx.showToast({
          title: '添加购物车成功',
          image: '/images/icon/success.png'
        })
        setTimeout(function() {
          self.setData({
            buyNow: false
          })
          app._api.myCart({
            access_token: app.globalData._token
          }, cb => {
            console.log(cb)
            let num = cb.data.length
            self.setData({
              num: num
            })
          })
        }, 2000)
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