/** @format */

import React from 'react'
import './title.css'
export default function App() {
  return (
    <div className="title">
      <Demo name="ddd" />
      afaffasdfsdfsdfasfasdfsdfasdffadsfsfasdffadsfafasdsdsfd1
    </div>
  )
}

interface Props {
  name: string
}
function Demo(props: Props) {
  return <div>{props.name}</div>
}
