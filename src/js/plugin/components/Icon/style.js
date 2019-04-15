import styled from 'styled-components'
import { GUI } from "Dashboard";

const Icon = styled(GUI.Icon)`
    padding-left: 0;
    /* padding-top: 0; */
    /* margin-bottom: 14px; */
    display: inline-block;
    .se-infomaker-gui-icon__icon {
        display: inline-block;
        top: 5px;
        left: 7px;
        display: inline-block;
        position: absolute;
        
    }
    .se-infomaker-gui-icon-text {
        font-weight: 400;
        padding-left: 25px;
    }
`

export {
    Icon
}