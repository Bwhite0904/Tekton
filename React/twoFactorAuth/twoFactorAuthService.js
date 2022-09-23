import axios from "axios";
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from "./serviceHelpers";

const twoFactorAuth = API_HOST_PREFIX + '/api/twofactorauth';

const getAuthCode = (payload) => {
    const config =
    {
        method: "PUT",
        url: twoFactorAuth,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const verifyAuthCode = (payload) => {
    const config =
    {
        method: "POST",
        url: twoFactorAuth,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
 
export { getAuthCode, verifyAuthCode }