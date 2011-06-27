(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jQuery(function() {
    $.miniCount = function(element, options) {
      var cMsg, count, setState, state;
      this.defaults = {
        maxWords: 30,
        msg: "words",
        erMsg: "words",
        erCl: "error",
        counter: "counter"
      };
      state = '';
      this.settings = {};
      this.$element = $(element);
      setState = function(_state) {
        return state = _state;
      };
      count = __bind(function() {
        if (this.$element.val() !== '') {
          return $.trim(this.$element.val()).split(/[\s\.\?]+/).length;
        } else {
          return 0;
        }
      }, this);
      cMsg = __bind(function() {
        var dif;
        dif = this.getSetting('maxWords') - count();
        if (dif >= 0) {
          if (this.$wordcount.hasClass(this.getSetting('erCl'))) {
            this.$wordcount.removeClass(this.getSetting('erCl'));
          }
        } else {
          if (!this.$wordcount.hasClass(this.getSetting('erCl'))) {
            $wordcount.addClass(this.getSetting('erCl'));
          }
        }
        return (this.getSetting('maxWords') - count()) + ' ' + this.getSetting('msg');
      }, this);
      this.getState = function() {
        return state;
      };
      this.getSetting = function(settingKey) {
        return this.settings[settingKey];
      };
      this.callSettingFunction = function(functionName) {
        return this.settings[functionName]();
      };
      this.init = function() {
        this.settings = $.extend({}, this.defaults, options);
        this.$wordcount = $('#' + this.getSetting('counter'));
        this.$wordcount.text(cMsg());
        return this.$element.bind('click focus keyup blur change paste', __bind(function() {
          return this.$wordcount.text(cMsg());
        }, this));
      };
      return this.init();
    };
    return $.fn.miniCount = function(options) {
      return this.each(function() {
        var miniCount;
        if (void 0 === ($(this)).data('miniCount')) {
          miniCount = new $.miniCount(this, options);
          return ($(this)).data('miniCount', miniCount);
        }
      });
    };
  });
}).call(this);
