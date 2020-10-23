// pages/serviceCompany/serviceClose/serviceClose.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extraCosts:[0],
    costTypes:["请选择","差旅费","招待费","快递费","配件费","其它"],
    costNames:[],
    costTypeIndexs: [{mIndex:0}],
    weight:'',
    costData:"",
    serviceDescribe:"",
    faultId:"",
    projectIndex:0,
    listProject: ['请选择'],
    projectInfo:"",
    processId:'',
    processPerId:'',
    serviceCompanyId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      faultId: options.faultId,
      weight: options.weight,
      processId: options.processId,
      processPerId: options.processPerId,
      serviceCompanyId: options.serviceCompanyId
    }),
      this.requestFeeAndProject();
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
    var serviceDescribe = wx.getStorageSync('serviceDescribe');
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
    wx.setStorageSync('serviceDescribe', '')//清空输入内容
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

  insertCost:function(){
    var costs = this.data.extraCosts;
    var tempCostTypeIndexs = this.data.costTypeIndexs;
    tempCostTypeIndexs[this.data.extraCosts.length] = { mIndex: 0 };
    costs.push(this.data.extraCosts.length);
    this.setData({
      extraCosts: costs,
      costTypeIndexs: tempCostTypeIndexs,
    })
    console.log(this.data.costTypeIndexs);
  },

  deleteCost: function () {
    var costs = this.data.extraCosts;
    var tempCostTypeIndexs = this.data.costTypeIndexs;
    if (costs.length>1){
      tempCostTypeIndexs.pop(this.data.extraCosts.length);
      costs.pop(this.data.extraCosts.length);
      this.setData({
        extraCosts: costs,
        costTypeIndexs: tempCostTypeIndexs,
      })
      console.log(this.data.costTypeIndexs);
    }
  },

  bindPickerChange: function (e) {
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    var tempCostTypeIndexs = this.data.costTypeIndexs;
    console.log(e);
    for (var i = 0; i<tempCostTypeIndexs.length;i++){
      if (name == 'costType'+i){
       tempCostTypeIndexs[i].mIndex = eindex;
       this.setData({
         costTypeIndexs: tempCostTypeIndexs
       })
      }
    } 
  },

  bindPickerProject:function(e){
    const eindex = e.detail.value;
    this.setData({
      projectIndex: eindex,
    })
  },

  applySubmit:function(e){
    console.log(e);
    var that = this;
    this.dealFormIds(e.detail.formId);
    var weight = e.detail.value.weight; 
    var tempCostTypeIndexs = this.data.costTypeIndexs;
    var temCostData = [];
    for (var i = 0; i < tempCostTypeIndexs.length; i++) {
      var cost = "cost" + i;
      if (tempCostTypeIndexs.length > 1) {
        if (tempCostTypeIndexs[i].mIndex == 0) {
          this.setData({
            popErrorMsg: '请选择费用类型'
          })
          this.ohShitfadeOut();
          return;
        }
        if (e.detail.value[cost] == "") {
          this.setData({
            popErrorMsg: '请选输入费用数额'
          })
          this.ohShitfadeOut();
          return;
        }
      }
      
      temCostData[i] = { "name": tempCostTypeIndexs[i].mIndex, "cost": e.detail.value[cost]};
    }
    if (this.data.projectIndex==0){
      this.setData({
        popErrorMsg: '请选择项目所属'
      })
      this.ohShitfadeOut();
      return;
    }
    if (weight == '') {
      this.setData({
        popErrorMsg: '请输入权重'
      })
      this.ohShitfadeOut();
      return;
    }

    this.setData({
      weight: weight
    })

    var param = {
      'forwardRecord.faultId': this.data.faultId,
      'forwardRecord.userId': wx.getStorageSync('userInfo').id,
      "forwardRecord.time": this.getNowFormatDate(),
      'forwardRecord.context': '',
      'extraCostArray': JSON.stringify(temCostData),
      'explain': this.data.serviceDescribe = "请输入描述" ? "" : this.data.serviceDescribe,
      'weight': this.data.weight,
      'inProject': this.data.projectInfo[this.data.projectIndex - 1].projectInfoId,
      'processId': this.data.processId,
      'processPerId': this.data.processPerId,
    }
    app.webCall(app.serviceCode["CLOSE_SERVICE"], param,
      function onSuccess(res) {
        if (res.resultcode == "3") {
          that.setData({
            popErrorMsg: '子流程未结束，不能关闭工单'
          })
          that.ohShitfadeOut();
        } else if (res.resultcode == "2"){
          wx.navigateBack({
            
          })
        }
      },
      function onErrorBefore(res) {
          console.log(res)
      },

      "POST")
    
    
  },

  transferDescribe: function () {
    wx.navigateTo({
      url: '../../serviceDescribe/serviceDescribe',
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
    console.log(formIds);
  },

  requestFeeAndProject: function () {
    var that = this;
    var param = {
      'faultInfo.faultId': this.data.faultId,
      'faultInfo.companyid': this.data.serviceCompanyId
    }
    app.webCall(app.serviceCode["GET_PROJECT_AND_FEE_DETAIL"], param,
      function onSuccess(res) {
        console.log(res);
        var temListProject = ['请选择'];

        for (var i = 0; i < res.listProjectInfo.length; i++) {
          temListProject[i + 1] = res.listProjectInfo[i].name;

        }
        that.setData({
          projectInfo: res.listProjectInfo,
          listProject: temListProject,
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

})