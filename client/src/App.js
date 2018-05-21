import React, { Component } from 'react';
import './App.css'; 
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import { Footer, Navbar, Landing } from './components/layout';
import { Register, Login } from './components/register/auth';
import { Provider } from 'react-redux';
import { store } from './STORE/store'; 


class App extends Component {
  
  render() {

    return (
      <Provider store={ store }> 
        <Router> 
          <div className="App">
            <Navbar />
              <Route exact path="/"
                render={(props) =>
                    <Landing {...props} />
                }
              />
              <div className="container">

              <Route exact path="/register"
                render={(props) =>
                    <Register {...props} />
                }
              />

              <Route exact path="/login"
                render={(props) =>
                    <Login {...props} />
                }
              />

              </div>
            <Footer/>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
