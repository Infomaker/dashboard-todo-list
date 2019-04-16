
import { GUI, moment } from 'Dashboard'
import { Component } from 'react'

class DatePicker extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            dateTime: null
        }
    }

    onBlur() {
        const { dateTime } = this.state;
        
        this.handleChangedValue(dateTime);
    }

    onChange(value) {
        
        this.setState({
            dateTime: value
        })

        if (value === null) { // Handles clear button
            this.handleChangedValue(value)
        }
    }

    handleChangedValue(value) {
        const { onChangedValue } = this.props;
        
        if (onChangedValue) {
            onChangedValue(value);
        }
    }
    
    render() {
        const props = this.props;

        return (
            <GUI.DatePicker
                {...props}
                onBlur={() => this.onBlur()}
                onChange={value => this.onChange(value)}
                showTimeSelect
                timeFormat={"HH:mm"}
                minDate={moment()}
                maxDate={moment().add("2", "years")}
                showDisabledMonthNavigation
                isClearable={true}
                dateFormat={"YYYY-MM-DD HH:mm"}
                placeholderText={"Remind me (optional)"}
            />
        )
    }
}

export default DatePicker