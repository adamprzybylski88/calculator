import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import Calculator from '../js/components/Calculator/Calculator.js'

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Calculator/>, div);
    // let component = shallow(<Calculator />);
    // component
});