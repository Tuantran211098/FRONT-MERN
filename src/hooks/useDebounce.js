import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import * as  UserService from "../services/UserService"

export const useDebounce = (value,delay) =>{
  const [valueDebounce, setValueDebounce] = useState('')
  useEffect(()=>{
    const handle = setTimeout(() => {
      console.log('debounce');
      setValueDebounce(value)
    }, delay);
    return ()=>{
      clearTimeout(handle)
    }
  },[value])
 return valueDebounce
   
}