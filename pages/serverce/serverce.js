// index/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['擅长', '等级', '好评率'], //分类
    tab: [true, true, true],
    pinpaiList: [],
    pinpai_id: 0, //品牌
    pinpai_txt: '',
    jiage_id: 0, //价格
    jiage_txt: '',
    xiaoliang_id: 0, //销量
    xiaoliang_txt: '',
    details: [],
  },
  onLoad() {
    this.getClassifyList()
    this.getDataList()
  },
  // 跳转到提交详情
  navigateTo(e) {
    // console.log(e)
    let sid = e.currentTarget.dataset.sid
    wx.navigateTo({
      url: '/pages/submitServer/submitServer?sid=' + sid,
    })
  },
  // 获取品牌分类
  getClassifyList: function() {
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
          // console.log(res)
          let pinpaiList = res.data
          self.setData({
            pinpaiList
          })
        })
      },
    })
  },
  // 选项卡
  filterTab: function(e) {
    var data = [true, true, true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  //筛选项点击操作
  filter: function(e) {
    let self = this
    console.log(e)
    let id = e.currentTarget.dataset.id
    let txt = e.currentTarget.dataset.txt
    let tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          jiage_id: id,
          jiage_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          xiaoliang_id: id,
          xiaoliang_txt: txt
        });
        break;
    }
    //数据筛选
    self.getDataList();
  },

  //加载数据
  getDataList: function() {
    //调用数据接口，获取数据
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      type: 2,
      degree: this.data.jiage_id || '',
      sale_type: this.data.pinpai_id || ''
    }
    console.log(data)
    app._api.getServercesList(data, res => {
      console.log(res)
      this.setData({
        details: res.data
      })
    })

  }

})