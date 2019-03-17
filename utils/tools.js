const amapFile = require('./amap-wx.js');
const config = require("./config.js");

// 实例化高德地图api
var myAmapFun = new amapFile.AMapWX({ key: config.key.sdk });


//获取位置信息
function getLocation_user(longitude, latitude,callback) {
  myAmapFun.getRegeo({
    // 坐标信息
    location: `${longitude},${latitude}`,
    success: function (data) {

      const myLocation = data[0].desc;
      const myCity = data[0].regeocodeData.addressComponent.province;
      //回调函数
      callback(myCity,myLocation);
      wx.hideLoading();
    },
    fail: function () {
      failcallback(getLocation_user(longitude, latitude, callback));
    }
  });
}


//获取周围站台
function getAroundStation(longitude, latitude, callback) {
  var that = this;
  myAmapFun.getPoiAround({
    //https://lbs.amap.com/api/wx/reference/core/#get-poiaround-callback
    // 限定查询结果只包含公交站台
    querykeywords: '公交站|地铁站',
    querytypes: '150700|150500',
    location: `${longitude},${latitude}`,
    success: function (data) {
      //console.log(data);
      //获取附近站台列表
      //过滤
      var nearlyStation = data.poisData.filter(function(item) {
          return item.name.match(/\(/g);
      })
     // console.log(nearlyStation_filter);
      if (nearlyStation.length >= 6) {
        nearlyStation = nearlyStation.slice(0, 6);
      }
      //获取最近站台信息
      var nearestStation;
      var otherStation = [];
      //遍历站台信息
      nearlyStation.forEach((item, index) => {
        //获取id，名称，距离
        var longitude = item.location.split(",")[0];
        var latitude = item.location.split(",")[1];
        var otherItems = [];
        const stationInfo = { 
          id:item.id,
          distance:item.distance,
          name:item.name,
          longitude: longitude,
          latitude: latitude,
          otherItems: otherItems
        };
        //获取数组中的第一项（距离最近，distance最小）
        if (index === 0) {
          nearestStation = stationInfo;
        } else {
          otherStation.push(stationInfo);
        };
        
      })
      callback(nearestStation, otherStation);
    },
    fail:function() {
      failcallback(getAroundStation(longitude, latitude, callback));

			}
 
    
  })
}


//根据站台id获取线路列表
function getLineLists(id, longitude, latitude,callback) {
  var that = this;

  //发请求
  wx.request({
    url: config.url.searchLineLists_near,
    data: {
      longitude: longitude,
      latitude: latitude,
      id: id

    },
    success(res) {
      //站台附近公交id列表
      var lineids = res.data.bus[0].businfo_lineids;
      callback(lineids);
    },
    fail() {
      failcallback(getLineLists(id, callback));
    }

  })
}

//根据线路id，获取线路详细信息
function getLineListsDetial(lineids,callback) {
  wx.request({
    url: config.url.searchLineListDetial,
    data: {
      lineids: lineids
    },
    success: function (res) {
      //获取线路信息数组
      var lineDetailArr = res.data.data.map(function (item) {        
        var info = item.item[0];
        //线路名称
        var lineName = info.key_name;
        //最低价格
        var price = info.basic_price || 1;
        //最高价格
        var max_price = info.total_price || 3;
        //早班车
        var startTime = info.displayStartTime === ":" ? "" : info.displayStartTime;
        //末班车
        var timeStr = "--" + info.displayEndTime;
        var endTime = timeStr === "--:" ? "" : timeStr;
        //方向
        var direction = info.displayDirection;
        //经过站点
        var stationArr = info.stations.map(function (item) {
          return item.name;
        })
        return {
          lineName: lineName,
          price: price,
          max_price: max_price,
          stationArr: stationArr,
          id: info.id,
          start: info.front_name,
          end: info.terminal_name,
          direction: direction,
          startTime: startTime,
          endTime: endTime

        } 
      })
      callback(lineDetailArr);
    },
    fail:function() {
      failcallback(getLineListsDetial(lineids, callback(lineDetailArr)));
    }
  })
}


// 根据输入的关键字获取搜索到的站台和线路
function getSearchResult(searchValue, myCity, callback) {
  //console.log(searchValue, myCity);
  wx.request({
    url: config.url.getSearchResult,
    data: {
      key: config.key.web,
      keywords: searchValue,
      // 优先搜索当前城市数据
      city: myCity,
      // 限定只搜索站台和线路
      datatype: 'bus|busline',
    },
    success(res) {
      //console.log(res);
      if (res.data.tips.length > 0) {
        const searchResult = res.data.tips.map(item => ({
          id: item.id,
          name: item.name,
          isStation: item.typecode === '150700',
        }));
        callback(searchResult);
      } else {
        // 未搜索到结果
        wx.showModal({
          title: '未搜索到结果',
          content: '请检查输入的是否为合法的线路、站台名，重新搜索',
          showCancel: false
        });
      }
    },
    fail() {
      failHandler(() => getSearchResult(searchValue, myCity, callback));
    },
  });
}

//失败回调函数
function failcallback(callback) { 
    // wx.showModal({
    //   title: '数据获取失败',
    //   content: '请检查设备网络状况，是否重新获取数据',
    //   confirmColor: "#90EE90", 
    //   cancelText:"暂不获取", 
    //   confirmText:"重新加载",
    //   success:function(res) {
    //       if(res.confirm){
    //         wx.navigateBack({
    //           　
    //         　})
    //       }
          
    //   },
    //   fail:function(res) {
    //    return '';
    //   }
    // })
  
  wx.hideLoading();

}

module.exports = {
  getLocation_user,
  getAroundStation,
  getLineLists,
  getLineListsDetial,
  getSearchResult

}


