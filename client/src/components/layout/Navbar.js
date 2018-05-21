import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';


class Navbar extends Component {
  render() {
    return (
      <div>
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
      </div>
    )
  }
}

export { Navbar }
