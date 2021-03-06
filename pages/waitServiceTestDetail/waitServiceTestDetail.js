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
    checkPicture:[],

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
      { bindtap: 'ServiceSign', txt: '服务签到' },
      { bindtap: 'AddRecord', txt: '添加记录' },
      { bindtap: 'SignClose', txt: '重置签到' },
      { bindtap: 'ServiceClose', txt: '服务结束' },
      { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
    ],

    modalHidden: true,
    modalTitle: '',
    closeModalHidden: true,
    weight: '',
    popErrorMsg: '',
    requestAddress: '',
    isPlayAudio: false,
    audioPath: '',
    transferHidden:true,
    personId:'',
    companyDepts:['请选择'],
    companyDeptIndex:0,
    companyDeptInfo:"",
    companyMembers:['请选择'],
    companyMemberIndex:0,
    companyMemberInfo:"",

    changeHidden:true,
    companyDeptChangeIndex:0,
    changeCompanyDepts:['请选择'],
    changeCompanyDeptInfos:"",
    changeCompanyMembers:['请选择'],
    companyMemberChangeIndex:0,
    changeCompanyMemberInfos:"",
    mHeight:'',

    processId: '',
    perId: '',
    changeTypes:['人员变更','权重变更'],
    changeTypeIndex:0,
    isPersonChange:true,
    serviceDescribe:'',
    newWeight:''
    
    


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
      servicer: "沈冰",
      companyName:"南京数据运维中心",
      phoneNo: "1391396500",
      faultId: '17034',
      serviceId: '7727',
      faultIp: '4000',
      personId: 'dcd99f36b3d64b6888d470f8b8757344',
      processId: '72614',
      perId: options.perId,
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
    var serviceDescribe = wx.getStorageSync('serviceDescribe');
    wx.setStorageSync('serviceDescribe', '');
    this.setData({
      serviceDescribe: serviceDescribe == '' ? '请输入描述' : serviceDescribe.length < 10 ? serviceDescribe : serviceDescribe.substring(0, 10) + '...',
    })
    
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
    var param = { "faultInfo.faultId": this.data.faultId, "faultInfo.serviceid": this.data.serviceId, "faultInfo.equipmentId": this.data.faultIp, "userId": wx.getStorageSync('userInfo').id, "mouleId": wx.getStorageSync("appRole"), "processId": this.data.processId, "processPerId": this.data.perId};
    console.log(param)
    app.webCall(app.serviceCode["GET_SERVICE_DETAIL_YI"], param,
      function onSuccess(res) {
        // console.log(res.listFaultInfo[0])
        var totalTempSteps =[];
        console.log(requestSteps);

        for (var j = 0; j < res.listTimeRecord.length;j++){
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
        console.log("打印步骤：");
        console.log(totalTempSteps);
        var temImage = [];
        for (var i = 0; i < res.listFaultImage.length;i++){
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
          checkPicture: temImage,
        })
        if (that.data.faultInfo.isSign == '2') {
          if (that.data.personId == wx.getStorageSync("userInfo").id){
            if (that.data.faultInfo.faultFrom == '7' || that.data.faultInfo.faultFrom == '8'){
                that.setData({
                  actionSheetItems: [
                    { bindtap: 'ServiceSign', txt: '修改签到(已签到)' },
                    { bindtap: 'AddRecord', txt: '添加记录' },
                    { bindtap: 'SignClose', txt: '重置签到' },
                    { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
                    { bindtap: 'ServiceClose', txt: '服务结束' },
                    { bindtap: 'ServiceTransfer', txt: '增派' },
                    { bindtap: 'ServiceChange', txt: '变更' },
                    { bindtap: 'ServiceCheck', txt: '服务检测' },
                    { bindtap: 'ServiceCheckSummary', txt: '服务检测总结' },
                  ]
                })
              }else{
                that.setData({
                  actionSheetItems: [
                    { bindtap: 'ServiceSign', txt: '修改签到(已签到)' },
                    { bindtap: 'AddRecord', txt: '添加记录' },
                    { bindtap: 'SignClose', txt: '重置签到' },
                    { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
                    { bindtap: 'ServiceClose', txt: '服务结束' },
                    { bindtap: 'ServiceTransfer', txt: '增派' },
                    { bindtap: 'ServiceChange', txt: '变更' },
                  ]
                })
              }
          }else{
            if (that.data.faultInfo.faultFrom == '7' || that.data.faultInfo.faultFrom == '8'){
              that.setData({
                actionSheetItems: [
                  { bindtap: 'ServiceSign', txt: '修改签到(已签到)' },
                  { bindtap: 'AddRecord', txt: '添加记录' },
                  { bindtap: 'SignClose', txt: '重置签到' },
                  { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
                  { bindtap: 'ServiceClose', txt: '服务结束' },
                  { bindtap: 'ServiceChange', txt: '变更' },
                  { bindtap: 'ServiceCheck', txt: '服务检测' },
                  { bindtap: 'ServiceCheckSummary', txt: '服务检测总结' },
                ]
              })
            }else{
              that.setData({
                actionSheetItems: [
                  { bindtap: 'ServiceSign', txt: '修改签到(已签到)' },
                  { bindtap: 'AddRecord', txt: '添加记录' },
                  { bindtap: 'SignClose', txt: '重置签到' },
                  { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
                  { bindtap: 'ServiceClose', txt: '服务结束' },
                  { bindtap: 'ServiceChange', txt: '变更' },
                ]
              })
            }
            
          }
        } else {
          if (that.data.personId == wx.getStorageSync("userInfo").id) {
                that.setData({
                  actionSheetItems: [
                    { bindtap: 'ServiceSign', txt: '服务签到' },
                    { bindtap: 'AddRecord', txt: '添加记录' },
                    { bindtap: 'SignClose', txt: '重置签到' },
                    { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
                    { bindtap: 'ServiceClose', txt: '服务结束' },
                    { bindtap: 'ServiceTransfer', txt: '增派' },
                    { bindtap: 'ServiceChange', txt: '变更' },
                  ]
                })
          }else{
            that.setData({
              actionSheetItems: [
                { bindtap: 'ServiceSign', txt: '服务签到' },
                { bindtap: 'AddRecord', txt: '添加记录' },
                { bindtap: 'SignClose', txt: '重置签到' },
                { bindtap: 'AddServiceCheckImage', txt: '添加验收图' },
                { bindtap: 'ServiceClose', txt: '服务结束' },
                { bindtap: 'ServiceChange', txt: '变更' },
              ]
            })
          }
        }
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

  bindServiceSign: function () {
    console.log('bindServiceSign');
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.navigateTo({
      url: '../serviceSign/serviceSign?faultId=' + this.data.faultId + '&&processId=' + this.data.processId + '&&processPerId=' + this.data.perId,
    })
  },

  bindAddRecord: function () {
    console.log('bindAddRecord');
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    if (this.data.faultInfo.isSign == '2') {
      wx.navigateTo({
        url: '../addServiceRecord/addServiceRecord?faultId=' + this.data.faultId + '&&processId=' + this.data.processId + '&&processPerId=' + this.data.perId + '&&faultTitle=' + this.data.faultInfo.title,
      })
    } else {
      this.setData({
        popErrorMsg: '请先签到',
      })
      this.ohShitfadeOut();
    }
  },

  bindSignClose: function () {
    console.log('bindSignClose');
    if (this.data.faultInfo.isSign == '2') {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden,
        modalHidden: false,
        modalTitle: '确定要关闭签到？',
      })
    } else {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden,
        popErrorMsg: '请先签到',
      })
      this.ohShitfadeOut();
    }

  },

  bindAddServiceCheckImage:function(){
    this.setData({
      actionSheetHidden: true
    });
    wx.navigateTo({
      url: '../../checkReport/checkReport?faultId=' + this.data.faultId,
    })
  },

  bindServiceClose: function () {
    console.log(this.data.weight);
    if (this.data.faultInfo.isSign == '2') { 
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden,
        // closeModalHidden: false,
      })
      if (this.data.forwardRecords != null && this.data.forwardRecords != "") {
        wx.redirectTo({
          url: '../serviceClose/serviceClose?faultId=' + this.data.faultId + '&&weight=' + this.data.weight + '&&processId=' + this.data.processId + '&&processPerId=' + this.data.perId + '&&serviceCompanyId=' + this.data.faultInfo.serviceCompanyId,
        })
      } else {
        this.setData({
          popErrorMsg: '请添加服务记录',
        })
        this.ohShitfadeOut();
      }
    } else {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden,
        popErrorMsg: '请先签到',
      })
      this.ohShitfadeOut();
    }
  },

  bindServiceTransfer:function(){
    this.setData({
      transferHidden:false,
      actionSheetHidden:true
    })
    this.requestDepartment(wx.getStorageSync('userInfo').companyId,false);
  },

  bindServiceChange: function () { 
    this.setData({
      changeHidden: false,
      actionSheetHidden: true
    })
    this.requestDepartment(wx.getStorageSync('userInfo').companyId, true);
  },

  bindServiceCheck: function () {
    this.setData({
      actionSheetHidden: true
    });
    wx.navigateTo({
      url: '../patrolPage/patrolPage?faultId=' + this.data.faultId + "&&companyId=" + this.data.faultInfo.companyId,
    })
  },

  bindServiceCheckSummary: function () {
    this.setData({
      actionSheetHidden: true
    });
    wx.navigateTo({
      url: '../../deviceCheckSummary/deviceCheckSummary?faultId=' + this.data.faultId,
    })
  },

  modalChange: function () {
    this.setData({
      modalHidden: true,
    })

    var param = {
      'forwardRecord.faultId': this.data.faultId,
      "stamp": '3',
      'state': '',
      'attachment': '',
      'processId': this.data.processId,
      'processPerId': this.data.processPerId,
    }
    app.webCall(app.serviceCode["ADD_SERVICE_RECORD"], param,
      function onSuccess(res) {
        console.log('成功'),
          console.log(res)
        wx.navigateBack({
          url: '../waitService/waitService',
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

  closeModalChange: function () {
    this.setData({
      closeModalHidden: true,
    })
    var param = {
      'forwardRecord.faultId': this.data.faultId,
      'forwardRecord.userId': wx.getStorageSync('userInfo').id,
      "forwardRecord.time": this.getNowFormatDate(),
      'forwardRecord.context': '',
      'weight': this.data.weight,
      'processId': this.data.processId,
      'processPerId': this.data.processPerId,
    }
    app.webCall(app.serviceCode["CLOSE_SERVICE"], param,
      function onSuccess(res) {
        console.log('成功'),
          console.log(res)
        wx.navigateBack({
          url: '../waitService/waitService',
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

  cancleModalChange: function () {
    this.setData({
      closeModalHidden: true,
      weight: this.data.faultInfo.weight,
    })
  },

  bindChange: function (e) {
    this.setData({
      weight: e.detail.value,
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

  bindPickerChange: function (e) {
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch (name) {
      case 'companyDept':
        this.setData({
          companyDeptIndex: eindex,
          companyMemberIndex:0
        })
        if (eindex>0){
          this.requestServiceName(this.data.companyDeptInfo[eindex-1].id,false);
        }
        break;
      case 'companyMember':
        this.setData({
          companyMemberIndex: eindex
        })
        break;
      case 'companyDeptChange':
        this.setData({
          companyDeptChangeIndex: eindex,
          companyMemberChangeIndex:0
        })
        if (eindex > 0) {
          this.requestServiceName(this.data.changeCompanyDeptInfos[eindex - 1].id, true);
        }
        break;
      case 'companyMemberChange':
        this.setData({
          companyMemberChangeIndex: eindex
        })
        break;
      case 'changeType':
      if(eindex==0){
        console.log("变更值0：");
        console.log(eindex);
        this.setData({
          changeTypeIndex: eindex,
          isPersonChange: true
        })
      }else{
        console.log("变更值1：");
        console.log(eindex);
        this.setData({
          changeTypeIndex: eindex,
          isPersonChange: false
        })
      }
        
      break;
    }
  },

  transferDescribe: function () {
    wx.navigateTo({
      url: '../../serviceDescribe/serviceDescribe',
    })
  },

  modalTransferChange:function(e){
    this.serviceTransfer();
  },

  cancleTransferChange: function(e){
      this.setData({
        transferHidden:true
      })
  },

  modalServiceChange:function(e){
    this.serviceChange();
  },

  cancleServiceChange: function (e) {
    this.setData({
      changeHidden: true
    })
  },

  /**
 * 获取部门信息
 */
  requestDepartment: function (compnayId, isChangeService) {
    var that = this;
    var temDepartments = ['请选择'];
    var param = {
      "companyId": compnayId
    }

    app.webCall(app.serviceCode["QUERY_COMPANY_DEPARTMENT"], param,
      function onSuccess(res) {
        console.log(res)
        if (isChangeService){
              for (var i = 0; i < res.detail.length; i++) {
                temDepartments[i + 1] = res.detail[i].name;
              }
              that.setData({
                changeCompanyDepts: temDepartments,
                changeCompanyDeptInfos: res.detail
              })
        }else{
            for (var i = 0; i < res.detail.length;i++){
              temDepartments[i + 1] = res.detail[i].name;
            }
            that.setData({
              companyDepts: temDepartments,
              companyDeptInfo: res.detail
            })
        }
      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  /**
 * 获取人员名称
 */
  requestServiceName: function (deptId, isChangeService) {
    var that = this;
    var temNames = ['请选择'];
    var param = {
      "deptId": deptId,
      "id": wx.getStorageSync("userInfo").id
    }

    app.webCall(app.serviceCode["GET_TRANSFER_PERSON_NAME"], param,
      function onSuccess(res) {
        console.log(res)
        if (isChangeService){
            for (var i = 0; i < res.detail.length; i++) {
              temNames[i + 1] = res.detail[i].userName;
            }
            that.setData({
              changeCompanyMembers: temNames,
              changeCompanyMemberInfos: res.detail
            })
        }else{
          for (var i = 0; i < res.detail.length; i++) {
            temNames[i + 1] = res.detail[i].userName;
          }
          that.setData({
            companyMembers: temNames,
            companyMemberInfo: res.detail
          })
        }
      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  serviceTransfer:function(){
    var that = this;
    var temNames = ['请选择'];
    if (this.data.companyDeptIndex==0){
        this.setData({
          popErrorMsg: '请选择部门',
        })
        this.ohShitfadeOut();
        return;
    }
    if (this.data.companyMemberIndex == 0) {
      this.setData({
        popErrorMsg: '请选择人员',
      })
      this.ohShitfadeOut();
      return;
    }
    var param = {
      "faultUser.faultId": this.data.faultId,
      "faultUser.userId": this.data.companyMemberInfo[this.data.companyMemberIndex-1].id,
      "faultUser.stage": '3',
      "faultUser.phone": this.data.companyMemberInfo[this.data.companyMemberIndex - 1].mobile,
      'processId': this.data.processId,
      'processPerId': this.data.processPerId,
      'userId': wx.getStorageSync('userInfo').id
    }

    app.webCall(app.serviceCode["UPDATE_SERVICE_TRANSFER"], param,
      function onSuccess(res) {
        console.log(res);
        wx.navigateBack({
          
        })
      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  serviceChange: function () {
    var that = this;
    if (this.data.isPersonChange){
        if (this.data.companyDeptChangeIndex == 0) {
          this.setData({
            popErrorMsg: '请选择部门',
          })
          this.ohShitfadeOut();
          return;
        }
        if (this.data.companyMemberChangeIndex == 0) {
          this.setData({
            popErrorMsg: '请选择人员',
          })
          this.ohShitfadeOut();
          return;
        }
    }else{
      if (this.data.newWeight==''){
        this.setData({
          popErrorMsg: '请填写变更权重',
        })
        this.ohShitfadeOut();
        return;
      }
    }
    if (this.data.serviceDescribe == '' || this.data.serviceDescribe == '请输入描述') {
      this.setData({
        popErrorMsg: '请填写服务描述',
      })
      this.ohShitfadeOut();
      return;
    }
    var param = {
      "changeInfo.faultId": this.data.faultId,
      "changeInfo.oldPerson":wx.getStorageSync("userInfo").id,
      "changeInfo.type": '1',
      'processId': this.data.processId,
      'processPerId': this.data.processPerId,
      'changeInfo.processId': this.data.processId,
      'changeInfo.changeUserid': this.data.personId,
      'changeInfo.content': this.data.serviceDescribe
    }

    if (this.data.isPersonChange){
      param["changeInfo.newPerson"] = this.data.changeCompanyMemberInfos[this.data.companyMemberChangeIndex - 1].id,
      param["changeInfo.reviewedType"] = 2
    }else{
      param["changeInfo.oldWeight"] = this.data.weight,
      param["changeInfo.newWeight"] = this.data.newWeight,
      param["changeInfo.reviewedType"] = 1
    }

    if (this.data.personId == wx.getStorageSync("userInfo").id){
      param["changeInfo.sysType"] = "1"
    }else{
      param["changeInfo.sysType"] = "2"
    }

    app.webCall(app.serviceCode["SERVICE_CHANGE"], param,
      function onSuccess(res) {
        console.log(res);
        if (res.resultcode == '2') {
          wx.navigateBack({

          })
        } else {
          that.setData({
            changeHidden:true,
            popErrorMsg: '变更失败!当前有未完成变更的工单!',
          })
          that.ohShitfadeOut();
        }
      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  getNewWeight:function(e){
    this.setData({
      newWeight: e.detail.value
    })
  },

  bindtest:function(e){
    console.log("我是按钮");
    console.log(e);
  }

})