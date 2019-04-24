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
    ID_first: "/images/user/upload.png",
    zz: "/images/user/upload.png",
    zz_on: '',
    zf: "/images/user/upload.png",
    zf_on: '',
    zg: "/images/user/upload.png",
    zg_on: '',
    sy: "/images/user/upload.png",
    sy_on: '',
    degree: [{
      id: 1,
      type: "初级"
    }, {
      id: 2,
      type: "中级"
    }, {
      id: 3,
      type: "高级"
    }, {
      id: 4,
      type: "技师"
    }, {
      id: 5,
      type: "高级技师"
    }],
    degreeArr: [],
    dIndex: 0,
    degreeId: 1,
    ID_second: '',
    infos: {
      deposit: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const type = options.type;
    let degreeArr = this.data.degree.map(item => item.type)
    this.setData({
      select: type,
      degreeArr
    })
    // 获取酒的分类
    this.getClassifyList(type)
    this.getClothesPrice(type)

  },
  // 获取之前的申请资料
  getApplyStatus(type, classType) {
    app._api.applyStatus({
      mid: app.globalData.mid || wx.getStorageSync("mid")
    }, res => {
      this.setData({
        classType
      })
      console.log(res.data)

      if (res.data == null) {
        return false
      }
      if (res.data.status == 0 || res.data.status == 1 || res.data.status == 3) {
        let list = res.data
        console.log(res)
        if (type != list.type) {
          if (this.data.select == 1) {
            list.images = ['', '']
          } else {
            list.images = ['']
          }
        }
        let location = {
          lat: list.lat,
          lng: list.lng
        }
        console.log(classType)
        classType.forEach((val1, index) => {
          list.sale_type.forEach((val2, index) => {
            if (val2 == val1.id) {
              val1['checked'] = true
            }
          })
        })
        this.setData({
          list,
          app,
          location,
          classType,
          sale_type: list.sale_type.toString(),
        })
      }
      if (res.data.status == 2) {
        this.setData({
          btnStatus: hiden
        })
      }
    })
  },
  // 获取酒的分类
  getClassifyList: function(type) {
    let self = this;
    wx.getLocation({
      success: function(res) {
        let lat = res.latitude;
        let lng = res.longitude
        app._api.manuList({
          mid: app.globalData.mid || wx.getStorageSync('mid'),
          lat,
          lng
        }, res => {
          console.log(res)
          let classType = res.data
          self.getApplyStatus(type, classType)
        })
      },
    })

  },
  // 获取服装押金
  getClothesPrice(type) {
    app._api.getClothesPrice({
      type
    }, res => {
      console.log(res)
      let infos = res.data
      this.setData({
        infos
      })
    })
  },
  // 调酒师选择等级
  bindNumChange(e) {
    // console.log(e)
    let index = e.detail.value
    this.setData({
      dIndex: index,
      degreeId: this.data.degree[index].id
    })
  },
  // 获取调酒师的特长
  checkboxChange(e) {
    let val = e.detail.value
    let sale_type = val.toString()
    this.setData({
      sale_type
    })
  },
  //获取地址
  getLocation() {
    app.getLocation(res => {
      console.log(res)
      demo.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: (rs) => {
          console.log(rs)
          this.setData({
            address: rs.result.address || res.result.name,
            cityInfo: rs.result.address_component,
            // ad: rs.result.ad_info //包含区域ID
            location: rs.result.ad_info.location
          })
        },
      })
    })
  },
  // 获取专服收服装地址
  address2(e) {
    // console.log(e)
    let address2 = e.detail.value
    this.setData({
      address2
    })
  },
  // 上传图片
  uploadImg(e) {
    // console.log(e)
    let type = e.currentTarget.dataset.type;
    // console.log(type)
    app._api.upLoadImgs(e, (url, icon) => {
      // console.log(url, icon)
      if (type == "ID_first") {
        this.setData({
          ID_first_on: url,
          ID_first: icon
        })
      }
      if (type == "ID_second") {
        this.setData({
          ID_second_on: url,
          ID_second: icon
        })
      }
      if (type == "zz") {
        this.setData({
          zz_on: url,
          zz: icon
        })
      }
      if (type == "zf") {
        this.setData({
          zf_on: url,
          zf: icon
        })
      }
      if (type == "zg") {
        this.setData({
          zg_on: url,
          zg: icon
        })
      }
      if (type == 'sy') {
        this.setData({
          sy_on: url,
          sy: icon
        })
      }
    })
  },
  // 提交申请
  submit: function(e) {
    console.log(e)
    let self = this;
    let {
      name,
      phone,
      address,
      idcard,
      goods,
      address2
    } = e.detail.value;
    // 获取之前的填写数据
    if (self.data.ID_first == '/images/user/upload.png') {
      wx.showToast({
        title: '请上传身份证',
        icon: "none"
      })
      return false
    }
    if (address2 == '') {
      wx.showToast({
        title: '请填写服装收货地址',
        icon: "none"
      })
      return false
    }
    if (self.data.select == 1 && self.data.zz == '/images/user/upload.png') {
      wx.showToast({
        title: '请上传驾照证明图片',
        icon: "none"
      })
      return false
    }
    if (self.data.select == 1 && self.data.zf == '/images/user/upload.png') {
      wx.showToast({
        title: '请上传驾照反面图片',
        icon: "none"
      })
      return false
    }
    if (self.data.select == 2 && self.data.zg == '/images/user/upload.png') {
      wx.showToast({
        title: '请上传资格证明',
        icon: "none"
      })
      return false
    }
    if (self.data.select == 3 && self.data.sy == '/images/user/upload.png') {
      wx.showToast({
        title: '请上传一张素颜照',
        icon: "none"
      })
      return false
    }
    if (self.data.select == 1) {

      let {
        zz_on,
        zf_on,
        ID_first_on,
        ID_second_on
      } = self.data
      app._api.removeImg({
        image: [zz_on, zf_on, ID_first_on, ID_second_on]
      }, res => {
        console.log(res)
        if (res.msg == "成功") {
          self.setData({
            zz_on: res.data[0],
            zf_on: res.data[1],
            ID_first_on: res.data[2],
            ID_second_on: res.data[3]
          })
          self.applySecond(e)
        }
      })
    }
    if (self.data.select == 2) {
      let {
        zg_on,
        ID_first_on,
        ID_second_on
      } = self.data
      app._api.removeImg({
        image: [zg_on, ID_first_on, ID_second_on]
      }, res => {
        console.log(res)
        if (res.msg == "成功") {
          self.setData({
            zg_on: res.data[0],
            ID_first_on: res.data[1],
            ID_second_on: res.data[2]
          })
          self.applySecond(e)

        }
      })
    }
    if (self.data.select == 3) {
      let {
        ID_first_on,
        ID_second_on,
        sy_on
      } = self.data
      app._api.removeImg({
        image: [ID_first_on, ID_second_on, sy_on]
      }, res => {
        console.log(res)
        if (res.msg == "成功") {
          self.setData({
            ID_first_on: res.data[0],
            ID_second_on: res.data[1],
            sy_on: res.data[2]
          })
          self.applySecond(e)
        }
      })
    }
    if (name == "" || phone == "" || address == "" || idcard == "" || goods == "") {
      wx.showToast({
        title: '请填写所需资料',
        icon: "none"
      })
      return false
    }
  },
  applySecond(e) {
    let self = this;
    wx.showLoading({
      title: '提交中...',
    })
    let {
      name,
      phone,
      address,
      idcard,
      goods,
      height,
      weight,
      address2
    } = e.detail.value;
    let select = self.data.select
    let list = self.data.list || void 0
    // console.log(list.images)
    let images = ''
    if (select == 2) {
      images = [self.data.zg_on]
    }
    if (select == 1) {
      images = [self.data.zz_on, self.data.zf_on]
    }
    let data = {
      mid: app.globalData.mid, //用户mid
      type: self.data.select, //1 - 代驾 2-调酒师 3-专服人员
      realname: name, //用户真实姓名
      tel: phone, // 用户联系电话          以上参数必需
      idcard_images: [self.data.ID_first_on, self.data.ID_second_on], // '身份证正反面',
      idcard,
      lat: self.data.location.lat, //纬度
      lng: self.data.location.lng, //经度
      address: address,
      images: images, //'用户证件正反面图片',
      degree: self.data.degreeId,
      sale_type: self.data.sale_type || '',
      address2, //填写服装收货地址
      height,
      weight,
      photo: self.data.sy_on
    }
    console.log(data)
    // return false
    app._api.submitApply(data, res => {
      console.log(res)
      if (res.status == 1) {
        let service_waiter_id = res.data
        let nextStep = self.data.infos.is_free; //判断服装押金
        if (nextStep == 1) {
          wx.showToast({
            title: '提交成功，等待审核',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            })
          }, 2000)
          return false
        }
        app._api.payMoney({
          mid: app.globalData.mid || wx.getStorageSync('mid'),
          service_waiter_id: res.data
        }, res => {
          console.log(res)
          wx.hideLoading()
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
                title: '支付失败',
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
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      return false
      if (res.status == 1) {
        wx.showToast({
          title: '申请成功,请等待审核',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: -2
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: -1
          })
        }, 2000)
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})