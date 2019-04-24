// pages/mycart/mycart.js
const app = getApp()
Page({

  data: {

    loading: true,
    wholePrice: 0,
    sumCart: {},
    payCommodities: [],

    //模拟数据
    carts: [],
    selectGoods: {},
    allPrices: 0,
    checked: []
  },

  onLoad() {
    this.getCartList()
  },
  onShow() {
    this.getCartList()
  },
  getCartList() {
    app._api.getCartList({
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }, res => {
      // console.log(res)
      let carts = res.data
      carts.forEach((val, index) => {
        val['checked'] = false
        val['total_price'] = parseFloat(val.price) * val.buy_number
        val['images'] = app._api.host + val['images']
      })
      console.log(carts)
      this.setData({
        carts: res.data,
        loading: false,
      })
    })
  },
  //删除商品
  deleteCommodity(e) {
    let self = this;
    let checked = this.data.checked;
    let goodId = ''
    let fu = ''
    checked.forEach((checked, index) => {
      goodId += fu + checked
      fu = ','
    })
    console.log(goodId)
    app._api.delCart({
      detail_id: goodId
    }, res => {
      // console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '删除成功',
          image: "/images/icon/success.png"
        })
        setTimeout(() => {
          self.getCartList()
        }, 1000)
      }
    })
  },
  checkGoods(e) {
    // console.log(e)
    let checked = e.detail.value
    // console.log(checked)
    let carts = this.data.carts
    let goodsId = carts.map(item => item.detail_id)
    let allPrices = 0
    checked.forEach((val, index) => {
      allPrices += carts[goodsId.indexOf(parseInt(val))].total_price
      // console.log(carts[goodsId.indexOf(parseInt(val))].total_price)
    })
    // console.log(allPrices)
    this.setData({
      allPrices,
      checked
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


  //更新数值
  updataGoodsNum(e) {
    // console.log(e)
    let num = e.currentTarget.dataset.num
    let goodid = e.currentTarget.dataset.goodid
    let type = e.currentTarget.dataset.type
    let shop_id = e.currentTarget.dataset.shop_id
    if (type == 'add') {
      let data = {
        mid: app.globalData.mid || wx.getStorageSync('mid'), //用户
        goods_id: goodid, // 商品id
        type: 2,// 1 - 数量减一  2-数量加一
        shop_id
      }
      console.log(data)
      app._api.updataGoodsNum(data, res => {
        console.log(res)
        if (res.status == 1) {
          this.getCartList()
        }
      })
    } else {
      app._api.updataGoodsNum({
        mid: app.globalData.mid || wx.getStorageSync('mid'), //用户
        goods_id: goodid, // 商品id
        type: 1, // 1 - 数量减一  2-数量加一
        shop_id
      }, res => {
        console.log(res)
        if (res.status == 1) {
          this.getCartList()
        }
      })
    }
  },

  //购买下单
  payForIt() {
    const checked = this.data.checked
    if (checked.length == 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: "none"
      })
      return false
    }
    let carts = this.data.carts
    let goodsId = carts.map(item => item.detail_id)
    let goods = []
    checked.forEach((val, index) => {
      goods.push(carts[goodsId.indexOf(parseInt(val))])
    })
    // console.log(selectGoodsList)


    wx.navigateTo({
      url: '/pages/buyconfirm/buyconfirm?goods=' + JSON.stringify(goods) + '&price=' + this.data.allPrices + '&type=2',
    })
  },

  //商城跳转
  goToShoppingMall() {
    wx.switchTab({
      url: '/pages/classify/classify',
    })
  }

})