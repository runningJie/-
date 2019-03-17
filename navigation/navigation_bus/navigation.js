var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: '',
    end: '',
    // 起始经纬度
    origin: '',
    // 终止经纬度
    destination: '',
    markers: [],
    route: '',
    transits: [],
    city: '',
    buffer: false
  },
  show: function () {
    var buffer = this.data.buffer;
    this.setData({
      buffer: !buffer
    })
  },
  details_xq: function (e) {
    var num = e.currentTarget.dataset.num;
    var buslinelength = e.currentTarget.dataset.busline.length;
    var id = e.currentTarget.dataset.id;
    console.log(num, id);
    this.setData({
      _num: num,
      buslinelength: !!buslinelength,
      _id: id
    });
  },
  backIndex: function () {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = wx.getSystemInfoSync();
    var width = obj.windowWidth - 100;
    // console.log(options);
    var city = app.globalData.myCity;
    // console.log(city);
    // 起始
    var origin = options.location1;
    var obj1 = {
      iconPath: "",
      id: 0,
      latitude: options.location1.split(",").pop(),
      longtitude: options.location1.split(",").shift(),
      width: 23,
      height: 24
    }
    // 终止
    var destination = options.location2;
    var obj2 = {
      iconPath: "",
      id: 0,
      latitude: options.location2.split(",").pop(),
      longtitude: options.location1.split(",").shift(),
      width: 23,
      height: 24
    }
    let markers = this.data.markers;
    markers.unshift(obj2, obj1)

    this.setData({
      start: options.val1,
      end: options.val2,
      markers: markers,
      origin: origin,
      destination: destination,
      city: city,
      width: width
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
    var city = this.data.city;
    // console.log(city);
    // console.log(this.data)
    var keywords = '73bbc16c064e3c990d968227fff319f0';
    // 备份this
    var that = this;
    var origin = this.data.origin;
    var destination = this.data.destination;
    wx.request({
      url: `https://restapi.amap.com/v3/direction/transit/integrated?origin=${origin}&destination=${destination}&city=${city}&output=json&key=${keywords}`,
      success: function (data) {
        console.log(data);
        var route = data.data.route;
        var distance = route.distance;//起点到终点的步行距离 m
        var taxi_cost = Math.ceil(route.taxi_cost);//打车预计费用 ￥
        var transits = route.transits;//这里是所有主要信息

        that.setData({
          route: route,
          transits: transits,
          taxi_cost: taxi_cost,
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '请求错误',
          content: '网可能不太好'
        })
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