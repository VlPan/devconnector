import { setCurrentUser, getErrors } from "../../actions/authActions";
import { LOGIN_USER, GET_ERRORS, SET_CURRENT_USER } from "../../actions/type";
import setAuthToken from './../../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'; 
import axios from 'axios';
import { mergeMap } from "rxjs";
import 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { store } from "../../store";


export const authEpic = (action$, store) => {
    return action$.ofType(LOGIN_USER)
    .mergeMap( action => {
        return axios.post('/api/users/login', action.payload)})
        .map(res => {
            console.log(res);
            const { token } = res.data;
            // Set token to ls
            localStorage.setItem('jwtToken', token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get UserData
            const decoded = jwt_decode(token);
            // Set current user
            console.log('Here')

            return setCurrentUser(res);
            
        }).catch(err => {
            console.log(err);
            getErrors(err);
        })
    }


