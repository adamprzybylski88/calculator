import React from 'react'
import ReactDOM from 'react-dom'
import PointTarget from 'react-point'

// define calculator display
class CalcDisplay extends React.Component {
	render() {
		const { value } = this.props

		let formattedValue = parseFloat(value);

		console.log(formattedValue);

	    return (
			<div className="calculator-display">
				<span>{formattedValue}</span>
			</div>
	    )
	}
}

// define all calculator keys
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

	// reset calculator
	resetCalc() {
		this.setState({
			displayVal: '0',
			afterOperation: false,
			value: null,
			operator: null
		})
	}

	//
	setDigit(digit) {
		const { displayVal, afterOperation } = this.state

		console.log(displayVal, afterOperation)

			if (afterOperation) {
			this.setState({
				displayVal	: String(digit),
				afterOperation: false
			})
		} else {
			this.setState({
				displayVal: displayVal === '0' ? String(digit) : displayVal + digit
			})
		}
	}

	//
	insertDot() {
		const { displayVal } = this.state

		if (!(/\./).test(displayVal)) {
			this.setState({
				displayVal: displayVal + '.'
			})
		}
	}

	//
	makeOperation(_operator) {

		const operations = {
		    '+': (prevValue, nextValue) => prevValue + nextValue,
		    '-': (prevValue, nextValue) => prevValue - nextValue,
		    '=': (prevValue, nextValue) => nextValue
		}

		const { value, displayVal, operator } = this.state
		const inputValue = parseFloat(displayVal)

		// console.log(value, operator)

		if (value == null) {
			this.setState({
				value: inputValue
			})
		} else if (operator) {
			const currentValue = value || 0
			const newValue = operations[operator](currentValue, inputValue)

			this.setState({
				value: newValue,
				displayVal: String(newValue)
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


const app = document.getElementById('app')
ReactDOM.render(
	<Calculator/>,app
)
