import React from 'react'
import PointTarget from 'react-point'

// output scaling in calculator display
class OutputScaling extends React.Component {
	
	state = {
		scale: 1
	};

	componentDidUpdate() {
		const { scale } = this.state

		const node = this.node

		const parent_w = node.parentNode.offsetWidth
		const elem_w = node.offsetWidth
		const new_scale = parent_w / elem_w

		if (scale === new_scale) return

		if (new_scale < 1) {
			this.setState({ scale: new_scale })
		} else if (scale < 1) {
			this.setState({ scale: 1 })
		}
	}

	render() {
		const { scale } = this.state

		return (
			<span style={{ transform: `scale(${scale},${scale})` }} ref={node => this.node = node}>{this.props.children}</span>
		)
	}
}

// define calculator display
class CalcDisplay extends React.Component {
	render() {
		const { value } = this.props

	    return (
			<div className="calculator-display">
				<OutputScaling>{value}</OutputScaling>
			</div>
	    )
	}
}

// define calculator keys
class CalcKey extends React.Component {
	render() {
		const { calcKeyPress, ...props } = this.props

		return (
			<PointTarget onPoint={calcKeyPress}>
				<button { ...props }/>
			</PointTarget>
		)
	}
}

// main function
class Calculator extends React.Component {
	constructor() {
	  super();
	}

	state = {
    	displayVal: '0',
		afterOperation: false,
		value: null,
		operator: null
  	};

	// AC button - reset calculator
	resetCalc() {
		this.setState({
			displayVal: '0',
			afterOperation: false,
			value: null,
			operator: null
		})
	}

	// DIGIT buttons - set number
	setDigit(digit) {
		const { displayVal, afterOperation } = this.state

		if (afterOperation) {
			this.setState({
				displayVal: String(digit),
				afterOperation: false
			})
		} else {
			this.setState({
				displayVal: displayVal === '0' ? String(digit) : displayVal + digit
			})
		}
	}

	// DOT button - start decimals
	insertDot() {
		const { displayVal, afterOperation } = this.state

		// if begin writing from dot
		// else if dot does not exist
		if (afterOperation) {
			this.setState({
				displayVal: 0 + '.',
				afterOperation: false
			})
		} else if (!(/\./).test(displayVal)) {
			this.setState({
				displayVal: displayVal + '.'
			})
		}
	}

	// OPERATION buttons actions + - =
	makeOperation(_operator) {

		const { value, displayVal, operator } = this.state

		const operations = {
		    '+': (prevValue, nextValue) => prevValue + nextValue,
		    '-': (prevValue, nextValue) => prevValue - nextValue,
		    '=': (prevValue, nextValue) => nextValue
		}

		const inputValue = parseFloat(displayVal)

		if (value == null) {
			this.setState({
				value: inputValue
			})
		} else if (operator) {
			const currentValue = value || 0
			const newValue = operations[operator](currentValue, inputValue)

			let decimalLength = 6

			let decimalDivider = '1';
			for (var i = 0; i < decimalLength; i++) {
				decimalDivider += '0'
			}
			decimalDivider = parseFloat(decimalDivider);

			// console.log(decimalDivider)
			
			const formattedValue = Math.round(parseFloat(newValue) * decimalDivider) / decimalDivider;

			this.setState({
				value: formattedValue,
				displayVal: String(formattedValue)
			})
		}

		this.setState({
			afterOperation: true,
			operator: _operator
		})
	}

	render() {
		const { displayVal } = this.state

		return (
			<div className="calculator">

		        <CalcDisplay value={displayVal}/>

		        <div className="calculator-keypad">
					<div className="keys_inputs">
						<CalcKey calcKeyPress={() => this.setDigit(7)}>7</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(8)}>8</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(9)}>9</CalcKey>

						<CalcKey calcKeyPress={() => this.setDigit(4)}>4</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(5)}>5</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(6)}>6</CalcKey>

						<CalcKey calcKeyPress={() => this.setDigit(1)}>1</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(2)}>2</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(3)}>3</CalcKey>

						<CalcKey calcKeyPress={() => this.resetCalc()}>AC</CalcKey>
						<CalcKey calcKeyPress={() => this.setDigit(0)}>0</CalcKey>
						<CalcKey calcKeyPress={() => this.insertDot()}>.</CalcKey>
					</div>
					<div className="keys_operations">
						<CalcKey className="key-subtract" calcKeyPress={() => this.makeOperation('-')}>−</CalcKey>
						<CalcKey className="key-add" calcKeyPress={() => this.makeOperation('+')}>+</CalcKey>
						<CalcKey className="key-equals" calcKeyPress={() => this.makeOperation('=')}>=</CalcKey>
					</div>
				</div>
			</div>
		)
	}

}

export default Calculator;