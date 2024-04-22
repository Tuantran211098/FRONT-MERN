import { orderConstant } from "./orderConstant";

export const isJsonString = (data) => {
  try {
    JSON.parse(data)
  } catch (error) {
    return false
  }
  return true
}
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
export const renderOption = (arr) => {
  // console.log('renderOption',arr);
  let result = []
  if (arr) {
    result = arr.map((opt) => {
      return {
        value: opt,
        label: opt
      }
    })
  }
  result.push({
    value: 'add_type',
    label: 'Thêm type',

  })
  // console.log('result',result);
  return result

}
export const convertPrice = (price) => {
  try {
    const result = price?.toLocaleString().replaceAll(',', '.')
    return `${result} VND`
  } catch (error) {
    return null
  }
}

export const initFacebookSdk = () => {
  if (window.FB) {
    window.FB.XFBML.parse()
  }
  let locale = "vi_VN"
  // wait for facebook sdk to initialize before starting the react app
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.REACT_APP_FE_ID,
      cookie: true,
      xfbml: true,
      version: 'v8.6'
    });

    // auto authenticate with the api if already logged in with facebook
    // window.FB.getLoginStatus(({ authResponse }) => {
    //   if (authResponse) {
    //     accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
    //   } else {
    //     resolve();
    //   }
    // });
  };

  // load facebook sdk script
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = `https://connect.facebook.net/${locale}/sdk.js`;
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

}
export const convertDataChart = (data, type) => {
  // try {
  //   const result = price?.toLocaleString().replaceAll(',', '.')
  //   return `${result} VND`
  // } catch (error) {
  //   return null
  // }
  try {
    const object = []
    console.log('object tren', object);
    data && data.forEach((opt) => {
      console.log('object giua', object, opt);
      if (!object[opt.paymentMethod]) {
        console.log('object chua', object);
        object[opt.paymentMethod] = 1

      } else {
        console.log('object roi', object);
        object[opt.paymentMethod]++
      }
    });
    console.log('object duoi', object);
    const loopData = []
    console.log('object array', Object.keys(object));
    const results = Array.isArray(Object.keys(object) && Object.keys(object).map((item) => {
      console.log('item', item, orderConstant.payment[item], object[item]);
      // return {
      //   name: `${orderConstant.payment[item]}`,
      //   value: object[item]
      // }
      loopData.push({ name: orderConstant.payment[item], value: object[item] })
    }))
    console.log('loopData', loopData);
    return loopData

  } catch (error) {
    console.log('error', error);
  }

}
