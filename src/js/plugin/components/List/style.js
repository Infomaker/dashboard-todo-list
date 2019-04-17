import styled from 'styled-components'
import { GUI } from "Dashboard";

const List = styled(GUI.List)`
    
    padding-top: 24px;
    margin-bottom: 30px;
    border-bottom: solid 2px #eee;
    overflow: visible;
    .se-infomaker-gui-list-item {
        &:hover {
            box-shadow: inset 0 0 0 1px #ccc;
        }
        &:nth-child(odd) {
            background-color: #eee;
        }

        .se-infomaker-gui-list-item__list-item-content {
            overflow: visible;
        }
    }
`

const WidgetList = styled(GUI.List)`
    
    min-width: 250px;  /* För att widgeten inte ska renderas fel.. */
    
    .se-infomaker-gui-list-item {
        padding: 8px;
    }
`

export {
    List,
    WidgetList
}