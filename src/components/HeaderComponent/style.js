import { Row } from "antd";
import { styled } from "styled-components";

export const WrapperHeader = styled(Row)`
    padding:20px 120px;
    background-color:rgb(26,148,255);
    align-items:center;

    flex-wrap:nowrap
`
export const WrapperTextHeader = styled.span`
    font-size:1rem;
    color:#fff;
    font-weight:bold;
    text-align:left
`
export const WrapperHeaderAccount = styled.div`
    display:flex;
    align-items:center;
    color:#fff;
    gap:10px;
`
export const WrapperTextHeaderSmall = styled.span`
    font-size:12px;
    color:#fff;
    white-space:nowrap
`
export const WrapperIcon = styled.span`
    font-size:30px;
    color:#fff;
`