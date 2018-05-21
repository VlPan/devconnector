import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import  PropTypes  from "prop-types";
import  {connect } from 'react-redux';
import {loginUser} from './../../../STORE/actions/authActions';


class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {

      email: '',
      password: '',
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.hundleSubmit = this.hundleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

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
    
    const user = {
      email: this.state.email,
      password: this.state.password
    }
    console.log(user);
    this.props.loginUser(user);
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <form noValidate autoComplete="off" style={{display:'flex', flexWrap: 'wrap'}} 
        onSubmit={this.hundleSubmit}>
        <TextField
          id="password"
          label="Password"
          value={this.state.password}
          onChange={this.handleChange('password')}
          type="password"
          margin="normal"
        />
        {errors.password && <h2>{errors.password}</h2>}

        <TextField
          id="email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="normal"
        />
        {errors.email && <h2>{errors.email}</h2>}
         <Button variant="raised" color="primary" style={{maringRight: '20px'}} type="submit">
            Login
        </Button>
        </form>


      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

// LoginComponent.propTypes = {
//   loginUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired
// }

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user) => dispatch(loginUser(user)),
});


const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export { Login }
