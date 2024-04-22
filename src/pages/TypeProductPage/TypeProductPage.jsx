import { Col, Pagination, Row } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CardComponent from '../../components/CardComponent/CardComponent'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { WrapperNavbar, WrapperProducts } from './style'
import * as ProductService from '../../services/ProductService'
import Loading from '../../LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { useSelector } from 'react-redux'
const TypeProductPage = () => {
    const {state} = useLocation()
    const searchProduct = useSelector(state =>state?.product?.search)
    const searchDebounce = useDebounce(searchProduct,500)
    const  [ products, setProducts ] = useState([])
    const [ loading,setLoading] = useState(true)
    const [ paginate, setPaginate] = useState({
        page:0,
        limit:5,
        total:1
    })
    // console.log('location',location);    
    const fetchProductType = async (type,page,limit) =>{
      
            const res = await ProductService.getProductType(type,page,limit)
            console.log('fetchProductType',res,type);
            if(res?.status == 'OK'){
                setLoading(false)
               
                setProducts(res?.data)
                console.log('products',res);
                setPaginate({...paginate,total:res?.pageTotal})
                console.log('paginate',paginate);
            }
            else{
                setLoading(true)
            }
            
        }
    // useEffect(() => {
    //  let newProduct = []
    //  if(searchDebounce){
    //     console.log('searchDebounce',searchDebounce);
    //     newProduct = products?.filter((pro) =>  pro?.name.toLowerCase().includes(searchDebounce) )
    //     console.log('newProduct',newProduct);
    //     setProducts(newProduct)
    //  }
    // }, [searchDebounce])
    
    useEffect(()=>{
        console.log('run',paginate);
        if(state){
        fetchProductType(state,paginate.page,paginate.limit)
        }
    },[state,paginate.page,paginate.limit])
    console.log('loading',loading,products);
    const onChange = (current, pageSize) => {
        // console.log('Page: ');
        console.log('onChange',current, pageSize);
        setPaginate({
            ...paginate,
            page:current - 1,
            limit:2
        })
        console.log('paginate: ',paginate);
      };
      const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
      };
  return (
    <Loading isLoading={loading}>
    <div style={{padding:'0 120px', background:'#efefef'}}>
    <Row style={{flexWrap:'nowrap', paddingTop:'10px',height:'calc(100vh - 100px)'}}>   
        <WrapperNavbar span={4}>
            <NavbarComponent/>
        </WrapperNavbar>
        <Col span={20}>
            <WrapperProducts> 
            {
                products?.filter((pro)=>{
                    if(searchDebounce === ''){
                        return pro
                    }else if(pro?.name?.toLowerCase()?.includes(searchDebounce.toLowerCase())){
                        return pro
                    }
                })?.map((product)=>{
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
            <Pagination showQuickJumper defaultCurrent={paginate?.page + 1 } total={products.length} onChange={onChange} 
            style={{textAlign:'center',marginTop:'10px'}}/>
        </Col>
    </Row>
   
    </div>
    </Loading>
  )
}

export default TypeProductPage