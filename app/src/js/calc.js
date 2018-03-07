import React from 'react'
import ReactDOM from 'react-dom'
import PointTarget from 'react-point'

// define module - calculator display
class CalcDisplay extends React.Component {
  	render() {
		const { value } = this.props

		return (
			<div className="calculator-display">
				<span>{value}</span>
			</div>
		)
  	}
}

class CalcKey extends React.Component {
	render() {
		const { ...props } = this.props

		return (
			<PointTarget>
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
    	displayVal: '0'
  	};

	render() {
		const { displayVal } = this.state

		return (
			<div className="calculator">

		        <CalcDisplay value={displayVal}/>

		        <div className="calculator-keypad">
					<div className="keys_inputs">
						<CalcKey>7</CalcKey>
						<CalcKey>8</CalcKey>
						<CalcKey>9</CalcKey>

						<CalcKey>4</CalcKey>
						<CalcKey>5</CalcKey>
						<CalcKey>6</CalcKey>

						<CalcKey>1</CalcKey>
						<CalcKey>2</CalcKey>
						<CalcKey>3</CalcKey>

						<CalcKey className="key-clear">AC</CalcKey>
						<CalcKey>0</CalcKey>
						<CalcKey className="key-dot">.</CalcKey>
					</div>
					<div className="keys_operations">
						<CalcKey className="key-subtract">−</CalcKey>
						<CalcKey className="key-add">+</CalcKey>
						<CalcKey className="key-equals">=</CalcKey>
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
