const App = getApp();
// pages/orderDetail/orderDetail.js
const request = require('../../../request')
const config = require('../../../config')

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    orderid: {
      type: String,
      value: "",
    },
    orderIndex: {
      type: String,
      value: ""
    }
  },
  data: {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,

    accountInfo: {},//用户信息

    resignArr: [],//改派人员列表
    workerClickIdx: -1,
    assignId: '',
    imgsArr: [],//上传图片数组
    uploadFileSuccessArr: [],//图片上传成功数组
    grayBgShow: false,
    grayBgStatus: false,
    popReassignShow: false,
    popReassignStatus: false,
    customerName: '',
    customerMobile: '',
    customerIdno: '',
    contactSname: '',
    contactSmobile: '',
    contactRname: '',
    contactRmobile: '',
    orderId: '',
    orderno: '',
    bagsNum: '',
    sendTime: '',
    takeTime: '',
    srcgps: '',
    srcaddress: '',
    destgps: '',
    destaddress: '',
    destaddrtype: '',
    status: '',
    appUserDistributorId: '',
    appUserName: '',
    appUserMobile: '',
    qrArr: [],
    bigImgsArr: [],//放大的图片数组
    bigImgsArr1: [],//放大的图片数组
    type: '',//交接方式
    remark: '',
    level3Clicked: false,//初级取派员改派按钮权限，点击过改派名单的确定按钮后，改派按钮消失
    neadfetch: '',
    FlightNum: '',//航班号
    baggageCodeList: [],//如果有行李待提取，下单时的行李编码
    baggageImgList: [],//如果有行李待提取，下单时的照片

    // 是否打开员工
    isshowstafflistpanel:false
  },

  attached() {
    this.init_orderdetails();
  },

  methods: {
    // 是否跳转注册页面
    init_orderdetails() {
      var maxcirclu = 1;
      var this_ = this;

      var getToken = setInterval(function () {
        if (maxcirclu <= 100) {
          maxcirclu = maxcirclu + 1;

          if (request.header.token) {
            // 获取当前登录用户信息
            this_.setData({
              accountInfo: wx.getStorageSync('accountInfo')
            })
            
            // 加载订单列表
            this_.loadData(this_.properties.orderid);
            
            clearInterval(getToken);
          }
        } else {

          // 结束循环
          clearInterval(getToken);
          return;

        }
      }, 10)
    },

    stopPageScroll: function () {
      return false
    },

    //点击查看大图
    previewImg: function (e) {
      var that = this
      var index = e.currentTarget.dataset.key
      var imgArr = that.data.bigImgsArr
      wx.previewImage({
        current: imgArr[index],     //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    previewImg1: function (e) {
      var that = this
      var index = e.currentTarget.dataset.key
      var imgArr = that.data.bigImgsArr1
      wx.previewImage({
        current: imgArr[index],     //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    //打电话
    callFunc: function (e) {
      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }

        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.mobile
        })
      })
    },
    // 扫描二维码
    scanCode: function () {
      var that = this
      if (that.data.status == 'PREPAID') {
        wx.showModal({
          content: '对不起,订单还未分配，您没有权限进行操作',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        })

        return false
      }
      if (that.data.appUserName != that.data.accountInfo.appUser.name) {
        wx.showModal({
          content: '对不起,这不是您的订单,您没有权限进行操作',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        })

        return false
      }
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        wx.scanCode({
          success(res) {
            console.log(res.result)
            const qrReg = /^QR\d{6}$/
            if (that.data.qrArr.length == that.data.bagsNum) {
              wx.showModal({
                content: '已全部扫描',
                confirmText: '确定',
                confirmColor: '#fbc400',
                showCancel: false
              })
              return false
            }
            if (that.data.qrArr.indexOf(res.result) >= 0) {
              wx.showModal({
                content: '这个QR码已经扫描过了',
                confirmText: '确定',
                confirmColor: '#fbc400',
                showCancel: false
              })
              return false
            }
            if (!qrReg.test(res.result)) {
              wx.showModal({
                content: 'QR码格式错误',
                confirmText: '确定',
                confirmColor: '#fbc400',
                showCancel: false
              })
              return false
            }

            var paramRepeat = res.result
            request.HttpRequst('/v2/order/qrIsRepet', 'GET', { qrCode: paramRepeat }).then(function (res1) {
              if (!res1.isRepet) {
                var qrStr = ''
                for (var i = 0; i < that.data.qrArr.length; ++i) {
                  qrStr += that.data.qrArr[i] + ','
                }
                qrStr += res.result

                var params = {
                  orderId: that.data.orderId,
                  qrCode: qrStr
                }

                wx.showLoading({
                  title: '加载中...',
                  mask: true
                })

                request.HttpRequst('/v2/order/saveQR', 'POST', params).then(function () {
                  wx.hideLoading();
                  that.loadData(that.data.orderId)
                })
              }
              else {
                wx.showModal({
                  content: 'QR码与其他订单重复',
                  confirmText: '确定',
                  confirmColor: '#fbc400',
                  showCancel: false
                })
                return false
              }
            })
          },
          fail(res) {
            // console.log(res)
            wx.showToast({
              title: '扫码失败',
              icon: 'none',
              duration: 1000,
              mask: true,
            })
          }
        })
      })
    },
    //上传照片
    addPics: function () {
      if (this.data.imgsArr.length >=6) {
        wx.showToast({
          title: '照片已达上线，无法在拍照',
          icon: 'none',
          duration: 2000,
        });
        return false
      }

      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        var picsArr = []
        wx.chooseImage({
          count: 6,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            if (tempFilePaths.length > 0) {
              for (var i = 0; i < tempFilePaths.length; ++i) {
                picsArr.push(tempFilePaths[i])
              }

              console.log(picsArr)
              that.uploadFunc(picsArr)
            }
          }
        })
      })
    },
    //多张图片上传
    uploadImg: function (data) {
      var that = this,
        upload_i = data.upload_i ? data.upload_i : 0,//当前上传的哪张图片
        success = data.success ? data.success : 0,//上传成功的个数
        fail = data.fail ? data.fail : 0;//上传失败的个数

      wx.showLoading({
        title: '上传中...',
      })

      wx.uploadFile({
        url: data.url,
        filePath: data.path[upload_i],
        name: 'file',//这里根据自己的实际情况改
        formData: null,//这里是上传图片时一起上传的数据
        success: function (resp) {
          if (JSON.parse(resp.data).msg == 'success') {
            success++;//图片上传成功，图片上传成功的变量+1
            that.data.uploadFileSuccessArr.push(JSON.parse(resp.data).url)
            console.log(that.data.uploadFileSuccessArr)
          }
        },
        fail: function (res) {
          fail++;//图片上传失败，图片上传失败的变量+1
          console.log('fail:' + upload_i + "fail:" + fail);
          wx.showModal({
            content: '上传图片失败',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false
          })

          return false
        },
        complete: function () {
          console.log(upload_i);
          upload_i++;//这个图片执行完上传后，开始上传下一张
          if (upload_i == data.path.length) {   //当图片传完时，停止调用
            console.log('执行完毕');
            console.log('成功：' + success + " 失败：" + fail);
            console.log('上传完成')
            console.log(data.paramsData)
            wx.hideLoading()
            that.uploadSuccessFunc(data.paramsData)
          } else {//若图片还没有传完，则继续调用函数
            data.upload_i = upload_i;
            data.success = success;
            data.fail = fail;
            that.uploadImg(data);
          }

        }
      })
    },
    //上传图片到图片空间成功后调用方法
    uploadSuccessFunc: function (params) {
      var that = this

      wx.showLoading({
        title: '保存',
      })

      if (that.data.uploadFileSuccessArr.length > 0) {
        for (var i = 0; i < that.data.uploadFileSuccessArr.length; ++i) {
          params.imgUrls.push(that.data.uploadFileSuccessArr[i])
        }
      }

      console.log('结果参数')
      console.log(params)

      request.HttpRequst('/v2/order/saveImg', 'POST', params).then(function (res) {
        console.log('结果')
        console.log(res)

        wx.hideLoading()

        that.setData({
          uploadFileSuccessArr: []
        })

        that.loadData(that.data.orderId)
      })
    },
    //上传图片
    uploadFunc: function (picsArr) {
      var that = this

      var params = {
        orderId: that.data.orderId,
        imgUrls: []
      }

      that.uploadImg({
        url: config.ipconfig + '/v2/img-storage/upload',
        path: picsArr,
        paramsData: params
      })
    },
    //点击接受按钮
    getFunc: function () {
      var that = this

      if (that.data.appUserName == '') {
        wx.showModal({
          content: '对不起,订单还未分配，您没有权限进行操作',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        })

        return false
      }

      wx.showLoading({
        title: '加载中...',
        mask: true
      });

      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        wx.hideLoading()
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        //判断后台是否是退单状态
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        //判断订单状态是否被别人操作导致状态修改
        if (res.data.order.status != that.data.status) {
          wx.showModal({
            content: '订单状态修改，请回到首页后重新进入查看最新订单详情',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        if (that.data.appUserName != that.data.accountInfo.appUser.name) {
          wx.showModal({
            content: '对不起,这不是您的订单,您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        if (that.data.qrArr.length == 0) {
          wx.showModal({
            content: '请先扫描行李QR码，再进行接收操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        if (that.data.qrArr.length != that.data.bagsNum) {
          wx.showModal({
            content: 'QR码数量和行李件数不相同',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        var params = {
          operateType: 'RECEIVE',
          orderId: that.data.orderId
        }

        request.HttpRequst('/v2/order/operate', 'POST', params).then(function (res) {

          that.setData({
            status: 'DELIVERYING'
          })
        })
      })
    },
    //点击送达按钮
    arriveFunc: function () {
      var that = this

      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        wx.hideLoading()
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        //判断订单状态是否被别人操作导致状态修改
        if (res.data.order.status != that.data.status) {
          wx.showModal({
            content: '订单状态修改，请回到首页后重新进入查看最新订单详情',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        if (that.data.appUserName != that.data.accountInfo.appUser.name) {
          wx.showModal({
            content: '对不起,这不是您的订单,您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        var params = {
          operateType: 'DELIVERY',
          orderId: that.data.orderId
        }

        request.HttpRequst('/v2/order/operate', 'POST', params).then(function (res) {

          that.setData({
            status: 'DELIVERYOVER'
          })
        })
      })
    },
    //点击完成按钮
    completeFunc: function () {
      var that = this

      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        wx.hideLoading()
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        //判断订单状态是否被别人操作导致状态修改
        if (res.data.order.status != that.data.status) {
          wx.showModal({
            content: '订单状态修改，请回到首页后重新进入查看最新订单详情',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        if (that.data.appUserName != that.data.accountInfo.appUser.name) {
          wx.showModal({
            content: '对不起,这不是您的订单,您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        var params = {
          operateType: 'FINISH',
          orderId: that.data.orderId
        }

        request.HttpRequst('/v2/order/operate', 'POST', params).then(function (res) {

          that.setData({
            status: 'COMPLETED'
          })
        })
      })
    },
    //寄件地址导航
    toNavSend: function (e) {
      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        var name = e.currentTarget.dataset.name
        var gps = JSON.parse(e.currentTarget.dataset.gps.replace(/\'/g, "\""))

        console.log(gps)

        wx.getLocation({//获取当前经纬度
          type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: Number(gps.lat),//要去的纬度-地址
              longitude: Number(gps.lng),//要去的经度-地址
              name: name,
              address: name
            })
          }
        })
      })
    },
    toRecord: function () {
      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }
        wx.navigateTo({
          url: '../log/log',
        })
      })
    },
    toFeedbackList: function (e) {
      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        wx.navigateTo({
          url: '../feedbackList/feedbackList',
        })
      })
    },
    //显示改派弹层
    showPopResign: function () {
      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.data.orderId, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showModal({
            content: '您没有权限进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reject/reject'
              })
            }
          })

          return false
        }
        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })

          return false
        }

        that.setData({
          isshowstafflistpanel:true
        }) 
        
      })
    },
   
    
    //改派方法
    sure_changeallow_staff: function (e) {
      var that = this

      var params = {
        userId: e.detail.id,
        orderIds: that.data.orderId
      }

      console.log(params)
      request.HttpRequst('/v2/order/anewAppoint', 'POST', params).then(function (res) {
        if(res.code != '0') {
          wx.showToast({
            title: '未改派成功',
            icon: 'none',
            duration: 2000,
          });
          return;
        }

        that.loadData(that.properties.orderid);

        // 关闭人员列表
        that.setData({
          isshowstafflistpanel: false
        }) 

        // 如果是三级
        if (that.data.accountInfo.appUser.level == '3') {
          // 改派给别人，所以要关闭订单详情列表，并且要刷新订单列表
          that.lowlevel_changeallow();
        } else {
          that._nonlowlevel_changeallow(e);
        }
      })
    },

    lowlevel_changeallow() {
      this.triggerEvent("lowlevel_changeallow");
    },

    _nonlowlevel_changeallow(e) {
      this.triggerEvent("nonlowlevel_changeallow", { "orderindex": this.properties.orderIndex, allowuser:e.detail});
    },

    //获取数据
    loadData: function (orderId) {
      var that = this
      console.info(orderId);
      request.HttpRequst('/v2/order/info/' + orderId, 'GET', {}).then(function (res) {
        console.info(res);

        wx.hideLoading();

        var curOrder = res.data

        

        that.setData({
          customerName: curOrder.customer.name,
          customerMobile: curOrder.customer.mobile,
          customerIdno: curOrder.customer.idno,
          orderId: curOrder.order.id,
          orderno: curOrder.order.orderno,
          contactSname: curOrder.orderContacter.sendername,
          contactSmobile: curOrder.orderContacter.senderphone,
          contactRname: curOrder.orderContacter.receivername,
          contactRmobile: curOrder.orderContacter.receiverphone,
          bagsNum: curOrder.order.num,
          srcgps: curOrder.orderAddress.srcgps,
          srcaddress: curOrder.orderAddress.srcaddress,
          destgps: curOrder.orderAddress.destgps,
          destaddress: curOrder.orderAddress.destaddress,
          destaddrtype: curOrder.orderAddress.destaddrtype,
          sendTime: curOrder.order.taketime.substring(0, 16),
          takeTime: curOrder.order.sendtime.substring(0, 16),
          status: curOrder.order.status,
          appUserDistributorId: curOrder.appUser ? curOrder.appUser.distributor3rd : '',
          appUserName: curOrder.appUser ? curOrder.appUser.name : '',
          appUserMobile: curOrder.appUser ? curOrder.appUser.mobile : '',
          imgsArr: curOrder.imgList ? curOrder.imgList : [],
          remark: curOrder.order.remark ? curOrder.order.remark : '',
          neadfetch: curOrder.order.neadfetch ? curOrder.order.neadfetch : '',
          FlightNum: curOrder.orderFlight ? curOrder.orderFlight.takeflightno : '',
          baggageCodeList: curOrder.baggageCodeList ? curOrder.baggageCodeList : [],
          baggageImgList: curOrder.baggageImgList ? curOrder.baggageImgList : [],
          level3Clicked: curOrder.primaryAnewAppoint ? curOrder.primaryAnewAppoint : false
        })

        if (curOrder.qr) {
          var qrStr = curOrder.qr.qrCode
          var arr = qrStr.split(",")
          that.setData({
            qrArr: arr
          })
        }

        var arrBigPic = []
        var num = 0;
        for (var i = 0; i < that.data.imgsArr.length; ++i) {
          arrBigPic.push(that.data.imgsArr[i].imgUrl)
        }

        that.setData({
          bigImgsArr: arrBigPic
        })

        var arrBigPic1 = []
        var num = 0;
        for (var i = 0; i < that.data.baggageImgList.length; ++i) {
          arrBigPic1.push(that.data.baggageImgList[i].imgurl)
        }

        that.setData({
          bigImgsArr1: arrBigPic1
        })

      })
    },

    
    // 关闭员工列表面板
    closestafflistpanel() {
      this.setData({
        isshowstafflistpanel: false
      });
    }
    
  },

  
})
