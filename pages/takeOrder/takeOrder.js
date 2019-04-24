// pages/takeOrder/takeOrder.js
const app = getApp()
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    NumArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    date: '2016-09-01',
    time: '12:01',
    SizeArr: ['小瓶', '大瓶'],
    size: '小瓶',
    dj: false,
    tjs: false,
    zf: true,
    num: "",
    price: 0,
    tjsFirst: true,
    tjsSecond: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(JSON.parse(options.type))
    let type = JSON.parse(options.type).type
    let goodsInfo = JSON.parse(options.type).goods
    // console.log()
    if (type == '') {
      wx.showToast({
        title: '商品参数有问题',
        icon: "none"
      })
      return false
    }
    this.setData({
      type: type[0],
      SizeArr: type[0].info.map(item => item.value + type[0].name),
      size: type[0].info[0].value + type[0].name,
      price: type[0].info[0].price,
      date: util.formatYear(new Date()),
      time: util.formatNowTime(new Date()),
      spec: type[0].info[0].value_id,
      goodsInfo
    })
    // console.log(new Date())
  },
  // 选择收货地址
  chooseAddess() {
    let self = this;
    wx.chooseAddress({
      success(res) {
        // console.log(res)
        self.setData({
          name: res.userName,
          phone: res.telNumber,
          address: res.cityName + res.countyName + res.detailInfo
        })
      }
    })
  },
  // 修改数量
  bindNumChange(e) {
    this.setData({
      num: parseInt(e.detail.value) + 1 + '瓶',
      nums: parseInt(e.detail.value) + 1,
      prices: (parseFloat(e.detail.value) + 1) * parseFloat(this.data.price)
    })
  },
  // 修改日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 修改时间
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindDjTimeChange(e) {
    this.setData({
      DJtime: e.detail.value
    })
  },
  // 关闭调酒师的模态框
  cancelTJ() {
    this.setData({
      tjs: !this.data.tjs
    })
  },
  // 修改商品规格
  bindSizeChange(e) {
    this.setData({
      size: this.data.SizeArr[e.detail.value],
      price: this.data.type.info[e.detail.value].price,
      prices: parseFloat(this.data.num) * parseFloat(this.data.type.info[e.detail.value].price),
      spec: this.data.type.info[e.detail.value].value_id
    })
  },
  // 选择代驾起点
  chooseStart(e) {
    app.getLocation(res => {
      // console.log(res)
      let startAddresstData = res
      this.setData({
        startAddresstData
      })
    })
  },
  //选择代驾终点
  chooseEnd(e) {
    app.getLocation(res => {
      // console.log(res)
      let endAddresstData = res
      this.setData({
        endAddresstData
      })
    })
  },
  // 立即购买
  buy(e) {
    let self = this;
    // console.log(e)
    wx.showModal({
      title: '温馨提示',
      content: '私人住宅将不会进行配送，请谨慎下单',
      confirmColor: ' rgb(198, 141, 18)',
      cancelText: '取消订单',
      confirmText: '确认无误',
      success: res => {
        if (res.confirm) {
          let receive_time = self.data.date + ' ' + self.data.time
          let other_service = '3'
          if (self.data.dj) {
            other_service = '1,3'
          }
          if (self.data.tjs) {
            other_service = '2,3'
          }
          if (self.data.dj && self.data.tjs) {
            other_service = '1,2,3'
          }
          let data = {
            mid: app.globalData.mid || wx.getStorageSync('mid'), // 用户id
            product_id: self.data.goodsInfo.id, //商品id
            price: this.data.price, //单价
            spec: self.data.spec, //规格id
            buy_number: self.data.nums, //购买数量
            receive_name: self.data.name, // 收货人姓名
            receive_tel: self.data.phone, // 收货人电话
            receive_address: self.data.address, //收货人地址
            receive_time, // 送达时间
            other_service, // 其他服务1: 代驾 2: 调酒师 3: 专服(多个用逗号隔开 如 1, 3) 必需
            // lat: self.data.location.lat,
            // lng: self.data.location.lng
          }
          if (data.receive_address == '') {
            wx.showToast({
              title: '请选择收货地址',
              icon: "none"
            })
            return false
          }
          if (data.buy_number == '') {
            wx.showToast({
              title: '请选择商品数量',
              icon: "none"
            })
            return false
          }
          // console.log(data)
          app._api.payGoods(data, res => {
            // console.log(res)
            if (res.status == 0) {
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
              return false
            }
            let order_id = res.data.order_id
            // 用户发起支付
            app._api.payWeiChat({
              mid: app.globalData.mid || wx.getStorageSync('mid'),
              order_id
            }, res => {
              console.log(res)
              let payParam = res.data.arr;
              wx.requestPayment({
                'timeStamp': payParam.timeStamp,
                'nonceStr': payParam.nonceStr,
                'package': payParam.package,
                'signType': payParam.signType,
                'paySign': payParam.paySign,
                success: function(res) {
                  // console.log(res)
                  if (res.errMsg == 'requestPayment:ok') {
                    wx.showToast({
                      title: '支付成功',
                    })
                    app._api.payResult({
                      order_id
                    }, res => {
                      console.log(res)
                    })
                    setTimeout(() => {
                      let type = 1;
                      wx.navigateTo({
                        url: `/pages/order/order?type=${type}`,
                      })
                    }, 1000)
                  }
                },
                fail: function(err) {
                  // console.log(err)
                  wx.showToast({
                    title: err.err_desc,
                    icon: "none"
                  })
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: -1
                    })
                  }, 2000)
                }
              })
            })
          })
        }
      }
    })
  },
  // 选择代驾
  choosedj: function(e) {
    this.setData({
      dj: !this.data.dj
    })
  },
  // 显示调酒师模态框
  choosetjs: function(e) {
    if (this.data.tjs == false) {
      let data = {
        mid: app.globalData.mid || wx.getStorageSync('mid'),
        type: 2,
        degree: '',
        sale_type: 0
      }
      app._api.getServercesList(data, res => {
        console.log(res)
        let serverList = res.data
        this.setData({
          serverList
        })
      })
    }
    this.setData({
      tjs: !this.data.tjs
    })
  },
  // 选择调酒师
  serverSelect(e) {
    // console.log(e)
    let barman_mid = e.detail.value
    this.setData({
      barman_mid
    })
  },
  //选择代驾
  cancelDJ() {
    this.setData({
      dj: !this.data.dj
    })
  },
  navToSecond() {
    this.setData({
      tjsFirst: false,
      tjsSecond: true
    })
  },
  // 选择专服
  choosezf: function(e) {

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