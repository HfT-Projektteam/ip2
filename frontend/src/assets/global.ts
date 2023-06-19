import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
   body {
       font-family: 'Open Sans', sans-serif; 
   }
   
   body::-webkit-scrollbar{
    display: none;
  }
   
`
export default GlobalStyle
