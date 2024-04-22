import { styled } from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display:flex;
    align-items:center;
    gap:24px;
    justify-content:flex-start;
    border-bottom:1px solid red;
    height:44px
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover{
        color:#fff!important;
        background:rgb(13,92,182);
        span{
             color:#fff;
        }
    }
    cursor: ${props=>props.disabled ? 'not-allowed' : 'pointer'}
`
export const WrapperProducts = styled.div`
 display:flex;
 justify-content:center;
 gap:15px;
 margin-top:10px;
 flex-wrap:wrap;
`
