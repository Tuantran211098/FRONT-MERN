import axios from "axios"
import { axiosJWT } from "./UserService";


export const createOrder = async (access_token, data) => {
    console.log('createOrder', access_token, data);
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    console.log('FE createOrder', res);
    return res.data
}

export const getOrderDetails = async (id, access_token) => {
    console.log('getOrderDetails', id, access_token);
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    // console.log('FE createOrder', res);
    return res.data
}
export const getOrderDetailItems = async (id, access_token) => {
    console.log('getOrderDetailItems', id, access_token);
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details-items/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    console.log('FE createOrder', res);
    return res.data
}
export const cancelProductDetails = async (id, access_token, data) => {
    console.log('cancelProductDetails FE', id, access_token, data);
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, { data: data }, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    console.log('FE createOrder', res);
    return res.data
}
export const getAllOrderAdmin = async (access_token) => {
    console.log('getAllOrderAdmin', access_token);
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}
