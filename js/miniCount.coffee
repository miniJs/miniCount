#
# miniCount, the letter/word/sentence counter miniCount for jQuery
# Instructions: Coming Soon
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com
# Version: 1.0 Alpha 1.0
# Updated: June 27th, 2011
#

jQuery ->
    $.miniCount = (element, options) ->
        # default miniCount settings
        @defaults = {
            unit                    :   'letter'   # counter unit: 'letter' | 'word' | 'sentence'
            min                     :   null       # minimum of letters/words/sentences occurrences
            max                     :   null       # maximum of letters/words/sentences occurrences

            className               :   'counter'  # counter wrapper class name
            validClassName          :   ''         # class name added to counter wrapper when invalid
            invalidClass            :   'error'    # class name to add to counter wrapper when invalid

            text                    :   ''         # valid text to be displayed
            textPosition            :   'after'    # valid text position - 'before' | 'after' the counter
            invalidText             :   ''         # invalid text to be displayed

            onValid                 :   ->         # function(element, counter, count) callback function called when valid state
            onInvalid               :   ->         # function(element, counter, count) callback function called when invalid state
        }

        ## private variables
        # current state
        state = ''

        # patterns
        patterns = {
            letter    :   /./
            word      :   /.\s/ #/[\s\.]+/
            sentence  :   /[\.\?\!]\s/
        }

        ## public variables
        # miniCount settings
        @settings = {}

        # jQuery version of DOM element attached to the plugin
        @$element = $ element

        ## private methods
        # set current state
        setState = (_state) =>
            if _state is 'valid'
                @callSettingFunction('onValid')
            else if _state is 'invalid'
                @callSettingFunction('onInvalid')
            state = _state


        #count the number of words
        count = =>
            if @$element.val()
                $.trim(@$element.val()).split(patterns[@getSetting('unit')]).length
            else
                0

        # format counter text
        formatText = (_text = '') =>
            if @getSetting('textPosition') is 'before' then _text + ' '  else ' ' + _text

        #create the text
        @updateCounter = =>
            # init local variables
            _dif = count()
            _error = false

            # get the difference
            if @getSetting('min')
                if @getSetting('min') > _dif or ( @getSetting('max') and @getSetting('max') < _dif )
                    _error = true
                if not @getSetting('max')
                    _dif = count() - @getSetting('min')
            else if @getSetting('max')
                _dif = @getSetting('max') - count()

            # handle the error classes
            if @getSetting('invalidClass') or @getSetting('validClass')
                if  _error or _dif < 0
                    if @getState() isnt 'invalid'
                        if @getSetting('invalidClass')
                            @$element.addClass(@getSetting('invalidClass'))
                            @$counterWrapper.addClass(@getSetting('invalidClass'))
                        if @getSetting('validClass')
                            @$element.removeClass(@getSetting('validClass'))
                            @$counterWrapper.removeClass(@getSetting('validClass'))
                        @$text.text(formatText(@getSetting('invalidText')))
                    setState 'invalid'
                else
                    if @getState() isnt 'valid'
                        if @getSetting('invalidClass')
                            @$element.removeClass(@getSetting('invalidClass'))
                            @$counterWrapper.removeClass(@getSetting('invalidClass'))
                        if @getSetting('validClass')
                            @$element.addClass(@getSetting('validClass'))
                            @$counterWrapper.addClass(@getSetting('validClass'))
                        @$text.text(formatText(@getSetting('text')))
                    setState 'valid'

            # update the counter text
            @$counter.text _dif

        ## public methods
        #get current state
        @getState = ->
          state

        # get particular miniCount setting
        @getSetting = (settingKey) ->
          @settings[settingKey]

        # call one of the miniCount setting functions
        @callSettingFunction = (functionName) ->
          @settings[functionName](element, @$counter[0], count())

        # init function
        @init = ->
            # Initialise the settings
            @settings = $.extend {}, @defaults, options

            # check unit
            if not @getSetting('unit').match('letter|word|sentence') then return @$element

            # set text and invalid text
            text        = if @getSetting('text').length then @getSetting('text') else @getSetting('unit')
            invalidText = if @getSetting('invalidText').length then @getSetting('invalidText') else @getSetting('unit')

            # Counter element
            @$counter          = $ '<span />'
            @$text             = $ '<span />'
            @$counterWrapper   = $('<div />', {'class': @getSetting('className'), 'css' : { 'display': 'none' }}).append @$text
            if @getSetting('textPosition') is 'before' then @$counterWrapper.append @$counter else @$counterWrapper.prepend @$counter
            @$element.after @$counterWrapper

            # update the counter
            @updateCounter()

            # show the counter
            @$counterWrapper.show()

            # bind events to the element
            @$element.bind('click focus keyup blur change paste', @updateCounter)
        # end init method

        # initialise the miniCount
        @init()

    $.fn.miniCount = (options) ->
        return this.each ->
            if undefined == ($ this).data('miniCount')
                miniCount = new $.miniCount this, options
                ($ this).data 'miniCount', miniCount