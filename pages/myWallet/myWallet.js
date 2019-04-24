// pages/myWallet/myWallet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getWallet()
    this.history()
    // 获取手机号
    let phone = app.globalData.phone || 0
    console.log(phone)
    this.setData({
      phone
    })
  },
  getWallet: function() {
    app._api.myWallet({
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }, res => {
      console.log(res)
      this.setData({
        wallet: res.data
      })
    })
  },

  // 绑定用户的手机号
  getPhoneNumber(e) {
    let info = e.detail;
    let phone = this.data.phone
    if (phone == 0) {
      wx.login({
        success: res => {
          // console.log(res)
          let js_code = res.code
          let data = {
            mid: app.globalData.mid || wx.getStorageSync('mid'),
            js_code,
            encryptedData: encodeURIComponent(info.encryptedData),
            iv: info.iv,
          }
          // console.log(data)
          app._api.getUserPhone(data, res => {
            console.log(res)
            if (res.status == 1) {
              app.globalData.phone = res.data
              this.setData({
                phone: res.data
              })
              setTimeout(() => {
                this.withdraw()
              }, 1000)
            }
          })
        }
      })
    }
  },
  //提现
  withdraw: function() {
    let phone = this.data.phone
    // console.log(phone)
    if (phone != 0) {
      let data = {
        mid: app.globalData.mid || wx.getStorageSync('mid'),
        number: this.data.wallet.money
      }
      if (data.number == 0) {
        wx.showToast({
          title: '暂无可提现金额',
          icon: 'none'
        })
        return false
      }
      console.log(data)
      app._api.getWithDraw(data, res => {
        console.log(res)
        if (res.status == 1) {
          // let bonuses_id = res.data.bonuses_id
          wx.showToast({
            title: res.msg,
          })
          setTimeout(() => {
            this.onLoad()
          }, 1000)
        }
      })
    }
  },
  // 提现记录
  history() {
    app._api.withDraw({
      mid: app.globalData.mid || wx.getStorageSync('mid')
    }, res => {
      console.log(res)
      this.setData({
        history: res.data
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