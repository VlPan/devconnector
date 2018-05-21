import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component {
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
    console.log('Login');
  }

  render() {
    return (
      <div>
        <form noValidate autoComplete="off" style={{display:'flex', flexWrap: 'wrap'}} 
        onSubmit={this.onSubmit}>
        <TextField
          id="name"
          label="Name"
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
        />

        <TextField
          id="email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="normal"
        />

         <Button variant="raised" color="primary" style={{maringRight: '20px'}} type="submit">
            Login
        </Button>
        </form>


      </div>
    )
  }
}
export { Login }
