// pages/serviceCompany/serviceHistoryRecord/serviceHistoryRecord.js
var app = getApp();
var faultLevel = { '0': '', '1': '10', '2': '15', '3': '20' };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList: [],
    scrolltop: null, //滚动位置
    page: 0, //分页
    lastTime: 0,
    navigateToUrl: '',
    modalHidden: true,
    urgencyLevels: ['请选择', '一般', '严重', '紧急'],
    urgencyLevelIndex: 0,
    nowStartDate: '',
    startDate: '',
    endDate: '',
    nowEndDate: '',
    closeStartDate: '',
    closeEndDate: '',
    serviceContent: '',
    isConditionSearch: false,
    isFinishRequest:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var start = this.getYearFormatDate(true);
    var end = this.getYearFormatDate(false);
    this.setData({
      nowStartDate: this.getNowFormatDate(false),
      startDate: start,
      endDate: end,
      nowEndDate: this.getNowFormatDate(true),
      closeStartDate: start,
      closeEndDate: end,
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
    this.fetchServiceData();
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
    this.setData({
      page: 0,
      serviceList: []
    })
    this.fetchServiceData();
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

  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchServiceData();
  },
  fetchServiceData: function () {  //获取服务数据
    var nowTime = new Date().getTime();
    if ((nowTime - this.data.lastTime) < 500) {
      console.log("重复提交")
      return;
    }
    this.setData({
      lastTime: nowTime
    })
    var that = this;
    const perpage = 10;
    this.setData({
      page: this.data.page + 1
    })
    const page = this.data.page;
    // const newlist = [];
    var param = { "page": this.data.page, "rows": perpage, 'faultInfo.personid': wx.getStorageSync('userInfo').id,"type":'10' };
    if (this.data.isConditionSearch) {
      param['faultInfo.faultDate'] = this.data.nowStartDate;
      param['faultInfo.faultEndDate'] = this.data.nowEndDate;
      param['faultInfo.faultLevel'] = faultLevel[this.data.urgencyLevelIndex];
      param['faultInfo.faultContent'] = this.data.serviceContent;
    }
    console.log(wx.getStorageSync('userInfo').id)
    app.webCall(app.serviceCode["ENGINEER_HISTORY_RECORD"], param,
      function onSuccess(res) {
        console.log(res.info)
        that.setData({
          serviceList: that.data.serviceList.concat(res.info),
          isFinishRequest:true
        })
      },
      function onErrorBefore(res) {
        console.log(res)
        that.setData({
          isFinishRequest:true
        })
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")

  },

  conditionSearch: function () {  //获取服务数据
    var nowTime = new Date().getTime();
    if ((nowTime - this.data.lastTime) < 500) {
      console.log("重复提交");
      return;
    }
    this.setData({
      lastTime: nowTime
    })
    var that = this;
    const perpage = 10;
    this.setData({
      page: this.data.page + 1
    })
    const page = this.data.page;
    // const newlist = [];
    var param = {
      "page": 1,
      "rows": perpage,
      "faultInfo.faultDate": this.data.nowStartDate,
      "faultInfo.faultEndDate": this.data.nowEndDate,
      "faultInfo.faultLevel": faultLevel[this.data.urgencyLevelIndex],
      "faultInfo.faultContent": this.data.serviceContent,
      'faultInfo.personid': wx.getStorageSync('userInfo').id, 
      "type": '10'
    };
    console.log(wx.getStorageSync('userInfo').id);
    that.setData({
      serviceList: [],
    })
    app.webCall(app.serviceCode["ENGINEER_HISTORY_RECORD"], param,
      function onSuccess(res) {
        console.log(res.info)
        that.setData({
          serviceList: that.data.serviceList.concat(res.info),
          isConditionSearch: true,
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

  clickItem: function (e) {
    console.log(e);
    console.log(e.currentTarget.dataset.current);
    var clickData = this.data.serviceList[e.currentTarget.dataset.current];
    console.log(clickData);
    var turnToPage = clickData.faultStatus == 5 || clickData.faultStatus == 6 ? "waitServiceDetail" : clickData.faultStatus == 3 ? "waitConfirmDetail" : "serviceHistoryRecordDetail";
    var clickUrl = "../" + turnToPage + "/" + turnToPage + "/?" + "servicer=" + clickData.personName + "&&" + "companyName=" + clickData.companyNameRepair + " &&" + "phoneNo=" + clickData.personMobile + "&&" + "faultId=" + clickData.faultId + "&&" + "faultIp=" + clickData.faultIp;
    wx.navigateTo({
      url: clickUrl,
    })
    // this.setData({
    //   navigateToUrl: clickUrl,
    // })
    // console.log(this.data.navigateToUrl);
  },

  keyWordsSearch: function () {
    wx.navigateTo({
      url: "../../keySearch/keySearch?path=myService&&param=faultInfo.sysuserid&&mUrl=ENGINEER_HISTORY_RECORD&&type=''&&role=2",
    })
  },

  bindPickerChange: function (e) {
    const eindex = e.detail.value;
    this.setData({
      urgencyLevelIndex: eindex,
    })
  },

  confirmChange: function () {
    this.setData({
      modalHidden: true,
    });
    this.conditionSearch();
  },

  cancleChange: function () {
    this.setData({
      modalHidden: true,
    })

  },

  getNowFormatDate: function (isNowDate) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (!isNowDate) {
      strDate = date.getDate() - 1;
    }
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  bindDateChange: function (e) {
    switch (e.currentTarget.dataset.current) {
      case 'start':
        this.setData({
          nowStartDate: e.detail.value,
        })
        break;
      case 'end':
        this.setData({
          nowEndDate: e.detail.value,
        })
        break;
    }
  },

  getYearFormatDate: function (isPastMonth) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = isPastMonth ? date.getFullYear() - 5 + seperator1 + month + seperator1 + strDate : date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  bindServiceContent: function (e) {
    console.log(e);
    this.setData({
      serviceContent: e.detail.value,
    })
  },

  applySubmit: function (e) {
    console.log(e);
    this.dealFormIds(e.detail.formId);
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