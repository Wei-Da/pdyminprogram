// pages/serviceCompany/taskDealPage/taskDealPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activiInstanceId:'',
    assignee:'',
    createTime:'',
    name:'',
    status:'',
    taskId:'',
    companyName:'',
    projectName:'',
    userName:'',
    modalHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      activiInstanceId: options.activiInstanceId,
      assignee: options.assignee,
      createTime: options.createTime,
      name: options.name,
      status: options.status,
      taskId: options.taskId,
      companyName: options.companyName,
      projectName: options.projectName,
      userName: options.userName,
      
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

  dealTask:function(e){
      wx.redirectTo({
        url: '../../serviceCompany/patrolPage/patrolPage?activiInstanceId=' + this.data.activiInstanceId + "&&taskId=" + this.data.taskId,
      })
      
  },

  modalChange: function () {
    this.setData({
      modalHidden: true
    })
    this.completeTask();
    
  },

  modalCancel: function () {
    this.setData({
      modalHidden: true,
    })
  },

  submitTask:function(){
    this.setData({
      modalHidden:false
    })
  },

  completeTask: function () {
    var that = this;
    var param = { "taskId": that.data.taskId };
    app.webCall(app.serviceCode["COMPLETE_TASK"], param,
      function onSuccess(res) {
        console.log(res);
        if (res.resultcode==2){
          wx.navigateBack({
            
          })
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


})