import axios from "axios";

const blhCurrencyRequest = ()=>{
    const blhAxiosClient = axios.create({
        baseURL: process.env.REACT_APP_BLH_CURRENCY_API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        responseType: 'json', 
    });

    return blhAxiosClient;
}

const getCurrentExchange = async()=>{
    const currencies = await blhCurrencyRequest().get("/currency/current");
    return currencies;
};

const getExchangeByDate = async(date)=>{
    const currencies = await blhCurrencyRequest().get(`/currency/by-date/${date}`);
    return currencies;
};

export { getCurrentExchange, getExchangeByDate };

export default blhCurrencyRequest;