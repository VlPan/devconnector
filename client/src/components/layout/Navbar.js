import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from './../../STORE/actions/authActions';



class NavbarComponent extends Component {


  onLogoutClick(e){
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul>
        <a href="" onClick={this.onLogoutClick.bind(this)}>
          <img src={user.avatar} alt={user.name} title="You must have a gravatar connected to your email" 
            style={{width: '25px', marginRight: '5px'}}
          />
          Logout 
        </a>
      </ul>  
    );

    const guestLinks = (
      <ul>
        <NavLink 
          to="/register"
          style={{ marginRight: '20px' }}
          activeStyle={{
            fontWeight: 'bold',
            color: 'red',
          }}
        >
            Register
        </NavLink>
        <NavLink 
        to="/login"
          activeStyle={{
            fontWeight: 'bold',
            color: 'red'
          }}>
            Login
        </NavLink>
      </ul>
    );

    return (
      <div>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
 
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
});


const Navbar = connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);

export { Navbar }
