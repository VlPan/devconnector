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
import  jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './STORE/actions/authActions';
import 'rxjs';



if(localStorage.jwtToken){
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded)); 

  // Check if expired
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser); 
    window.location.href = '/login'
  }
}

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
