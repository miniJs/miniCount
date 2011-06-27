(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jQuery(function() {
    $.miniCount = function(element, options) {
      var count, formatText, patterns, setState, state;
      this.defaults = {
        unit: 'letter',
        min: null,
        max: null,
        className: 'counter',
        validClassName: '',
        invalidClass: 'error',
        text: '',
        textPosition: 'after',
        invalidText: '',
        onValid: function() {},
        onInvalid: function() {}
      };
      state = '';
      patterns = {
        letter: /./,
        word: /.\s/,
        sentence: /[\.\?\!]\s/
      };
      this.settings = {};
      this.$element = $(element);
      setState = __bind(function(_state) {
        if (_state === 'valid') {
          this.callSettingFunction('onValid');
        } else if (_state === 'invalid') {
          this.callSettingFunction('onInvalid');
        }
        return state = _state;
      }, this);
      count = __bind(function() {
        if (this.$element.val()) {
          return $.trim(this.$element.val()).split(patterns[this.getSetting('unit')]).length;
        } else {
          return 0;
        }
      }, this);
      formatText = __bind(function(_text) {
        if (_text == null) {
          _text = '';
        }
        if (this.getSetting('textPosition') === 'before') {
          return _text + ' ';
        } else {
          return ' ' + _text;
        }
      }, this);
      this.updateCounter = __bind(function() {
        var _dif, _error;
        _dif = count();
        _error = false;
        if (this.getSetting('min')) {
          if (this.getSetting('min') > _dif || (this.getSetting('max') && this.getSetting('max') < _dif)) {
            _error = true;
          }
          if (!this.getSetting('max')) {
            _dif = count() - this.getSetting('min');
          }
        } else if (this.getSetting('max')) {
          _dif = this.getSetting('max') - count();
        }
        if (this.getSetting('invalidClass') || this.getSetting('validClass')) {
          if (_error || _dif < 0) {
            if (this.getState() !== 'invalid') {
              if (this.getSetting('invalidClass')) {
                this.$element.addClass(this.getSetting('invalidClass'));
                this.$counterWrapper.addClass(this.getSetting('invalidClass'));
              }
              if (this.getSetting('validClass')) {
                this.$element.removeClass(this.getSetting('validClass'));
                this.$counterWrapper.removeClass(this.getSetting('validClass'));
              }
              this.$text.text(formatText(this.getSetting('invalidText')));
            }
            setState('invalid');
          } else {
            if (this.getState() !== 'valid') {
              if (this.getSetting('invalidClass')) {
                this.$element.removeClass(this.getSetting('invalidClass'));
                this.$counterWrapper.removeClass(this.getSetting('invalidClass'));
              }
              if (this.getSetting('validClass')) {
                this.$element.addClass(this.getSetting('validClass'));
                this.$counterWrapper.addClass(this.getSetting('validClass'));
              }
              this.$text.text(formatText(this.getSetting('text')));
            }
            setState('valid');
          }
        }
        return this.$counter.text(_dif);
      }, this);
      this.getState = function() {
        return state;
      };
      this.getSetting = function(settingKey) {
        return this.settings[settingKey];
      };
      this.callSettingFunction = function(functionName) {
        return this.settings[functionName](element, this.$counter[0], count());
      };
      this.init = function() {
        var invalidText, text;
        this.settings = $.extend({}, this.defaults, options);
        if (!this.getSetting('unit').match('letter|word|sentence')) {
          return this.$element;
        }
        text = this.getSetting('text').length ? this.getSetting('text') : this.getSetting('unit');
        invalidText = this.getSetting('invalidText').length ? this.getSetting('invalidText') : this.getSetting('unit');
        this.$counter = $('<span />');
        this.$text = $('<span />');
        this.$counterWrapper = $('<div />', {
          'class': this.getSetting('className'),
          'css': {
            'display': 'none'
          }
        }).append(this.$text);
        if (this.getSetting('textPosition') === 'before') {
          this.$counterWrapper.append(this.$counter);
        } else {
          this.$counterWrapper.prepend(this.$counter);
        }
        this.$element.after(this.$counterWrapper);
        this.updateCounter();
        this.$counterWrapper.show();
        return this.$element.bind('click focus keyup blur change paste', this.updateCounter);
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
