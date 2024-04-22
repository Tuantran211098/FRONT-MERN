import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetailsPage = () => {
  const {id} = useParams()
  console.log('params',id);
  const navigate = useNavigate()
  return (
    <>
    <div style={{padding:'1px 120px',background:'#efefef', clear:'both', height:'1000px'}}>
        <h5 onClick={()=> navigate('/')}>Trang chủ</h5>
      
            <ProductDetailsComponent idProduct={id}/>
     
    </div>
    </>
  )
}

export default ProductDetailsPage