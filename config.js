// 订单状态
var ORDERSTATUS = {
  PREPAID: {
    value: 'PREPAID',
    name: '待分配'
  },
  WAITPICK: {
    value: 'WAITPICK',
    name: '待提取'
  },
  DELIVERYING: {
    value: 'DELIVERYING',
    name: '配送中'
  },
  DELIVERYOVER: {
    value: 'DELIVERYOVER',
    name: '已送达'
  },
  COMPLETED: {
    value: 'COMPLETED',
    name: '已完成'
  },
  REFUNDING: {
    value: 'REFUNDING',
    name: '退单中'
  },
};


var ADDRTYPE = {
  AIRPORTCOUNTER: {
    value: 'AIRPORTCOUNTER',
    name: '机场'
  },
  HOTEL: {
    value: 'HOTEL',
    name: '酒店'
  },
  RESIDENCE: {
    value: 'RESIDENCE',
    name: '住宅'
  }
};

var SREVICETYPE = {
  GOLD: {
    value: 'GOLD',
    name: '金'
  },
  SPECIAL: {
    value: 'SPECIAL',
    name: '专'
  }
};

// 全局配置
module.exports = {
  // TODO 高德地图
  map: {
    key: 'e8d3f97a6e4f57ad42149f3974dd2bd5',
  },

  // 测试
  ipconfig: 'https://uat2.porterme.cn',
  // 生产
  // ipconfig: 'https://delivery.porterme.cn',
  
  //渠道：微信小程序
  channel:1,

  // 订单状态
  orderStatus: ORDERSTATUS,
  // 地址类型
  addrType: ADDRTYPE,
  // 服务类型
  serviceType: SREVICETYPE
};


