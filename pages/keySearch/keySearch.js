// pages/keySearch/keySearch.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteHidden:true,
    searchTitleHidden:false,
    keyWords:'',
    keyWordList: '',
    path:'',
    param:'',
    serviceList:null,
    mUrl:'',
    mType:'',
    mRole:'',//1:甲方角色；2：乙方角色；3：服务台角色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      path: options.path,
      param: options.param,
      mUrl: options.mUrl,
      mType: options.type,
      mRole: options.role,
      keyWordList: wx.getStorageSync(options.path),
    });
    console.log(this.data.mRole);
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

  onInputListener:function(e){
    console.log(e);
    if(e.detail.value!=''){
        this.setData({
          deleteHidden:false,
          keyWords: e.detail.value,
        })
    }
  },

  clearInputData:function(){
    this.setData({
      deleteHidden: true,
      keyWords: '',
    })
  },

  cancelBack:function(){
    var mUrl = "../serviceCompany/" + this.data.path + "/" + this.data.path;
    console.log(mUrl);
    wx.navigateBack({
      // url: mUrl,
    })
  },

  searchResult:function(){
    if (this.data.keyWords==''){
      return;
    }
    var temp = wx.getStorageSync(this.data.path);
    var isAdd = true;
    if (temp ==''){
      wx.setStorageSync(this.data.path, [{ 'keyWord': this.data.keyWords,'account':1}]);
    }else{
      for(var i=0;i<temp.length;i++){
        if (temp[i].keyWord == this.data.keyWords){
          temp[i].account++;
          isAdd = false;
        }  
      }
      if(isAdd){
        temp.push({ 'keyWord': this.data.keyWords, 'account': 1 });
      }
      if(!isAdd){
        this.sortData(temp);
      }else{
        wx.setStorageSync(this.data.path, temp)
      }
      
    }
    
    var that = this;
    var param = { 
    "page": 1, 
    "rows": 10000, 
    "faultInfo.faultContent": this.data.keyWords,
    "type": this.data.mType,
    };
    if (this.data.param!=''){
      param[this.data.param] = wx.getStorageSync('userInfo').id;
    }
    app.webCall(app.serviceCode[that.data.mUrl], param,
      function onSuccess(res) {
        console.log(res.info);
        console.log(res);
        if (res.info!=''){
            that.setData({
              serviceList: res.info,
              searchTitleHidden: true,
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

  sortData:function(data){
    var temp;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data.length-i-1;j++){
        if (data[j].account < data[j + 1].account){
          temp = data[j + 1];
          data[j + 1] = data[j];
          data[j] = temp;
        }
      }
    }
    wx.setStorageSync(this.data.path, data);  
    console.log(data);
  },

  clearRecord:function(){
    wx.removeStorageSync(this.data.path);
    this.setData({
      keyWordList:'',
    })
  },

  keywordSearch:function(e){
    var that = this;
    var param = {
      "page": 1,
      "rows": 10000,
      "faultInfo.faultContent": this.data.keyWordList[e.target.dataset.current].keyWord,
      "type": this.data.mType,
    };
    param[this.data.param] = wx.getStorageSync('userInfo').id;
    app.webCall(app.serviceCode[this.data.mUrl], param,
      function onSuccess(res) {
        console.log(res.info);
        console.log(res);
        if (res.info != '') {
          that.setData({
            serviceList: res.info,
            searchTitleHidden: true,
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
  }




})