/** @format */

import React,{useEffect} from 'react'
import {extend, useThree, useFrame} from 'react-three-fiber'
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls'
import * as THREE from 'three'

// extend THREE to include TrackballControls
extend({TrackballControls})

// key code constants
const ALT_KEY = 18
const CTRL_KEY = 17
const CMD_KEY = 91

const Controls = (props) => {
  const controls = React.useRef()
  const {camera, gl} = useThree()

  useFrame(() => {
    // update the view as the vis is interacted with
    controls.current.update()
    // console.log(controls.current.start)
  })
  useEffect(() => {
    controls.current.start = function () {
      console.log('start')
    }
    controls.current.addEventListener('change' , function (){
      console.log('change')
    })
    controls.current.addEventListener('end' , function (){
      console.log('end')
      props.changeCameraFlag(false)
    })
    controls.current.addEventListener('start' , function (){
      console.log('start')
      props.changeCameraFlag(true)
    })
  })
  function start() {
    console.log('start')
  }
  return (
    <trackballControls
      ref={controls}
      args={[camera, gl.domElement]}
      dynamicDampingFactor={1}
      keys={[
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ]}
      start={() => { console.log(11111111)}}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
  )
}

export default Controls
