import React from 'react';
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import Icon from './icon';
import {Form, Input, FormGroup, Container, Label} from 'reactstrap';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {SingleDatePicker} from 'react-dates';

let data = [
  {'name': "Workout", 'data': {"2017-01-01": 5, "2017-01-02": 4}},
  {'name': "Call parents", 'data': {"2017-01-01": 5, "2017-01-02": 3}}
]
data = []
class Chartdraw extends React.Component {
    constructor(props) {
         super(props);

         this.state = {
             'dataingraph': {},
             date: null,
             focused: null
         }

    }

    componentDidMount() {
        console.log(document.getElementById("id_1"))

        fetch('/ccass/home')
        .then(response =>  response.json())
        .then(resData => {
            data = resData;
            console.log(resData)
            this.setState({'dataingraph': resData})
            })

    }

    Change_value = () => {


    }

    render() {
        return (
            <div>

                <Container>
          <Form>
            <FormGroup>
              <Label for="firstname">Name: </Label>
              <Input type="text" name="firstname" />
            </FormGroup>
            <FormGroup>
              <Label for="lastname">Last Name: </Label>
              <Input type="text" name="lastname" />
            </FormGroup>
            <FormGroup>
            <SingleDatePicker
                          // showClearDate={true}
                          customInputIcon={
                            <svg className="icon icon-small">
                              <Icon
                                icon="ICON_CALENDER"
                                className="icon icon-large"
                              />
                            </svg>
                          }
                          inputIconPosition="after"
                          small={true}
                          block={false}
                          numberOfMonths={1}
                          date={this.state.date}
                          onDateChange={date => this.handleDateChange(date)}
                          focused={this.state.focused}
                          onFocusChange={({ focused }) =>
                            this.setState({ focused })
                          }
                          openDirection="up"
                          hideKeyboardShortcutsPanel={true}
                        />
            </FormGroup>
          </Form>
        </Container>

                We will load graph here
                <LineChart data={data} />

                {data.map((object, i) => <LineChart data={[data[i]]} key={i} />)}

            </div>

        )

    }

}

export default Chartdraw;