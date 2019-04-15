import styled from 'styled-components'
import { GUI } from "Dashboard";

const DatePickerWithClearButton = styled(GUI.DatePicker)`  // Hur döpa saker?
    margin-left: 12px;
    margin-right: 12px;
    .react-datepicker__close-icon {
        top: 19px; // Hur fixar vi denna i dashboarden??
    }
`


export {
    DatePickerWithClearButton
}