(function() {

  describe('miniCount', function() {
    var options;
    options = {
      unit: 'word'
    };
    beforeEach(function() {
      loadFixtures('fragment.html');
      return this.$element = $('#fixtures');
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
    return it('should overwrites the settings', function() {
      var plugin;
      plugin = new $.miniCount(this.$element[0], options);
      return expect(plugin.settings.unit).toBe(options.unit);
    });
  });

}).call(this);
