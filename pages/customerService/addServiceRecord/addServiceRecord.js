// pages/serviceCompany/mineCreateService/mineCreateService.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyNames: [],
    companyNameIndex: 0,
    companyInfos: [],
    serviceLevels:[],
    serviceLevelIndex: 0,
    influenceLevels: [],
    influenceLevelIndex: 0,
    serviceDetails: [],
    serviceDetailIndex: 0,
    pictures: [],
    index: 0,
    createTime: "yy-mm-dd",
    endTime: "yy-mm-dd",
    uploadimgs: [],
    editable: false, //是否可编辑
    title: '',
    changeType: '其它',
    isOther: true,
    popErrorMsg:'',
    serviceIp:'',
    serviceContent:'',
    faultId:'',
    processId: '',
    processPerId: '',
    imageWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.faultId);
    this.setData({
      faultId: options.faultId,
      processId: options.processId,
      processPerId: options.processPerId,
      title: options.faultTitle
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

  bindPickerChange: function (e) {
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch (name) {
      case 'companyName':
        this.setData({
          companyNameIndex: eindex
        })
        break;
      case 'serviceLevel':
        this.setData({
          serviceLevelIndex: eindex
        })
        break;
      case 'repairName':
        this.setData({
          repairNameIndex: eindex
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
        break;
      case 'repairDepartment':
        this.setData({
          repairDepartmentIndex: eindex
        })
        break;
      case 'repairMember':
        this.setData({
          repairMemberIndex: eindex
        })
        break;
      case 'serviceCatalog':
        this.setData({
          serviceCatalogIndex: eindex
        })
        break;
      case 'serviceDetail':
        this.setData({
          serviceDetailIndex: eindex
        })
        break;
      default:
        return
    }
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

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          uploadimgs: tempFilePaths
        });
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

  previewImage: function (e) {
    console.log(e)
    // var index = e.currentTarget.dataset.index;
    var pictures = this.data.uploadimgs;
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: pictures, // 需要预览的图片http链接列表
    })
  },

  changeRepair: function () {
    if (this.data.isOther) {
      this.setData({
        isOther: false,
        changeType: '返回'
      })
    } else {
      this.setData({
        isOther: true,
        changeType: '其它'
      })
    }

  },

  requestComapny: function () {
    var that = this;
    var temCompanys = ['请选择'];
    var param = {
      "type": '1'
    }

    app.webCall(app.serviceCode["QUERY_COMPANY_NAME"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length; i++) {
          temCompanys[i + 1] = res.detail[i].name;
        }
        that.setData({
          companyNames: temCompanys,
          companyInfos: res.detail,
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


  requestDepartment: function (compnayId) {
    var that = this;
    var temDepartments = ['请选择'];
    var param = {
      "companyId": compnayId
    }

    app.webCall(app.serviceCode["QUERY_COMPANY_DEPARTMENT"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length; i++) {
          temDepartments[i + 1] = res.detail[i].name;
        }
        console.log(temDepartments);
        that.setData({
          departmentNames: temDepartments,
          departmentInfos: res.detail,
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

  requestCompanyMember: function (deptId) {
    var that = this;
    var temMembers = ['请选择'];
    var param = {
      "deptId": deptId
    }

    app.webCall(app.serviceCode["QUERY_COMPANY_MEMBER"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length; i++) {
          temMembers[i + 1] = res.detail[i].name;
        }

        that.setData({
          departmentNames: temDepartments,
          departmentInfos: res.detail,
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

  applySubmit:function(e){
    console.log(e)
    this.dealFormIds(e.detail.formId);
    var title = e.detail.value.title; 
    var serviceContent = e.detail.value.serviceContent;
    if (title==''){
      this.setData({
        popErrorMsg:'请输入标题',
      })
      this.ohShitfadeOut();
      return;
    }
    this.setData({
      title: title,
    })
    if (serviceContent == '') {
      this.setData({
        popErrorMsg: '请填输入服务描述',
      })
      this.ohShitfadeOut();
      return
    }
    this.setData({
      serviceContent: serviceContent,
    })
    if (this.data.uploadimgs.length == 0) {
      this.uploadNoImageAndData();
    } else {
      wx.showLoading({
        title: '加载中',
      });
      this.uploadImageAndData();
    }
  },

  uploadImageAndData(){
    console.log('有图片'),
    wx.uploadFile({
      url: app.apiHost + app.serviceCode["ADD_SERVICE_RECORD"],
      filePath: this.data.uploadimgs[0],
      name: 'attachment',
      formData:{
        'forwardRecord.faultId': this.data.faultId,
        'forwardRecord.userId': wx.getStorageSync('userInfo').id,
        'forwardRecord.time': this.getNowFormatDate(),
        'forwardRecord.context': this.data.serviceContent,
        'forwardRecord.title': this.data.title,
        "stamp":'2',
        'state':'1',
        'routerCompany': wx.getStorageSync("serial"),
        'sessionId': wx.getStorageSync("sessionId"),
        'processId': this.data.processId,
        'processPerId': this.data.processPerId,
      },
      success:(res)=>{
        console.log('成功'),
        console.log(res),
        wx.hideLoading();
        wx.navigateBack({
          url: '../waitServiceDetail/waitServiceDetail',
        })
      },
      fail: (res) => {
        console.log('失败');
        console.log(res);
      },
      
      complete: () => {
        
      },
    })
  },

  uploadNoImageAndData: function () {
    var param = {
      'forwardRecord.faultId': this.data.faultId,
      'forwardRecord.userId': wx.getStorageSync('userInfo').id,
      'forwardRecord.time': this.getNowFormatDate(),
      'forwardRecord.context': this.data.serviceContent,
      'forwardRecord.title': this.data.title,
      "stamp": '4',
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
          url: '../waitServiceDetail/waitServiceDetail',
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
  

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      
    }, 3000);
  },  

  getNowFormatDate:function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if(month >= 1 && month <= 9) {
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

  dealFormIds: function (formId) {
    let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime()) + 604800000 //计算7天后的过期时间时间戳
    }
    formIds.push(data);//将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  }


})