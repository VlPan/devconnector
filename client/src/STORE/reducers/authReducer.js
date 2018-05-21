import { TEXT_DISPATCH } from "../actions/type";


const initalState = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initalState, action ) {
    switch(action.type) {
        case TEXT_DISPATCH:
        return {
            ...state,
            user: action.payload
        }
        default: 
            return state
    }
}