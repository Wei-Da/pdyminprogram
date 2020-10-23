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
    departmentNames: [],
    departmentNameIndex: 0,
    departmentInfos: [],
    index: 0,
    createTime: "yy-mm-dd",
    endTime: "yy-mm-dd",
    editable: false, //是否可编辑
    telephone: '',
    popErrorMsg: '',
    serviceContent: '',
    personId: '',
    personName:'',
    fauleEndDate:'',
    isChangePerson:true,
    faultId:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      personId: options.personId,
      personName: options.personName,
      fauleEndDate: options.fauleEndDate,
      telephone: options.personName,
      faultId: options.faultId,
      companyNames:['变更维修人','变更时间'],
    })
    this.requestRepairName();
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
          companyNameIndex: eindex,
          isChangePerson: eindex==0?true:false,
          telephone: eindex == 0 ? this.data.personName : this.data.fauleEndDate,
        })
        break;
      case 'departmentName':
        this.setData({
          departmentNameIndex: eindex
        })
        this.setData({
          repairNames: ['请选择'],
          repairNameIndex: [0],
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
      url: '../study/study'
    })
  },

 

  requestRepairName: function () {
    var that = this;
    var temDepartments = [];
    var param = {
      "userInfo.id": this.data.personId,
    }

    app.webCall(app.serviceCode["GET_REPAIR_NAMES"], param,
      function onSuccess(res) {
        console.log(res)
        for (var i = 0; i < res.info.length; i++) {
          temDepartments[i] = res.info[i].userName;
        }
        console.log(temDepartments);
        that.setData({
          departmentNames: temDepartments,
          departmentInfos: res.info,
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
    console.log(e);
    this.dealFormIds(e.detail.formId);
    var serviceContent = e.detail.value.serviceContent;
    if (!this.data.isChangePerson){
          if (this.data.endTime == 'yy-mm-dd' || this.data.endTime == '') {
            this.setData({
              popErrorMsg: '请选择超时时间',
            })
            this.tipfadeOut();
            return
          }
    }
    if (serviceContent == '') {
      this.setData({
        popErrorMsg: '请输入变更描述',
      })
      this.tipfadeOut();
      return
    }
    this.uploadNoImageAndData(serviceContent);


  },

  uploadNoImageAndData: function (serviceContent) {
    var param = {
      'changeInfo.content': serviceContent,
      'changeInfo.faultId': this.data.faultId,
      'changeInfo.oldPerson':this.data.personId,
    }
    if (this.data.isChangePerson){
      param['changeInfo.type'] = '1';
      param['changeInfo.newPerson'] = this.data.departmentInfos[this.data.departmentNameIndex].id;
    }else{
      param['changeInfo.type'] = '2';
      param['changeInfo.oldDate'] = this.data.fauleEndDate;
      param['changeInfo.newDate'] = this.data.endTime;
    }
    app.webCall(app.serviceCode["SERVICE_CHANGE"], param,
      function onSuccess(res) {
        console.log(res)
        if (res.resultcode == '2') {
          wx.navigateBack({

          })
        } else {
          that.setData({
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