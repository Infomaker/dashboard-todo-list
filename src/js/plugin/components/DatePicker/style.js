import styled from 'styled-components'
import DatePicker from './DatePicker'

const DatePickerWithClearButton = styled(DatePicker)`  // Hur döpa saker?
    margin-left: 12px;
    margin-right: 12px;
    .react-datepicker__close-icon {
        top: 19px; // Hur fixar vi denna i dashboarden??
    }
`
export {
    DatePickerWithClearButton
}