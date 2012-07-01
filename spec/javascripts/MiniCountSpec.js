(function() {

  describe('miniCount', function() {
    var options;
    options = {
      unit: 'word'
    };
    beforeEach(function() {
      setFixtures('<section><textarea></textarea></section>');
      return this.$element = $('textarea');
    });
    it('should be available on the jQuery object', function() {
      return expect($.fn.miniCount).toBeDefined();
    });
    it('should be chainable', function() {
      return expect(this.$element.miniCount(options)).toBe(this.$element);
    });
    it('should offers default values', function() {
      var plugin;
      plugin = new $.miniCount(this.$element[0], options);
      return expect(plugin.defaults).toBeDefined();
    });
    it('should overwrites the settings', function() {
      var plugin;
      plugin = new $.miniCount(this.$element[0], options);
      return expect(plugin.settings.unit).toBe(options.unit);
    });
    describe('counter element', function() {
      describe('with default options', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element);
        });
        it('should add the counter after the element', function() {
          return expect(this.plugin.$counterWrapper).toBe(this.$element.next());
        });
        it('should be a div', function() {
          return expect(this.$element.next().prop('tagName')).toBe('DIV');
        });
        it('should have the default class name', function() {
          return expect(this.plugin.$counterWrapper.hasClass(this.plugin.defaults.className)).toBeTruthy();
        });
        return it('should include the current count wrapped in a span', function() {
          return expect(this.plugin.$counterWrapper.children('span').html()).toBe('0');
        });
      });
      return describe('custom options', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element, {
            className: 'custom-class-name'
          });
        });
        return it('should have the default class name', function() {
          return expect(this.plugin.$counterWrapper.hasClass("custom-class-name")).toBeTruthy();
        });
      });
    });
    describe('visual validation', function() {
      describe('when valid', function() {
        it('should add the custom text after the counter', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            text: 'some text'
          });
          return expect(plugin.$counter.next()).toBe(plugin.$text);
        });
        it('should prepend the custom text', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            text: 'some text',
            textPosition: 'before'
          });
          return expect(plugin.$counter.prev()).toBe(plugin.$text);
        });
        it('should include the custom text prepended by a space if position after', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            text: 'some text'
          });
          return expect(plugin.$text.text()).toBe(' some text');
        });
        return it('should include the custom text prepended by a space if position before', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            text: 'some text',
            textPosition: 'before'
          });
          return expect(plugin.$text.text()).toBe('some text ');
        });
      });
      return describe('when invalid', function() {
        it('should replace text invalid text when invalid', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            text: 'valid text',
            invalidText: 'invalid text',
            min: 5
          });
          expect(plugin.$text.text()).toBe(' invalid text');
          this.$element.val('this is now valid').trigger('change');
          return expect(plugin.$text.text()).toBe(' valid text');
        });
        it('should add the default invalid class when text invalid', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            min: 5
          });
          expect(plugin.$counterWrapper.hasClass('error')).toBeTruthy();
          this.$element.val('this is now valid').trigger('change');
          return expect(plugin.$counterWrapper.hasClass('error')).toBeFalsy();
        });
        return it('should add the custom class when text invalid', function() {
          var plugin;
          plugin = new $.miniCount(this.$element, {
            min: 5,
            invalidClass: 'custom-invalid-class'
          });
          expect(plugin.$counterWrapper.hasClass('custom-invalid-class')).toBeTruthy();
          this.$element.val('this is now valid').trigger('change');
          return expect(plugin.$counterWrapper.hasClass('custom-invalid-class')).toBeFalsy();
        });
      });
    });
    describe('validation', function() {
      describe('without min and max', function() {
        return it('should always be valid, default values', function() {
          var plugin;
          plugin = new $.miniCount(this.$element);
          expect(plugin.getState()).toBe('valid');
          this.$element.val('this is still valid').trigger('change');
          return expect(plugin.getState()).toBe('valid');
        });
      });
      describe('with min only', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element, {
            min: 10
          });
        });
        it('should be invalid below 10 characters', function() {
          expect(this.plugin.getState()).toBe('invalid');
          this.$element.val('abcdefghi').trigger('change');
          return expect(this.plugin.getState()).toBe('invalid');
        });
        return it('should be valid above 9 characters', function() {
          this.$element.val('abcdefghij').trigger('change');
          return expect(this.plugin.getState()).toBe('valid');
        });
      });
      describe('with max only', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element, {
            max: 10
          });
        });
        it('should be invalid above 10 characters', function() {
          this.$element.val('abcdefghijk').trigger('change');
          expect(this.plugin.getState()).toBe('invalid');
          this.$element.val('this is longer than 10 characters obviously').trigger('change');
          return expect(this.plugin.getState()).toBe('invalid');
        });
        return it('should be valid below 9 characters', function() {
          expect(this.plugin.getState()).toBe('valid');
          this.$element.val('abcdefghi').trigger('change');
          return expect(this.plugin.getState()).toBe('valid');
        });
      });
      return describe('with min and max', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element, {
            min: 5,
            max: 10
          });
        });
        it('should be invalid below 5 characters', function() {
          expect(this.plugin.getState()).toBe('invalid');
          this.$element.val('abcd').trigger('change');
          return expect(this.plugin.getState()).toBe('invalid');
        });
        it('should be invalid above 10 characters', function() {
          this.$element.val('abcdefghikl').trigger('change');
          expect(this.plugin.getState()).toBe('invalid');
          this.$element.val('this is longer than 10 characters obviously').trigger('change');
          return expect(this.plugin.getState()).toBe('invalid');
        });
        return it('should be balid between 5 and 10 characters inclusive', function() {
          this.$element.val('abcde').trigger('change');
          expect(this.plugin.getState()).toBe('valid');
          this.$element.val('abcdefg').trigger('change');
          expect(this.plugin.getState()).toBe('valid');
          this.$element.val('abcdefghij').trigger('change');
          return expect(this.plugin.getState()).toBe('valid');
        });
      });
    });
    describe('character count', function() {});
    describe('word count', function() {});
    describe('sentence count', function() {});
    describe('hideOnValid', function() {
      describe('when false, default value', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element, {
            max: 5
          });
        });
        it("should be visible when valid", function() {
          expect(this.plugin.$counter.css('visibility')).toBe('visible');
          return expect(this.plugin.$text.css('visibility')).toBe('visible');
        });
        return it("should be visible when invalid", function() {
          this.$element.val('this is now invalid').trigger('change');
          expect(this.plugin.$counter.css('visibility')).toBe('visible');
          return expect(this.plugin.$text.css('visibility')).toBe('visible');
        });
      });
      return describe('when true', function() {
        beforeEach(function() {
          return this.plugin = new $.miniCount(this.$element, {
            max: 5,
            hideOnValid: true
          });
        });
        it("should be hidden when valid", function() {
          expect(this.plugin.$counter.css('visibility')).toBe('hidden');
          return expect(this.plugin.$text.css('visibility')).toBe('hidden');
        });
        return it("should be visible when invalid", function() {
          this.$element.val('this is now invalid').trigger('change');
          expect(this.plugin.$counter.css('visibility')).toBe('visible');
          return expect(this.plugin.$text.css('visibility')).toBe('visible');
        });
      });
    });
    describe('countdown', function() {});
    return describe('callbacks', function() {
      beforeEach(function() {
        return this.foo = jasmine.createSpy('foo');
      });
      it('should call valid callback function when valid', function() {
        var plugin;
        plugin = new $.miniCount(this.$element, {
          min: 5,
          onValid: this.foo
        });
        expect(this.foo).not.toHaveBeenCalled();
        this.$element.val('this is now valid').trigger('change');
        return expect(this.foo).toHaveBeenCalled();
      });
      return it('should call invalid callback function when invalid', function() {
        var plugin;
        plugin = new $.miniCount(this.$element, {
          max: 5,
          onInvalid: this.foo
        });
        expect(this.foo).not.toHaveBeenCalled();
        this.$element.val('this is now invalid').trigger('change');
        return expect(this.foo).toHaveBeenCalled();
      });
    });
  });

}).call(this);
