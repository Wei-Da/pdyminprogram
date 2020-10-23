// pages/createService/createService.js
var app = getApp();
const recorderManager = wx.getRecorderManager();
const options = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
};
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyNames:[],
    companyNameIndex:0,
    companyInfos:[],
    departmentNames: ["请选择"],
    departmentNameIndex:0,
    departmentInfos: [],
    repairNames: ["请选择"],
    repairNameIndex:0,
    repairNameInfo:[],
    influenceLevels:[],
    influenceLevelIndex:0,
    repairCompanys:[],
    repairCompanyIndex:0,
    repairCompanyInfo:[],
    repairDepartments: ['请选择'],
    repairDepartmentIndex:0,
    repairDepartmentInfo:[],
    repairMembers: ['请选择'],
    repairMemberIndex:0,
    repairMemberInfo:[],
    deviceDepartments:['请选择'],
    deviceDepartmentIndex:0,
    deviceDepartmentInfo:[],
    deviceNames: ['请选择'],
    deviceNameIndex:0,
    deviceNameInfo:[],
    serviceCatalogs:[],
    serviceCatalogInfo:[],
    serviceCatalogIndex:0,
    serviceDetails: ['请选择'],
    serviceDetailInfo:[],    
    serviceDetailIndex:0,
    serviceLevelIndex:0,
    pictures:[],
    index:0,
    createTime: "yy-mm-dd",
    endTime: "yy-mm-dd",
    uploadimgs: [],
    editable: false, //是否可编辑
    title:'',
    changeType:'其它',
    isOther:false,
    telephone:'',
    weight:'',
    popErrorMsg: '', 
    errorMsg:'',
    serviceContent:'',
    repairMan:'',
    repairManPhone:'',
    serviceDescribe:'请输入描述',
    devicePerson:'',
    personDepartment:'',
    personPhone:'',
    isOtherDevice:false,
    deviceType:'其它',
    otherDeviceName:'',
    scannerInfo:'',
    modalHidden:true,
    companyTypes:['运维公司','服务公司'],
    companyTypeIndex:0,
    serviceCompanyIndex:0,
    companyMans:['请选择'],
    companyManIndex:0,
    companyManInfo:[],
    isRepairCompany:true,
    imageWidth: '',
    audioPath: [],
    isReady: true,
    isPlayAudio: false,
    totalFilePath: [],
    isSearchDevice:false,
    isSearchCompany: false,
    gds:'',
    jsl:'',
    hpl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //录音通知回调
    recorderManager.onStop((res) => {
      console.log('recorder stop', res.tempFilePath)
      innerAudioContext.src = res.tempFilePath;
      // const { tempFilePath } = res
      that.setData({
        isReady: true,
        audioPath: res.tempFilePath
      })

    });
    //录音播放完成回调
    innerAudioContext.onEnded(() => {
      that.setData({
        isPlayAudio: !that.data.isPlayAudio
      })
    })
    if (getApp().screenWidth != '') {
      this.setData({
        imageWidth: getApp().screenWidth / 6 - 10,
      })
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            imageWidth: res.windowWidth / 6 - 10,
          })
        }
      });
    }
    this.fetchData();
    console.log(options);
    this.requestComapny(false);
    this.requestServiceCatalog();
    this.ohShitfadeOut();
  },

  fetchData:function(){
    this.setData({
      influenceLevels: ["请选择","一般","严重","紧急"],
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
    var timeType = wx.getStorageSync("timeType");
    var serviceDescribe = wx.getStorageSync('serviceDescribe');
    if (timeType == "Y") {
      var createTime = wx.getStorageSync("createTime");
      wx.setStorageSync("timeType", ""),
        wx.setStorageSync("createTime", ""),
        this.setData({
          createTime: createTime == '' ? 'yy-mm-dd' : createTime,
        })
    } else if (timeType == "N") {
      var endTime = wx.getStorageSync("endTime");
      wx.setStorageSync("timeType", ""),
        wx.setStorageSync("endTime", ""),
        this.setData({
          endTime: endTime == '' ? 'yy-mm-dd' : endTime,
        })
    }
    this.setData({
      serviceDescribe: serviceDescribe == '' ? '请输入描述' : serviceDescribe.length < 10 ? serviceDescribe : serviceDescribe.substring(0,10)+'...',
    })
    if (this.data.isSearchDevice){
      var deviceIndex = parseInt(wx.getStorageSync("deviceIndex"))+1;
      if (deviceIndex!=''){
          this.setData({
            deviceNameIndex: deviceIndex,
            devicePerson: this.data.deviceNameInfo[deviceIndex - 1].personName,
            personDepartment: this.data.deviceDepartmentIndex == this.data.deviceDepartmentInfo.length + 1 ? "公司资产" : this.data.deviceDepartmentInfo[this.data.deviceDepartmentIndex - 1].name,
            personPhone: this.data.deviceNameInfo[deviceIndex - 1].personPhone,
            isSearchDevice:false
          })

      }
    }

    if(this.data.isSearchCompany){
      var companyNameIndex = parseInt(wx.getStorageSync("companyNameIndex")) + 1;
      if (companyNameIndex!=''){
        this.setData({
          departmentNames: ['请选择'],
          departmentNameIndex: [0],
          repairNames: ['请选择'],
          repairNameIndex: [0],
          deviceDepartments: ['请选择'],
          deviceDepartmentIndex: 0,
          deviceNames: ['请选择'],
          deviceNameIndex: 0,
          companyNameIndex: companyNameIndex,
          devicePerson: '',
          personDepartment: '',
          personPhone: '',
          deviceNameIndex: 0,
          isSearchCompany: false
        })
        if (companyNameIndex > 0) {
          this.requestDepartment(this.data.companyInfos[companyNameIndex - 1].companyid, false, false);
        }
      }
    }
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
    wx.setStorageSync('serviceDescribe', '')
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

  bindPickerChange:function(e){
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch(name){
      case 'companyName':
        this.setData({
          departmentNames: ['请选择'],
          departmentNameIndex: [0],
          repairNames: ['请选择'],
          repairNameIndex: [0],
          deviceDepartments: ['请选择'],
          deviceDepartmentIndex:0,
          deviceNames: ['请选择'],
          deviceNameIndex: 0,
          companyNameIndex: eindex,
          devicePerson: '',
          personDepartment: '',
          personPhone: '',
          deviceNameIndex: 0,
        })
        if (eindex>0){
          this.requestDepartment(this.data.companyInfos[eindex-1].companyid,false,false);
        }
        break;
      case 'departmentName':
        this.setData({
          departmentNameIndex:eindex
        })
        if (eindex > 0) {
          this.requestCompanyMember(this.data.departmentInfos[eindex - 1].id,false);
        }
        this.setData({
          repairNames: ['请选择'],
          repairNameIndex: [0],
        })
        break;
      case 'repairName':
        var phone = this.data.repairNameInfo[eindex - 1].mobile;
        console.log("电话号码："+phone);
        this.setData({
          repairNameIndex:eindex,
          telephone: phone,
        })
        break;
      case 'serviceLevel':
        this.setData({
          serviceLevelIndex: eindex,
        })
        break;
      case 'influenceLevel':
        this.setData({
          influenceLevelIndex: eindex
        })
        break;
      case 'repairCompany':
        this.setData({
          repairCompanyIndex: eindex
        })
        if (eindex > 0) {
          this.requestDepartment(this.data.repairCompanyInfo[eindex - 1].companyid,true,false);
        }
        this.setData({
          repairDepartments: ['请选择'],
          repairDepartmentIndex: [0],
          repairMembers: ['请选择'],
          repairMemberIndex: [0],
          gds: '',
          jsl: '',
          hpl: ''
        })
        break;
      case 'repairDepartment':
        this.setData({
          repairDepartmentIndex: eindex
        });
        if (eindex > 0) {
          this.requestCompanyMember(this.data.repairDepartmentInfo[eindex - 1].id, true);
        }
        this.setData({
          repairMembers: ['请选择'],
          repairMemberIndex: [0],
          gds:'',
          jsl:'',
          hpl:''
        })
        break;
      case 'repairMember':
        this.setData({
          repairMemberIndex: eindex
        })
        if (eindex>0){
          console.log(this.data.repairMemberInfo[eindex-1].id);
          this.requestPersonAccount(this.data.repairMemberInfo[eindex - 1].id);
        }
        break;
      case 'serviceCatalog':
        this.setData({
          serviceCatalogIndex: eindex,
          weight: this.data.serviceCatalogInfo[eindex - 1].weight
        })
        this.requestServiceCatalogDetail(this.data.serviceCatalogInfo[eindex - 1].id);
        break;
      case 'serviceDetail':
        this.setData({
          serviceDetailIndex: eindex,
          weight: this.data.serviceDetailInfo[eindex - 1].weight
        })
        break;
      case 'deviceDepartment':
        var deviceDepartmentInfo = this.data.deviceDepartmentInfo;
        this.setData({
          deviceDepartmentIndex: eindex,
          deviceNames: ['请选择'],
          deviceNameIndex: 0,
          devicePerson: '',
          personDepartment: '',
          personPhone: '',
        })
        if (deviceDepartmentInfo != '' && eindex > 0){
          if (eindex == deviceDepartmentInfo.length+1){
            this.requestCompanyDeviceName(this.data.companyInfos[this.data.companyNameIndex - 1].companyid,false);
          }else{
            this.requestDeviceName(deviceDepartmentInfo[eindex - 1].id,false);
          }
        }
        break;
      case 'deviceName':
        if (eindex>0){
          this.setData({
            deviceNameIndex: eindex,
            devicePerson: this.data.deviceNameInfo[eindex - 1].personName,
            personDepartment: this.data.deviceDepartmentIndex == this.data.deviceDepartmentInfo.length + 1 ? "公司资产" : this.data.deviceDepartmentInfo[this.data.deviceDepartmentIndex - 1].name,
            personPhone: this.data.deviceNameInfo[eindex - 1].personPhone,
          })
        }else{
          this.setData({
            deviceNameIndex: eindex,
            devicePerson: '',
            personDepartment: '',
            personPhone: '',
          })
        }
        
        break;
      case 'companyType':
      if(eindex==0){
        this.setData({
          isRepairCompany:true,
          companyTypeIndex: eindex,
          gds: '',
          jsl: '',
          hpl: ''
        })
      }else{
        this.setData({
          isRepairCompany: false,
          companyTypeIndex: eindex,
          gds: '',
          jsl: '',
          hpl: ''
        })
      }
      break;
      case 'serviceCompany':
      this.setData({
        serviceCompanyIndex: eindex,
        gds: '',
        jsl: '',
        hpl: ''
      })
        if (eindex>0){
          this.requestServiceCompanyMember(this.data.companyInfos[eindex - 1].companyid);
        }
      break;
      case 'companyMan':
        this.setData({
          companyManIndex: eindex,
        })
        if (eindex>0){
          this.requestPersonAccount(this.data.companyManInfo[eindex - 1].id);
        }
        break;
      default:
        return
    }
  },

  toTimeChoose:function(e){
    console.log(e);
    wx.setStorageSync("timeType", "Y");
    wx.navigateTo({
      url: '../study/study'
    })
  },

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var canAddPaths = [];
        var addPicSize = 9 - that.data.uploadimgs.length;
        if (addPicSize > 0) {
          if (tempFilePaths.length < addPicSize + 1) {
            that.setData({
              uploadimgs: that.data.uploadimgs.concat(tempFilePaths),
            })
          } else {
            for (var i = 0; i < addPicSize; i++) {
              canAddPaths[i] = tempFilePaths[i]
            }
            that.setData({
              uploadimgs: that.data.uploadimgs.concat(canAddPaths),
            })
          }

        }
      }
    })
  },

  deleteImage: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var images = this.data.uploadimgs;
    images.splice(index, 1);
    this.setData({
      uploadimgs: images
    });

  },

  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    // Array.prototype.remove = function(i){
    //   const l = this.length;
    //   if(l==1){
    //     return []
    //   }else if(i>1){
    //     return [].concat(this.splice(0,i),this.splice(i+1,l-1))
    //   }
    // }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })
  },

  previewImage:function(e){
    console.log(e)
    // var index = e.currentTarget.dataset.index;
    var pictures = this.data.uploadimgs;
    wx.previewImage({
    current: e.target.dataset.src, // 当前显示图片的http链接
    urls: pictures, // 需要预览的图片http链接列表
    })
  },

  changeRepair:function(){
    if(this.data.isOther){
      this.setData({
        isOther:false,
        changeType:'其它'
      })
    }else{
      this.setData({
        isOther: true,
        changeType: '返回'
      })
    }

  },

  changeDeviceFrom: function () {
    if (this.data.isOtherDevice) {
      this.setData({
        isOtherDevice: false,
        deviceType: '其它'
      })
    } else {
      this.setData({
        isOtherDevice: true,
        deviceType: '返回'
      })
    }

  },

  cancleChange: function () {
    this.setData({
      modalHidden: true,
    })
  },

  modalChange: function () {
    this.setData({
      modalHidden: true,
    })
    if (this.data.companyTypeIndex==0){
      if (this.data.repairCompanyIndex == 0) {
        this.setData({
          popErrorMsg: '请选择服务公司',
        })
        this.tipfadeOut();
        return;
      }
      if (this.data.repairMemberIndex == 0) {
        this.setData({
          popErrorMsg: '请选择服务人员',
        })
        this.tipfadeOut();
        return;
      }
    }else{
      if (this.data.serviceCompanyIndex == 0) {
        this.setData({
          popErrorMsg: '请选择服务公司',
        })
        this.tipfadeOut();
        return;
      }
      if (this.data.companyManIndex == 0) {
        this.setData({
          popErrorMsg: '请选择服务人员',
        })
        this.tipfadeOut();
        return;
      }
    }
    this.setData({
      totalFilePath: this.data.uploadimgs.concat(this.data.audioPath)
    })
    if (this.data.totalFilePath.length == 0) {
      this.uploadNoImageAndData();
    } else {
      wx.showLoading({
        title: '加载中',
      });
      this.uploadImageAndData(0, this.data.totalFilePath.length, '');
    }
  },

  requestServiceCompanyMember: function (companyId) {
    var that = this;
    var temMembers = ['请选择'];
    var param = {
      "userInfo.companyId": companyId
    } 

    app.webCall(app.serviceCode["GET_MEMBER_BY_COMPANY"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.info.length; i++) {
          temMembers[i + 1] = res.info[i].userName;
        }
        that.setData({
          companyMans: temMembers,
          companyManInfo: res.info,
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

  requestComapny:function(isRepair){
    var that = this;
    var temCompanys = ['请选择'];
    var param = {
      "type": '1'
    }
    if(isRepair){
      param.type = '2';
    }
    app.webCall(app.serviceCode["QUERY_COMPANY_NAME"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length;i++){
          temCompanys[i+1] = res.detail[i].name;
        }
        if(!isRepair){
          that.setData({
            companyNames: temCompanys,
            companyInfos: res.detail,
          })
        }else{
          that.setData({
            repairCompanys: temCompanys,
            repairCompanyInfo: res.detail,
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
 * 获取部门信息
 * isRepair是否维修
 * isScanner扫描数据
 */
  requestDepartment: function (compnayId,isRepair,isScanner) {
    var that = this;
    var temDepartments = ['请选择'];
    var temDeviceDepartments = ['请选择'];
    var param = {
      "companyId": compnayId
    }

    app.webCall(app.serviceCode["QUERY_COMPANY_DEPARTMENT"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length; i++) {
          temDepartments[i + 1] = res.detail[i].name;
          temDeviceDepartments[i + 1] = res.detail[i].name;
        }
        temDeviceDepartments[res.detail.length + 1] = "公司资产",
        console.log(temDepartments);
        if(!isRepair){
          that.setData({
            departmentNames: temDepartments,
            departmentInfos: res.detail,
            deviceDepartments: temDeviceDepartments,
            deviceDepartmentInfo: res.detail,
          })
          if(isScanner){
            if (that.data.scannerInfo.deptId != ''){
              for (var i = 0; i < that.data.deviceDepartmentInfo.length; i++) {
                if (that.data.scannerInfo.deptId == that.data.deviceDepartmentInfo[i].id) {
                  that.setData({
                    departmentNameIndex: i + 1,
                    repairNames: ['请选择'],
                    repairNameIndex: [0],
                    deviceDepartmentIndex: i + 1,
                    deviceNames: ['请选择'],
                    deviceNameIndex: 0,
                    devicePerson: '',
                    personDepartment: '',
                    personPhone: '',
                  })
                  that.requestCompanyMember(that.data.deviceDepartmentInfo[i].id, false);
                  that.requestDeviceName(that.data.deviceDepartmentInfo[i].id,true);
                }
              }
            } else {
              that.setData({
                deviceDepartmentIndex: that.data.deviceDepartmentInfo.length+1,
                repairNames: ['请选择'],
                repairNameIndex: [0],
              })
              that.requestCompanyDeviceName(that.data.scannerInfo.companyId,true);
            }
            
          }
        }else{
          that.setData({
            repairDepartments: temDepartments,
            repairDepartmentInfo: res.detail,
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

  requestCompanyMember: function (deptId,isRepair) {
    var that = this;
    var temMembers = ['请选择'];
    var param = {
      "deptId": deptId
    }

    app.webCall(app.serviceCode["QUERY_COMPANY_MEMBER"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length; i++) {
          temMembers[i + 1] = res.detail[i].userName;
        }
        if (!isRepair){
            that.setData({
              repairNames: temMembers,
              repairNameInfo: res.detail,
            })
        }else{
          that.setData({
            repairMembers: temMembers,
            repairMemberInfo: res.detail,
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

  requestPersonAccount: function (userId) {
    var that = this;
    var param = {
      "faultReportDTO.sysUserId": userId
    }

    app.webCall(app.serviceCode["GET_PERSON_ORDER_COUNT"], param,
      function onSuccess(res) {
        console.log(res)
        if (res.info.length>0){
          that.setData({
            gds: res.info[0].ungdscount,
            jsl: res.info[0].jslff,
            hpl: res.info[0].hplff,
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

  requestServiceCatalog: function () {
    var that = this;
    var temMembers = ['请选择'];
    app.webCall(app.serviceCode["GET_SERVICE_CATALOG"], null,
      function onSuccess(res) {
        for (var i = 0; i < res.info.length; i++) {
          temMembers[i + 1] = res.info[i].name;
        }
        that.setData({
          serviceCatalogs: temMembers,
          serviceCatalogInfo: res.info,
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

  requestServiceCatalogDetail: function (perId) {
    var that = this;
    var temMembers = ['请选择'];
    var param = {
      "serviceList.perId": perId
    }
    app.webCall(app.serviceCode["GET_SERVICE_CATALOG_DETAIL"], param,
      function onSuccess(res) {
        // console.log(res);
        for (var i = 0; i < res.info.length; i++) {
          temMembers[i + 1] = res.info[i].name;
        }
        that.setData({
          serviceDetails: temMembers,
          serviceDetailInfo: res.info,
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

  requestDeviceName: function (perId,isScanner) {
    var that = this;
    var temMembers = ['请选择'];
    var param = {
      "deptId": perId
    }
    app.webCall(app.serviceCode["GET_DEVICE_NAME"], param,
      function onSuccess(res) {
        // console.log(res);
        for (var i = 0; i < res.info.length; i++) {
          temMembers[i + 1] = res.info[i].deviceName;
        }
        that.setData({
          deviceNames: temMembers,
          deviceNameInfo: res.info,
        })
        if(isScanner){
          for (var i = 0; i < that.data.deviceNameInfo.length;i++){
            if (that.data.deviceNameInfo[i].id == that.data.scannerInfo.id){
              that.setData({
                devicePerson: that.data.scannerInfo.personName,
                personDepartment: that.data.deviceDepartments[that.data.deviceDepartmentIndex],
                personPhone: that.data.scannerInfo.personPhone,
                deviceNameIndex:i+1,
              })
            }
          }
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

  requestCompanyDeviceName: function (companyId,isScanner) {
    var that = this;
    var temMembers = ['请选择'];
    var param = {
      "companyId": companyId
    }
    app.webCall(app.serviceCode["COMPANY_GET_DEVICE_NAME"], param,
      function onSuccess(res) {
        // console.log(res);
        for (var i = 0; i < res.info.length; i++) {
          temMembers[i + 1] = res.info[i].deviceName;
        }
        that.setData({
          deviceNames: temMembers,
          deviceNameInfo: res.info,
        })
        if (isScanner) {
          for (var i = 0; i < that.data.deviceNameInfo.length; i++) {
            if (that.data.deviceNameInfo[i].id == that.data.scannerInfo.id) {
              that.setData({
                devicePerson: that.data.scannerInfo.personName,
                personDepartment: that.data.deviceDepartments[that.data.deviceDepartmentIndex],
                personPhone: that.data.scannerInfo.personPhone,
                deviceNameIndex: i + 1,
              })
            }
          }
        }
      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.requestComapny(true);

    }, 600);
  },

  tipfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
    }, 3000);
  },

  tipfadeOutByNoCompany() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ errorMsg: '' });
    }, 3000);
  },    

  toTimeChoose: function (e) {
    console.log(e);
    wx.setStorageSync("timeType", "Y");
    wx.navigateTo({
      url: '../../dateChoose/dateChoose'
    })
  },
  toEndTimeChoose: function (e) {
    console.log(e);
    wx.setStorageSync("timeType", "N");
    wx.navigateTo({
      url: '../../dateChoose/dateChoose'
    })
  },

  applySubmit: function (e) {
    this.dealFormIds(e.detail.formId);
    console.log(e);
    var otherDeviceName = e.detail.value.otherDeviceName;
    var title = e.detail.value.title;
    var serviceContent = wx.getStorageSync('serviceDescribe');
    var repairMan = e.detail.value.repairMan;
    var repairManPhone = e.detail.value.repairManPhone;
    if (wx.getStorageSync('userInfo').isRepair == '1' && this.data.isOtherDevice) {
      this.setData({
        popErrorMsg: '请选择二维码扫描的方式报修',
      })
      this.ohShitfadeOut();
      return
    }
    if (title == '') {
      this.setData({
        popErrorMsg: '请输入标题',
      })
      this.tipfadeOut();
      return;
    }
    this.setData({
      title: title,
    })
    if (this.data.companyNameIndex==0){
      this.setData({
        popErrorMsg: '请选择服务公司',
      })
      this.tipfadeOut();
      return;
    }
    if(!this.data.isOther){
      if (this.data.repairNameIndex == 0) {
        this.setData({
          popErrorMsg: '请选择报修人',
        })
        this.tipfadeOut();
        return;
      }
    }else{
      if (repairMan==''){
        this.setData({
          popErrorMsg: '请输入报修人',
        })
        this.tipfadeOut();
        return;
      }
      if (repairManPhone == '') {
        this.setData({
          popErrorMsg: '请输入报修人电话',
        })
        this.tipfadeOut();
        return;
      }

    }
    if (this.data.serviceLevelIndex == 0) {
      this.setData({
        popErrorMsg: '请服务级别',
      })
      this.tipfadeOut();
      return;
    }
    if (this.data.createTime == 'yy-mm-dd' || this.data.createTime == '') {
      this.setData({
        popErrorMsg: '请选择创建时间',
      })
      this.tipfadeOut();
      return
    }
    if (this.data.endTime == 'yy-mm-dd' || this.data.endTime == '') {
      this.setData({
        popErrorMsg: '请选择超时时间',
      })
      this.tipfadeOut();
      return
    }

    if (this.data.influenceLevelIndex == 0) {
      this.setData({
        popErrorMsg: '请选择影响度',
      })
      this.tipfadeOut();
      return;
    }
    
    if (!this.data.isOtherDevice){
      if (this.data.deviceNameIndex==0){
        this.setData({
          popErrorMsg: '请选择设备名称',
        })
        this.tipfadeOut();
        return;
      }
    }else{
      if (otherDeviceName==''){
        this.setData({
          popErrorMsg: '请输入设备名称',
        })
        this.tipfadeOut();
        return
      }
      this.setData({
        otherDeviceName: otherDeviceName,
      })
    }
    if (this.data.serviceCatalogIndex == 0) {
      this.setData({
        popErrorMsg: '请选择服务目录',
      })
      this.tipfadeOut();
      return;
    }
    if (serviceContent == '' && this.data.audioPath.length == 0) {
      this.setData({
        popErrorMsg: '请填输入服务描述或语音描述',
      })
      this.tipfadeOut();
      return
    }
    this.setData({
      serviceContent: serviceContent,
      modalHidden: false,
    })

    
    // this.sendNote(formid);


  },

  uploadImageAndData: function (i, length, faultId) {
    var map = { '1': '10', '2': '15', '3': '20' };
    var effects = ['1', '2', '3'];
    wx.uploadFile({
      url: app.apiHost + app.serviceCode["CREATE_SERVICE"],
      filePath: this.data.totalFilePath.length == 0 ? '' : this.data.totalFilePath[i],
      name: 'attachment',
      formData: {
        'state': '1',
        'faultId': faultId,
        'userId': wx.getStorageSync('userInfo').id,
        'faultInfo.title': this.data.title,
        'faultInfo.faultLevel': map[this.data.serviceLevelIndex + ''],
        'faultInfo.faultDate': this.data.createTime,
        'faultInfo.faultEndDate': this.data.endTime,
        'faultInfo.serviceid': this.data.serviceCatalogInfo[parseInt(this.data.serviceCatalogIndex) - 1].id,
        'faultInfo.effect': effects[this.data.influenceLevelIndex],
        'faultInfo.faultFrom': '3',
        'faultInfo.faultStatus': '3',
        'faultInfo.faultContent': this.data.serviceContent,
        'faultInfo.personid': this.data.companyTypeIndex == 0 ? this.data.repairMemberInfo[this.data.repairMemberIndex - 1].id : this.data.companyManInfo[this.data.companyManIndex - 1].id,
        'faultInfo.equipmentName': this.data.isOtherDevice ? this.data.otherDeviceName : this.data.deviceNames[this.data.deviceNameIndex], 
        'faultInfo.equipmentId': this.data.isOtherDevice ? '' : this.data.deviceNameInfo[this.data.deviceNameIndex-1].id,
        'faultInfo.weight': this.data.weight,
        'faultInfo.companyid': this.data.companyInfos[parseInt(this.data.companyNameIndex) - 1].companyid,
        'faultInfo.repairmanName': this.data.isOther ? this.data.repairMan :this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].userName,
        'faultInfo.repairmanPhone': this.data.isOther ? this.data.repairManPhone : this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].mobile,
        'faultInfo.sysuserid': this.data.isOther? "":this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].id,
        'routerCompany': wx.getStorageSync("serial"),
        'sessionId': wx.getStorageSync("sessionId"),
      },
      success: (res) => {
        console.log('成功');
        if (i == 0) {
          faultId = JSON.parse(res.data).faultId;
          console.log(JSON.parse(res.data).faultId);
        }
        // console.log(res.data);
        // console.log(res);


      },
      fail: (res) => {
        console.log('失败');
        console.log(res);
      },

      complete: () => {
        i++;
        if (i == length) {
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: '服务创建成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../../customerPage/customerPage',
                })
              }
            }
          })
        } else {
          this.uploadImageAndData(i, length, faultId);
        }
      },
    })
  },

  uploadNoImageAndData: function () {
    var map = { '1': '10', '2': '15', '3': '20' };
    var effects = ['1', '2', '3'];
    var param = {
      'state': '',
      'faultId': '',
      'userId': wx.getStorageSync('userInfo').id,
      'faultInfo.title': this.data.title,
      'faultInfo.faultLevel': map[this.data.serviceLevelIndex + ''],
      'faultInfo.faultDate': this.data.createTime,
      'faultInfo.faultEndDate': this.data.endTime,
      'faultInfo.serviceid': this.data.serviceCatalogInfo[parseInt(this.data.serviceCatalogIndex) - 1].id,
      'faultInfo.effect': effects[this.data.influenceLevelIndex],
      'faultInfo.faultFrom': '3',
      'faultInfo.faultStatus': '3',
      'faultInfo.faultContent': this.data.serviceContent,
      //'faultInfo.personid': this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].id,
      'faultInfo.equipmentName': this.data.isOtherDevice ? this.data.otherDeviceName : this.data.deviceNames[this.data.deviceNameIndex],
      'faultInfo.equipmentId': this.data.isOtherDevice ? '' : this.data.deviceNameInfo[this.data.deviceNameIndex - 1].id,
      'faultInfo.weight': this.data.weight,
      'faultInfo.companyid': this.data.companyInfos[parseInt(this.data.companyNameIndex) - 1].companyid,

      'faultInfo.repairmanName': this.data.isOther ? this.data.repairMan : this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].userName,
      'faultInfo.repairmanPhone': this.data.isOther ? this.data.repairManPhone : this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].mobile,
      'faultInfo.sysuserid': this.data.isOther ? "" : this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].id,
      'attachment': ''
    };
    if (this.data.companyTypeIndex==0){
      param['faultInfo.personid'] = this.data.repairMemberInfo[this.data.repairMemberIndex-1].id;
    }else{
      param['faultInfo.personid'] = this.data.companyManInfo[this.data.companyManIndex - 1].id;
    };
    app.webCall(app.serviceCode["CREATE_SERVICE"], param,
      function onSuccess(res) {
        wx.showModal({
          title: '温馨提示',
          content: '服务创建成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../../customerPage/customerPage',
              });
            }
          }
        });
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")

  },

  transferDescribe:function(){
    wx.navigateTo({
      url: '../../serviceDescribe/serviceDescribe',
    })
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

  scannerData:function(){
    var that = this;
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        console.log("扫描成功：")
        if (res.result!=null){
          this.getScannerContent(JSON.parse(res.result).eId, that)
        }
      },
      fail: (res) => {
        console.log("扫描失败")
      }
    })
  },

  getScannerContent: function (id, that) {
    var hasCompany = false; 
    var temMembers = ['请选择'];
    var param = {
      "equipmentInfo.id": id,
      "type": 1
    }
    app.webCall(app.serviceCode["GET_SCANNER_CONTENT"], param,
      function onSuccess(res) {
        console.log(res);
        for (var i = 0; i < that.data.companyInfos.length;i++){
          if (that.data.companyInfos[i].companyid == res.info[0].companyId){
            hasCompany = true;
            that.setData({
              companyNameIndex: i+1,
              departmentNames: ['请选择'],
              departmentNameIndex: [0],
              repairNames: ['请选择'],
              repairNameIndex: [0],
              deviceDepartments: ['请选择'],
              deviceDepartmentIndex: 0,
              deviceNames: ['请选择'],
              deviceNameIndex: 0,
              devicePerson: '',
              personDepartment: '',
              personPhone: '',
              deviceNameIndex: 0,
              scannerInfo: res.info[0],
              title: res.info[0].deviceName+"故障",
              createTime: that.getNowFormatDate(true),
              endTime: that.getNowFormatDate(false),
              serviceLevelIndex:1,
              influenceLevelIndex:1,      
            })
            that.requestDepartment(that.data.companyInfos[i].companyid, false,true);
            break;
          }

        }

        if(!hasCompany){
          wx.showModal({
            title: '温馨提示',
            content: '服务公司不存在此设备',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          });
          return;
        }
        
      },
      function onErrorBefore(res) {
        console.log(res);
        wx.showModal({
          title: '温馨提示',
          content: '服务请求失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        });
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },


  getNowFormatDate: function (isNowDay) {
    var date = new Date();
    if (!isNowDay) {
      date.setDate(date.getDate() + 1);
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var seperator3 = " ";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes()
    var second = date.getSeconds();
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
    if (second >= 0 && second <= 9) {
      second = "0" + second;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + second;
    return currentdate;
  }, 

  bindtapPlayAudio: function () {
    var that = this;
    this.setData({
      isPlayAudio: !this.data.isPlayAudio
    })
    innerAudioContext.play();
  },


  bindtouchstart: function (e) {
    console.log(e)
    this.setData({
      isReady: false
    })
    recorderManager.start(options);

  },


  bindtouchend: function (e) {
    console.log(e)
    recorderManager.stop();
    this.setData({
      isReady: true
    })
  },

  deviceSearch:function(e){
    if (this.data.deviceNames.length!=1){
      this.setData({
        isSearchDevice:true
      })
        wx.navigateTo({
          url: '../../searchPage/searchPage?deviceNames=' +this.data.deviceNames.join('_'),
        })
    }
  },

  companySearch: function (e) {
    if (this.data.companyNames.length != 1) {
      this.setData({
        isSearchCompany: true
      })
      wx.navigateTo({
        url: '../../searchCompanyName/searchCompanyName?deviceNames=' + this.data.companyNames.join('_'),
      })
    }
  }


  


})