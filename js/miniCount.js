(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jQuery(function() {
    $.miniCount = function(element, options) {
      var addClass, count, formatText, hide, patterns, removeClass, setState, show, state;
      this.defaults = {
        unit: 'letter',
        min: null,
        max: null,
        countdown: false,
        hideOnValid: false,
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
        word: " ",
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
      count = __bind(function() {
        if (this.$element.val().length > 0) {
          switch (this.getSetting('unit')) {
            case 'word':
              return this.$element.val().split(" ").length;
            case 'sentence':
              return this.$element.val().split(/[\.\?\!]\s/).length;
            default:
              return this.$element.val().length;
          }
        } else {
          return 0;
        }
      }, this);
      addClass = __bind(function(_class) {
        this.$element.addClass(_class);
        return this.$counterWrapper.addClass(_class);
      }, this);
      removeClass = __bind(function(_class) {
        this.$element.removeClass(_class);
        return this.$counterWrapper.removeClass(_class);
      }, this);
      show = __bind(function() {
        this.$counter.css('visibility', 'visible');
        return this.$text.css('visibility', 'visible');
      }, this);
      hide = __bind(function() {
        this.$counter.css('visibility', 'hidden');
        return this.$text.css('visibility', 'hidden');
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
      this.updateCounter = __bind(function() {
        var _dif, _error;
        _dif = count();
        _error = false;
        if (this.getSetting('min') != null) {
          if (this.getSetting('min') > _dif || ((this.getSetting('max') != null) && this.getSetting('max') < _dif)) {
            _error = true;
          }
          if (this.getSetting('countdown') && !(this.getSetting('max') != null)) {
            _dif = count() - this.getSetting('min');
          }
        } else if (this.getSetting('max') != null) {
          if (this.getSetting('max') < _dif) {
            _error = true;
          }
          if (this.getSetting('countdown')) {
            _dif = this.getSetting('max') - count();
          }
        }
        if (_error || _dif < 0) {
          if (this.getState() !== 'invalid') {
            if (this.getSetting('hideOnValid')) {
              show();
            }
            if (this.getSetting('invalidClass') != null) {
              addClass(this.getSetting('invalidClass'));
            }
            if (this.getSetting('validClass') != null) {
              removeClass(this.getSetting('validClass'));
            }
            this.$text.text(formatText(this.getSetting('invalidText')));
            setState('invalid');
          }
        } else {
          if (this.getState() !== 'valid') {
            if (this.getSetting('hideOnValid')) {
              hide();
            }
            if (this.getSetting('invalidClass') != null) {
              removeClass(this.getSetting('invalidClass'));
            }
            if (this.getSetting('validClass') != null) {
              addClass(this.getSetting('validClass'));
            }
            this.$text.text(formatText(this.getSetting('text')));
          }
          setState('valid');
        }
        return this.$counter.text(_dif);
      }, this);
      this.init = function() {
        var invalidText, text;
        this.settings = $.extend({}, this.defaults, options);
        if (!(this.getSetting('unit').match('letter|word|sentence') != null)) {
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
