import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({name, ...rests}) => {
  const navigate = useNavigate()
  const handleNavigatetype = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state:type })
    // navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})

  }
  return (
    <div onClick={() => handleNavigatetype(name)} >{name} </div>
  )
}

export default TypeProduct