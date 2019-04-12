import styled from 'styled-components'
import { GUI } from "Dashboard";

const CustomWrapper = styled(GUI.Wrapper)`
    background-color: cornflowerblue;
`

const ComponentButton = styled(GUI.Button)`
    margin-right: 50px;
    margin-top:20px;
`

export {
    CustomWrapper,
    ComponentButton
}