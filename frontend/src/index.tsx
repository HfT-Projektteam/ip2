import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import GlobalStyle from 'assets/global'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from '@context/AuthProvider'
import ThemeProvider from '@context/ThemeProvider'

const MobileWrapper = styled.div`
  @media (min-width: 768px) {
    display: flex;
    justify-content: center;
  }
`
const MobileContainer = styled.div`
  @media (min-width: 768px) {
    max-width: 500px;
  }
`

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <MobileWrapper>
      <MobileContainer>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </MobileContainer>
    </MobileWrapper>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
void reportWebVitals()
