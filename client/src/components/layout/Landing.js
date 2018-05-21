import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


class Landing extends Component {
  render() {
    return (
      <div>
        <h2>Landing!</h2>
        <Link to="/register" >
            <Button variant="raised" color="primary" style={{maringRight: '20px'}}>
                Register
            </Button>
        </Link>

        <Link to="/login">
            <Button variant="raised" color="primary">
                Login
            </Button>
        </Link>
      </div>
    )
  }
}

export { Landing }