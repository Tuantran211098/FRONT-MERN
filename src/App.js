import { Fragment, useEffect } from "react";
import "./App.css";
import "./output.css"
// import { Button, Space } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./redux/slides/productSlide";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage/HomePage";
// import OrderPages from "./pages/OrderPage/OrderPage";
import { routes } from "./routes";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { isJsonString } from "./ultils";
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import { resetUser, updateUser } from "./redux/slides/userSlide";
import Loading from "./LoadingComponent/Loading";
import { useState } from "react";
const App = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  // console.log('useruser',user);
  useEffect(() => {
    setIsLoading(true)
    const { decoded, storageData } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, [])
  const handleGetDetailsUser = async (id, token) => {
    const storageRefreshToken = localStorage.getItem('refresh_token')

    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    console.log('storageRefreshToken token', res);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }

  //checkToken expire
  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {

      storageData = JSON.parse(storageData)

      decoded = jwtDecode(storageData);
    }
    console.log('storageData', storageData, 'decoded', decoded);
    return { decoded, storageData }
  }
  UserService.axiosJWT.interceptors.request.use(async (config) => {
    console.log('interceptors', config);
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded, storageData } = handleDecoded()

    // console.log('data chua do',decoded,storageData);
    if (decoded?.exp < currentTime.getTime() / 1000) {
      const storageDataRefresh = localStorage.getItem('refresh_token')
      const refreshTokenJSON = JSON.parse(storageDataRefresh)
      const decodeRefresh = jwtDecode(refreshTokenJSON);
      if (decodeRefresh?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshTokenJSON)
        config.headers['token'] = `Bearer ${data?.access_token}`
      } else {
        dispatch(resetUser(0))
      }


      // config.headers['token'] = `Bearer ${data?.access_token}`
      // dispatch(updateUser({...data}))
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  return (
    <div>
      {/* <HeaderComponent /> */}
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route, i) => {
              const Page = route.page;
              // const isCheckAuth = !route.isPrivated || user.isAdmin
              const LayoutPage = route.isShowHeader ? HeaderComponent : Fragment;
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={
                    <>
                      <LayoutPage />
                      <Page />
                    </>
                  }
                />
              );
            })}
            {/* <Route path="/" element={<HomePage/>}/>
          <Route path="/order" element={<OrderPages/>}/> */}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
};

export default App;
