import { GET_ERRORS, SET_CURRENT_USER, LOGIN_USER } from "./type";
import axios from 'axios';
import setAuthToken from './../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'; 


export const registerUser = (userData, history) => dispatch => {
   
    axios
        .post('/api/users/register', userData)
        .then((res) => history.push('/login'))
        .catch(err => {
            dispatch({ 
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
};

export const loginUser = (userData) => {
    return {
        type: LOGIN_USER,
        payload: userData
    }
};

// Set Logged in User
export const setCurrentUser = (decoded) => (
    {
        type: SET_CURRENT_USER,
        payload: decoded
    }
);

export const getErrors = (errors) => {
    return {
        type: GET_ERRORS,
        payload: errors
    }
}



export const logoutUser = () => dispatch => {
     localStorage.removeItem('jwtToken');
     setAuthToken(false);
     dispatch(setCurrentUser({}))
}