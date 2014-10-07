
describe 'Counter', ->
	element = counter = null
	
	beforeEach ->
		element = document.createElement 'div'

		element.setAttribute 'data-duration', 10
		element.setAttribute 'data-separator', ':'

		counter = new Counter element, 0, 5000, duration: 5, prefix: '£', suffix: ' Only', decimals: 2

	it 'should setup options using constructor, data attributes and default values', ->
		expect(counter.options).toEqual
			autostart: false
			decimal: "."
			decimals: 2
			duration: 5
			easing: true
			grouping: true
			prefix: "£"
			separator: ":"
			suffix: " Only"

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
			expect(counter.formatNumber 1000000).toEqual '£1:000:000.00 Only'

		it 'should format negative numbers', ->
			expect(counter.formatNumber -1000000).toEqual '£-1:000:000.00 Only'

		it 'should format numbers with decimals', ->
			expect(counter.formatNumber 1000000.000).toEqual '£1:000:000.00 Only'
