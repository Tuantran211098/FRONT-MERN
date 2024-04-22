import React from 'react'

const LikeButton = (props) => {
  const {dataHref} = props
  console.log('dataHref',dataHref,window.location.href);
  return (
    <div class="fb-like" data-href={dataHref} data-width="" data-layout="" data-action="" data-size="" data-share="true"></div>
  )
}

export default LikeButton