#
# miniCount, the letter/word/sentence counter miniCount for jQuery
# Instructions: Coming Soon
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com
# Version: 0.1
# Updated: June 27th, 2011
#

jQuery ->
    $.miniCount = (element, options) ->
        # default miniCount settings
        @defaults = {
            maxWords: 30
            msg: "words"
            erMsg: "words"
            erCl: "error"
            counter: "counter"
        }

        ## private variables
        # current state
        state = ''

        ## public variables
        # miniCount settings
        @settings = {}

        # jQuery version of DOM element attached to the plugin
        @$element = $ element

        ## private methods
        # set current state
        setState = (_state) ->
          state = _state

        #count the number of words
        count = =>
            if @$element.val() != '' then $.trim(@$element.val()).split(/[\s\.\?]+/).length else 0

        #create the message
        cMsg = =>
            dif = @getSetting('maxWords') - count()
            if dif >= 0
                if @$wordcount.hasClass(@getSetting('erCl')) then @$wordcount.removeClass @getSetting('erCl')
            else
                if not @$wordcount.hasClass(@getSetting('erCl')) then $wordcount.addClass(@getSetting('erCl'))
            (@getSetting('maxWords') - count()) + ' ' + @getSetting('msg')

        ## public methods
        #get current state
        @getState = ->
          state

        # get particular miniCount setting
        @getSetting = (settingKey) ->
          @settings[settingKey]

        # call one of the miniCount setting functions
        @callSettingFunction = (functionName) ->
          @settings[functionName]()

        # init function
        @init = ->
            # Initialise the settings
            @settings = $.extend {}, @defaults, options
            
            # Counter element
            @$wordcount = $('#' + @getSetting('counter'))

            # Display counter
            @$wordcount.text cMsg()

            # bind event to the element
            @$element.bind('click focus keyup blur change paste', => @$wordcount.text cMsg())
        # end init method

        # initialise the miniCount
        @init()

    $.fn.miniCount = (options) ->
        return this.each ->
            if undefined == ($ this).data('miniCount')
                miniCount = new $.miniCount this, options
                ($ this).data 'miniCount', miniCount