import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
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

  componentWillReceiveProps(nextProps){
    if(nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
     this.props.history.push('/dashboard');
    }
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

    
    this.props.registerUser(newUser, this.props.history);
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
        <div>
          {this.state.errors.name && <h3>{this.state.errors.name}</h3>}
        </div>
        <TextField
          id="email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="normal"
        />
        <div>
          {this.state.errors.email && <h3>{this.state.errors.email}</h3>}
        </div>
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={this.state.password}
          onChange={this.handleChange('password')}
          margin="normal"
        />
         <div>
            {this.state.errors.password && <h3>{this.state.errors.password}</h3>}
        </div>
        <TextField
          id="password2"
          label="Repear Password"
          value={this.state.password2}
          onChange={this.handleChange('password2')}
          margin="normal"
          type="password"
        />
        <div>
          {this.state.errors.password2 && <h3>{this.state.errors.password2}</h3>}
       </div>
        <Button variant="raised" color="primary" style={{maringRight: '20px'}} type="submit">
            Register
        </Button>
        </form>


      </div>
    )
  }
}

// RegisterComponent.PropTypes = {
//   registerUser: propTypes.func.isRequired,
//   auth: propTypes.object.isRequired,
//   errors: propTypes.object.isRequired
// }

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});


const mapDispatchToProps = (dispatch) => ({
  registerUser: (userData, history) => dispatch(registerUser(userData, history)),
});

export const Register = connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterComponent));

