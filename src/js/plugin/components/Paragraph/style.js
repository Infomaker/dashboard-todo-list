import styled from 'styled-components'
import { GUI } from 'Dashboard';

const Paragraph = styled(GUI.Paragraph)`
    
   ${props => props.strikeThrough && `
        text-decoration: line-through;
   `} 
`

export {
    Paragraph
}   