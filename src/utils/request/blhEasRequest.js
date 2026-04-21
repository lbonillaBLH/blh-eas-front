import axios from "axios";
import { getLocalStorage, removeLocalStorage } from "../browserStorage/browserStorage";

const getAuthToken = ()=>{
    const token = getLocalStorage("auth-token");
    //@todo, validate token vality
    return token;
};

const blhEasRequest = ({ withToken })=>{
    const token = withToken && getAuthToken();
    const blhAxiosClient = axios.create({
        baseURL: process.env.REACT_APP_BLH_EAS_API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        },
        responseType: 'json', 
    });

    blhAxiosClient.interceptors.response.use(function(response){
        return response;
    }, function (error){
        if(error.response.status == 401){
            window.location.href = "/?_="+new Date().getTime();
        };
        return Promise.reject(error);
    });

    return blhAxiosClient;
}

const getUrlViewFiel = async (fileId) => {
    try{
        const response = await blhEasRequest({ withToken: true }).get(`api/file/get-url/${fileId}`);
        return response.data;
    }catch(error){
        console.error(error); 
    }
};

const fetchCountries = async ()=>{
    try{
        const response = await blhEasRequest({ withToken: true }).get("/api/country/list");
        return response;
    }catch(error){
        console.log(error);
    }
};

const fetchPermissionsCountries = async ()=>{
    try{
        const response = await blhEasRequest({ withToken: true }).get("/api/country/list-country-by-role");
        return response;
    }catch(error){
        console.log(error);
    }
};

const fetchStatus = async ()=>{
    try{
        const response = await blhEasRequest({ withToken: true }).get("/api/status/list");
        return response;
    }catch(error){
        console.log(error);
    }
};

export { getUrlViewFiel, fetchCountries, fetchStatus, fetchPermissionsCountries };

export default blhEasRequest;