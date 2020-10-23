// pages/createService/createService.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyNames: [],
    companyNameIndex: 0,
    companyInfos: [],
    departmentNames: ["请选择"],
    departmentNameIndex: 0,
    departmentInfos: [],
    repairNames: ["请选择"],
    repairNameIndex: 0,
    repairNameInfo: [],
    influenceLevels: [],
    influenceLevelIndex: 0,
    serviceCatalogs: [],
    serviceCatalogInfo: [],
    serviceCatalogIndex: 0,
    serviceDetails: ['请选择'],
    serviceDetailInfo: [],
    serviceDetailIndex: 0,
    serviceLevelIndex: 0,
    pictures: [],
    index: 0,
    createTime: "yy-mm-dd",
    endTime: "yy-mm-dd",
    uploadimgs: [],
    editable: false, //是否可编辑
    title: '',
    changeType: '其它',
    isOther: false,
    telephone: '',
    weight: '',
    popErrorMsg: '',
    serviceContent: '',
    repairMan: '',
    repairManPhone: '',
    faultId:'',
    isRepairCompany:true,
    serviceCompanys:['请选择'],
    serviceCompanyIndex:0,
    serviceCompanyInfo:[],
    serviceMans:['请选择'],
    serviceManIndex:0,
    serviceManInfo:[],
    companyTypes: ['运维公司', '服务公司'],
    companyTypeIndex: 0,
    isFirst:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      faultId: options.faultId,
    })
    this.requestCompany(true);
    this.requestServiceCatalog();
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
        if (eindex > 0) {
          this.requestDepartment(this.data.companyInfos[eindex - 1].companyid);
        }
        this.setData({
          departmentNames: ['请选择'],
          departmentNameIndex: [0],
          repairNames: ['请选择'],
          repairNameIndex: [0],
        })
        break;
      case 'departmentName':
        this.setData({
          departmentNameIndex: eindex
        })
        if (eindex > 0) {
          this.requestCompanyMember(this.data.departmentInfos[eindex - 1].id);
        }
        this.setData({
          repairNames: ['请选择'],
          repairNameIndex: [0],
        })
        break;
      case 'repairName':
        if (eindex>0){
          var phone = this.data.repairNameInfo[eindex - 1].telephone;
          this.setData({
            repairNameIndex: eindex,
            telephone: phone,
          })
        }else{
          this.setData({
            repairNameIndex: eindex,
            telephone: "",
          })
        }
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
      case 'companyType':
        if (eindex==0){
          this.setData({
            companyTypeIndex: eindex,
            isRepairCompany:true,
            telephone: '',
          })
        }else{
          if (this.data.isFirst==true){
            this.requestCompany(false);
          }
          this.setData({
            companyTypeIndex: eindex,
            isRepairCompany: false,
            telephone: '',
          })
        }
        break;
      case 'serviceCompany':
        if (eindex > 0) {
          this.requestServiceCompanyMember(this.data.serviceCompanyInfo[eindex - 1].companyid);
        }
        this.setData({
          serviceCompanyIndex:eindex,
        })
        break;
      case 'serviceMan':
        if (eindex>0){
          var phone = this.data.serviceManInfo[eindex - 1].telephone;
          this.setData({
            serviceManIndex: eindex,
            telephone: phone,
          });
        }else{
          this.setData({
            serviceManIndex: eindex,
            telephone: "",
          });
        }
        break;
      default:
        return
    }
  },

  toTimeChoose: function (e) {
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
        var tempFilePaths = res.tempFilePaths
        that.setData({
          uploadimgs: tempFilePaths
        });
      }
    })
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
        changeType: '其它'
      })
    } else {
      this.setData({
        isOther: true,
        changeType: '返回'
      })
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
          serviceMans: temMembers,
          serviceManInfo: res.info,
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

  requestCompany: function (isRepair) {
    var that = this;
    var temCompanys = ['请选择'];
    var param = {
      "type": '1'
    }
    if (isRepair) {
      param.type = '2';
    }
    app.webCall(app.serviceCode["QUERY_COMPANY_NAME"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.detail.length; i++) {
          temCompanys[i + 1] = res.detail[i].name;
        }
        if (!isRepair) {
          that.setData({
            serviceCompanys: temCompanys,
            serviceCompanyInfo: res.detail,
          })
        } else {
          that.setData({
            companyNames: temCompanys,
            companyInfos: res.detail,
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

  // requestComapny: function () {
  //   var that = this;
  //   var temCompanys = ['请选择'];
  //   var param = {
  //     "type": '2'
  //   }
  //   app.webCall(app.serviceCode["QUERY_COMPANY_NAME"], param,
  //     function onSuccess(res) {
  //       console.log(res)
  //       for (var i = 0; i < res.detail.length; i++) {
  //         temCompanys[i + 1] = res.detail[i].name;
  //       }
  //       that.setData({
  //         companyNames: temCompanys,
  //         companyInfos: res.detail,
  //       })
  //     },
  //     function onErrorBefore(res) {
  //       console.log(res)
  //     },
  //     function onComplete(res) {
  //       console.log(res)
  //     },

  //     "POST")
  // },


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
          temMembers[i + 1] = res.detail[i].userName;
        }
        that.setData({
          repairNames: temMembers,
          repairNameInfo: res.detail,
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

  

  tipfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
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
    if (this.data.companyTypeIndex==0){
      if (this.data.companyNameIndex == 0) {
        this.setData({
          popErrorMsg: '请选择公司名称',
        })
        this.tipfadeOut();
        return;
      }
      if (this.data.repairNameIndex == 0) {
        this.setData({
          popErrorMsg: '请选择服务人',
        })
        this.tipfadeOut();
        return;
      }
    }else{
      if (this.data.serviceCompanyIndex == 0) {
        this.setData({
          popErrorMsg: '请选择公司名称',
        })
        this.tipfadeOut();
        return;
      }
      if (this.data.serviceManIndex == 0) {
        this.setData({
          popErrorMsg: '请选择服务人',
        })
        this.tipfadeOut();
        return;
      }
    }
    
    if (this.data.serviceCatalogIndex == 0) {
      this.setData({
        popErrorMsg: '请选择服务目录',
      })
      this.tipfadeOut();
      return;
    }
    if (this.data.endTime == 'yy-mm-dd' || this.data.endTime == '') {
      this.setData({
        popErrorMsg: '请选择超时时间',
      })
      this.tipfadeOut();
      return
    }
    this.uploadNoImageAndData();


  },

  uploadNoImageAndData: function () {
    var param = {
      'faultInfo.faultId': this.data.faultId,
      'userId': wx.getStorageSync('userInfo').id,
      'faultInfo.faultEndDate': this.data.endTime,
      'faultInfo.serviceid': this.data.serviceCatalogInfo[parseInt(this.data.serviceCatalogIndex) - 1].id,
      //'faultInfo.personid': this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].id,
      'faultInfo.weight': this.data.weight,
    };
    if (this.data.companyTypeIndex == 0) {
      param['faultInfo.personid'] = this.data.repairNameInfo[parseInt(this.data.repairNameIndex) - 1].id;
    }else{
      param['faultInfo.personid'] = this.data.serviceManInfo[parseInt(this.data.serviceManIndex) - 1].id;
    }
    app.webCall(app.serviceCode["SERVICE_DISTRIBUTE"], param,
      function onSuccess(res) {
        console.log(res)
        wx.switchTab({
          url: '../../customerPage/customerPage',
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






})