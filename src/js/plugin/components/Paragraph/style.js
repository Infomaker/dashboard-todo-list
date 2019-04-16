import styled from 'styled-components'
import { GUI } from 'Dashboard';

const Paragraph = styled(GUI.Paragraph)`
    /* &.se-infomaker-gui-paragraph--strike-through {
        text-decoration: line-through;
    } */

   ${props => props.strikeThrough && `
        text-decoration: line-through;
   `} 
`

export {
    Paragraph
}   