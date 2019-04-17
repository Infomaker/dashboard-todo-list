import styled from 'styled-components'
import { GUI } from "Dashboard";

const CustomWrapper = styled(GUI.Wrapper)`
    background-color: cornflowerblue;
`

const ComponentButton = styled(GUI.Button)`
    width: 45%;
    margin-bottom: 10px;
    button {
        width: 100%;
    }
`

export {
    CustomWrapper,
    ComponentButton
}