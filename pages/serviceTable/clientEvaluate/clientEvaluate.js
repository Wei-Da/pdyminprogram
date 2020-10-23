// pages/clientEvaluate/clientEvaluate.js
var app = getApp();
var map = { '有待提高': "1", '一般': "2",'较满意': "4", '非常好': "5" }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceNames:[],
    serviceNameIndex:0,
    serviceNameInfo:[],
    serviceAttitudes:[
      { name:"非常好",value:"5",checked:true},
      { name:"较满意", value: "4" },
      { name:"一般", value: "2" },
      { name:"有待提高", value: "1" },
    ],
    jobQualitys:[
      { name: "非常好", value: "5", checked: true },
      { name: "较满意", value: "4" },
      { name: "一般", value: "2" },
      { name: "有待提高", value: "1" },
    ],
    repairMan:'',
    repairPhone:'',
    companyId:'',
    faultId:'',
    servicePhone:'',
    serviceAttitude: '5',
    jobQuality: '5',
    projectInfo:"",
    listProject:['请选择'],
    projectIndex:0,
    extraCostInfo:"",
    costTypes: { "0":'',"1": "差旅费", "2": "招待费", "3": "快递费", "4": "配件费", "5": "其它"},
    serviceInfos:"",
    evaluateContent:"",
    weight:"",
    projectId:"",
    personId:"",
    serviceCompanyId:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      repairMan: options.repairmanName,
      repairPhone: options.repairmanPhone,
      companyId: options.companyId,
      faultId: options.faultId,
      weight: options.weight,
      projectId: options.projectId,
      personId: options.personId,
      serviceCompanyId: options.serviceCompanyId
    });
    this.getServiceName();
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
      evaluateContent: serviceDescribe == '' ? '请输入描述' : serviceDescribe.length < 10 ? serviceDescribe : serviceDescribe.substring(0, 10) + '...',
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

  bindPickerChange:function(e){
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch(name){
      case "serviceName":
        this.setData({
          serviceNameIndex:eindex,
          servicePhone: eindex == 0 ? '' : this.data.serviceNameInfo[eindex - 1].mobile,
        })
        break;
      case "projectName":
        this.setData({
          projectIndex: eindex,
        })
      break;
    }
  },

  checkboxChange:function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    
  },

  getServiceName:function(){
    var that = this;
    var param = {
      'companyId': this.data.companyId,
    }
    app.webCall(app.serviceCode["GET_SERVICE_NAME"], param,
      function onSuccess(res) {
        console.log(res);
        var tempUserName=['请选择'];
        for(var i=0;i<res.detail.length;i++){
          if (res.detail[i].id == that.data.personId){
            that.setData({
              serviceNameIndex: i+1,
              servicePhone: res.detail[i].mobile
            })
          }
          tempUserName[i+1] = res.detail[i].userName;
        };
        that.setData({
          serviceNames: tempUserName,
          serviceNameInfo: res.detail,
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

  requestFeeAndProject: function () {
    var that = this;
    var param = {
      'faultInfo.faultId': this.data.faultId,
      'faultInfo.companyid': this.data.serviceCompanyId,
    }
    app.webCall(app.serviceCode["GET_PROJECT_AND_FEE_DETAIL"], param,
      function onSuccess(res) {
        console.log(res);
        var temListProject = ['请选择'];
        
        for (var i = 0; i < res.listProjectInfo.length;i++){
          if (res.listProjectInfo[i].projectInfoId == that.data.projectId){
              that.setData({
                projectIndex:i+1,
                
              })
          }
          temListProject[i+1] = res.listProjectInfo[i].name;
          
        }
        that.setData({
          projectInfo: res.listProjectInfo,
          listProject: temListProject,
          extraCostInfo: res.listExtraCost,
          
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

  attitudeChange: function (e) {
    console.log('态度：')
    console.log(map[e.detail.value])
    this.setData({
      serviceAttitude: map[e.detail.value]
    })
  },

  qualityChange: function (e) {
    console.log('质量：' + e.detail.value)
    this.setData({
      jobQuality: map[e.detail.value]
    })
  },

  doEvaluate: function (e) {
    this.dealFormIds(e.detail.formId);
    var weight = e.detail.value.weight;
    var extraCostTemp = [];
    if (this.data.serviceNameIndex==0){
      this.setData({
        popErrorMsg: '请选择服务人',
      })
      this.ohShitfadeOut();
      return;
    }
    if (weight == '') {
      this.setData({
        popErrorMsg: '请输入权重',
      })
      this.ohShitfadeOut();
      return;
    }
    if (this.data.projectIndex==0){
      this.setData({
        popErrorMsg: '请选择项目所属',
      })
      this.ohShitfadeOut();
      return;
    }
    if (this.data.extraCostInfo.length == 1 && this.data.extraCostInfo[0].name=='0'){//没有花费的状况
      extraCostTemp=[];
    }else{
      for (var i = 0; i < this.data.extraCostInfo.length; i++) {
        var mCost = e.detail.value["cost" + i];
        console.log(mCost)
        if (mCost == '') {
          this.setData({
            popErrorMsg: '请输入费用额度',
          })
          this.ohShitfadeOut();
          return;
        }
        extraCostTemp[i] = { 'id': this.data.extraCostInfo[i].id, 'cost': mCost, 'name': this.data.extraCostInfo[i].name }
    }
    
    }

    // if (this.data.evaluateContent =='请输入描述'){
    //   this.setData({
    //     popErrorMsg: '请输入评价内容',
    //   })
    //   this.ohShitfadeOut();
    //   return;
    // }
    
    var param = {
      'userId':wx.getStorageSync('userInfo').id,
      'checkInfo.servicerId': this.data.serviceNameInfo[this.data.serviceNameIndex-1].id,
      'checkInfo.serviceAttitude': this.data.serviceAttitude,
      'checkInfo.serviceQuality': this.data.jobQuality,
      'checkInfo.serviceContent': this.data.evaluateContent == '请输入描述' ? '' : this.data.evaluateContent,
      'checkInfo.faultId': this.data.faultId,
      'weight': weight,
      'projectInfoId': this.data.projectInfo[this.data.projectIndex - 1].projectInfoId,
      'extraCostArray': JSON.stringify(extraCostTemp),
    }
    app.webCall(app.serviceCode["SERVICE_EVALUATE"], param,
      function onSuccess(res) {
        console.log(res)
        wx.navigateBack({
          url: '../serviceTableClose/serviceTableClose',
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

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  }, 

  transferDescribe: function () {
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
  }

})