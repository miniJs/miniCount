describe 'miniCount', ->
  options =
    unit: 'word'

  beforeEach ->
    loadFixtures 'fragment.html'
    @$element = $('#fixtures')

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