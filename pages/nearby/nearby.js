const app = getApp()


Page({
  data: {
    markers: [{
      iconPath: '/images/djIcon.png',
      id: 0,
      latitude: 30.64252,
      longitude: 104.04411,
      width: 20,
      height: 20
    }],
    text: '平台派单成功，等待接单',
    textStatus: true,
    close: false
  },
  //引入数据库
  onLoad: function(options) {
    console.log(options)
    let self = this;
    let order_id = options.order_id
    app._api.getDJList({
      order_id
    }, res => {
      console.log(res)
      let list = res.data
      list.forEach((val, index) => {
        val['iconPath'] = val.type == 1 ? "/images/djIcon.png" : "/images/zfIcon.png"
        val['id'] = index
        val['latitude'] = val['lat']
        val['longitude'] = val['lng']
        val['width'] = 20
        val['height'] = 20
        val['callout'] = {
          content: val.type == 1 ? "代驾" : "专服",
          color: '#fff',
          fontSize: 12,
          padding: 6,
          display: "ALWAYS",
          bgColor: "#4a94ff",
          borderRadius: 8,
          textAlign: 'center'
        }
      })
      self.setData({
        markers: list
      })
    })
    wx.getLocation({
      success: function(res) {
        console.log(res)
        self.setData({
          lng: res.longitude,
          lat: res.latitude
        })
      },
    })
  },
  // 切换页面以后隐藏弹窗
  onHide() {
    let self = this;
    self.setData({
      close: true
    })
  },
  // 跳转到详情
  showDetail() {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  //取消代驾订单
  cancelDJOrder() {
    let self = this;
    let data = {
      order_detail_id: self.data.order_detail_id_zf,
      type: 1
    }
    let status = self.data.status
    wx.showModal({
      title: '温馨提示',
      content: '是否取消代驾的预约',
      success: res => {
        if (res.confirm) {
          if (status == false) {
            wx.showToast({
              title: '取消成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: -2
              })
            }, 2000)
          } else {
            app._api.cancelServer(data, res => {
              console.log(res)
              if (res.status == 1) {
                wx.showToast({
                  title: '取消成功',
                })
                self.setData({
                  close: true
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: -2
                  })
                }, 2000)
              }
            })
          }
        }
      }
    })
  },
  //取消代驾订单
  cancelZFOrder() {
    let self = this;
    let data = {
      order_detail_id: self.data.order_detail_id_zf,
      type: 3
    }
    let status = self.data.status
    wx.showModal({
      title: '温馨提示',
      content: '是否取消专服的预约',
      success: res => {
        if (res.confirm) {
          if (status == false) {
            wx.showToast({
              title: '取消成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: -2
              })
            }, 2000)
          } else {
            app._api.cancelServer(data, res => {
              console.log(res)
              if (res.status == 1) {
                wx.showToast({
                  title: '取消成功',
                })
                self.setData({
                  close: true
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: -2
                  })
                }, 2000)
              }
            })
          }
        }
      }
    })
  }
})