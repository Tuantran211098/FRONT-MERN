import TypeProduct from "../components/TypeProduct/TypeProduct";
import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrder from "../pages/DetailsOrderPage/DetailsOrder";
import HomePage from "../pages/HomePage/HomePage";
import MyOrder from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPay from "../pages/PaymentPay/PaymentPay";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInpage from "../pages/SignInPage/SignInpage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes =[
    {
        path:'/',
        page:HomePage,
        isShowHeader:true
    },
    {
        path:'/order',
        page:OrderPage,
        isShowHeader:true
    },
    {
        path:'/my-order',
        page:MyOrder,
        isShowHeader:true
    },
    {
        path:'/details-order/:id',
        page:DetailsOrder,
        isShowHeader:true
    },
    {
        path:'/PaymentPay',
        page: PaymentPay,
        isShowHeader:true
    },

    {
        path:'/orderSuccess',
        page: OrderSuccess,
        isShowHeader:true
    },
    {
        path:'/products',
        page:ProductsPage,
        isShowHeader:true
    },
    
    {
        path:'/product/:type',
        page: TypeProductPage,
        isShowHeader:true
    },
    {
        path:'/sign-in',
        page: SignInpage ,
        isShowHeader:false
    },
    {
        path:'/sign-up',
        page: SignUpPage,
        isShowHeader:false
    },
    {
        path:'/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader:true
    },
    {
        path:'/profile-user',
        page: ProfilePage,
        isShowHeader:true
    },
    {
        path:'/system/admin',
        page: AdminPage,
        isShowHeader:false,
        isPrivated:true
    },
    {
        path:'*',
        page:NotFoundPage,
        isShowHeader:false
    },
]