import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick';
import Chart from 'chart.js';
import Chartdraw from './Chartdraw.js';
import DateRangePicker from './datepicker.js'

let data = [];
class App extends React.Component {


render() {
  return (
    <div className="App">

     <Chartdraw />

    </div>
  );
  }
}

export default App;
