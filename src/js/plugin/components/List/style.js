import styled from 'styled-components'
import { GUI } from "Dashboard";

const List = styled(GUI.List)`
    padding-top: 10px;
    margin-bottom: 30px;
    border-bottom: solid 2px #eee;
    .se-infomaker-gui-list-item {
        &:hover {
            box-shadow: inset 0 0 0 1px #ccc;
        }
        &:nth-child(odd) {
            background-color: #eee;
        }
    }
`

export {
    List
}