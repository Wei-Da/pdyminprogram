// pages/serviceCompany/waitServiceDetailDemo/waitServiceDetailDemo.js
var app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servicer: '',
    companyName: '',
    phoneNo: '',
    faultId: '',
    serviceId: '',
    faultIp: '',
    faultInfo: null,
    equmentInfo: null,
    knowledges: null,
    forwardRecords: null,
    pictures: [],

    defaultSteps: [{ addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务创建', stage: '1', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务分配', stage: '3', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '工程师确认', stage: '5', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '工程师签到', stage: '6', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务完成', stage: '7', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务客评', stage: '8', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务关闭', stage: '9', isPass: false },
    ],
    serviceSteps: [],
    account: 0,
    currentTab: 0,
    currentItem: 0,
    clickItem: 0,

    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'ConfirmService', txt: '服务确认' },
    ],

    modalHidden: true,
    modalTitle: '',
    closeModalHidden: true,
    weight: '',
    popErrorMsg: '',

    isPlayAudio: false,
    audioPath: '',
    listCheckInfo: [],

    requestAddress:'',


  },

  swichNav: function (e) {
    console.log(e);
    this.dealFormIds(e.detail.formId);
    // var that = this;
    if (this.data.currentTab === e.detail.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.detail.target.dataset.current,
      })

    }
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      servicer: options.servicer,
      companyName: options.companyName,
      phoneNo: options.phoneNo,
      faultId: options.faultId,
      serviceId: options.serviceId,
      faultIp: options.faultIp,
      requestAddress: app.apiHost + app.serviceCode['IMAGE_URL'],
    })
    // this.getServiceDetail();
    this.getImageUrl();
    innerAudioContext.onEnded(() => {
      that.setData({
        isPlayAudio: !that.data.isPlayAudio
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getServiceDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getServiceDetail: function () {
    var map = { '1': "服务创建", '3': "服务分配", '5': "工程师确认", '6': "工程师签到", '7': "服务完成", '8': "服务客评", '9': "服务关闭" };
    var that = this;
    var param = { "faultInfo.faultId": this.data.faultId, "faultInfo.serviceid": this.data.serviceId, "faultInfo.equipmentId": this.data.faultIp };
    console.log(param)
    app.webCall(app.serviceCode["GET_SERVICE_DETAIL"], param,
      function onSuccess(res) {
        // console.log(res.listFaultInfo[0])
        var tempSteps = [];
        var requestSteps = res.listTimeRecord;
        var num = 0;
        console.log(requestSteps);
        for (var i = 0; i < requestSteps.length; i++) {
          tempSteps[i] = {
            addr: requestSteps[i].addr, dualdate: requestSteps[i].dualdate, imageUrl: requestSteps[i].imageUrl,
            serviceContent: requestSteps[i].explain, processName: map[requestSteps[i].stage], stage: requestSteps[i].stage, isPass: true
          };
          if (requestSteps[i].stage == 6) {
            num++;
          }

        }
        if (tempSteps.length == 0) {
          tempSteps = that.data.defaultSteps;
          tempSteps[0] = { addr: '', dualdate: res.listFaultInfo[0].faultDate, imageUrl: '', serviceContent: '', processName: '服务创建', stage: '1', isPass: true };
        } else {
          if (tempSteps[0].stage == 3) {
            var temp = tempSteps;
            tempSteps = [{ addr: '', dualdate: res.listFaultInfo[0].faultDate, imageUrl: '', serviceContent: '', processName: '服务创建', stage: '1', isPass: true }];
            // console.log('改变数组');
            // console.log(tempSteps);
            for (var i = 0; i < temp.length; i++) {
              tempSteps[i + 1] = temp[i]
            }
            // console.log('开始是3');
            // console.log(tempSteps);
          }
          if (num > 1) {
            for (var i = tempSteps.length - num + 1; i < that.data.defaultSteps.length; i++) {
              tempSteps[i + num - 1] = {
                addr: that.data.defaultSteps[i].addr, dualdate: that.data.defaultSteps[i].dualdate, imageUrl: that.data.defaultSteps[i].imageUrl,
                serviceContent: that.data.defaultSteps[i].serviceContent, processName: that.data.defaultSteps[i].processName, stage: that.data.defaultSteps[i].stage, isPass: that.data.defaultSteps[i].isPass
              };
            }
          } else {
            for (var i = tempSteps.length; i < that.data.defaultSteps.length; i++) {
              tempSteps[i] = {
                addr: that.data.defaultSteps[i].addr, dualdate: that.data.defaultSteps[i].dualdate, imageUrl: that.data.defaultSteps[i].imageUrl,
                serviceContent: that.data.defaultSteps[i].serviceContent, processName: that.data.defaultSteps[i].processName, stage: that.data.defaultSteps[i].stage, isPass: that.data.defaultSteps[i].isPass
              };
            }
          }
          console.log('tempSteps步骤加默认：');
          console.log(tempSteps);
        }
        that.setData({
          faultInfo: res.listFaultInfo[0],
          equmentInfo: res.listEqumentInfo[0],
          knowledges: res.listKnowledge,
          forwardRecords: res.listForwardRecord,
          serviceSteps: tempSteps,
          account: tempSteps.length,
          weight: res.listFaultInfo[0].weight,
          listCheckInfo: res.istCheckInfo[0]
        })
      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res);
      },

      "POST")
  },

  getImageUrl: function () {
    var that = this;
    var param = { "fid": this.data.faultId };
    var loadPictures = [];
    console.log(param)
    app.webCall(app.serviceCode["QUERY_IMAGE_URL"], param,
      function onSuccess(res) {
        console.log(res.info)
        if (res.info.length == 1) {
          if ((res.info[0].url).indexOf("mp3") != -1) {
            // innerAudioContext.src = app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[0].url;
            that.setData({
              audioPath: app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[0].url
            })
          } else {
            loadPictures[0] = app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[0].url
          }
        } else {
          if (res.info.length != 0) {
            if ((res.info[res.info.length - 1].url).indexOf("mp3") != -1) {
              for (var i = 0; i < res.info.length - 1; i++) {
                loadPictures[i] = app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[i].url
              }
              that.setData({
                audioPath: app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[res.info.length - 1].url
              })
              // innerAudioContext.src = app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[res.info.length - 1].url;
            } else {
              for (var i = 0; i < res.info.length; i++) {
                loadPictures[i] = app.apiHost + app.serviceCode['IMAGE_URL'] + res.info[i].url
              }
            }
          }
        }
        that.setData({
          pictures: loadPictures
        })
        // console.log(that.data.pictures);
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  previewImage: function (e) {
    var that = this;
    var path = e.target.dataset.src;
    // wx.previewImage({
    //   current: e.target.dataset.src, // 当前显示图片的http链接
    //   urls: that.data.pictures, // 需要预览的图片http链接列表
    // })
    wx.getImageInfo({
      src: path,
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
        console.log(res.path)
        wx.previewImage({
          current: res.path,
          urls: [res.path],
        })
      }
    })

    // wx.previewImage({
    //   current: 'http://szimg.mukewang.com/5806de7c00014a3105400300-360-202.jpg', // 当前显示图片的http链接
    //   urls: ['http://szimg.mukewang.com/5806de7c00014a3105400300-360-202.jpg'], // 需要预览的图片http链接列表
    // })
  },

  previewSignImage: function (e) {
    var that = this;
    var path = e.target.dataset.src;
    wx.getImageInfo({
      src: path,
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
        console.log(res.path)
        wx.previewImage({
          current: res.path,
          urls: [res.path],
        })
      }
    })
  },

  clickLib: function (e) {
    console.log(e);
    console.log(e.target.dataset.current);
    if (this.data.clickItem == e.target.dataset.current) {
      this.setData({
        currentItem: e.target.dataset.current,
        clickItem: -1,
      })
    } else {
      this.setData({
        currentItem: e.target.dataset.current,
        clickItem: e.target.dataset.current,
      })

    }
  },

  // 底部弹窗
  moreOperation: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  bindConfirmService: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      modalHidden: false,
    })
  },


  modalChange: function () {
    this.setData({
      modalHidden: true,
    })

    var param = {
      'faultInfo.faultId': this.data.faultId,
    }
    app.webCall(app.serviceCode["SERVICE_CONFIRM"], param,
      function onSuccess(res) {
        wx.navigateBack({
          url: '../waitConfirm/waitConfirm',
        })
      },
      function onErrorBefore(res) {
        console.log('失败'),
          console.log(res)
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  cancleChange: function () {
    this.setData({
      modalHidden: true,
    })
  },


  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hour + seperator2 + minutes
      + seperator2 + seconds;
    return currentdate;
  },

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  },

  dealFormIds: function (formId) {
    let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime()) + 604800000 //计算7天后的过期时间时间戳
    }
    formIds.push(data);//将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },

  bindtapPlayAudio: function () {
    var that = this;
    this.setData({
      isPlayAudio: !this.data.isPlayAudio
    })
    wx.downloadFile({
      url: that.data.audioPath, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log(res.tempFilePath);
          innerAudioContext.autoplay = true
          innerAudioContext.src = res.tempFilePath
          innerAudioContext.onPlay(() => {
            console.log('开始播放')
          })
          innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          })
        }
      }
    })



  },

})