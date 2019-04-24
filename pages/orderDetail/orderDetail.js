const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

// 实例化API核心类
const qqmapsdk = new QQMapWX({
  key: '4SYBZ-VC7WX-LLE4K-ZDFLL-HETK6-AMFWN' // 必填
});
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()


Page({
  data: {
    polyline: [],
    markers: [],
    buttonText: "开始代驾",
    disable: false,
    orderId: 0,
    status: 0,
    distance: 0,
    suggestion: [],
    toLocation: ''
  },
  // / 开始录音的时候
  start: function() {
    const options = {
      duration: 600000, //指定录音的时长，单位 ms
      // duration: 6000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function() {
    let self = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      self.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
      app._api.uploadRadio(tempFilePath, res => {
        console.log(res)
        let data = {
          fid: res.data,
          order_detail_id: self.data.orderId
        }
        app._api.upLoadRadioId(data, res => {
          console.log(res)
        })
      })
    })
  },

  onLoad: function(options) {
    var _this = this;
    _this.setData({
      options: options
    })
    // 获取司机的当前位置
    wx.getLocation({
      success: (res) => {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      }
    })
    app.globalData.otherPage = true
    wx.setNavigationBarTitle({
      title: '导航',
    })
    console.log(options)
    let status = options.status
    _this.setData({
      type: app.globalData.type || wx.getStorageSync('type'),
      orderId: options.orderId,
      status
    })
    //起始点的经纬度
    let location = JSON.parse(options.location)
    console.log(location)

    _this.setData({
      startLocation: location
    })
    let aim_location = JSON.parse(options.toLocation)
    // console.log(aim_location)
    if (status == '4') {
      let toLocation = {
        lat: aim_location.lat,
        lng: aim_location.lng
      }
      _this.setData({
        backfill: options.aim_address,
        status,
        buttonText: "结束代驾",
        toLocation
      })
      setInterval(() => {
        _this.start()
        setTimeout(() => {
          _this.stop()
        }, 600000)
      }, 600000)
      setInterval(() => {
        _this.updateLocation(location, toLocation)
      }, 5000)
    }
  },

  // 代驾开始任务
  goDetail() {
    let _self = this
    let status = _self.data.status
    let toLocation = _self.data.toLocation
    let startLocation = _self.data.startLocation
    if (toLocation == '') {
      wx.showToast({
        title: '请选择目的地',
        icon: "none"
      })
      return false
    }
    let data = {
      mid: app.globalData.mid || wx.getStorageSync("mid"), //   服务人员用户id
      status: 3, // 1接受订单  2拒绝订单 3开始服务 4结束服务
      order_detail_id: _self.data.orderId, //  子订单id
      lat: startLocation.lat,
      lng: startLocation.lng,
      aim_lat: toLocation.lat.toFixed(5),
      aim_lng: toLocation.lng.toFixed(5),
      aim_address: _self.data.backfill
    }
    console.log(data)
    app._api.getAnticipate(data, res => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '开始计费，系统已经开始录音',
          icon: "none"
        })
        // 上传录音 
        _self.start()
        setInterval(() => {
          _this.start()
          setTimeout(() => {
            _this.stop()
          }, 600000)
        }, 600000)
        _self.setData({
          buttonText: "结束任务",
          status: 4
        })
      }
    })
  },
  // 结束任务
  endTask() {
    let _self = this
    let status = _self.data.status
    // let toLocation = _self.data.toLocation
    // let startLocation = _self.data.startLocation
    wx.getLocation({
      success: function(res) {
        let lat = res.latitude
        let lng = res.longitude
        let data = {
          mid: app.globalData.mid || wx.getStorageSync("mid"), //   服务人员用户id
          status: 4, // 1接受订单  2拒绝订单 3开始服务 4结束服务
          order_detail_id: _self.data.orderId, //  子订单id
          lat,
          lng,
          aim_lat: 0,
          aim_lng: 0,
          aim_address: 0
        }
        console.log(data)
        app._api.getAnticipate(data, res => {
          console.log(res)
          if (res.status == 1) {
            wx.showToast({
              title: '结束成功，提醒用户确认付款',
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
    })


  },
  // 获取输入的终点的值
  bindInput(e) {
    // console.log(e)
    var _this = this;
    let address = e.detail.value
    if (address == '') {
      _this.setData({
        isShow: false,
        suggestion: []
      })
      return false
    } else {
      _this.setData({
        isShow: true,
      })
    }
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) { //搜索成功后的回调
        // console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  //数据回填方法
  backfill: function(e) {
    console.log(e)
    let seif = this
    let index = e.currentTarget.dataset.index
    let info = seif.data.suggestion[index]
    console.log(info)
    seif.setData({
      backfill: info.title,
      toLocation: {
        lat: info.latitude,
        lng: info.longitude
      },
      isShow: false,
      suggestion: []
    });
    let toLocation = {
      lat: info.latitude,
      lng: info.longitude
    }
    let location = seif.data.startLocation
    setInterval(() => {
      seif.updateLocation(location, toLocation)
    }, 5000)
  },

  // 更新位置
  updateLocation(location, aimLngLat) {
    let _this = this;
    _this.getCenterLocation(location, aimLngLat);

    // return false
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving', //'transit'(公交路线规划)
      //from参数不填默认当前地址
      from: `${location.lat},${location.lng}`, //起点经纬度  (纬度，经度)
      to: `${aimLngLat.lat},${aimLngLat.lng}`, //终点经纬度
      success: function(res) {
        // console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        // console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: "#00ae20",
            width: 4,
            dottedLine: false
          }],
          distance: ret.result.routes["0"].distance,
          cost: ret.result.routes["0"].duration
        })
        // console.log(ret.result.routes["0"].distance)
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  //  两个坐标 一个下单地址，一个接单地址，然后不停的更新配送员的坐标位置。
  getCenterLocation: function(res, location) {
    this.setData({
      markers: [{
          iconPath: "/images/order/center.png",
          id: 0,
          latitude: res.lat,
          longitude: res.lng,
          width: 30,
          height: 30,
          alpha: 0.8,
          callout: {
            content: " 起始位置 ",
            color: "#ffffff",
            fontSize: 10,
            borderRadius: 10,
            bgColor: "#6e707c",
            padding: 5,
            display: "ALWAYS"
          }
        },
        {
          iconPath: "/images/order/location.png",
          id: 1,
          latitude: location.lat,
          longitude: location.lng,
          width: 30,
          height: 30,
          alpha: 0.8,
          callout: {
            content: " 终点位置 ",
            color: "#ffffff",
            fontSize: 10,
            borderRadius: 10,
            bgColor: "#6e707c",
            padding: 5,
            display: "ALWAYS"
          }
        }
      ],
    });
  },
  onHide() {
    app.globalData.otherPage = null
  }
});