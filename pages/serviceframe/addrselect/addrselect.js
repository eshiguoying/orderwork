// 全局配置
const config = require('../../config');
// 高德地图引用
const amapFile = require('../../../thirdparty/js/amap-wx.js');

var selectaddrpag= false;// 地址选择页面是否开启 true 开启 false不开启，默认不开启
var suggestion= [{}];// 地址列表
var isselect_addr= false;// 地址搜索是否不可用 false 是可用



//触发关键词输入提示事件
function getsuggest(keywords, cityid, _this) {
  // 通过高德地图api获取搜索列表
  const myAmapFun = new amapFile.AMapWX({ key: config.map.key });
  myAmapFun.getInputtips({
    keywords: keywords,
    citylimit: true,
    city: cityid,
    success: data => {
      if (data && data.tips) {
        // 处理高亮字符
        let datas = data.tips
        var sug = [];
        for (var i = 0; i < datas.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中、
            landmark: datas[i].name,// 地标性建筑
            address: datas[i].district + datas[i].address,// 详细地址
            location: datas[i].location,
          });
        }

        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      }
    }
  })
}