/** 时间选择范围 */
module.exports={

//  TIME_SCOPE = {
// 	// 上海市寄送时间配置
// 	310000 : {
// 		// 寄送时间范围 
// 		dayscope : 14,// 寄送时间不会超过当天14天后
// 	    sT_differ_tT : 4, // 寄件时间和收件时间差值不能小于4个小时	zzz
			
// 		SENDTIME : {
// 			HOTEL : {
// 				startlimit : 7,// 早上下单最早时间
// 				endlimit : 18,  // 晚上下单最迟时间
// 				lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
// 				lastminlimit : 0// 寄件允许范围最迟时间分钟最大值
// 			},
// 			RESIDENCE : {
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 18,  // 晚上下单最迟时间
// 				lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
// 				lastminlimit : 0// 寄件允许范围最迟时间分钟最大值
// 			},
// 			// 机场特殊处理_下面两个机场枚举实际在数据库里配置:counter_service_center
// 			PUDONG_AIRPORT : {// 浦东_机场
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 18,  // 晚上下单最迟时间
// 				lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
// 				lastminlimit : 0// 寄件允许范围最迟时间分钟最大值
// 			},
// 			HONGQIAO_AIRPORT : {// 虹桥出发层_机场
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 18,  // 晚上下单最迟时间
// 				lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
// 				lastminlimit : 0// 寄件允许范围最迟时间分钟最大值
// 			},
// 			HONGQIAO_AIRPORT_ARRIVED : {// 虹桥到达层_机场
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 24,  // 晚上下单最迟时间
// 				lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
// 				lastminlimit : 0,// 寄件允许范围最迟时间分钟最大值
// 				specialtimenode : 20// 用于时间校验
// 			}
// 		},
// 		TASKTIME : {
// 			// 寄件时间和收件时间是同一天,则最早下单时间
// 			THESAMEDAYTIME : {
// 				value : 14
// 			},
// 			HOTEL : {
// 				startlimit : 7,// 早上下单最早时间
// 				endlimit : 24  // 晚上下单最迟时间
// 			},
// 			RESIDENCE : {
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 22,  // 晚上下单最迟时间
				
// 				specialkey : 'HONGQIAO_AIRPORT_ARRIVED',// 特殊处理
// 				specialendlimit : 24,
// 			},
// 			// 机场特殊处理_下面两个机场枚举实际在数据库里配置:counter_service_center
// 			PUDONG_AIRPORT : {// 浦东_机场
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 22,  // 晚上下单最迟时间
// 			},
// 			// 机场特殊处理_下面两个机场枚举实际在数据库里配置:counter_service_center
// 			PUDONG_AIRPORT_DEPARTINGFLOOR : {// 浦东_机场
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 22,  // 晚上下单最迟时间
// 			},
// 			HONGQIAO_AIRPORT : {// 虹桥_机场
// 				startlimit : 9,// 早上下单最早时间
// 				endlimit : 22,  // 晚上下单最迟时间
// 			}
// 		}
// 	},
//     // 上海市寄送时间配置
//     330100 : {
//         // 寄送时间范围
//         dayscope : 14,// 寄送时间不会超过当天14天后
//         sT_differ_tT : 4, // 寄件时间和收件时间差值不能小于4个小时	zzz

//         SENDTIME : {
//             HOTEL : {
//                 startlimit : 7,// 早上下单最早时间
//                 endlimit : 18,  // 晚上下单最迟时间
//                 lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
//                 lastminlimit : 0// 寄件允许范围最迟时间分钟最大值
//             },
//             RESIDENCE : {
//                 startlimit : 9,// 早上下单最早时间
//                 endlimit : 18,  // 晚上下单最迟时间
//                 lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
//                 lastminlimit : 0// 寄件允许范围最迟时间分钟最大值
//             },
//             XIAOSHAN_AIRPORT : {// 萧山机场
//                 startlimit : 9,// 早上下单最早时间
//                 endlimit : 24,  // 晚上下单最迟时间
//                 lasthourslimit : 18,// 寄件允许范围最迟时间小时最大值
//                 lastminlimit : 0,// 寄件允许范围最迟时间分钟最大值
//             }
//         },
//         TASKTIME : {
//             // 寄件时间和收件时间是同一天,则最早下单时间
//             THESAMEDAYTIME : {
//                 value : 14
//             },
//             HOTEL : {
//                 startlimit : 7,// 早上下单最早时间
//                 endlimit : 24  // 晚上下单最迟时间
//             },
//             RESIDENCE : {
//                 startlimit : 9,// 早上下单最早时间
//                 endlimit : 22,  // 晚上下单最迟时间
//             },
//             XIAOSHAN_AIRPORT : {// 虹桥_机场
//                 startlimit : 9,// 早上下单最早时间
//                 endlimit : 22,  // 晚上下单最迟时间
//             }
//         }
//     }
// }



}