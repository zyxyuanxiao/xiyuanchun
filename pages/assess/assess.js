const app = getApp();
Page({
  data: {
    staticImg: app.globalData.staticImg,
    current: 0,
    attitude: true,
    time: true,
    efficiency: true,
    environment: true,
    professional: true,
    userStars: [
      "/images/full.png",
      "/images/full.png",
      "/images/full.png",
      "/images/full.png",
      "/images/full.png",
    ],
    assessItem: [{
        id: 1,
        name: "服务态度好",
        status: false
      },
      {
        id: 2,
        name: "发货快",
        status: false
      },
      {
        id: 3,
        name: "效率高",
        status: false
      }, {
        id: 4,
        name: "很专业",
        status: false
      }
    ],
    wjxScore: 5,
    // textarea
    min: 5, //最少字数
    max: 300, //最多字数 (根据自己需求改变) 
    pics: [],
  },
  // 星星点击事件
  starTap: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    console.log(index)
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "/images/full.png";
        that.setData({
          wjxScore: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "/images/half.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars: tempUserStars
    })
  },
  // 标签
  label: function(e) {
    console.log(e)
    var that = this;
    let index = e.currentTarget.dataset.index;
    let assessItem = that.data.assessItem
    assessItem[index].status = !assessItem[index].status
    // return false
    that.setData({
      assessItem: assessItem
    })
  },
  // 留言
  //字数限制  
  inputs: function(e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  // 图片
  choose: function(e) { //这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {

        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        console.log(pics);
        // console.log(imgsrc);
        that.setData({
          pics: pics,
          // console.log(pics),
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },
  uploadimg: function() { //这里触发图片上传的方法
    var pics = this.data.pics;
    console.log(pics);
    app.uploadimg({
      url: 'https://........', //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组
    });
  },
  onLoad: function(options) {
    console.log(options)
    let servermid = options.servermid;
    let orderid = options.orderid
    this.setData({
      servermid,
      orderid
    })
  },
  // 删除图片
  deleteImg: function(e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  // 提交评论
  submitAssess: function(e) {
    console.log(e)
    let more = e.detail.value.more;
    let wjxScore = this.data.wjxScore


    // 'mid'                     评价人id
    // 'order_detail_id'         预订订单id
    // 'serverce_mid'            被评价人id
    // 'content_score'           评价分数             评价内容 
    let data = {
      mid: app.globalData.mid || wx.getStorageSync('mid'),
      order_detail_id: this.data.orderid,
      serverce_mid: this.data.servermid,
      content_score: wjxScore,
      content: more
    }
    console.log(data)
    app._api.submitAssess(data, res => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '评价成功',
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: -1
          })
        }, 2000)
      } else {
        wx.showToast({
          title: '提交失败',
          icon: "none"
        })
      }
    })
  }
})