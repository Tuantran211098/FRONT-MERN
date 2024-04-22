import React from 'react'

const CommentCpomponent = (props) => {
  const {dataHref,width} = props
  console.log('CommentCpomponent',dataHref,window.location.href);
  return (
    <div class="fb-comments" data-href={dataHref} data-width={width} data-numposts="5"></div>
  )
}

export default CommentCpomponent