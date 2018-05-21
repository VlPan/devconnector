import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {connect} from 'react-redux';
import { registerUser } from '../../../STORE/actions/authActions';
import './css.css'


class RegisterComponent extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.hundleSubmit = this.hundleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  hundleSubmit(e) {
    e.preventDefault();
    
    
    const newUser = {
      name: this.state.name,
      password: this.state.password,
      password2: this.state.password2,
      email: this.state.email
    }

    this.props.registerUser(newUser);
    axios.post('/api/users/register', newUser).then((res) => {
      console.log(res.data); 
    })
    .catch(err => this.setState({errors: err.response.data}));

    console.log(newUser)
  }

  render() {
    return (
      <div>
        <form noValidate autoComplete="off" style={{display:'flex', flexWrap: 'wrap'}} onSubmit={this.hundleSubmit}>
        <TextField
          id="name"
          label="Name"
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        {this.state.errors.name && <h3>{this.state.errors.name}</h3>}

        <TextField
          id="email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="normal"
        />
        {this.state.errors.email && <h3>{this.state.errors.email}</h3>}

        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={this.state.password}
          onChange={this.handleChange('password')}
          margin="normal"
        />
        {this.state.errors.password && <h3>{this.state.errors.password}</h3>}

        <TextField
          id="password2"
          label="Repear Password"
          value={this.state.password2}
          onChange={this.handleChange('password2')}
          margin="normal"
        />
      {this.state.errors.password2 && <h3>{this.state.errors.password2}</h3>}

        <Button variant="raised" color="primary" style={{maringRight: '20px'}} type="submit">
            Register
        </Button>
        </form>


      </div>
    )
  }
}

RegisterComponent.PropTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  auth: state.auth;
};

const mapDispatchToProps = (dispatch) => ({
  registerUser: () => dispatch(registerUser()),
});

export const Register = connect(null, mapDispatchToProps)(RegisterComponent);

