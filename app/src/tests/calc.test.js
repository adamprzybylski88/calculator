import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
Enzyme.configure({ adapter: new Adapter() });

import Calculator from '../js/components/Calculator/Calculator.js'

// import ShallowRenderer from 'react-test-renderer/shallow';
// const renderer = new ShallowRenderer();
// renderer.render(<Calculator />);
// const result = renderer.getRenderOutput();

describe('<Calculator />', () => {
    const calc = shallow(<Calculator />);

    const keys_inputs = calc.find('div.keys_inputs');
    const keys_operations = calc.find('div.keys_operations');

    it('renders main elements', () => {
        expect(calc.render().find('div.calculator-display').length).toEqual(1);
        expect(calc.find('div.calculator-keypad').length).toEqual(1);

        expect(keys_inputs.length).toEqual(1);
        expect(keys_operations.length).toEqual(1);
    });

    it('renders buttons', () => {
        expect(keys_inputs.render().find('button').length).toEqual(12);
        expect(keys_operations.render().find('button').length).toEqual(3);
    });
    
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Calculator/>, div);
    });
})