// pages/search/search.js
// 引入全局信息
var app = getApp();
// 引入 amap-wx.js文件
var amapFile = require("../../utils/amap-wx.js");
const config = require("../../utils/config.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    val1: "我的位置",
    val2: "",
    lock1: false,
    lock2: false,
    focus: true,
    tips: [],
    height: 0,
    width: 0,
    location1: "",
    location: "",
    city: ''
  },

  // searchRound事件
  searchRound: function(){
    wx.switchTab({
      url: ''
    })
  }, 
  
  focus1: function(){
    this.setData({
      focus: true
    })
  },

  focus2: function() {
    this.setData({
      focus: false
    })
  },

  inputInfo: function(e) {
    // console.log(e);
    var city = this.data.city;
    // 获取关键字
    var keywords = e.detail.value;
    // 备份 this
    var that = this;
    // 获取实例对象
    var myAmapFun = new amapFile.AMapWX({ key: config.key.sdk });
    myAmapFun.getInputtips({
      keywords: keywords,
      // location：不书写则获取返回信息所在位置；
      location: '',
      offset: 20,
      page: 10,
      // 设置城市后，优先显示当前城市信息
      city: city,
      // 仅返回当前设置城市信息
      citylimit: true,
      success: function(data) {
        // console.log(data);
        // 成功时回调函数
        if(data && data.tips){
          // 
          that.setData({
            tips: data.tips
          })
        }
      },
      fail: function(res) {
      }
    })
  },

  endName: function(e){
    // console.log(e);
    // 获取当前元素子元素某个值
    var val = e._relatedInfo.anchorRelatedText.split("·").shift();
    // 获取location
    var location = e.currentTarget.dataset.location;

    // 判断是哪个输入框需要的值
    if(this.data.focus){
      this.setData({
        val1: val,
        location1: location,
        lock1: true
      })
    }else {
      this.setData({
        val2: val,
        location2: location,
        lock2: true
      })
    }
  },

  // 文本交换
  exchange: function(){
    // 获取这两个输入框的值
    var val1 = this.data.val1;
    var val2 = this.data.val2;
    // 定义一个变量由于存储交换值
    var val = "";

    if(val1 === "我的位置"|| val1 === "" || val2 === ""){
      // 什么都不干
      wx.showModal({
        title: '选择地址',
        content: '请先选择地址'
      })
    }else {
      val = val1;
      val1 = val2;
      val2 = val;
      
      this.setData({
        val1: val1,
        val2: val2
      })
    }
  },

  // 开始规划
  planning:function(){
    // 获取锁
    var lock1 = this.data.lock1;
    var lock2 = this.data.lock2;

    // 获取查询信息
    var val1 = this.data.val1;
    var val2 = this.data.val2;

    var location1 = this.data.location1;
    var location2 = this.data.location2;
    // console.log(val1, val2, location1, location2)

    if (val1 === "我的位置" || val1 === "" || val2 === "" || lock1 === false || lock2 === false){
      // 什么都不干
      // 请选择显示出的地址
      wx.showModal({
        title: '选择地址',
        content: '请先选择地址'
      })
    }else {
      wx.navigateTo({
        url: `/navigation/navigation_bus/navigation?val1=${val1}&val2=${val2}&location1=${location1}&location2=${location2}`
      })
    }
    
  },

  inputInfoMap:function() {
    wx.navigateTo({
      url: '/pages/search/search_one'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var city = app.globalData.myCity;
   // console.log(city);
    // 获取设备高
    var obj = wx.getSystemInfoSync();
    // console.log(obj);
    // 获取可用高度
    var height = obj.windowHeight - 146;
    var width = obj.windowWidth - 30;
    this.setData({
      height: height,
      width: width,
      city: city
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

  }
})