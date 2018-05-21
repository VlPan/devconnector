import { TEXT_DISPATCH } from "./type";

export const registerUser = (userData) => {
    return {
        type: TEXT_DISPATCH,
        payload: userData
    };
};