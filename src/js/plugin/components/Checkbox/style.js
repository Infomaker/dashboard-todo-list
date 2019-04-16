import styled from 'styled-components'
import { GUI } from 'Dashboard';

const WidgetCheckbox = styled(GUI.Checkbox)`
    &.se-infomaker-gui-checkbox--strike-through {
        text-decoration: line-through;
    }
    
    .se-infomaker-gui-checkbox-label {  /* Ska man gå på klassen här? (För att hitta underliggande label) */
        max-width: 90%;
        white-space: normal;
    }
`

export {
    WidgetCheckbox
}   