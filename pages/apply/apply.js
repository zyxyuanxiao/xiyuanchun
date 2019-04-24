// pages/apply/apply.js
const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const demo = new QQMapWX({
  key: 'EUNBZ-MIEKW-LPMR7-ODGYY-IKEIH-Y3B4O'
});
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    next: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getApplyStatus()
  },
  // 获取用户的申请状态
  getApplyStatus() {
    app._api.applyStatus({
      mid: app.globalData.mid || wx.getStorageSync("mid")
    }, res => {
      console.log(res)
      if (!res.data) {
        return void 0
      }
      if (res.data.status == 0) {

        return false
        wx.showModal({
          title: '提示',
          content: res.data.status_val,
          showCancel: false,
          success: res2 => {
            if (res2.confirm) {
              let service_waiter_id = res.data.id
              app._api.payMoney({
                mid: app.globalData.mid || wx.getStorageSync('mid'),
                service_waiter_id: service_waiter_id
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
                      app._api.applyMakeSure({
                        service_waiter_id
                      }, res => {
                        console.log(res)
                      })
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: -2
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
            }
          }
        })
      }
      if (res.data.status == 1) {
        wx.showModal({
          title: '提示',
          content: res.data.status_val,
          showCancel: false,
          success: res => {
            if (res.confirm) {
              // setTimeout(() => {
              //   wx.navigateBack({
              //     delta: -1
              //   })
              // }, 500)
            }
          }
        })
      }
      if (res.data.status == 3) {
        wx.showModal({
          title: '提示',
          content: res.data.remark,
          showCancel: false,
          success: res => {}
        })
      }
    })
  },
  // 选择申请职业
  select: function(e) {
    // console.log(e)
    let id = e.target.dataset.id;
    this.setData({
      select: id
    })
  },
  // 下一步
  next() {
    let id = this.data.select
    if (id == void 0) {
      wx.showToast({
        title: '请选择申请的职位',
        icon: "none"
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/second/second?type=' + id,
    })
  },
  //获取地址
  getLocation() {
    app.getLocation(res => {
      demo.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: (rs) => {
          console.log(rs)
          this.setData({
            address: rs.result.address,
            cityInfo: rs.result.address_component,
            ad: rs.result.ad_info //包含区域ID
          })
        },
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
    this.getApplyStatus()
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