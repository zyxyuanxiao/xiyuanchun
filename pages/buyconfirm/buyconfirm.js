// pages/buyconfirm/buyconfirm.js
const app = getApp()
const util = require('../../utils/util.js')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const demo = new QQMapWX({
  key: 'EUNBZ-MIEKW-LPMR7-ODGYY-IKEIH-Y3B4O'
});
const innerAudioContext = wx.createInnerAudioContext(); //新建一个createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DJ: true,
    selectDJ: false,
    selectDJView: false,
    TJS: true,
    selectTJS: false,
    selectTJSView: false,
    ZF: true,
    selectZF: false,
    selectZFView: false,
    name: "",
    type: 2,
    num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    hideAll: false,
    getStatus: true,
    locaInfo: {
      lat: 0,
      lng: 0
    },
    payDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    let goods = JSON.parse(options.goods)
    let allPrice = options.price
    let type = options.type
    let sizeArr = goods.map(item => item.buy_number)
    let goods_type = goods.map(item => item.product_classify_id)
    // console.log(goods_type)
    let sale_type = goods_type.toString()
    // console.log(sale_type)
    let ZFNum = 0
    sizeArr.forEach((val, index) => {
      ZFNum += parseInt(val)
    })
    // console.log(type, type)
    if (type) {
      this.setData({
        type
      })
    }
    let month = util.formatYear(new Date())
    // console.log(month)
    let time = util.formatNowTime(((new Date()).getTime()))
    // console.log(time)
    time = time.substring(0, 2)
    // console.log(time)
    if (0 < time < 9) {
      this.setData({
        hideAll: true //规定时间内不能下单
      })
    }
    this.setData({
      goods,
      allPrice,
      month,
      sale_type,
      type,
      payDisabled: false

    })
  },

  // 选择专服的服务时间
  chooseZFTime(e) {
    // console.log(e.detail.value)
    let startDate = this.data.month + ' ' + e.detail.value
    let time3 = new Date(startDate.replace("-", "/").replace("-", "/"))
    time3 = time3 / 1000
    this.setData({
      time3,
      ZFTime: e.detail.value,
      ZFTimes: this.data.month + ' ' + e.detail.value
    })
  },
  // 选择专服数量
  chooseZFNum(e) {
    let numbers = parseInt(e.detail.value) + 1
    let ZFNum = this.data.ZFNum
    // console.log(numbers, ZFNum)
    if (numbers > ZFNum) {
      wx.showToast({
        title: '专服数量不能超过酒的数量',
        icon: "none"
      })
      this.setData({
        ZFNum: ZFNum,
        ZFNums: ZFNum + '个专服'
      })
      return false
    }
    this.setData({
      ZFNum: parseInt(e.detail.value) + 1,
      ZFNums: parseInt(1 + parseInt(e.detail.value)) + '个专服'
    })
  },
  // 调酒师选择时间
  bindTjsTimeChange(e) {

    // 兼容ios
    let startDate = this.data.month + ' ' + e.detail.value
    let time2 = new Date(startDate.replace("-", "/").replace("-", "/"))
    time2 = time2 / 1000

    this.setData({
      time2,
      TJSTime: e.detail.value,
      TJSTimes: this.data.month + ' ' + e.detail.value
    })
  },
  // 直接购买部分
  toBuy(e) {
    let self = this;
    let goods = self.data.goods
    wx.showLoading({
      title: '支付中...',
    })
    self.setData({
      payDisabled: true
    })
    let data = {
      member_id: app.globalData.mid || wx.getStorageSync('mid'), //  消费用户id
      receive_name: self.data.name, // 下单人姓名
      receive_tel: self.data.phone, //  下单人电话
      receive_address: self.data.address, // 下单人地址,
      goods_id: goods[0].id, //   商品ID, 用逗号隔开
      buy_number: goods[0].buy_number,
      shop_id: goods[0].shop_id,
      lat: self.data.locaInfo.lat.toFixed(5),
      lng: self.data.locaInfo.lng.toFixed(5)
    }
    if (data.receive_name == '') {
      wx.showToast({
        title: '请填写收货信息',
        icon: "none"
      })
      self.setData({
        payDisabled: false
      })
      return false
    }
    console.log(data)
    // this.wxPay(data)
    app._api.redictToBuy(data, res => {
      console.log(res)
      let orderId = res.data;
      wx.hideLoading()
      self.wxPay(orderId)
    })
  },
  // 进行支付
  toPay(e) {
    let goods = this.data.goods
    let goodsId = goods.map(item => item.detail_id)
    let goodId = goodsId.toString()
    wx.showLoading({
      title: '支付中...',
    })
    self.setData({
      payDisabled: true
    })
    console.log(goodId)
    let data = {
      member_id: app.globalData.mid || wx.getStorageSync('mid'), //  消费用户id
      receive_name: this.data.name, // 下单人姓名
      receive_tel: this.data.phone, //  下单人电话
      receive_address: this.data.address, // 下单人地址,
      detail_ids: goodId, //   购物车id, 用逗号隔开
      shop_id: goods[0].shop_id,
      lat: this.data.locaInfo.lat.toFixed(5),
      lng: this.data.locaInfo.lng.toFixed(5)
    }
    if (data.receive_name == '') {
      wx.showToast({
        title: '请填写收货信息',
        icon: "none"
      })
      self.setData({
        payDisabled: false
      })
      return false
    }
    console.log(data)
    app._api.payGoods(data, res => {
      console.log(res)
      wx.hideLoading()
      let orderId = res.data;
      this.wxPay(orderId)
    })
  },
  // 提取支付的公共部分
  wxPay(orderId) {
    let self = this
    let selectDJView = self.data.selectDJView //选择了代驾
    let selectTJSView = self.data.selectTJSView //选择了调酒师
    let selectZFView = self.data.selectZFView //选择了专服
    // 选择了代驾 提交代驾资料
    if (selectDJView === true) {
      let djinfo = {
        mid: app.globalData.mid || wx.getStorageSync('mid'), //  下单人用户id
        order_id: orderId, // 订单id
        time1: self.data.time1, //              预约时间(10位时间戳)
        address: self.data.DJStartAddress, //         出发地址, 多个用逗号隔开
        aim_address: 0, //       目的地地址, 多个用逗号隔开
        lat: self.data.DJStartLat.toFixed(5), //     出发地点纬度, 多个用逗号隔开
        lng: self.data.DJStartLng.toFixed(5), // 出发地点经度, 多个用逗号隔开
        aim_lat: 0, // 目的地点纬度, 多个用逗号隔开
        aim_lng: 0, //   目的地点经度, 多个用逗号隔开
        server1_number: self.data.DJNum, //     代驾总人数(1- 255)
      }
      if (djinfo.time1 == '') {
        wx.showToast({
          title: '请选择代驾的预约时间',
          icon: "none"
        })
        return false
      }
      if (djinfo.address == '' && djinfo.aim_address == '') {
        wx.showToast({
          title: '请选择代驾的起始点',
          icon: "none"
        })
        return false
      }
      console.log(djinfo)
      app._api.addDJOrder(djinfo, res => {
        console.log("代驾返回的信息：", res)
        if (res.status == 2) {

          // 代驾取消提醒
          // wx.showToast({
          //   title: res.msg,
          //   icon: "none"
          // })
          self.setData({
            djStatus: false,
            order_detail_id_dj: 0
          })
          return false
        }
        if (res.status == 1) {
          self.setData({
            djStatus: true,
            order_detail_id_dj: 1
          })
        }
      })
    }
    // 选了调酒师服务
    if (selectTJSView == true) {

      let tjsinfo = {
        mid: app.globalData.mid || wx.getStorageSync('mid'), //  下单人用户id
        order_id: orderId, // 订单id
        time2: self.data.time2, //              预约时间(10位时间戳)
        server_ids: self.data.tjsID, //        
      }
      if (tjsinfo.server_ids == '') {
        wx.showToast({
          title: '请选择调酒师',
          icon: "none"
        })
        return false
      }
      if (tjsinfo.time2 == '') {
        wx.showToast({
          title: '请选择调酒师预约时间',
          icon: "none"
        })
        return false
      }
      console.log(tjsinfo)
      app._api.addTjsOrder(tjsinfo, res => {
        console.log('调酒师返回的信息:', res)
        if (res.status == 2) {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
          return false
        }
      })
    }
    if (selectZFView == true) {

      let zfinfo = {
        mid: app.globalData.mid || wx.getStorageSync('mid'), //  下单人用户id
        order_id: orderId, // 订单id
        time3: self.data.time3, //              预约时间(10位时间戳)
        server3_number: parseInt(self.data.ZFNum), //         
      }
      if (zfinfo.time3 == '') {
        wx.showToast({
          title: '请选择专服的预约时间',
          icon: "none"
        })
        return false
      }
      if (zfinfo.server3_number == '') {
        wx.showToast({
          title: '请选择专服的数量',
          icon: "none"
        })
        return false
      }
      console.log(zfinfo)
      app._api.addZfOrder(zfinfo, res => {
        console.log('专服返回的信息', res)
        if (res.status == 2) {
          // 专服取消提示
          // wx.showToast({
          //   title: res.msg,
          //   icon: "none"
          // })
          self.setData({
            zfStatus: false,
            order_detail_id_zf: 0
          })
          return false
        }
        if (res.status == 1) {
          self.setData({
            zfStatus: true,
            order_detail_id_zf: 1
          })
        }
      })
    }
    app._api.payWeiChat({
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      order_id: orderId
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
          self.setData({
            payDisabled: false
          })
          if (res.errMsg == 'requestPayment:ok') {
            wx.showToast({
              title: '支付成功',
            })
            app._api.payResult({
              order_id: orderId
            }, res => {
              console.log(res)

              // 轮询派单的结果 如果派单成功，则跳转

              setTimeout(() => {
                let type = 0;
                // 选择了代驾 跳转到待接单界面
                if (selectZFView == true || selectDJView == true) {
                  // 查询状态
                  wx.showLoading({
                    title: '正在派单，请等待...',
                  })
                  let order_id = orderId
                  setInterval(() => {
                    let getStatus = self.data.getStatus
                    console.log(getStatus)
                    if (getStatus == true) {
                      app._api.getServerStatus({
                        order_id
                      }, res => {
                        console.log(res)
                        let status = res.status
                        if (status == 1) {
                          wx.hideLoading()
                          wx.showToast({
                            title: '派单成功',
                          })
                          innerAudioContext.autoplay = true; //音频自动播放设置
                          innerAudioContext.src = '/images/7499.wav'; //链接到音频的地址
                          innerAudioContext.onPlay(() => {
                            console.log('播放完成')
                          }); //播放音效
                          innerAudioContext.onError((res) => { //打印错误
                            console.log(res.errMsg); //错误信息
                            console.log(res.errCode); //错误码
                          })
                          self.setData({
                            getStatus: false
                          })
                          setTimeout(() => {
                            wx.navigateTo({
                              url: '/pages/nearby/nearby?order_id=' + order_id,
                            })
                          }, 3000)
                        }
                      })
                    }
                  }, 6000)
                } else {
                  wx.navigateTo({
                    url: `/pages/order/order?type=${type}`,
                  })
                }
              }, 1000)
            })

          }
        },
        fail: function(err) {
          // console.log(err)
          wx.showToast({
            title: "支付取消",
            icon: "none"
          })
          self.setData({
            payDisabled: false
          })
          // setTimeout(() => {
          //   wx.navigateBack({
          //     delta: -1
          //   })
          // }, 2000)
        }
      })
    })
  },
  // 选择收货地址
  chooseLocation() {
    let self = this;
    wx.chooseAddress({
      success(res) {
        // console.log(res)
        self.setData({
          name: res.userName,
          phone: res.telNumber,
          address: res.cityName + res.countyName + res.detailInfo
        })
        let address = res.cityName + res.countyName + res.detailInfo
        demo.geocoder({
          address,
          success: function(res) { //成功后的回调
            console.log(res);
            let locaInfo = res.result.location
            self.setData({
              locaInfo
            })
          }
        })
      }
    })
  },
  // 选择代驾时间
  bindDjTimeChange(e) {
    console.log(e.detail.value)
    console.log(this.data.month)
    let startDate = this.data.month + ' ' + e.detail.value
    let time1 = new Date(startDate.replace("-", "/").replace("-", "/"))
    time1 = time1 / 1000
    console.log(time1)
    this.setData({
      time1,
      DJTime: e.detail.value,
      DJtimes: this.data.month + ' ' + e.detail.value
    })
  },
  // 选择代驾起点
  chooseStart(e) {
    let self = this
    wx.chooseLocation({
      success: function(res) {
        // console.log(res)
        self.setData({
          DJStartAddress: res.address,
          DJStartLat: res.latitude,
          DJStartLng: res.longitude,
        })
      },
    })
  },
  // 代驾选择终点位置
  chooseDJEnd(e) {
    let self = this
    let numbers = parseInt(e.detail.value) + 1
    let ZFNum = this.data.ZFNum
    // console.log(numbers, ZFNum)
    if (numbers > ZFNum) {
      wx.showToast({
        title: '代驾数量不能超过酒的数量',
        icon: "none"
      })
      self.setData({
        DJNum: ZFNum,
        DJNums: ZFNum + '个代驾'
      })
      return false
    }
    self.setData({
      DJNum: parseInt(e.detail.value) + 1,
      DJNums: parseInt(1 + parseInt(e.detail.value)) + '个代驾'
    })
  },
  // 显示代驾模块
  selectDJ(e) {
    // console.log(e)
    let selectDJ = e.detail.value
    // console.log(selectDJ[0])
    this.setData({
      selectDJView: !this.data.selectDJView
    })
  },
  // 显示调酒师模块
  selectTJS(e) {
    let selectTJS = e.detail.value
    // console.log(selectDJ[0])
    this.setData({
      selectTJSView: !this.data.selectTJSView
    })
    this.serverList()
  },

  // 显示专服模块
  selectZF(e) {
    let selectZF = e.detail.value
    // console.log(selectDJ[0])
    this.setData({
      selectZFView: !this.data.selectZFView
    })
  },
  // 获取调酒师列表
  serverList() {
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      type: 2,
      degree: '',
      sale_type: this.data.sale_type
    }
    console.log(data)
    app._api.getServercesList(data, res => {
      console.log(res)
      let serverList = res.data
      serverList.forEach((val, index) => {
        val['checked'] = false
      })
      this.setData({
        serverList
      })
    })
  },
  // 获取调酒师列表
  chooseTJSList(e) {
    console.log(e.detail.value)
    let tjsArr = e.detail.value
    let tjsID = tjsArr.toString()
    this.setData({
      tjsID
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
    // 页面隐藏 关闭定时任务
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