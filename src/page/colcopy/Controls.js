/** @format */

import React, { useEffect } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

// extend THREE to include TrackballControls
extend({ OrbitControls });

// key code constants
const ALT_KEY = 18;
const CTRL_KEY = 17;
const CMD_KEY = 91;

const Controls = (props) => {
  const controls = React.useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    // update the view as the vis is interacted with

    // controls.current.update(); 
   
    if (props.buttonFlag) {
      console.log('change')
      // controls.current.reset();
      if (props.item === 2) {
        controls.current.reset();
      } else if (props.item === 1) {
        controls.current.reset();
      } else if (props.item === 0) {
        controls.current.reset();
      }
      props.changeButtonFlag(false);
    }
   
    // console.log(controls.current.start)
  });
  useEffect(() => {
    controls.current.start = function () {

      props.changeStart()
    };
    controls.current.addEventListener("change", function () {
 
    });
    controls.current.addEventListener("end", function () {
   
      // props.changeCameraFlag(false)
      // props.changeEnd()
    });
    controls.current.addEventListener("start", function () {
      
      // props.changeCameraFlag(true)
      // props.changeStart()
    });
  });
  function start() {
    console.log("start");
  }
  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      dynamicDampingFactor={1}
      keys={[
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ]}
      start={() => {
      
        
      }}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
  );
};

export default Controls;
