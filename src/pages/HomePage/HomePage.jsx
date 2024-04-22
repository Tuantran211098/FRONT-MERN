import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { decrement, increment } from "../../redux/slides/productSlide";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import sliderimage1 from '../../assets/images/sliderimage1.png'
import sliderimage2 from '../../assets/images/sliderimage2.png'
import sliderimage3 from '../../assets/images/sliderimage3.png'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import * as ProductService from '../../services/ProductService'
import { TrophyOutlined } from "@ant-design/icons";
import Loading from "../../LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
const HomePage = () => {
  // const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const arr = ['TV', 'TU LẠNH', 'LAPTOP']
  const searchProduct = useSelector(state =>state?.product?.search)
  const searchDebounce = useDebounce(searchProduct,500)
  const refSearch = useRef()
  const [stateProduct, setStateProduct] = useState([])
  const [limit,setLimit] = useState(4)
  const [loading,setLoading] = useState(false)  
  const [disable,setDisable] = useState(false)
  const [typeProduct, setTypeProduct] = useState([])
  const fetchProductAll = async (context) =>{
    console.log('context',context);
   const search = context.queryKey && context.queryKey[2]
   const limit = context.queryKey && context.queryKey[1]
    const res = await ProductService.getAllProduct(search,limit)

    if(res?.pageTotal == 1){
      console.log('setDisable');
      setDisable(true)
    }
    console.log('fetchProductAll result',res);
    // if(search?.length > 0 || refSearch.current){
    //   // console.log('right search',res,refSearch.current);
    //   setStateProduct(res?.data)
    //   return []
    // }
    // else{
    //   // console.log('right',res);
    //   // setStateProduct(res)
    //   return res
  // } 
    return res
  
  }
  // useEffect(()=>{
  //   if(refSearch.current){
  //     setLoading(true)
  //     // console.log('dodo');
  //     fetchProductAll(searchDebounce)

  //   }
  //   setLoading(false)
  //   refSearch.current = true
  // },[searchDebounce])
  
  
  const { isLoading,data: products,isPreviousData} = useQuery(['products',limit,searchDebounce],fetchProductAll,{keepPreviousData:true,isFetchedAfterMount:true})
  // console.log('products',products);
  // useEffect(()=>{ 
  //   if(products?.data?.length >0){
  //     setStateProduct(products?.data)
  //   }
  // },[products])
  console.log('isPreviousData',isPreviousData,products);
  const fetchAllTypeProduct = async () =>{
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProduct(res?.data)
    }
    // console.log('fetchAllTypeProduct',res);
    return res
  }
  useEffect(()=>{
    fetchAllTypeProduct()
  },[])
  return (
    <>
    <Loading isLoading={loading || isLoading}>
    <div style={{padding:'0 120px'}}>
      
      <WrapperTypeProduct>
      {typeProduct.map((item) => {
        return(
          <TypeProduct name={item} key={item}/>
        )
      })}
      </WrapperTypeProduct>
      </div>
      <div>
      <div id="container" style={{backgroundColor:'#efefef',padding:'0 120px'}}>
        {/* <SliderComponent arrImages={[sliderimage1,sliderimage2,sliderimage3]} /> */}
        <WrapperProducts>
          {/* <CardComponent/>
          <CardComponent/>
          <CardComponent/>
          <CardComponent/>
          <CardComponent/>  
          <CardComponent/>
          <CardComponent/> */}
          {
        
        products?.data?.map((product)=>{
          // console.log('map stateProduct',stateProduct);
              return(
                // console.log('product',product);
                <CardComponent 
                key={product._id} 
                // data={product}
                discount={product.discount}
                selled={product.selled}
                countIntock={product.countIntock} 
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                id={product._id}
                />
                )
          })
        }
        </WrapperProducts>
       <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent: 'center', marginTop:'10px'}}>
          <WrapperButtonMore   textButton={ products?.total === products?.data?.length ? 'Đã xem hết sản phẩm' :"Xem Thêm"} type="outline" styleButton={{
            //  disabled:{products?.total === products?.data?.length}
              border: '1px solid rgb(10, 104, 255)',
              color: products?.total === products?.data?.length ? 'white' : 'rgb(10, 104, 255)',
              width: '240px',
             
              display: 'inline-block',
              textAlign: 'center',
            }} 
           disabled={products?.total == products?.data?.length || products?.pageTotal < 2 }
            // cursonPointerMore={disable && ''}  
            styleTextButton={{fontWeight:500}}
            onClick={()=> {
              if(products?.total == products?.data?.length || products?.pageTotal < 2){
                return false
              }
              else{
                setLimit(prev => prev + 4)
              }
            }}
            />
        </div>
        {/* <NavbarComponent/> */}
      </div>

    </div>
    </Loading>
    </>
  );
};

export default HomePage;
