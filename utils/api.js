// const host = 'http://www.xiyuanchun.com/'
const host = 'https://xyc.dianshenwang.cn/'
// const host = 'https://xcx.dianshenwang.cn/'

// 请求 promise 封装
const _http = {
  get: function(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: host + url,
        data,
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        },
        fail: err => {
          reject(err.data)
        }
      })
    })
  },

  post: function(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: host + url,
        data,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        },
        fail: err => {
          reject(err.data)
        }
      })
    })
  }
}

const errFnc = function(err) {
  console.log(err)
  const message = err.data ? err.data.msg : err
  wx.showToast({
    title: message,
    image: '/images/icon/cry.png',
    // icon: "none"
  })
}

const api = {
  host: host + 'upload/',
  /**
   * 登录获取 token
   * @param {object} data  {code, iv, encryptedData}
   * @param {function} cb 回调
   */
  login(data, cb) {
    _http.post('api/login/Login', data)
      .then(res => {
        typeof cb === 'function' && cb(res)
      })
      .catch(err => {
        errFnc(err)
      })
  },
  /**
   * 获取首页的商品数据
   */
  getIndexGoods(data, cb) {
    _http.post('api/index/getIndexList', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取首页的banner，视频和分类
   */
  getIndexBanner(cb) {
    _http.post('api/index/getIndexBanner').then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 根据商品ID获取商品详情
   */
  getGoodsDetail(data, cb) {
    _http.post('api/index/getGoodsInfoByGoodsId', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 提交用户的反馈内容
   */
  submitFeedBack(data, cb) {
    _http.post('api/person/feedback', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取常见问题
   */
  getQuestionList: function(cb) {
    _http.post('api/person/member_answer').then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取产品的分类
   */
  manuList(data, cb) {
    _http.post('api/product/getGoodsList', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 根据分类ID获取产品列表
   */
  getClassifyList(data, cb) {
    _http.post('api/index/getGoodsInfoByClassify', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 上传图片
   */
  upLoadImgs: function(type, cb) {
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res)
        let tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        // console.log(`${host}api/upload/uploadImages`)
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        // for (var i = 0, h = tempFilePaths.length; i < h; i++) {
        wx.uploadFile({
          url: `${host}api/upload/uploadImages`,
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            'imgIndex': 0
          },
          header: {
            // "Content-Type": "multipart/form-data"
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            // console.log(res)
            wx.hideToast()
            // console.log(res.data)
            var image = JSON.parse(res.data);
            // console.log(image.data)
            let url = image.data
            let icon = tempFilePaths[0]
            typeof cb === "function" && cb(url, icon)
          }
        })
        // }
      }
    })
  },
  /***
   * 移动临时图片的路径
   */
  removeImg(data, cb) {
    _http.post('api/upload/removeImageAll', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 提交申请
   */
  submitApply(data, cb) {
    _http.post('api/person/apply_waiter', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取用户的申请状态
   */
  applyStatus(data, cb) {
    _http.post('api/person/get_my_apply_info', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户添加商品到购物车
   */
  addToCart(data, cb) {
    _http.post('api/person/add_goods', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取购物车的列表
   */
  getCartList(data, cb) {
    _http.post('api/person/get_shopping_cart', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 删除购物车商品
   */
  delCart(data, cb) {
    _http.post('api/person/del_cart', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户支付商品
   */
  payGoods(data, cb) {
    _http.post('api/person/create_order', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户发起微信支付
   */
  payWeiChat(data, cb) {
    _http.post('api/fund/pay_order', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户确认支付结果
   */
  payResult(data, cb) {
    _http.post('api/fund/pay_result', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  // 增加购物车的商品数量
  updataGoodsNum(data, cb) {
    _http.post('api/person/update_shopping_cart', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户直接购买
   */
  redictToBuy(data, cb) {
    _http.post('api/person/create_order_goods', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取用户的个人中心的订单
   */
  getOrderList(data, cb) {
    _http.post('api/person/get_order_list', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取定制项的调酒师列表
   */
  getServicesList(data, cb) {
    _http.post('api/Customized/getServerList', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 业务人员获取评价
   */
  getAssessList(data, cb) {
    _http.post('api/person/getCommentByMid', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  // 实时上传工作人员的定位信息
  uploadLocation(data, cb) {
    _http.post('api/listen/updateLatLng', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //轮训我的任务
  getMyTasks(data, cb) {
    _http.post('api/listen/get_my_task', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //业务人员进行抢单操作
  getAnticipate(data, cb) {
    _http.post('api/person/server_operate_order', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //业务人员获取我的订单
  getMyOrderLists(data, cb) {
    _http.post('api/person/server_order_list', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  // 业务人员结束订单操作
  endMyTasks(data, cb) {
    _http.post('api/person/finishOrder', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //用户对业务人员的服务进行评价
  toAssessServices(data, cb) {
    _http.post('api/person/access', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //获取后台设置的业务的单价和免费时间
  getPriceAndTime(cb) {
    _http.post('api/person/getServerceTime').then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //更新后台的时间
  upTimeOrder(data, cb) {
    _http.post('api/person/updateOrder', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //获取业务人员的业绩情况
  getAchievement(data, cb) {
    _http.post('api/person/getAchievement', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  //查询订单下面的子订单
  getChildOrder: function(data, cb) {
    _http.post('api/person/getOrderChildren', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 个人用户获取订单详情
   * */
  getOrderDetail(data, cb) {
    _http.post('api/person/getOrderDetail', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户支付超时的订单
   */
  toPay(data, cb) {
    _http.post('api/product/pay_order_other', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 支付超时订单回调
   */
  resultRePay(data, cb) {
    _http.post('api/product/pay_result_other', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户确认业务员的工作
   */
  confirmOrder(data, cb) {
    _http.post('api/person/comfirm_order', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户提交评价
   */
  submitAssess(data, cb) {
    _http.post('api/person/assess', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 业务人员获取提现
   */
  myWallet(data, cb) {
    _http.post('api/person/getMoneyRecorde', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 业务人员的提现记录
   */
  withDraw(data, cb) {
    _http.post('api/person/getWithDraw', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户的提现记录
   */
  getWithDraw(data, cb) {
    _http.post('api/person/withDraw', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 缴纳服装费
   */
  payMoney(data, cb) {
    _http.post('api/fund/pay_order_server', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户确认付款
   */
  applyMakeSure(data, cb) {
    _http.post('api/fund/pay_result_server', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户查询填写的资料
   */
  getApplyInfo(data, cb) {
    _http.post('api/person/get_my_apply_info', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 添加调酒师的订单
   */
  addTjsOrder(data, cb) {
    _http.post('api/person/add_barman', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取服务人员列表
   */
  getServercesList(data, cb) {
    _http.post('api/Customized/getServerList', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 添加代驾的预约单
   */
  addDJOrder(data, cb) {
    _http.post('api/person/add_driver', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 添加专服的预约单
   */
  addZfOrder(data, cb) {
    _http.post('api/person/add_server', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取用户的我的预约单
   */
  getUserSubOrder(data, cb) {
    _http.post('api/person/get_server_list', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取用户的设置按钮
   */
  getSetted(data, cb) {
    _http.post('api/person/update_job_status', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户支付超时的金额
   */
  userPay(data, cb) {
    _http.post('api/fund/pay_order_out_time', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户超时支付的回调
   */
  userResult(data, cb) {
    _http.post('api/fund/pay_result_out_time', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * =上传录音文件
   */
  uploadRadio(temp, cb) {
    wx.uploadFile({
      url: `${host}api/upload/uploadeVideo`,
      filePath: temp,
      name: 'file',
      formData: {
        'imgIndex': 0
      },
      header: {
        // "Content-Type": "multipart/form-data"
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        var res = JSON.parse(res.data);

        typeof cb === "function" && cb(res)
      }
    })
  },
  // 上传文件和ID绑定
  upLoadRadioId(data, cb) {
    _http.post('api/upload/add_video_id', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户收货操作
   */
  receiveGoods(data, cb) {
    _http.post('api/person/update_order_status', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户取消订单
   */
  cancelGoods(data, cb) {
    _http.post('api/person/cancel_order', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 用户取消预约单
   */
  cancelServer(data, cb) {
    _http.post('api/person/cancel_server', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取后台的服装押金
   */
  getClothesPrice(data, cb) {
    _http.post('api/person/get_param', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 获取附近的代驾列表
   */
  getDJList(data, cb) {
    // listen/getNearServers
    _http.post('api/listen/getNearServers', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 授权获取用户的手机号
   */
  getUserPhone(data, cb) {
    _http.post('api/login/getPhone', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 单独取消预约单
   */
  cancelyy(data, cb) {
    _http.post('api/person/cancel_server_by_orderid', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  },
  /**
   * 查询订单的接单情况
   */
  getServerStatus(data, cb) {
    _http.post('api/listen/getOrderStatus', data).then(res => {
      typeof cb === 'function' && cb(res)
    }).catch(err => {
      errFnc(err)
    })
  }
}


export default {
  api,
  errFnc
}