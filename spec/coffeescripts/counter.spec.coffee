
describe 'Counter', ->
  element = counter = options = null

  beforeEach ->
    options = duration: 5, prefix: '£', suffix: ' Only', decimals: 2
    element = document.createElement 'div'
    counter = new Counter element, 0, 5000, options

  describe 'parsing and extending options', ->
    it 'should extend an object overriding only null properties', ->
      options = counter.extend {}, {duration: 10}, {duration: 5}
      expect(options).toEqual duration: 10

    it 'should parse data attribute true alias values as boolean true', ->
      expect(counter.parseDataAttribute('on')).toEqual true
      expect(counter.parseDataAttribute('yes')).toEqual true
      expect(counter.parseDataAttribute('true')).toEqual true
      expect(counter.parseDataAttribute('1')).toEqual true

    it 'should parse data attribute false alias values as boolean false', ->
      expect(counter.parseDataAttribute('off')).toEqual false
      expect(counter.parseDataAttribute('no')).toEqual false
      expect(counter.parseDataAttribute('false')).toEqual false
      expect(counter.parseDataAttribute('0')).toEqual false

  describe 'when the counter is started', ->
    beforeEach ->
      counter.start()

    it 'should be running when started', ->
      expect(counter.isRunning).toEqual yes

  describe 'when the counter has been stopped', ->
    beforeEach ->
      counter.stop()

    it 'should not be running when stopped', ->
      expect(counter.isRunning).toBeFalsy()

    it 'should be possible to resume', ->
      counter.resume()
      expect(counter.isRunning).toBeTruthy()

  describe 'formatting numbers', ->
    it 'should format postive numbers', ->
      expect(counter.formatNumber 1000000).toEqual '£1,000,000.00 Only'

    it 'should format negative numbers', ->
      expect(counter.formatNumber -1000000).toEqual '£-1,000,000.00 Only'

    it 'should format numbers with decimals', ->
      expect(counter.formatNumber 1000000.000).toEqual '£1,000,000.00 Only'
