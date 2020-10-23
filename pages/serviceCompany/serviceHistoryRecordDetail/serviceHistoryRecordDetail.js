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
    checkPicture: [],

    defaultSteps: [{ addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务创建', stage: '1', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务分配', stage: '3', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '工程师确认', stage: '5', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '工程师签到', stage: '6', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务关闭', stage: '7', isPass: false },
    { addr: '', dualdate: '待定', imageUrl: '', serviceContent: '', processName: '服务客评', stage: '9', isPass: false },
    ],
    serviceSteps: [],
    account: 0,
    currentTab: 0,
    currentItem: 0,
    clickItem: 0,

    actionSheetHidden: true,
    actionSheetItems: [ 
      { bindtap: 'DeviceCheckHistory', txt: '设备检测历史' },
    ],

    modalHidden: true,
    modalTitle: '',
    closeModalHidden: true,
    weight: '',
    popErrorMsg: '',
    requestAddress: '',
    isPlayAudio: false,
    audioPath: '',
    listCheckInfo: [],
    mHeight: '',

    processId: '',
    perId: '',
    yiTodayAdd:false,
    isCheckDevice:false,

    personName: '',
    listTimeRecord: '',
    currentIndex: 0,


  },

  swichNav: function (e) {
    console.log(e);
    this.dealFormIds(e.detail.formId);
    var that = this;
    if (this.data.currentTab === e.detail.target.dataset.current) {
      return false;
    } else {
      that.setData({
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
      processId: options.processId,
      perId: options.perId,
      yiTodayAdd: options.yiTodayAdd,
      requestAddress: app.apiHost + app.serviceCode['IMAGE_URL'],
    })
    // this.getServiceDetail();
    this.getImageUrl();
    innerAudioContext.onEnded(() => {
      that.setData({
        isPlayAudio: !that.data.isPlayAudio
      })
    })

    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          mHeight: calc
        });
      }
    });
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
    var map = { '1': "服务创建", '3': "服务分配", '5': "工程师确认", '6': "工程师签到", '7': "服务关闭", '9': "服务客评" };
    var that = this;
    var param = { "faultInfo.faultId": this.data.faultId, "faultInfo.serviceid": this.data.serviceId, "faultInfo.equipmentId": this.data.faultIp, "userId": wx.getStorageSync('userInfo').id, "mouleId": wx.getStorageSync("appRole"), "processId": this.data.processId, "processPerId": this.data.perId };
    console.log(param)
    app.webCall(app.serviceCode[this.data.yiTodayAdd ? "GET_SERVICE_DETAIL_YI" :"GET_SERVICE_DETAIL_JIA"], param,
      function onSuccess(res) {
        // console.log(res.listFaultInfo[0])
        var totalTempSteps = [];
        console.log(requestSteps);

        for (var j = 0; j < res.listTimeRecord.length; j++) {
          var tempSteps = [];
          var num = 0;
          var requestSteps = res.listTimeRecord[j];
          for (var i = 0; i < requestSteps.length; i++) {
            tempSteps[i] = {
              addr: requestSteps[i].addr, dualdate: requestSteps[i].dualdate, imageUrl: requestSteps[i].imageUrl,
              serviceContent: requestSteps[i].explain, processName: map[requestSteps[i].stage], stage: requestSteps[i].stage, isPass: true
            };
            if (requestSteps[i].stage == 6) {
              num++;
            }

          }

          if (tempSteps.length == 2 && tempSteps[0].stage == '1' && tempSteps[1].stage == '7') {
            for (var i = 0; i < that.data.defaultSteps.length; i++) {
              if (i == 0) {
                tempSteps[i] = {
                  addr: requestSteps[0].addr, dualdate: requestSteps[0].dualdate, imageUrl: requestSteps[0].imageUrl,
                  serviceContent: requestSteps[0].explain, processName: map[requestSteps[0].stage], stage: requestSteps[0].stage, isPass: true
                };
              } else if (i == 4) {
                tempSteps[i] = {
                  addr: requestSteps[1].addr, dualdate: requestSteps[1].dualdate, imageUrl: requestSteps[1].imageUrl,
                  serviceContent: requestSteps[1].explain, processName: map[requestSteps[1].stage], stage: requestSteps[1].stage, isPass: true
                };
              } else {
                tempSteps[i] = {
                  addr: that.data.defaultSteps[i].addr, dualdate: '无', imageUrl: that.data.defaultSteps[i].imageUrl,
                  serviceContent: that.data.defaultSteps[i].serviceContent, processName: that.data.defaultSteps[i].processName, stage: that.data.defaultSteps[i].stage, isPass: true
                };
              }
            }
          } else if (tempSteps.length == 3 && tempSteps[0].stage == '1' && tempSteps[1].stage == '7' && tempSteps[2].stage == '9') {
            for (var i = 0; i < that.data.defaultSteps.length; i++) {
              if (i == 0) {
                tempSteps[i] = {
                  addr: requestSteps[0].addr, dualdate: requestSteps[0].dualdate, imageUrl: requestSteps[0].imageUrl,
                  serviceContent: requestSteps[0].explain, processName: map[requestSteps[0].stage], stage: requestSteps[0].stage, isPass: true
                };
              } else if (i == 4) {
                tempSteps[i] = {
                  addr: requestSteps[1].addr, dualdate: requestSteps[1].dualdate, imageUrl: requestSteps[1].imageUrl,
                  serviceContent: requestSteps[1].explain, processName: map[requestSteps[1].stage], stage: requestSteps[1].stage, isPass: true
                };
              } else if (i == 5) {
                tempSteps[i] = {
                  addr: requestSteps[2].addr, dualdate: requestSteps[2].dualdate, imageUrl: requestSteps[2].imageUrl,
                  serviceContent: requestSteps[2].explain, processName: map[requestSteps[2].stage], stage: requestSteps[2].stage, isPass: true
                };
              } else {
                tempSteps[i] = {
                  addr: that.data.defaultSteps[i].addr, dualdate: '无', imageUrl: that.data.defaultSteps[i].imageUrl,
                  serviceContent: that.data.defaultSteps[i].serviceContent, processName: that.data.defaultSteps[i].processName, stage: that.data.defaultSteps[i].stage, isPass: true
                };
              }
            }

          }else{
            if (tempSteps.length == 0) {
              console.log('默认步骤');
              tempSteps = that.data.defaultSteps;
              tempSteps[0] = { addr: '', dualdate: res.listFaultInfo[0].faultDate, imageUrl: '', serviceContent: '', processName: '服务创建', stage: '1', isPass: true };
            } else {
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

            }

          }



          totalTempSteps[j] = tempSteps;

        }
        var temImage = [];
        for (var i = 0; i < res.listFaultImage.length; i++) {
          temImage[i] = app.apiHost + app.serviceCode['CHECK_IMAGE_URL'] + res.listFaultImage[i].imagePath;
        }

        that.setData({
          faultInfo: res.listFaultInfo[0],
          equmentInfo: res.listEqumentInfo[0],
          knowledges: res.listKnowledge,
          forwardRecords: res.listForwardRecord,
          serviceSteps: totalTempSteps,
          // account: tempSteps.length,
          weight: res.listFaultInfo[0].weight,
          listCheckInfo: res.istCheckInfo[0],
          isCheckDevice: res.listFaultInfo[0].faultFrom == 7 ? true : res.listFaultInfo[0].faultFrom == 8 ? true : false,
          checkPicture: temImage,
          listTimeRecord: res.listTimeRecord,
          personName: res.listTimeRecord != '' && res.listTimeRecord.length > 0 ? res.listTimeRecord[that.data.currentIndex] != '' && res.listTimeRecord[that.data.currentIndex].length > 2 ? res.listTimeRecord[that.data.currentIndex][2].processingPerson : '工程师未确认' : '工程师未确认',
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
  moreOperation: function (e) {
    this.dealFormIds(e.detail.formId);
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
      'userId': wx.getStorageSync('userInfo').id,
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

  bindDeviceCheckHistory: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    wx.navigateTo({
      url: '../../patrolContentHistory/patrolContentHistory?faultId=' + this.data.faultId + "&&companyId=" + this.data.faultInfo.companyId,
    })
  },

  bindchangeSwiper: function (e) {
    var steps = this.data.listTimeRecord;
    if (steps != '' && steps.length > 0) {
      this.setData({
        personName: steps[e.detail.current] != '' && steps[e.detail.current].length > 2 ? steps[e.detail.current][2].processingPerson : '',
        currentIndex: e.detail.current
      })
    }
  }

})