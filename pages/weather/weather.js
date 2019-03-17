

// 引入amapFile
var amapFile = require("../../utils/amap-wx.js");

Page({

  data: {
    info: '',
    city: "",
    humidity: "",
    temperature: "",
    weather: "",
    winddirection: "",
    windpower: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		
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
		//更改key值
			 var that = this;
			    var myAmap = new amapFile.AMapWX({ key: 'f45af372e799ebdb89183b2a85672775' });
			   // console.log(myAmap);
			    // var data = myAmap.getWeather();
			    myAmap.getWeather({
			  
			      success: function (data) {
			        // 成功回调
			      //  console.log(data)
			        that.setData({
			          info: data,
			          city: data.city.data,
			          weather: data.weather.data,
			          temperature: data.temperature.data,
			          humidity: data.humidity.data,
			          winddirection: data.winddirection.data,
			          windpower: data.windpower.data
			        })
			
			      },
			      fail: function (info) {
			        console.log(info)
			      }
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