// pages/setted/setted.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app._api.getSetted({
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      status: 3
    }, res => {
      // console.log(res)
      if (res.data.status == 2) {
        this.setData({
          checked: false
        })
      } else {
        this.setData({
          checked: true
        })
      }
    })
  },
  changeSetted(e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    let checked = e.detail.value
    if (checked == true) {
      app._api.getSetted({
        mid: app.globalData.mid || wx.getStorageSync('mid'),
        status: 1
      }, res => {
        // console.log(res)
        this.setData({
          checked: true
        })
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确认是否关闭接单？',
        success: res => {
          if (res.confirm) {
            app._api.getSetted({
              mid: app.globalData.mid || wx.getStorageSync('mid'),
              status: 2
            }, res => {
              console.log(res)
            })
          } else {
            this.setData({
              checked: true
            })
          }
        }
      })

    }
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