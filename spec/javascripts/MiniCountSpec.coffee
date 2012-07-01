describe 'miniCount', ->
  options =
    unit: 'word'

  beforeEach ->
    setFixtures '<section><textarea></textarea></section>'    
    @$element = $('textarea')

  it 'should be available on the jQuery object', ->
    expect($.fn.miniCount).toBeDefined()

  it 'should be chainable', ->
    expect(@$element.miniCount(options)).toBe(@$element)

  it 'should offers default values', ->
    plugin = new $.miniCount(@$element[0], options)

    expect(plugin.defaults).toBeDefined()

  it 'should overwrites the settings', ->
    plugin = new $.miniCount(@$element[0], options)
    expect(plugin.settings.unit).toBe(options.unit)

  describe 'counter element', ->
    describe 'with default options', ->
      beforeEach ->
        @plugin = new $.miniCount(@$element)

      it 'should add the counter after the element', ->
        expect(@plugin.$counterWrapper).toBe(@$element.next())

      it 'should be a div', -> 
        expect(@$element.next().prop('tagName')).toBe('DIV')

      it 'should have the default class name', ->
        expect(@plugin.$counterWrapper.hasClass(@plugin.defaults.className)).toBeTruthy()

      it 'should include the current count wrapped in a span', ->
        expect(@plugin.$counterWrapper.children('span').html()).toBe '0'

    describe 'custom options', ->
      beforeEach ->
        @plugin = new $.miniCount(@$element, {className: 'custom-class-name'})

      it 'should have the default class name', ->
        expect(@plugin.$counterWrapper.hasClass("custom-class-name")).toBeTruthy()

  describe 'visual validation', ->
    describe 'when valid', ->
      it 'should add the custom text after the counter', ->
        plugin = new $.miniCount(@$element, {text: 'some text'})
        expect(plugin.$counter.next()).toBe(plugin.$text)

      it 'should prepend the custom text', ->
        plugin = new $.miniCount(@$element, {text: 'some text', textPosition: 'before' })
        expect(plugin.$counter.prev()).toBe(plugin.$text)

      it 'should include the custom text prepended by a space if position after', ->
        plugin = new $.miniCount(@$element, {text: 'some text' })
        expect(plugin.$text.text()).toBe(' some text')

      it 'should include the custom text prepended by a space if position before', ->
        plugin = new $.miniCount(@$element, {text: 'some text', textPosition: 'before' })
        expect(plugin.$text.text()).toBe('some text ')

    describe 'when invalid', ->
      it 'should replace text invalid text when invalid', ->
        plugin = new $.miniCount(@$element, {text: 'valid text', invalidText: 'invalid text', min: 5 })
        expect(plugin.$text.text()).toBe(' invalid text')

        @$element.val('this is now valid').trigger('change')
        expect(plugin.$text.text()).toBe(' valid text')

      it 'should add the default invalid class when text invalid', ->
        plugin = new $.miniCount(@$element, {min: 5 })
        expect(plugin.$counterWrapper.hasClass('error')).toBeTruthy()

        @$element.val('this is now valid').trigger('change')
        expect(plugin.$counterWrapper.hasClass('error')).toBeFalsy()

      it 'should add the custom class when text invalid', ->
        plugin = new $.miniCount(@$element, {min: 5, invalidClass: 'custom-invalid-class' })
        expect(plugin.$counterWrapper.hasClass('custom-invalid-class')).toBeTruthy()

        @$element.val('this is now valid').trigger('change')
        expect(plugin.$counterWrapper.hasClass('custom-invalid-class')).toBeFalsy()

  describe 'validation', ->
    describe 'without min and max', ->
      it 'should always be valid, default values', ->
        plugin = new $.miniCount(@$element)
        expect(plugin.getState()).toBe('valid')

        @$element.val('this is still valid').trigger('change')
        expect(plugin.getState()).toBe('valid')

    describe 'with min only', ->
      beforeEach ->
        @plugin = new $.miniCount( @$element, { min: 10 } )

      it 'should be invalid below 10 characters', ->
        expect(@plugin.getState()).toBe('invalid')

        @$element.val('abcdefghi').trigger('change')
        expect(@plugin.getState()).toBe('invalid')

      it 'should be valid above 9 characters', ->
        @$element.val('abcdefghij').trigger('change')
        expect(@plugin.getState()).toBe('valid')

    describe 'with max only', ->
      beforeEach ->
        @plugin = new $.miniCount( @$element, { max: 10 } )

      it 'should be invalid above 10 characters', ->
        @$element.val('abcdefghijk').trigger('change')
        expect(@plugin.getState()).toBe('invalid')

        @$element.val('this is longer than 10 characters obviously').trigger('change')
        expect(@plugin.getState()).toBe('invalid')

      it 'should be valid below 9 characters', ->
        expect(@plugin.getState()).toBe('valid')

        @$element.val('abcdefghi').trigger('change')
        expect(@plugin.getState()).toBe('valid')


    describe 'with min and max', ->
      beforeEach ->
        @plugin = new $.miniCount( @$element, { min: 5, max: 10 } )

      it 'should be invalid below 5 characters', ->
        expect(@plugin.getState()).toBe('invalid')

        @$element.val('abcd').trigger('change')
        expect(@plugin.getState()).toBe('invalid')

      it 'should be invalid above 10 characters', ->
        @$element.val('abcdefghikl').trigger('change')
        expect(@plugin.getState()).toBe('invalid')

        @$element.val('this is longer than 10 characters obviously').trigger('change')
        expect(@plugin.getState()).toBe('invalid')

      it 'should be balid between 5 and 10 characters inclusive', ->
        @$element.val('abcde').trigger('change')
        expect(@plugin.getState()).toBe('valid')

        @$element.val('abcdefg').trigger('change')
        expect(@plugin.getState()).toBe('valid')

        @$element.val('abcdefghij').trigger('change')
        expect(@plugin.getState()).toBe('valid')


  describe 'character count', ->


  describe 'word count', ->

  describe 'sentence count', ->

  describe 'hideOnValid', ->
    describe 'when false, default value', ->
      beforeEach ->
        @plugin = new $.miniCount( @$element, { max: 5 } )

      it "should be visible when valid", ->
        expect(@plugin.$counter.css('visibility')).toBe('visible')
        expect(@plugin.$text.css('visibility')).toBe('visible')

      it "should be visible when invalid", ->
        @$element.val('this is now invalid').trigger('change')

        expect(@plugin.$counter.css('visibility')).toBe('visible')
        expect(@plugin.$text.css('visibility')).toBe('visible')

    describe 'when true', ->
      beforeEach ->
        @plugin = new $.miniCount( @$element, { max: 5, hideOnValid: true } )

      it "should be hidden when valid", ->
        expect(@plugin.$counter.css('visibility')).toBe('hidden')
        expect(@plugin.$text.css('visibility')).toBe('hidden')

      it "should be visible when invalid", ->
        @$element.val('this is now invalid').trigger('change')

        expect(@plugin.$counter.css('visibility')).toBe('visible')
        expect(@plugin.$text.css('visibility')).toBe('visible')


  describe 'countdown', ->

  describe 'callbacks', ->
    beforeEach ->
      @foo = jasmine.createSpy('foo')

    it 'should call valid callback function when valid', ->
      plugin  = new $.miniCount(@$element, { min: 5, onValid: @foo})
      expect(@foo).not.toHaveBeenCalled()
      @$element.val('this is now valid').trigger('change')
      expect(@foo).toHaveBeenCalled()

    it 'should call invalid callback function when invalid', ->
      plugin  = new $.miniCount(@$element, { max: 5, onInvalid: @foo })
      expect(@foo).not.toHaveBeenCalled()
      @$element.val('this is now invalid').trigger('change')
      expect(@foo).toHaveBeenCalled()







