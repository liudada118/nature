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
    console.log(props)
    controls.current.update()
    if (props.buttonFlag) {
      if (props.item === 2) {
        camera.position.z = 2;
        // newState = [-Math.PI / 8, 0, 0];
        camera.rotation.x = -Math.PI / 2;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
       
        // DataFlag = false;
        // return
      } else if (props.item === 1) {
        camera.position.z = 0;
        // if()
        camera.position.y = 1400;
        camera.position.x = 0;
        camera.rotation.x = -Math.PI / 2;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
        // newState = [-Math.PI / 2, 0, 0];
       
        // DataFlag = false;
        // return
        // oldState = [0,0,0]
      } else if (props.item === 0) {
        camera.position.z = 0;
        camera.position.y = 1400;
        camera.position.x = 0;
        camera.rotation.x = -Math.PI / 2;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
        // newState = [0, 0, 0];
       
        // DataFlag = false;
        // return
        // oldState = [-Math.PI/2,0,0]
      }
    }
    props.changeButtonFlag(false)
    // console.log(controls.current.start)
  })
  useEffect(() => {
    controls.current.start = function () {
      // console.log('start')
    }
    controls.current.addEventListener('change' , function (){
      // console.log('change')
    })
    controls.current.addEventListener('end' , function (){
      // console.log('end')
      // props.changeCameraFlag(false)
    })
    controls.current.addEventListener('start' , function (){
      // console.log('start')
      // props.changeCameraFlag(true)
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
