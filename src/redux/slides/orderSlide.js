import { createSlice } from '@reduxjs/toolkit'



const initialState = {
    orderItems: [

    ],
    shippingAddress: {

    },
    orderItemSelected: [],
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: ''
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {

        // increment: (state) => {
        //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
        //   // doesn't actually mutate the state because it uses the Immer library,
        //   // which detects changes to a "draft state" and produces a brand new
        //   // immutable state based off those changes
        //   state.value += 1
        // },
        // decrement: (state) => {
        //   state.value -= 1
        // },
        addOrderProduct: (state, action) => {

            const { orderItems } = action.payload
            // console.log('addOrderProduct state, action', state);
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItems.product)
            // console.log('orderItem', orderItems);
            if (itemOrder) {
                itemOrder.amount += orderItems.amount
            } else {
                state.orderItems.push(orderItems)
            }
        },
        increaseAmount: (state, action) => {
            // console.log('increaseAmount stateaction',state, action);
            // console.log('increaseAmount stateaction', state, action);
            const { idProduct } = action.payload
            console.log('increaseAmount', state?.orderItems);
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount++
            if (itemOrderSelected) {
                itemOrderSelected.amount++
            }


        },
        decreaseAmount: (state, action) => {
            // console.log('decreaseAmount stateaction', state, action);
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product === idProduct)
            if (itemOrderSelected) {
                itemOrderSelected.amount--
            }

            itemOrder.amount--
        },
        removeOrderProduct: (state, action) => {
            // console.log('stateaction',state, action);
            const { idProduct } = action.payload
            // console.log('action.payload', action.payload);
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product !== idProduct)
            if (itemOrderSelected) {
                state.orderItemSelected = itemOrderSelected
            }
            state.orderItems = itemOrder

        },
        removeAllOrderProduct: (state, action) => {
            // console.log('stateaction',state, action);
            const { idProducts } = action.payload
            console.log('removeAllOrderProduct', state, action);
            const itemOrder = state?.orderItems?.filter((item) => !idProducts.includes(item?.product))
            const itemOrderSelected = state?.orderItemSelected?.filter((item) => !idProducts.includes(item?.product))
            state.orderItems = itemOrder
            if (itemOrderSelected) {
                state.orderItemSelected = itemOrderSelected
            }


        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload
            const orderSelected = []
            state.orderItems.forEach((items) => {
                if (listChecked.includes(items.product)) {
                    orderSelected.push(items)
                }
            })
            state.orderItemSelected = orderSelected
            // console.log('selectedOrder', state, action);
        }
    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseAmount, decreaseAmount, selectedOrder, removeOrderProduct, removeAllOrderProduct } = orderSlice.actions
export default orderSlice.reducer