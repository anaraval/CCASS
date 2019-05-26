import React from 'react';
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick';
import Chart from 'chart.js';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import Alert from 'react-bootstrap/Alert.js'

import {
  Button,
} from 'react-bootstrap';

let data = [
  {'name': "Workout", 'data': {"2017-01-01": 5, "2017-01-02": 4}},
  {'name': "Call parents", 'data': {"2017-01-01": 5, "2017-01-02": 3}}
]
data = []
let min_max = {}
class Chartdraw extends React.Component {
    constructor(props) {
         super(props);

         this.handleApply = this.handleApply.bind(this);
         this.handleStockTicker = this.handleStockTicker.bind(this);
         this.handleGraphData = this.handleGraphData.bind(this);

         this.state = {
             'dataingraph': {},
             startDate: moment().subtract(29, 'days'),
             endDate: moment(),
             ranges: {
                 'Today': [moment(), moment()],
                 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                 'This Month': [moment().startOf('month'), moment().endOf('month')],
                 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
             },
             stockTicker: '',
             fetchProgress: 'fetching of data from CCASS website yet not started',
         }

    }

    componentDidMount() {
        console.log('inside componentdidmount')
        console.log(this.state.startDate)
        console.log(this.state.endDate)



    }

    handleApply(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
    console.log(this.state.startDate.format('YYYY/MM/DD'))
    console.log(this.state.endDate.format('YYYY/MM/DD'))
  }

  handleStockTicker(event) {
      console.log(event)
      this.setState({stockTicker: event.target.value})
  }

  handleGraphData(event){
      this.setState({fetchProgress: 'Starting the fetching of data from CCASS website. Please wait!'})
      data = []
      fetch('/ccass/home', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
              'startDate': this.state.startDate.format('YYYY/MM/DD'),
              'endDate': this.state.endDate.format('YYYY/MM/DD'),
              'stockTicker': this.state.stockTicker
          })
      })
        .then(response =>  {
            if (response.ok) {
                response.json().then(resData => {
                this.setState({fetchProgress: 'Fetching of data completed. Please check graph below'})
                data = resData;
                console.log('in data');
                console.log(data);

                for (const data_company of resData) {
                    let company_name = data_company.name;
                    min_max[company_name] = {min: 0, max: 0}
                    var array1 = Object.values(data_company.data)
                    const max_value = Math.max(...array1)
                    const min_value = Math.min(...array1)
                    min_max[company_name].min = min_value
                    min_max[company_name].max = max_value
                }
                this.setState({'dataingraph': resData})
                }
                )
            }
            else {
                console.log('Something went wrong');
                this.setState({fetchProgress: 'Sorry! There is some issue in fetching the data'})
            }
            }
        )

  }

    //{data.map((object, i) =>
    //                <LineChart data={[data[6]]} min={144000} max={150000} key={i} />)
    //            }

    //<span className="input-group-btn">
    //                <Button className="default date-range-toggle">
    //                  <i className="fa fa-calendar"/>
    //                </Button>
    //            </span>

    //<LineChart data={[data[i]]} min={min_max[object.name].min} max={min_max[object.name].max} key={i} />

    //                   <Button className="default date-range-toggle">Pick your dates
    //                  <i className="fa fa-calendar"/>
    //                </Button>

    render() {
        let start = this.state.startDate.format('YYYY/MM/DD');
        let end = this.state.endDate.format('YYYY/MM/DD');
        let label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }

        return (
            <div>
                <Alert variant="success">Shareholding Of Banks</Alert>
                <div className="col-md-4">
                <label>Stock Ticker: </label>
                <input type="text" className="form-control" onChange={this.handleStockTicker} name="stockTicker"/>
                {this.state.stockTicker === '' && <label class="text-danger">Please enter stockTicker value</label>}
                </div>
        <div className="col-md-4">
          <label>Pick your dates: </label>
          <DatetimeRangePicker
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onApply={this.handleApply}
          >

            <div className="input-group">

              <input type="text" className="form-control" value={label}/>
              <span className="input-group-btn">

                </span>
            </div>
          </DatetimeRangePicker>
        </div>
        <br></br>
        <Button className="default date-range-toggle" onClick={this.handleGraphData} disabled={this.state.stockTicker == ''}>Generate graph</Button>

        <Alert variant='info'>
            {this.state.fetchProgress}
        </Alert>
                {data.map((object, i) => {
                    return([
                        <LineChart data={[data[i]]} key={i} ></LineChart>,
                        <Alert variant="secondary"></Alert>
                        ]
                        );
                    }
                    )
                }



            </div>

        )

    }

}

export default Chartdraw;