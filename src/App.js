import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';
import StudentsContextProvider from './contexts/StudentsContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#222',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <StudentsContextProvider>
          <div className="App">
            <Header />
            <Main />
            <Footer />
          </div>
        </StudentsContextProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
