// pages/canlendar/canlendar.js
const date = new Date();
const cur_year = date.getFullYear();
const cur_month = date.getMonth() + 1;
const todayIndex = date.getDate();

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    selectYear: {
      type: String,
      value: '',
    },
    selectMonth: {
      type: String,
      value: '',
    },
    selectDay: {
      type: String,
      value: '',
    },

    type:{//开始时间or结束时间
      type: String,
      value: '',
    }
    
  },

  /**
   * 组件的内部数据
   */
  data: {
    wrapperH:'',
    cur_year: '', 
    cur_month: '',
    showMonthNum:3,//显示的多少个月的日历视图
  },

  // 组件生命周期函数-在组件实例进入页面节点树时执行
  attached() {
    this.init(3);
  },

  /**
   * 组件的方法列表 
   */
  methods: {

    init: function (num) {
      var that = this

      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      this.setData({ weeks_ch, todayIndex, cur_year, cur_month })
      this.setNowDate(num)
    },

    dateSelectAction: function (e) { 
      var click_day = e.currentTarget.dataset.day; 
      var click_month = e.currentTarget.dataset.month; 
      var click_year = e.currentTarget.dataset.year; 
  
      console.log(`点击的日期:${click_year}年${click_month}月${click_day}日`); 
    },
    
    
    setNowDate: function (num) { 
      var monthData = []
      for(var i = -1; i < num-1; ++i){
        let newMonth = cur_month + i;
        let newYear = cur_year;
        if (newMonth > 12) {
          newYear = cur_year + 1;
          newMonth = 1;
        } 

        monthData.push({
          cur_year: newYear,
          cur_month: newMonth,
          empytGrids: this.calculateEmptyGrids(newYear, newMonth),
          days: this.calculateDays(newYear, newMonth)
        })
      }
      this.setData({
        monthData
      })
    },
    getThisMonthDays(year, month) { 
      return new Date(year, month, 0).getDate(); 
    }, 
    getFirstDayOfWeek(year, month) { 
      return new Date(Date.UTC(year, month - 1, 1)).getDay(); 
    }, 
    calculateEmptyGrids(year, month) { 
      const firstDayOfWeek = this.getFirstDayOfWeek(year, month); 
      let empytGrids = []; 
      if (firstDayOfWeek > 0) { 
        for (let i = 0; i < firstDayOfWeek; i++) { 
          empytGrids.push(i); 
        }
      }

      return empytGrids;
    },
    calculateDays(year, month) { 
      let days = []; 
      const thisMonthDays = this.getThisMonthDays(year, month); 
      for (let i = 1; i <= thisMonthDays; i++) { 
        days.push(i); 
      } 

      return days;
    },
    handleCalendar(e) { 
      const handle = e.currentTarget.dataset.handle; 
      const cur_year = this.data.cur_year; 
      const cur_month = this.data.cur_month; 
      if (handle === 'prev') { 
        let newMonth = cur_month - 1; 
        let newYear = cur_year; 
        if (newMonth < 1) { 
          newYear = cur_year - 1; 
          newMonth = 12; 
        } 
        this.calculateDays(newYear, newMonth); 
        this.calculateEmptyGrids(newYear, newMonth); 
        this.setData({ 
          cur_year: newYear, 
          cur_month: newMonth 
        }) 
      } else { 
        let newMonth = cur_month + 1; 
        let newYear = cur_year; 
        if (newMonth > 12) { 
          newYear = cur_year + 1; 
          newMonth = 1; 
        } 
        this.calculateDays(newYear, newMonth); 
        this.calculateEmptyGrids(newYear, newMonth); 
        this.setData({ 
          cur_year: newYear, 
          cur_month: newMonth 
        }) 
      } 
    },
    // 关闭时间页面
    canlendar_cancal_but() {
      //触发选择日期方法回调
      this.triggerEvent("canlendar_cancal_but")
    },
    _selectDayEvent(e){
      //触发选择日期方法回调
      this.triggerEvent("selectDayEvent",e)
    }
  }
})