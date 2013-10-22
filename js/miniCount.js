
jQuery(function() {
  $.miniCount = function(element, options) {
    var addClass, formatText, hide, patterns, removeClass, setState, show, state,
      _this = this;
    this.defaults = {
      unit: 'character',
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
      character: /./g,
      word: /\s+|$/g,
      sentence: /(\S.+?[.!?])(?=\s+|$)/g
    };
    this.settings = {};
    this.$element = $(element);
    setState = function(_state) {
      if (_state === 'valid') {
        _this.callSettingFunction('onValid');
      } else if (_state === 'invalid') {
        _this.callSettingFunction('onInvalid');
      }
      return state = _state;
    };
    formatText = function(_text) {
      if (_text == null) {
        _text = '';
      }
      if (_this.getSetting('textPosition') === 'before') {
        return _text + ' ';
      } else {
        return ' ' + _text;
      }
    };
    addClass = function(_class) {
      _this.$element.addClass(_class);
      return _this.$counterWrapper.addClass(_class);
    };
    removeClass = function(_class) {
      _this.$element.removeClass(_class);
      return _this.$counterWrapper.removeClass(_class);
    };
    show = function() {
      _this.$counter.css('visibility', 'visible');
      return _this.$text.css('visibility', 'visible');
    };
    hide = function() {
      _this.$counter.css('visibility', 'hidden');
      return _this.$text.css('visibility', 'hidden');
    };
    this.getState = function() {
      return state;
    };
    this.getSetting = function(settingKey) {
      return this.settings[settingKey];
    };
    this.callSettingFunction = function(functionName) {
      return this.settings[functionName](element, this.$counter[0], this.count());
    };
    this.count = function() {
      if (_this.$element.val().length > 0) {
        return _this.$element.val().match(patterns[_this.getSetting('unit')]).length;
      } else {
        return 0;
      }
    };
    this.updateCounter = function() {
      var _diff, _error;
      _diff = _this.count();
      _error = false;
      if (_this.getSetting('min') != null) {
        if (_this.getSetting('min') > _diff || ((_this.getSetting('max') != null) && _this.getSetting('max') < _diff)) {
          _error = true;
        }
        if (_this.getSetting('countdown') && !(_this.getSetting('max') != null)) {
          _diff = _this.count() - _this.getSetting('min');
        }
      } else if (_this.getSetting('max') != null) {
        if (_this.getSetting('max') < _diff) {
          _error = true;
        }
        if (_this.getSetting('countdown')) {
          _diff = _this.getSetting('max') - _this.count();
        }
      }
      if (_error || _diff < 0) {
        if (_this.getState() !== 'invalid') {
          if (_this.getSetting('hideOnValid')) {
            show();
          }
          if (_this.getSetting('invalidClass') != null) {
            addClass(_this.getSetting('invalidClass'));
          }
          if (_this.getSetting('validClass') != null) {
            removeClass(_this.getSetting('validClass'));
          }
          _this.$text.text(formatText(_this.getSetting('invalidText')));
          setState('invalid');
        }
      } else {
        if (_this.getState() !== 'valid') {
          if (_this.getSetting('hideOnValid')) {
            hide();
          }
          if (_this.getSetting('invalidClass') != null) {
            removeClass(_this.getSetting('invalidClass'));
          }
          if (_this.getSetting('validClass') != null) {
            addClass(_this.getSetting('validClass'));
          }
          _this.$text.text(formatText(_this.getSetting('text')));
        }
        setState('valid');
      }
      return _this.$counter.text(_diff);
    };
    this.init = function() {
      var invalidText, text;
      this.settings = $.extend({}, this.defaults, options);
      if (!(this.getSetting('unit').match('character|word|sentence') != null)) {
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
    this.init();
    return this;
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
