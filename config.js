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
  },
  ABNL: {
    value: 'ABNORMAL_LUG',
    name: '不正常行李'
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
    name: '高级'
  },
  MIDDLE : {
    value: '2',
    name: '中级'
  },
  LOW: {
    value: '3',
    name: '初级'
  },
  1: {
    value: '1',
    name: '高级'
  },
  2: {
    value: '2',
    name: '中级'
  },
  3: {
    value: '3',
    name: '初级'
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

var ISVALID_TYPE = {
  Y: {
    value: 'Y',
    name: '启动'
  },
  N: {
    value: 'N',
    name: '禁止'
  }
};

var WORKTYPE = {
  0: {
    value: '0',
    name: '固定柜台'
  },
  1: {
    value: '1',
    name: '外勤'
  }
};

var RESCODE = {
  success: {
    value: 0,
    name: '成功'
  }
};

var ORDEROPERATETYPE = {
  ALLOT: {
    value: 'ALLOT',
    name: '指派'
  },
  ANEWALLOT: {
    value: 'ANEWALLOT',
    name: '改派'
  },
  RECEIVE: {
    value: 'RECEIVE',
    name: '接收'
  },
  DELIVERY: {
    value: 'DELIVERY',
    name: '送达'
  },
  FINISH: {
    value: 'FINISH',
    name: '完成'
  }
};

var ACTION_TYPE = {
  SEND: {
    value: 'send',
    name: '寄'
  },
  TAKE: {
    value: 'take',
    name: '取'
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
  userEditType: USEREDIT_TYPE,
  // 工作方式
  workType: WORKTYPE,
  // 是否启动
  isvalidType: ISVALID_TYPE,
  // 返回的编码
  resCode: RESCODE,
  // 订单操作类型
  orderOperateType: ORDEROPERATETYPE,
  // 动作类型
  actionType: ACTION_TYPE,
};


