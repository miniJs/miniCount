#
# miniCount, a character/word/sentence counter miniCount for jQuery
# Instructions: http://minijs.com/plugins/5/count
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com, @mattaussaguel
# Version: 1.1 Stable
# Updated: June 4, 2012
# More info: http://minijs.com/
#

jQuery ->
    $.miniCount = (element, options) ->
        # default miniCount settings
        @defaults = {
            unit                    :   'character' # counter unit: 'character' | 'word' | 'sentence'
            min                     :   null        # minimum of characters/words/sentences occurrences
            max                     :   null        # maximum of characters/words/sentences occurrences
            countdown               :   false       # countdown, only when min or max have been set not both of them
            hideOnValid             :   false       # hide counter when it's valid
 
            className               :   'counter'   # counter wrapper class name
            validClassName          :   ''          # class name added to counter wrapper when invalid
            invalidClass            :   'error'     # class name to add to counter wrapper when invalid
 
            text                    :   ''          # valid text to be displayed
            textPosition            :   'after'     # valid text position - 'before' | 'after' the counter
            invalidText             :   ''          # invalid text to be displayed
 
            onValid                 :   ->          # function(element, counter, count) callback function called when valid state
            onInvalid               :   ->          # function(element, counter, count) callback function called when invalid state
        }

        ## private variables
        # current state
        state = ''

        # patterns
        patterns = {
            character :   /./g
            word      :   /\s|$/g
            sentence  :   /(\S.+?[.!?])(?=\s+|$)/g
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

        # format counter text
        formatText = (_text = '') =>
            if @getSetting('textPosition') is 'before' then _text + ' '  else ' ' + _text

        #count the number of words
        count = =>
            if @$element.val().length > 0
                @$element.val().match(patterns[@getSetting('unit')]).length
            else
                0

        # add class to element and counter wrapper
        addClass = (_class) =>
            @$element.addClass _class
            @$counterWrapper.addClass _class

        # remove class to element and counter wrapper
        removeClass = (_class) =>
            @$element.removeClass _class
            @$counterWrapper.removeClass _class

        # show counter
        show = () =>
            @$counter.css 'visibility', 'visible'
            @$text.css 'visibility', 'visible'

        # hide counter
        hide = () =>
            @$counter.css 'visibility', 'hidden'
            @$text.css 'visibility', 'hidden'


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

        # update counter content
        @updateCounter = =>
            # init local variables
            _diff = count()
            _error = false

            # get the difference
            if @getSetting('min')?
                # check whether it's valid or not
                if @getSetting('min') > _diff or ( @getSetting('max')? and @getSetting('max') < _diff )
                    _error = true
                # update _diff if countdown
                if @getSetting('countdown') and not @getSetting('max')?
                    _diff = count() - @getSetting('min')
            else if @getSetting('max')?
                # check whether it's valid or not
                if @getSetting('max') < _diff
                    _error = true
                # update _diff if countdown
                if @getSetting('countdown')
                    _diff = @getSetting('max') - count()

            # handle the error classes
            if  _error or _diff < 0
                # INVALID
                if @getState() isnt 'invalid'
                    # hide counter if necessary
                    show() if @getSetting('hideOnValid')

                    #update the counter classes
                    addClass @getSetting('invalidClass') if @getSetting('invalidClass')?
                    removeClass @getSetting('validClass') if @getSetting('validClass')?

                    # update the counter text
                    @$text.text(formatText(@getSetting('invalidText')))

                    # update state
                    setState 'invalid'
            else
                # VALID
                if @getState() isnt 'valid'
                    # hide counter if necessary
                    hide() if @getSetting('hideOnValid')

                    # update the counter text
                    removeClass @getSetting('invalidClass') if @getSetting('invalidClass')?
                    addClass @getSetting('validClass') if @getSetting('validClass')?

                    # update the counter text
                    @$text.text(formatText(@getSetting('text')))
                setState 'valid'

            # update the counter text
            @$counter.text _diff

        # init function
        @init = ->
            # Initialise the settings
            @settings = $.extend {}, @defaults, options

            # check unit
            if not @getSetting('unit').match('character|word|sentence')? then return @$element

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