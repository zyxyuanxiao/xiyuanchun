// app.js
import _api from './utils/api.js'
App({

  globalData: {
    mid: '',
    userInfo: null,
    location: null,
    type: null,
    nums: null,
    status: null,
    otherPage: null,
    phone: null
  },

  _api: _api.api,
  _errFnc: _api.errFnc,
  onLaunch(options) {
    let that = this;
    let queryInfo = options.query //获取分享页的数据
    wx.getUserInfo({
      withCredentials: true,
      success: function(ress) {
        // console.log(ress)
        that.globalData.userInfo = ress.userInfo
        that.getUserInfo(res => {
          console.log(res)
          that.globalData.mid = res.data.mid
          wx.setStorageSync('mid', res.data.mid)

          that.globalData.type = res.data.type
          wx.setStorageSync('type', res.data.type)
          // 登录返回的数据

          if (res.data.order == '') {
            return false
          } else {
            let serverid = ''
            if (res.data.order.type == 1) {
              let orderId = res.data.order.order[0].order_id
              console.log('待支付的订单ID:' + orderId)
              wx.showModal({
                title: '温馨提示',
                content: '你有待支付的服务订单,是否去支付',
                success: res => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/childTasks/childTasks?orderId=' + orderId + '&serverid=' + serverid,
                    })
                  }
                }
              })
            }
            if (res.data.order.type == 2) {
              return false
              let orderId = res.data.order.order["0"].id
              console.log('待支付的订单ID:' + orderId)
              wx.showModal({
                title: '温馨提示',
                content: '你有待确认的订单,是否去确认',
                success: res => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/childTasks/childTasks?orderId=' + orderId + '&serverid=' + serverid,
                    })
                  }
                }
              })
            }
          }
        })
      },
      fail: function(err) {
        console.log(err)
        console.log("用户未授权使用")
        //获取用户信息失败后。请跳转授权页面
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return false
        wx.showModal({
          title: '温馨提示',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
      }
    })
    let mid = that.globalData.mid || wx.getStorageSync('mid')
    // console.log(mid)

    // return false
    if (mid) {
      // 实时获取经纬度
      let type = that.globalData.type || wx.getStorageSync('type')
      console.log('用户身份：' + type)
      if (type === 4) { //普通用户只获取一次
        wx.getLocation({
          type: 'wgs84',
          success: function(res) {
            // console.log(res)
            let data = {
              mid: that.globalData.mid || wx.getStorageSync('mid'),
              lat: res.latitude.toFixed(5),
              lng: res.longitude.toFixed(5)
            }
            _api.api.uploadLocation(data, res => {
              // console.log(res)
            })
          },
        })
      }

      if (type == 1 || type == 2 || type == 3) { //业务人员随时获取经纬度
        let getLocation = setInterval(function() {
          wx.getLocation({
            type: 'wgs84',
            success: function(res) {
              // console.log(res)
              let data = {
                mid: that.globalData.mid || wx.getStorageSync('mid'),
                lat: res.latitude.toFixed(5),
                lng: res.longitude.toFixed(5)
              }
              // console.log(data)
              _api.api.uploadLocation(data, res => {
                // console.log(res)
              })
            },
          })
        }, 10000)

        let tasks = setInterval(() => {
          // 如果在不想显示的页面  ，停止轮训
          let otherPage = that.globalData.otherPage
          console.log(otherPage)
          if (otherPage) {
            return false
          }
          _api.api.getMyTasks({
            mid: that.globalData.mid || wx.getStorageSync('mid')
          }, res => {
            console.log(res)
            // console.log(that.globalData.status)
            // 如果modal在显示则不继续执行
            if (res.status == 0) {
              wx.hideTabBarRedDot({
                index: 3,
              })
              that.globalData.nums = null
            }
            if (that.globalData.status) {
              return false
            }
            if (res.data == null) {
              return false
            }
            if (res.data.status == 2) {
              wx.setTabBarBadge({
                index: 3,
                text: '1',
              })
              that.globalData.nums = 1
              that.globalData.status = true
              that.globalData.otherPage = true
              wx.showModal({
                title: '温馨提示',
                content: '你有新的订单等待接受，是否前去查看?',
                confirmText: "去查看",
                cancelText: "不想接单",
                confirmColor: "#d8995b",
                success: res => {
                  // console.log(res)
                  if (res.confirm) {
                    // that.globalData.status = true
                    wx.navigateTo({
                      url: '/pages/myOrder/myOrder?type=' + 0,
                    })
                  }
                  if (res.cancel) {
                    that.globalData.status = false
                  }
                }
              })
            }
            if (res.data.status == 3) {
              that.globalData.status = true
              that.globalData.otherPage = true
              wx.setTabBarBadge({
                index: 3,
                text: '1',
              })
              wx.showModal({
                title: '温馨提示',
                content: '你有任务正在进行中，去继续进行?',
                confirmText: "确定",
                cancelText: "不去",
                confirmColor: "#d8995b",
                success: res => {
                  if (res.confirm) {
                    // that.globalData.status = true
                    wx.navigateTo({
                      url: '/pages/myOrder/myOrder?type=' + 1,
                    })
                  }
                  if (res.cancel) {
                    // clearInterval(tasks)
                    that.globalData.status = true
                  }
                }
              })
            }
          })
        }, 20000)
      }
    }
  },

  //获取登录权限
  getUserInfo(callback) {
    let that = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.login({
      success: login => {
        // wx.hideLoading()
        wx.getUserInfo({
          // withCredentials: true,
          success: res => {
            that.globalData.userInfo == res.userInfo
            wx.setStorageSync('userInfo', res.userInfo)
            let data = {
              js_code: login.code,
              encryptedData: encodeURIComponent(res.encryptedData),
              iv: res.iv,
            }
            // console.log(data)
            // return false
            that._api.login(data, info => {
              // console.log(info)
              that.globalData.mid = info.data.mid
              wx.setStorageSync('mid', info.data.mid)

              that.globalData.type = info.data.type
              wx.setStorageSync('type', info.data.type)
              wx.getLocation({
                type: 'wgs84',
                success: function(ress) {
                  // console.log(ress)
                  let data = {
                    mid: info.data.mid,
                    lat: ress.latitude.toFixed(5),
                    lng: ress.longitude.toFixed(5)
                  }
                  _api.api.uploadLocation(data, res => {
                    // console.log(res)
                  })
                },
              })
              typeof callback === 'function' && callback(info)
            })
          },
          fail: (error) => {
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.userInfo']) {
                  that.getUserInfo(callback)
                }
              }
            })
          }
        })
      }
    })
  },

  //获取地址
  getAddress(callback, flag) {
    if (flag) {
      return false
    }
    const that = this
    wx.chooseAddress({
      success(res) {
        console.log("address:" + res)
        typeof callback === 'function' && callback(res)
      },
      fail(error) {
        wx.openSetting({
          success(res) {
            if (res.authSetting['scope.address']) {
              that.getAddress(callback, true)
            }
          }
        })
      }
    })
  },

  //获取经纬度，微信地图
  getLocation(callback, flag) {
    const that = this
    if (flag) {
      return false
    }
    wx.chooseLocation({
      success(res) {
        typeof callback === 'function' && callback(res)
      },
      fail(error) {
        wx.openSetting({
          success(res) {
            if (res.authSetting['scope.userLocation']) {
              that.getLocation(callback, true)
            }
          }
        })
      }
    })
  }

})