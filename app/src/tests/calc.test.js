import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
Enzyme.configure({ adapter: new Adapter() });

import Calculator from '../js/components/Calculator/Calculator.js'


describe('<Calculator />', () => {
    const calc = shallow(<Calculator />).render();
    const calc_inst = shallow(<Calculator />).instance();
    
    const keys_inputs = calc.find('div.keys_inputs');
    const keys_operations = calc.find('div.keys_operations');
    
    // console.log(calc.html()) 
    
    it('renders display and keypad elements', () => {
        expect(calc.find('div.calculator-display').length).toEqual(1);
        expect(calc.find('div.calculator-display span').length).toEqual(1);
        expect(calc.find('div.calculator-keypad').length).toEqual(1);

        expect(keys_inputs.length).toEqual(1);
        expect(keys_operations.length).toEqual(1);
    });

    it('renders input buttons (length === 12) ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "AC"]', () => {
        expect(keys_inputs.find('button').length).toEqual(12);
    });

    it('renders operation buttons (length === 3) ["+", "-", "="]', () => {
        expect(keys_operations.find('button').length).toEqual(3);
    });
    
    it('renders reactDOM without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Calculator/>, div);
    });

    it('test calculator add action // 2.3 + 2.4 = 4.7', () => {
        calc_inst.setDigit(2)
        calc_inst.insertDot()
        calc_inst.setDigit(3)
        calc_inst.makeOperation('+')
        calc_inst.setDigit(2)
        calc_inst.insertDot()
        calc_inst.setDigit(4)
        calc_inst.makeOperation('=')

        expect(calc_inst.state.displayVal).toEqual('4.7')
        expect(calc_inst.state.afterOperation).toEqual(true)
        expect(calc_inst.state.value).toEqual(4.7)
        expect(calc_inst.state.operator).toEqual('=')
    })

    it('test calculator substract action // .9 - 0.3 = 0.6', () => {
        calc_inst.insertDot()
        calc_inst.setDigit(9)
        calc_inst.makeOperation('-')
        calc_inst.setDigit(0)
        calc_inst.insertDot()
        calc_inst.setDigit(3)
        calc_inst.makeOperation('=')

        expect(calc_inst.state.displayVal).toEqual('0.6')
        expect(calc_inst.state.afterOperation).toEqual(true)
        expect(calc_inst.state.value).toEqual(0.6)
        expect(calc_inst.state.operator).toEqual('=')
    })

    it('test button reset state', () => {
        calc_inst.resetCalc()
        
        expect(calc_inst.state.displayVal).toEqual('0')
        expect(calc_inst.state.afterOperation).toEqual(false)
        expect(calc_inst.state.value).toEqual(null)
        expect(calc_inst.state.operator).toEqual(null)
    })
})