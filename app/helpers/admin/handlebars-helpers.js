var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

module.exports = {
  datetime: function(timestamp){
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: '2-digit', minute: '2-digit' };
    if (timestamp == null || timestamp == "" ){
    return timestamp
  }
  return new Date(timestamp).toLocaleTimeString('id',options)
  },
  date: function(timestamp){

    if (timestamp == null || timestamp == "" ){
    return timestamp
  }
  let date = new Date(timestamp);
  let year =  date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate()

  let myDate = year + "-" +(month > 9 ? month : `0${month}`) +"-"+ (day > 9 ? day : `0${day}`)

  return myDate;
  },

  dateFullTime: function(timestamp){

    if (timestamp == null || timestamp == "" ){
    return timestamp
  }
  let date = new Date(timestamp);
  let year =  date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate()
  let hour = date.getHours();
  let minute = date.getMinutes();

  let myDate = year + "-" +(month > 9 ? month : `0${month}`) +"-"+ (day > 9 ? day : `0${day}`)+"T"+ (hour > 9 ? hour : `0${hour}`)  + ":"+ (minute > 9 ? minute : `0${minute}`) 

  return myDate;
  },


  // date: function(timestamp){

  //   if (timestamp == null || timestamp == "" ){
  //   return timestamp
  // }
  // var date= new Date(timestamp);

  // return (date.getDate() + '/' + (date.getMonth() + 1)  + '/' + date.getFullYear());
  // },
 stringDateConverter:function (input) {
    let stringMonth;
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    //Day Month Year Setting Start
    let date = input.getDate();
    let month = input.getMonth();
    let year = input.getFullYear();

    for (let i = 0; i < monthList.length; i++) {
        if (i == month) {
            stringMonth = monthList[i]
        }
    }

    stringDate = `${date} ${stringMonth} ${year}`

    return stringDate;
  },

  hourMinute: function (date) {
    let hour = date.getHours();
    let minute = date.getMinutes();

    hour < 10 ? stringHour = `0${hour}` : stringHour = `${hour}`;
    minute < 10 ? stringMinute = `0${minute}` : stringMinute = `${minute}`;

    return `${stringHour}:${stringMinute}`;
  },

  ifeq: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  ifnoteq: function (a, b, options) {
    if (a != b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  select: function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value="' + value + '"]').attr({
      'selected': 'selected'
    });
    return $el.html();
  },
  multiselect: function (value, options) {
    var html = options.fn(this);

    if (value) {
      var values = value.split(',');
      var length = values.length;

      for (var i = 0; i < length; i++) {
        html = html.replace(new RegExp(' value=\"' + values[i] + '\"'), '$& selected="selected"');
      }
    }

    return html;
  },
  multiselectget: function (value, options) {
    var select = document.createElement('select');
    select.innerHTML = options.fn(this);

    if (value) {
      [].forEach.call(select.options, function (option) {
        if (value.indexOf(option.value) > -1) {
          option.setAttribute('selected', 'selected');
        }
      });
    }

    return select.innerHTML;
  },
  ifequals: function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },
  ifCond: function (arg1, operator, arg2, options) {
	switch (operator) {
        case '==':
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (arg1 < arg2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (arg1 <= arg2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (arg1 >= arg2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (arg1 && arg2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (arg1 || arg2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
  },
  checkpermissionlevel: function (user_permission_level, required_permission_level, options) {
    if (user_permission_level >= required_permission_level) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  checkSuperAdminOrAdmin(permissionLevel,required_level, options) {
    if (permissionLevel === 1) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
  },

  checkSuperAdminAndAdminManagemenKompor(permissionLevel,manajemenLevel,required_level, options) {
    if (permissionLevel === 1) {
      if(manajemenLevel === 1){
        return options.fn(this)
      }else if(manajemenLevel === 2){

      }
    } 
    else {
        return options.inverse(this)
    }
  },

  checkpermissionMultilevelOrAdminCanDoThisAction: function (user_permission_level, user_required_permission_level, management_permission_level,user_required_management_permission_level, options) {
    var ADMIN_PERMISSION = 1;
    var MANAGEMENT_ADMIN_PERMISSION = 4;

    var values_user = user_required_permission_level.split(',');
    var values_user_management = user_required_management_permission_level.split(',');
    var length_management = values_user_management.length;
    var length_user = values_user.length;
    var check_user = false;
    var check_management = false;

    for (var i = 0; i < length_user; i++) {
      if (user_permission_level == values_user[i]) {
        check_user = true;
      }
    }

    for (var i = 0; i < length_management; i++) {
      if (management_permission_level == values_user_management[i]) {
        check_management = true;
      }
    }
    if (check_user == true ) {
      if(check_management == true){
      return options.fn(this);
    }
    } else {
      if (user_permission_level == ADMIN_PERMISSION ) {
        if(MANAGEMENT_ADMIN_PERMISSION == MANAGEMENT_ADMIN_PERMISSION){
          return options.fn(this);
        }
      } else {
        return options.inverse(this);
      }
      
    }
  },
  formatCurrency: function (value, options) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  formatCurrencyIDR: function (value, options) {
    if (value == null || value == "" ){
      return value
    }
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  },
  paginateHelper: function (pagination, options) {
    if (!pagination) {
      return '';
    }

    var limit = 7
      , n;
    var queryParams = '';
    var page = pagination.page;
    var leftText = '<i class="fa fa-chevron-left"></i>';
    var rightText = '<i class="fa fa-chevron-right"></i>';
    var paginationClass = 'pagination pagination-sm';
    var liClass= 'page-item';
    var aClass = 'page-link';

    if (options.hash.limit) limit = +options.hash.limit;
    if (options.hash.leftText) leftText = options.hash.leftText;
    if (options.hash.rightText) rightText = options.hash.rightText;
    if (options.hash.paginationClass) paginationClass = options.hash.paginationClass;
    if (options.hash.liClass) liClass = options.hash.liClass;
    if (options.hash.aClass) aClass = options.hash.aClass;

    var pageCount = Math.ceil(pagination.totalRows / pagination.limit);

    //query params
    if (pagination.queryParams) {
      queryParams = '&';
      for (var key in pagination.queryParams) {
        if (pagination.queryParams.hasOwnProperty(key) && key !== 'page') {
          queryParams += key + "=" + pagination.queryParams[key] + "&";
        }
      }
      var lastCharacterOfQueryParams = queryParams.substring(queryParams.length, -1);

      if (lastCharacterOfQueryParams === "&") {
        //trim off last & character
        queryParams = queryParams.substring(0, queryParams.length - 1);
      }
    }


    var template = '<ul class="' + paginationClass + '">';

    // ========= Previous Button ===============
    if (page === 1) {
      n = 1;
      template = template + '<li class="disabled ' + liClass + '"><a class="' + aClass + '" href="?page=' + n + queryParams + '">' + leftText + '</a></li>';
    }
    else {
      n = page - 1;
      template = template + '<li class="' + liClass + '"><a class="' + aClass + '" href="?page=' + n + queryParams + '">' + leftText + '</a></li>';
    }

    // ========= Page Numbers Middle ======

    var i = 0;
    var leftCount = Math.ceil(limit / 2) - 1;
    var rightCount = limit - leftCount - 1;
    if (page + rightCount > pageCount) {
      leftCount = limit - (pageCount - page) - 1;
    }
    if (page - leftCount < 1) {
      leftCount = page - 1;
    }
    var start = page - leftCount;

    while (i < limit && i < pageCount) {
      n = start;
      if (start === page) {
        template = template + '<li class="active ' + liClass + '"><a class="' + aClass + '" href="?page=' + n + queryParams + '">' + n + '</a></li>';
      } else {
        template = template + '<li class="' + liClass + '"><a class="' + aClass + '" href="?page=' + n + queryParams + '">' + n + '</a></li>';
      }

      start++;
      i++;
    }

    // ========== Next Buton ===========
    if (page === pageCount) {
      n = pageCount;
      template = template + '<li class="disabled ' + liClass + '"><a class="' + aClass + '" href="?page=' + n + queryParams + '">' + rightText + '</i></a></li>';
    }
    else {
      n = page + 1;
      template = template + '<li class="' + liClass + '"><a class="' + aClass + '" href="?page=' + n + queryParams + '">' + rightText + '</a></li>';
    }
    template = template + '</ul>';
    return template;
  }
}