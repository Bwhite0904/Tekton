import axios from 'axios'
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from './serviceHelpers'

const endpoint = `${API_HOST_PREFIX}/api/admindata`

const getAdminData = (payload) => {
    const config =
    {
        method: 'POST',
        url: endpoint,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    };
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
}

const adminDataService = { getAdminData }
 
export default adminDataService;