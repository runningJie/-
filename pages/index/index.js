// pages/index/index.js
const amapFile = require("../../utils/amap-wx.js");
const config = require("../../utils/config.js");
const tools = require("../../utils/tools.js");
const globalData = getApp().globalData;
// 实例化高德地图api
var myAmapFun = new amapFile.AMapWX({ key: config.key.sdk });

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始数据；
    myLocation: "",
    //获取定位标志
    canGetLoctionFlag: true,
    //最近站点
    nearestStation: "",
    //其他站台
    otherStation: [],
    lineids: [],
    other_lineids: [],
    lineDetailArr: [],
    otherLineids: [],
    otherLineDetailArr: [],
    nearestLine_showOrhide: true,
    other_showOrhideFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation();


    //按钮
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    }); 
  },
  onShow:function() {
    // var n = 1;
    // var timer=  setInterval(function() {
    //     console.log();
    //     n = n + 1;
    //       if(n > 200){
    //         n=0;
    //       }
    //       this.animation = n ;
    //       this.setData({
    //         //输出动画
    //         animation: this.animation
    //      })
    //  }.bind(this),20);
    //  this.setData({
    //    timer
    //  })
  },
 
//搜索
  searchLineStation:function() {
   // console.log("触发搜索框");
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        var inputValue = res.name;
        var longitude = res.longitude;
        var latitude = res.latitude;
        //console.log(longitude,);
        that.setData({
          inputValue,
          longitude,
          latitude
        });
        //发送请求

        //获取周围站台列表
        tools.getAroundStation(longitude, latitude, function (nearestStation, otherStation) {
          //console.log(nearestStation, otherStation);
          //存储数据
          that.setData({
            nearestStation: nearestStation,
            otherStation: otherStation
          })
          // console.log(nearestStation,otherStation);
          tools.getLineLists(nearestStation.id, nearestStation.longitude, nearestStation.latitude, function (lineids) {
            that.setData({
              lineids: lineids
            })
            //获取最近站点的公交列表
            tools.getLineListsDetial(lineids, function (lineDetailArr) {
              //  console.log(lineDetailArr);
              if (lineDetailArr.length >= 6) {
                lineDetailArr = lineDetailArr.splice(0, 6);
              }
              that.setData({
                lineDetailArr: lineDetailArr
              })
            })
            wx.hideLoading();
          });

          //循环
          otherStation.forEach(function (value, index, arr) {
            var item_id = value.id;
            var item_longitude = value.longitude;
            var item_latitude = value.latitude;

            //console.log(item_id,item_longitude);

            tools.getLineLists(item_id, item_longitude, item_latitude, function (lineids) {
              that.setData({
                other_lineids: lineids
              })

              //获取最近站点的公交列表
              tools.getLineListsDetial(lineids, function (lineDetailArr) {

                //  console.log(lineDetailArr);
                if (lineDetailArr.length >= 6) {
                  lineDetailArr = lineDetailArr.splice(0, 6);
                }
                value.otherItems = lineDetailArr;
                // console.log(value);
                //////////存储信息
                var item = "otherStation[" + index + "]";

                that.setData({
                  [item]: value
                })
              })
              wx.hideLoading();
            });
            // console.log(value);

          })

        })
        that.onShow();
      }
    })
  },

  //获取用户定位方法
  getUserLocation: function () {
    //https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
    var that = this;
    this.setData({
      myLocation: "正在定位..."
    });
    //显示 loading 提示框
    wx.showLoading({
      title: '正在刷新',
    });
    //获取定位值
    wx.getLocation({
      //gcj02 返回可用于 wx.openLocation 的坐标
      type: 'gcj02',
      success(res) {
        //console.log(res);
        const latitude = res.latitude;
        const longitude = res.longitude;
        //添加全局
        globalData.Location = { longitude, latitude };

        //获取位置信息
        tools.getLocation_user(longitude, latitude, function (myCity, myLocation) {
          //添加全局
          globalData.myCity = myCity;
          //存储数据
          that.setData({
            myLocation: myLocation
          })
        });


        //获取周围站台列表
        tools.getAroundStation(longitude, latitude, function (nearestStation, otherStation) {
          //存储数据
          that.setData({
            nearestStation: nearestStation,
            otherStation: otherStation
          })
          //console.log(nearestStation, otherStation);
          tools.getLineLists(nearestStation.id, nearestStation.longitude, nearestStation.latitude, function (lineids) {
            that.setData({
              lineids: lineids
            })
            //获取最近站点的公交列表
            tools.getLineListsDetial(lineids, function (lineDetailArr) {
              //  console.log(lineDetailArr);
              if (lineDetailArr.length >= 6) {
                lineDetailArr = lineDetailArr.splice(0, 6);
              }
              that.setData({
                lineDetailArr: lineDetailArr
              })
            })
            wx.hideLoading();
          });

          //循环
          otherStation.forEach(function (value, index, arr) {
            var item_id = value.id;
            var item_longitude = value.longitude;
            var item_latitude = value.latitude;

            //console.log(item_id,item_longitude);

            tools.getLineLists(item_id, item_longitude, item_latitude, function (lineids) {
              that.setData({
                other_lineids: lineids
              })

              //获取最近站点的公交列表
              tools.getLineListsDetial(lineids, function (lineDetailArr) {

                //  console.log(lineDetailArr);
                if (lineDetailArr.length >= 6) {
                  lineDetailArr = lineDetailArr.splice(0, 6);
                }
                value.otherItems = lineDetailArr;
                // console.log(value);
                //////////存储信息
                var item = "otherStation[" + index + "]";

                that.setData({
                  [item]: value
                })
              })
              wx.hideLoading();
            });
            // console.log(value);

          })


        })

      }
    })

  },
  //最近公交的信息
  showLineDetail: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = this.data.lineDetailArr[index];
    // console.log(item);
    wx.navigateTo({
      url: '/pages/lineDetials/lineDetials?data=' + JSON.stringify(item)
    })
  },
  showOtherLineDetail: function (e) {
   // console.log("触发showOtherLineDetail");
    var father_index = e.currentTarget.dataset.fatherIndex;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var father_info = this.data.otherStation[father_index];
    var item = father_info.otherItems[index];
    wx.navigateTo({
      url: '/pages/lineDetials/lineDetials?data=' + JSON.stringify(item)
    })
  },

  showOrhide: function (e) {
   // console.log("触发showOrhide");
    var flag = this.data.nearestLine_showOrhide;
    var that = this;
    this.setData({
      nearestLine_showOrhide: !flag
    })
  }, 
  other_showOrhide: function (e) {
   // console.log("触发other_showOrhide");
   // console.log(e);
    var that = this;
    this.setData({
     _num: e.currentTarget.dataset.num

    })
  },
  reload:function() {
    this.onLoad();
    this.onShow();
  }
  
})