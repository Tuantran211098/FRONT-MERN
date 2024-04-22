import axios from "axios";


export const getConfig = async (access_token, data) => {
    // console.log('createOrder', access_token, data);
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`)
    // console.log('FE createOrder', res);
    return res.data
}

