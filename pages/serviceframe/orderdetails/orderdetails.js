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

    upload_lugimg_succ_list: [],//图片上传成功数组

    resignArr: [],//改派人员列表
    workerClickIdx: -1,
    assignId: '',
    imgsArr: [],//上传图片数组

    orderdetails:{
      orderno:'',// 订单号
      num: 1,// 行李数
      flightNum: '',//航班号

    },
    

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

    appUserName: '',
    appUserMobile: '',
    qrArr: [],
    bigImgsArr: [],//放大的图片数组
    bigImgsArr1: [],//放大的图片数组
    type: '',//交接方式
    remark: '',
    level3Clicked: false,//初级取派员改派按钮权限，点击过改派名单的确定按钮后，改派按钮消失
    neadfetch: '',

    baggageCodeList: [],//如果有行李待提取，下单时的行李编码
    baggageImgList: [],//如果有行李待提取，下单时的照片

    orderallowstaff: false, // 订单是否分配取派员

    distributorId: '',// 该订单所属的三级分销商

    // 是否打开员工
    isshowstafflistpanel:false,

    // 是否打开日志
    isshowRecord:false
  },

  attached() {
    this.setData({
      accountInfo: wx.getStorageSync('accountInfo')
    })
    this.loadorderdetails();
  },

  methods: {
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
            const qrReg = /^JPQR\d{6}$/
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
                  orderId: that.properties.orderid,
                  qrCode: qrStr
                }

                wx.showLoading({
                  title: '加载中...',
                  mask: true
                })

                request.HttpRequst('/v2/order/saveQR', 'POST', params).then(function () {
                  wx.hideLoading();
                  that.loadorderdetails(that.properties.orderid)
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
      var that = this
      //判断后台是否是退单状态
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showToast({
            title: '您没有权限进行操作',
            icon: 'none',
            duration: 2000,
          });

          wx.redirectTo({
            url: '../reject/reject'
          })

          return false
        }

        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          
          wx.showToast({
            title: '退单中，请稍后进行操作',
            icon: 'none',
            duration: 2000,
          });

          return false
        }

        wx.chooseImage({
          count: 6 - that.data.imgsArr.length,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            that.upload_lug_Img(tempFilePaths)
          }
        })
      })
    },


    //多张图片上传
    upload_lug_Img (lugimgpathlist) {
      var that = this;

      wx.showLoading({
        title: '上传中...',
      })

      var uploadcomplete = 0;
      for (var i = 0; i < lugimgpathlist.length; i++) {
        wx.uploadFile({
          url: config.ipconfig + '/v2/img-storage/upload',
          filePath: lugimgpathlist[i],
          name: 'file',//这里根据自己的实际情况改
          formData: null,//这里是上传图片时一起上传的数据
          success: function (resp) {
            if (JSON.parse(resp.data).msg == 'success') {
              that.data.upload_lugimg_succ_list.push(JSON.parse(resp.data).url)
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '部分图片未上传成功',
              icon: 'none',
              duration: 1000
            });
          },
          complete: function () {
            uploadcomplete ++;//这个图片执行完上传后，开始上传下一张
            if (uploadcomplete == lugimgpathlist.length) {//当图片传完时，停止调用
              that.savalugimagslist()
            }
          }
        })
      }
    },

    //上传图片到图片空间成功后调用方法
    savalugimagslist () {
      var that = this

      var params = {
        orderId: that.properties.orderid,
        imgUrls: that.data.upload_lugimg_succ_list
      }

      request.HttpRequst('/v2/order/saveImg', 'POST', params).then(function (res) {
        wx.hideLoading()
        if(res.code == 0) {
          that.setData({
            upload_lugimg_succ_list: []
          })
          that.loadorderdetails(that.properties.orderid)
        }
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

      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
          orderId: that.properties.orderid
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {

        console.info(res);
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
          orderId: that.properties.orderid
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
          orderId: that.properties.orderid
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
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
      request.HttpRequst('/v2/order/info/' + that.properties.orderid, 'GET', {}).then(function (res) {
        if (res.code == 401) {//用户被禁用或删除
          wx.showToast({
            title: '您没有权限进行操作',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        if (res.data.order.iscanceled == '1' || res.data.order.status == 'REFUNDING') {
          wx.showToast({
            title: '退单中，请稍后进行操作',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        that.setData({
          req_distributorid: that.data.distributorId,
          isshowstafflistpanel:true
        }) 
        
      })
    },
   
    
    //改派方法
    sure_changeallow_staff: function (e) {
      var this_ = this
  
      request.HttpRequst('/v2/order/info/' + this_.properties.orderid, 'GET', {}).then(function (res) {
        // 改派或者指派前，应该在查询一次订单详情，由此来确认到底是改派还是指派
        if (res.code == 401) {//用户被禁用或删除
          wx.showToast({
            title: '您的账号已被禁用',
            icon: 'none',
            duration: 2000,
          });
          
          wx.redirectTo({
            url: '../reject/reject'
          })

          return false
        }

        if(res.code != 0) {
          wx.showToast({
            title: '系统报错，请重新操作',
            icon: 'none',
            duration: 2000,
          });
          return;
        }

        if (res.data.order.iscanceled == '1' || res.data.order.status == config.orderStatus.REFUNDING.value) {
          wx.showModal({
            content: '退单中，请稍后进行操作',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false,
          })
          return false
        }

        var orderallowstaffFlag = res.data.appUser ? true : false;
        var level = this_.data.accountInfo.appUser.level;
        if (level != config.levelType.LOW.value && !orderallowstaffFlag) {
          // 指派
          var params = {
            userId: e.detail.id,
            orderIds: this_.properties.orderid
          }
          request.HttpRequst('/v2/order/appoint', 'POST', params).then(function (res) {
            console.info(res);
            if(res.code != 0) {
              wx.showToast({
                title: '未指派成功',
                icon: 'none',
                duration: 2000,
              });
              return;
            }

            // 刷新订单详情
            this_.loadorderdetails();
            // 更改订单列表
            this_.triggerEvent("orderdetailappoint", { 'index': this_.properties.orderIndex, 'staff': res.appUser})
          });
        } else if (level != config.levelType.LOW.value && orderallowstaffFlag)  {
          // 1、2级改派
          var params = {
            userId: e.detail.id,
            orderIds: this_.properties.orderid
          }
          request.HttpRequst('/v2/order/anewAppoint', 'POST', params).then(function (res) {
            if (res.code != 0) {
              wx.showToast({
                title: '未改派成功',
                icon: 'none',
                duration: 2000,
              });
              return;
            }
            // 刷新订单详情
            this_.loadorderdetails();
            // 更改订单订单详情
            this_.triggerEvent("orderdetailappoint", { 'index': this_.properties.orderIndex, 'staff': res.appUser })
          })

        } else if (level == config.levelType.LOW.value && orderallowstaffFlag) {
          // 3级改派
          var params = {
            userId: e.detail.id,
            orderIds: this_.properties.orderid
          }
          request.HttpRequst('/v2/order/anewAppoint', 'POST', params).then(function (res) {
            if (res.code != 0) {
              wx.showToast({
                title: '未改派成功',
                icon: 'none',
                duration: 2000,
              });
              return;
            }
            
            // 刷新订单列表
            this_.triggerEvent("refreshtap")
            // 关闭订单详情
            this_.closeorderdetailpanel();
            
          })
        }
      });

      
      
    },

   
    // 加载订单详情信息
    loadorderdetails: function () {
      var this_ = this
      request.HttpRequst('/v2/order/info/' + this_.properties.orderid, 'GET', {}).then(function (res) {
        console.info(res.data);
        wx.hideLoading();

        var curOrder = res.data;

        this_.setData({
            orderno: res.data.order.orderno,
            bagsNum: res.data.order.num,
            status: res.data.order.status,

            neadfetch: res.data.order.neadfetch ? res.data.order.neadfetch : '',
            flightNum: res.data.orderFlight ? curOrder.orderFlight.takeflightno : '',
            baggageCodeList: res.data.baggageCodeList,
            baggageImgList: res.data.baggageImgList,

            customerName: res.data.customer.name,
            customerMobile: res.data.customer.mobile,
            customerIdno: res.data.customer.idno,
            contactSname: res.data.orderContacter.sendername,
            contactSmobile: res.data.orderContacter.senderphone,
            contactRname: res.data.orderContacter.receivername,
            contactRmobile: res.data.orderContacter.receiverphone,
          
            srcgps: res.data.orderAddress.srcgps,
            srcaddress: res.data.orderAddress.srcaddress,
            destgps: res.data.orderAddress.destgps,
            destaddress: res.data.orderAddress.destaddress,
            destaddrtype: res.data.orderAddress.destaddrtype,
            sendTime: res.data.order.taketime.substring(0, 16),
            takeTime: res.data.order.sendtime.substring(0, 16),
          
            imgsArr: res.data.imgList ? res.data.imgList : [],
            remark: res.data.order.remark ? res.data.order.remark : '',
            
            level3Clicked: res.data.primaryAnewAppoint,
            appUserName: res.data.appUser ? res.data.appUser.name : '',
            appUserMobile: res.data.appUser ? res.data.appUser.mobile : '',
            orderallowstaff: res.data.appUser? true : false,

            distributorId: res.data.order.distributorId// 该订单所属三级分销商
        })

        if (curOrder.qr) {
          var qrStr = curOrder.qr.qrCode
          var arr = qrStr.split(",")
          this_.setData({
            qrArr: arr
          })
        }

        var arrBigPic = []
        var num = 0;
        for (var i = 0; i < this_.data.imgsArr.length; ++i) {
          arrBigPic.push(this_.data.imgsArr[i].imgUrl)
        }

        this_.setData({
          bigImgsArr: arrBigPic
        })

        var arrBigPic1 = []
        var num = 0;
        for (var i = 0; i < this_.data.baggageImgList.length; ++i) {
          arrBigPic1.push(this_.data.baggageImgList[i].imgurl)
        }

        this_.setData({
          bigImgsArr1: arrBigPic1
        })

      })
    },

    
    // 关闭员工列表面板
    closestafflistpanel() {
      this.setData({
        isshowstafflistpanel: false
      });
    },

    // 查看日志
    toRecord()  {
      var this_inner = this;
      request.HttpRequst('/v2/order/loglist', 'GET', { orderId: this.properties.orderid }).then(function (res) {
        console.info(res);

        if (res.list.length == 0) {
          wx.showToast({
            title: '暂无操作日志',
            icon: 'none',
            duration: 2000,
          });
          return;
        }

        this_inner.setData({
          order_record_list: res.list,
          isshowRecord: true
        });
      })
    },

    // 关闭日志面板
    closelogpanel() {
      this.setData({
        isshowRecord: false
      });
    },
    

    // 反馈
    toFeedbackList() {
      this.setData({
        orderid: this.properties.orderid,
        isshowfeedbackList: true
      });
    },

    // 关闭反馈列表 
    closefeedbacklistpanel() {
      this.setData({
        isshowfeedbackList: false
      });
    },

    // 取消订单详情面板
    closeorderdetailpanel() {
      this.triggerEvent("closeorderdetailpanel")
    },

    // 指派
    appointorder() {
      this.setData({
        req_distributorid: this.data.distributorId,
        isshowstafflistpanel: true
      });
    }
  },

})
