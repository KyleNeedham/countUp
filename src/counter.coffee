
((root, factory) ->
  if typeof define is 'function' and define.amd
    define ['counter'], factory
  else
    root.Counter = factory(root)
) @, (root)->

  class Counter

    @VERSION: '0.0.2'

    @DEFAULTS:
      useEasing: yes
      useGrouping: yes
      separator: ','
      decimal: '.'
      prefix: ''
      suffix: ''

    ###*
     * Counter
     * 
     * @class
     * @param {number} target element selector or var of previously selected html element where counting occurs
     * @param {number} startVal The value you want to begin at
     * @param {number} endVal The value you want to arrive at
     * @param {number} [decimals=0] Tumber of decimal places
     * @param {number} [duration=2] Duration of animation in second
     * @param {object} [options] Optional object of options (see below)
     * 
    ###
    constructor: (target, startVal, endVal, decimals, duration, options = {}) ->
      @polyFill()

      @root      = {target, startVal, endVal, decimals, duration}
      @element   = if typeof target is 'string' then document.querySelector target else target
      @startVal  = +startVal
      @endVal    = +endVal
      @countDown = if startVal > endVal then yes else no
      @startTime = null
      @timestamp = null
      @remaining = null
      @rAF       = null
      @frameVal  = @startVal
      @decimals  = Math.max 0, decimals or 0
      @dec       = 10 ** @decimals
      @duration  = duration * 1000 or 2000
      @options   = @extend options, @getAttributes(@element), Counter.DEFAULTS
      @options.useGrouping = no if @options.separator is ''

      @printValue @startVal

    ###*
     * Make sure requestAnimationFrame and cancelAnimationFrame are defined
     * polyfill for browsers without native support
     * by Opera engineer Erik Möller
     * 
     * @method polyFill
     *  
    ###
    polyFill: ->
      x        = 0
      lastTime = 0
      vendors  = ['webkit', 'moz', 'ms', 'o']

      while x < vendors.length and not root.requestAnimationFrame
        root.requestAnimationFrame = root["#{vendors[x]}RequestAnimationFrame"]
        root.cancelAnimationFrame  = root["#{vendors[x]}CancelAnimationFrame"] or root["#{vendors[x]}CancelRequestAnimationFrame"]
        x++

      unless root.requestAnimationFrame
        root.requestAnimationFrame = (callback, element) ->
          currTime   = new Date().getTime()
          timeToCall = Math.max 0, 16 - (currTime - lastTime)

          id = root.setTimeout ->
            callback currTime + timeToCall
          , timeToCall

          lastTime = currTime + timeToCall

          id

      unless root.cancelAnimationFrame
        root.cancelAnimationFrame = (id) ->
          clearTimeout id

    ###*
     * 
     * @method extend
     * @param {object} obj
     *  
    ###
    extend: (obj) ->
      i = 1

      while i < arguments.length
        source = arguments[i]

        for prop of source
          obj[prop] = source[prop] unless obj[prop]?

        i++

      obj

    ###*
     * Get options from `data-*` attributes
     * 
     * @method getAttributes
     * @param (object) element
     *  
    ###
    getAttributes: (element) ->
      return element.dataset if element.dataset

      useEasing: element.getAttribute 'data-easing'
      useGrouping: element.getAttribute 'data-grouping'
      separator: element.getAttribute 'data-separator'
      decimal: element.getAttribute 'data-decimal'
      prefix: element.getAttribute 'data-prefix'
      suffix: element.getAttribute 'data-suffix'

    ###*
     * Print value to the target element
     * 
     * @method printValue
     * @param {number} value
     * @return {string} The figure that was printed
     *  
    ###
    printValue: (value) ->
      result = if not isNaN value then @formatNumber value else '--'

      if @element.tagName is 'INPUT'
        @element.value = result
      else
        @element.innerHTML = result

      result

    ###*
     * 
     * @method easeOutExpo
     * @param {number} t
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @return {number}
     *  
    ###
    easeOutExpo: (t, b, c, d) ->
      c * (-(2 ** (-10 * t / d)) + 1) * 1024 / 1023 + b

    ###*
     * 
     * @method count
     * @param {number} timestamp
     * @return
     *  
    ###
    count: (timestamp) =>
      @startTime = timestamp if @startTime is null
      @timestamp = timestamp
      progress   = timestamp - @startTime
      @remaining = @duration - progress

      # To ease or not to ease
      if @options.useEasing
        if @countDown
          @frameVal = @startVal - @easeOutExpo progress, 0, (@startVal - @endVal), @duration
        else #@countDown
          @frameVal = @easeOutExpo progress, @startVal, @endVal - @startVal, @duration

      else #@options.useEasing
        if @countDown
          @frameVal = @startVal - (@startVal - @endVal) * (progress / @duration)
        else #@countDown
          @frameVal = @startVal + (@endVal - @startVal) * (progress / @duration)

      # Don't go past endVal since progress can exceed duration in the last frame
      if @countDown
        @frameVal = if @frameVal < @endVal then @endVal else @frameVal
      else #@countDown
        @frameVal = if @frameVal > @endVal then @endVal else @frameVal

      # Decimal
      @frameVal = Math.round(@frameVal * @dec) / @dec

      # Format and print value
      @printValue @frameVal

      # whether to cotinue
      if progress < @duration
        @rAF = requestAnimationFrame @count
      else #progress < @duration
        @callback() if @callback?

    ###*
     * 
     * @method start
     * @param {function} callback
     * @return {object}
     *  
    ###
    start: (callback) ->
      @callback = callback

      # Make sure values are valid
      if not isNaN(@endVal) and not isNaN @startVal
        @rAF = requestAnimationFrame @count
      else #isNaN @endVal and isNaN @startVal
        console.error 'countUp error: startVal or endVal is not a number'
        @printValue()

      @

    ###*
     * 
     * @method stop
     * @return {object}
     *  
    ###
    stop: ->
      cancelAnimationFrame @rAF

      @

    ###*
     * 
     * @method reset
     * @return {object}
     *  
    ###
    reset: ->
      @startTime = null
      @startVal  = @root.startVal

      cancelAnimationFrame @rAF
      @printValue @startVal

      @

    ###*
     * 
     * @method resume
     * @return {object}
     *  
    ###
    resume: ->
      @stop()

      @startTime = null
      @duration  = @remaining
      @startVal  = @frameVal

      requestAnimationFrame @count

      @

    ###*
     * 
     * @method resume
     * @return {string} formatted number
     *  
    ###
    formatNumber: (numberString) ->
      numberString = "#{numberString.toFixed @decimals}"

      x   = numberString.split '.'
      x1  = x[0]
      x2  = if x.length > 1 then @options.decimal + x[1] else ''
      rgx = /(\d+)(\d{3})/

      if @options.useGrouping
        while rgx.test x1
          x1 = x1.replace rgx, "$1#{@options.separator}$2"

      "#{@options.prefix}#{x1}#{x2}#{@options.suffix}"
