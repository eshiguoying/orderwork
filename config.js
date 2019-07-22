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
  HOUSE: {
    value: 'HOUSE',
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

// 派送方式
var APPOINT_TYPE = {
  APPOINT: {
    value: 'APPOINT',
    name: '指派'
  },
  ANEWAPPOINT: {
    value: 'ANEWAPPOINT',
    name: '改派'
  }
};

var LEVEL_TYPE = {
  HIGH: {
    value: '1',
    name: '高级权限'
  },
  MIDDLE : {
    value: '2',
    name: '中级权限'
  },
  LOW: {
    value: '3',
    name: '低级权限'
  }
};

var USEREDIT_TYPE = {
  MYSELF: {
    value: 'MYSELF',
    name: '我自己'
  },
  OTHERS: {
    value: 'OTHERS',
    name: '其他人'
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
  serviceType: SREVICETYPE,
  // 派送方式
  appointType: APPOINT_TYPE,
  // 级别等级
  levelType: LEVEL_TYPE,
  // 人员编辑类型
  userEditType: USEREDIT_TYPE
};


