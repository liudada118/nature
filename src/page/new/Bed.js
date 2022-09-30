/** ../..format */

import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import Controls from "./Controls";
import { TextureLoader } from "three";
import "antd/dist/antd.css";
import Compute from "../../assets/js/Compute";
// import "./anta copy.css";
import litter from "../../assets/images/litter.png";
import normal from "../../assets/images/normal.png";
import very from "../../assets/images/very.png";
import sidenormal from "../../assets/images/sidenormal.png";
import sidelitter from "../../assets/images/sidelitter.png";
import sidevery from "../../assets/images/sidevery.png";
import nature from "../../assets/images/nat.png";
import side from "../../assets/images/sidenormal.png";
import { interp, gaussBlur_1, jet, addSide, stack } from "../../assets/js/util";
import QRCode from "qrcode.react";
import feature from "../../assets/images/feature.png";
import bed1 from "../../assets/images/bed1.png";
import down from "../../assets/images/down.png";
import {
  Select,
  Modal,
  Input,
  Button,
  Slider,
  message,
  Radio,
  Spin,
} from "antd";
import axios from "axios";
import { jet1 } from "../../assets/js/util";
import view from "../../assets/image1/view.png";
import item from "../../assets/image1/item.png";
import sleep1 from "../../assets/image1/sleep12.png";
import sleep2 from "../../assets/image1/sleep13.png";
import sleep3 from "../../assets/image1/sleep3.png";
import report from "../../assets/image1/report.png";
import recommend from "../../assets/image1/recommend.png";
import star from "../../assets/image1/star.png";
import { Link } from "react-router-dom";
import recomBox from "../../assets/image1/recomBox.png";
// import nature from '../../assets/images/nat.png'
// import item from '../../assets/image1/item.png'
import titleRight from "../../assets/image1/titleRight.png";
import body from "../../assets/image1/body.png";
// import recomBox from '../../assets/image1/recomBox.png'
// import bed1 from '../../assets/images/bed1.png'
// import star from '../../assets/image1/star.png'
// import bed1 from '../../assets/images/bed1.png'
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import "./bed.scss";
// let bdata = 0
// let adata = 0
// setInterval(() => {
//   bdata = parseInt(Math.random() * 40)
//   adata = parseInt(Math.random() * 40)
// }, 100)
const SEPARATION = 20,
  AMOUNTX = 64 + 2 * 4,
  AMOUNTY = 128 + 2 * 4;
let wsPointData = new Array(36 * 68).fill(1);
let wsPointData1 = new Array(2048).fill(0);
let bigArrg = new Array(AMOUNTX * AMOUNTY).fill(1);
let bigArrp = new Array(AMOUNTX * AMOUNTY).fill(1);
let smoothBig = new Array(AMOUNTX * AMOUNTY).fill(1);
let oldPositionY = 1400
let ws, configWs;
let pageClose = false;

let newState = [0, 0, 0],
  oldState = [0, 0, 0],
  oldCameraPosition = "{}",
  newCameraPosition = "{}",
  oldCameraRotation = "{}",
  newCameraRotation = "{}";
const { Option } = Select;
let sleepType;
let timerErr;
let wsFlag = false;
let computeResult;
let changeItem = 0;
const itemArr = ["俯视图", "平视图", "三维图", "设置"];
const bedArr = [
  "X7臻耀系列",
  "S冠军系列",
  "S3系列",
  "意境系列",
  "强护脊系列",
  "净界系列",
  "Z6心境系列",
  "正棕Z5系列",
  "新梦境系列",
  "新幻境系列",
];
// [
//   "梦境经典",
//   "新梦境Z-Classic",
//   "心境系列",
//   "尚境系列",
//   "意境系列",
//   "强护脊系列",
//   "生态英雄",
//   "净界系列",
//   "正棕Z3系列",
//   "正棕Z5系列",
//   "Z6心境系列",
//   "新幻境系列",
//   "梵境系列",
//   "翡洛奇（丝蒂娜）",
//   "翡洛奇（苏菲雅）",
//   "清雅系列",
//   "舒适S3系列",
//   "S2舒雅系列",
//   "S-冠军系列",
//   "X7臻耀系列",
//   "快乐时光（思乐）",
//   "快乐时光（思怡）",
//   "学生垫",
//   "婴堡系列（YB)",
//   "婴堡系列（YC)",
//   "婴堡系列（YE)",
//   "乳胶床垫",
//   "麻知眠",
//   "清新PLUS系列",
//   "荣耀V11",
// ];
let endFlag = true;
let cameraPosition = {};
let cameraX = 0;
let cameraRotationX = 0;
let cameraRotationY = 0;
let cameraRotationZ = 0;
let cameraY = 1400;
let cameraZ = 0;
let rotation = [0, 0, 0];
let cameraFlag = false;
const id = new Date().getTime();
let nowId;
let newDate = new Date().getTime(),
  oldDate;
let DataFlag = false,
  buttonFlag = false;
let progress = 50;
let rotateZ = 0;
function Particles(props) {
  let i = 1;

  const spite = new TextureLoader().load(
    require("../../assets/images/circle.png")
  );
  const attrib = useRef();

  useEffect(() => {
    return () => {
      console.log("return");
    };
  });

  //变量放到内存，高速调用
  const [positions, colors] = useMemo(() => {
    let positions = [],
      colors = [];
    let i = 0,
      j = 0;
    for (let iy = 0; iy < AMOUNTX; iy++) {
      for (let ix = 0; ix < AMOUNTY; ix++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 - 1500 + ix; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2 + 500; // z

        colors[i] = 1;
        colors[i + 1] = 0.1;
        colors[i + 2] = 0;

        i += 3;
        j++;
      }
    }

    return [new Float32Array(positions), new Float32Array(colors)];
    // }, [pointCount]);
  });

  const comp = (x, y) => {
    if (x > y - 1 && x < y + 1) {
      return true;
    } else {
      return false;
    }
  };

  let fSmooth = 0,
    LSmooth = 0;
  useFrame((state, delta) => {
    // state.camera.lookAt(0,0,0)

    // if (i < 6) {
    //   i++
    //   wsPointData = null;
    //   wsPointData1= null;
    //   bigArrg = null;
    //   bigArrp = null;
    //   smoothBig = null;
    // } else

    // if (DataFlag) {
    // i = 1

    // state.gl.clear();
    // state.gl.dispose();
    // attrib.current.geometry.dispose();

    oldCameraPosition = JSON.stringify(state.camera.position);
    oldCameraRotation = JSON.stringify(state.camera.rotation);
    if (buttonFlag) {
      if (props.item === 2) {
        // state.camera.position.z = 2;
        newState = [-Math.PI / 8, 0, 0];
        // state.camera.rotation.x = -Math.PI / 2;
        // state.camera.rotation.y = 0;
        // state.camera.rotation.z = 0;
        state.scene.children[2].rotation.x = newState[0];
        state.scene.children[2].rotation.y = newState[1];
        state.scene.children[2].rotation.z = newState[2];
        // DataFlag = false;
        // return
      } else if (props.item === 1) {
        // state.camera.position.z = 0;
        // // if()
        // state.camera.position.y = 1400;
        // state.camera.position.x = 0;
        // state.camera.rotation.x = -Math.PI / 2;
        // state.camera.rotation.y = 0;
        // state.camera.rotation.z = 0;
        newState = [-Math.PI / 2, 0, 0];
        state.scene.children[2].rotation.x = newState[0];
        state.scene.children[2].rotation.y = newState[1];
        state.scene.children[2].rotation.z = newState[2];
        // DataFlag = false;
        // return
        // oldState = [0,0,0]
      } else if (props.item === 0) {
        // state.camera.position.z = 0;
        // state.camera.position.y = 1400;
        // state.camera.position.x = 0;
        // state.camera.rotation.x = -Math.PI / 2;
        // state.camera.rotation.y = 0;
        // state.camera.rotation.z = 0;
        newState = [0, 0, 0];
        state.scene.children[2].rotation.x = newState[0];
        state.scene.children[2].rotation.y = newState[1];
        state.scene.children[2].rotation.z = newState[2];
        // DataFlag = false;
        // return
        // oldState = [-Math.PI/2,0,0]
      }
    }
    buttonFlag = false;
    // console.log( state.camera.position.y,cameraY , comp(state.camera.position.y,cameraY))
    // if (
    //   !comp(state.camera.position.y,cameraY)
    // ) {
    //   console.log('yes')
    //   cameraY = state.camera.position.y
    //   configWs.send(
    //     JSON.stringify({
    //       camera: state.camera.position,
    //       cameraRotation: state.camera.rotation,
    //       id,
    //     })
    //   );
    // }
    
    if (
      cameraFlag
    ) {
      console.log('change')
      if (configWs.readyState === 1) {
        configWs.send(
          JSON.stringify({
            camera: state.camera.position,
            cameraRotation: state.camera.rotation,
            id,
          })
        );
      }
    }else if (
        !comp(state.camera.position.y,oldPositionY)
      ) {
      
        cameraY = state.camera.position.y
        configWs.send(
          JSON.stringify({
            camera: state.camera.position,
            cameraRotation: state.camera.rotation,
            id,
          })
        );
      }

    if (cameraFlag && endFlag) {
    }
    if (
      !cameraFlag &&
      !endFlag
      // &&(
      // comp(JSON.parse(oldCameraPosition).x , JSON.parse(newCameraPosition).x ) ||
      // comp(JSON.parse(oldCameraPosition).y , JSON.parse(newCameraPosition).y ) ||
      // comp(JSON.parse(oldCameraPosition).z , JSON.parse(newCameraPosition).z ) ||
      // comp(JSON.parse(oldCameraRotation).x , JSON.parse(newCameraRotation).x ) ||
      // comp(JSON.parse(oldCameraRotation).y , JSON.parse(newCameraRotation).y ) ||
      // comp(JSON.parse(oldCameraRotation).z , JSON.parse(newCameraRotation).z )
      // )
    ) {
      state.camera.position.x = cameraX;
      state.camera.position.y = cameraY;
      state.camera.position.z = cameraZ;
      state.camera.rotation.x = cameraRotationX;
      state.camera.rotation.y = cameraRotationY;
      state.camera.rotation.z = cameraRotationZ;
    }

    // if (ws.readyState === 1) {
    //   // state.camera.position.x = cameraX
    //   // state.camera.position.y = cameraY
    //   // state.camera.position.z = cameraZ
    //   // state.camera.rotation.x = cameraRotationX
    //   // state.camera.rotation.y = cameraRotationY
    //   // state.camera.rotation.z = cameraRotationZ

    // }

    if (
      ws.readyState === 1 &&
      JSON.stringify(oldState) != JSON.stringify(newState)
    ) {
      // state.camera.rotation.x = newState[0]
      // state.camera.rotation.y = newState[1]
      // state.camera.rotation.z = newState[2]
      // oldState = newState;
      // state.scene.children[2].rotation.x = newState[0];
      // state.scene.children[2].rotation.y = newState[1];
      // state.scene.children[2].rotation.z = newState[2];
    }

    newCameraPosition = JSON.stringify(state.camera.position);
    newCameraRotation = JSON.stringify(state.camera.rotation);
    //线性插值
    if (DataFlag) {
      interp(wsPointData, bigArrp, 64 + 4, 32 + 4);

      // //高斯滤波
      gaussBlur_1(bigArrp, bigArrg, 128 + 2 * 4, 64 + 2 * 4, props.valueg);

      //缩放

      if (wsPointData.length > 0) {
        let i = 0,
          j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            const value = bigArrg[j] * 20;

            //柔化处理smooth
            smoothBig[j] =
              smoothBig[j] + (value - smoothBig[j] + 0.5) / props.valuel;

            positions[i + 1] = smoothBig[j] * props.value; // y
            // const rgb = jet1(0, props.valuej, props.valuej1, props.valuej2, props.valuej3, smoothBig[j])
            const rgb = jet(0, props.valuej1, smoothBig[j]);
            colors[i] = rgb[0] / 255;
            colors[i + 1] = rgb[1] / 255;
            colors[i + 2] = rgb[2] / 255;

            i += 3;
            j++;
          }
        }

        attrib.current.geometry.attributes.position.needsUpdate = true;
        attrib.current.geometry.attributes.color.needsUpdate = true;
        // count += 0.1;
      }
    }
    cameraPosition = { ...state.camera.position };
    DataFlag = false;
    // } else {
    // }
    oldPositionY = state.camera.position.y
  });

  //线性插值

  return (
    // onPointerOver={hover} onPointerOut={unhover}
    <points
      ref={attrib}
      position={[props.postitonX, props.postitonY, props.postitonZ]}
      // rotation={[props.rotationX, props.rotationY, props.rotationZ]}
    >
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          needsUpdate={true}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "color"]}
          count={colors.length / 3}
          array={colors}
          needsUpdate={true}
          itemSize={3}
        />
        {/*<bufferAttribute ref={attrib} attachObject={["attributes", "size"]} count={colors.length / 3} array={colors} itemSize={1} />*/}
      </bufferGeometry>
      <pointsMaterial
        map={spite}
        attach="material"
        vertexColors
        size={28}
        sizeAttenuation={true}
        transparent={true}
        alphaTest={0.8}
      />
    </points>
  );
}

// 由于canvas不能重新渲染，也不会重新渲染，但是如果直接改变父组件的state，整个组件都会重新渲染体验不好（闪频情况），于是用一个不渲染组件包起来
class Com extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.valueg != this.props.valueg ||
      nextProps.valuej != this.props.valuej ||
      nextProps.valuej1 != this.props.valuej1 ||
      nextProps.valuej2 != this.props.valuej2 ||
      nextProps.valuej3 != this.props.valuej3 ||
      nextProps.value != this.props.value ||
      nextProps.valuef != this.props.valuef ||
      nextProps.valuel != this.props.valuel ||
      nextProps.rotationX != this.props.rotationX ||
      nextProps.rotationY != this.props.rotationY ||
      nextProps.rotationZ != this.props.rotationZ ||
      nextProps.cameraZ != this.props.cameraZ ||
      nextProps.buttonFlag != this.props.buttonFlag ||
      nextProps.item != this.props.item
    );
  }
  render() {
    return <>{this.props.children}</>;
  }
}

class Anta extends React.Component {
  message(e) {
    bigArrg = null;
    bigArrp = null;
    smoothBig = null;
    bigArrg = new Array(AMOUNTX * AMOUNTY).fill(1);
    bigArrp = new Array(AMOUNTX * AMOUNTY).fill(1);
    smoothBig = new Array(AMOUNTX * AMOUNTY).fill(1);
    oldDate = newDate;
    DataFlag = true;
    newDate = new Date().getTime();
    if (wsFlag) {
      wsFlag = false;
    }

    // if (jsonObject) {
    //   jsonObject = null;
    // }
    let jsonObject = JSON.parse(e.data);
    //处理空数组
    if (jsonObject.data != null) {
      wsPointData = null;
      wsPointData1 = null;
      wsPointData = jsonObject.data;
      wsPointData1 = wsPointData;

      wsPointData1 = wsPointData1.map((a) => {
        if (a < this.state.filter) {
          return 0;
        } else {
          return a;
        }
      });

      const allPress = wsPointData1.reduce((a, b) => a + b, 0);
      const allNum = wsPointData1.filter((a) => a > 0).length;
      this.setState({
        press: allNum > 0 ? allPress / allNum : 0,
      });
      // let a = []
      //   for (let i = 0; i < 32; i++) {
      //     a[i] = []
      //     for (let j = 0; j < 64; j++) {
      //       a[i].push(wsPointData1[i * 32 + j])
      //     }
      //   }

      //   this.setState({
      //     numArr32 : a
      //   })

      /**
       * 添加边框(避免高斯溢出)
       * */
      wsPointData = addSide(wsPointData1, 64, 32, 2, 2, 0);

      /**
       * 计算压力最大面积，最大值，平均值
       * */
    } else {
      progress = progress + (jsonObject.hardness_degree - progress) / 10;

      this.setState({
        sleep_pos:
          jsonObject.sleeping_pos === 0
            ? "无人"
            : jsonObject.sleeping_pos === 1
            ? "平躺"
            : jsonObject.sleeping_pos === 2
            ? "侧躺"
            : jsonObject.sleeping_pos === 3
            ? "重物"
            : "--",
        breatheData: jsonObject.breath_rate,
        moveData: jsonObject.bodymove_data,
        spine:
          jsonObject.spine_curvature == -1
            ? "无"
            : jsonObject.spine_curvature == 0
            ? "平躺正常"
            : jsonObject.spine_curvature == 1
            ? "平躺弯曲"
            : jsonObject.spine_curvature == 2
            ? "平躺严重弯曲"
            : jsonObject.spine_curvature == 3
            ? "侧躺正常"
            : jsonObject.spine_curvature == 4
            ? "侧躺弯曲"
            : jsonObject.spine_curvature == 5
            ? "侧躺严重弯曲"
            : "--",
        hardness: progress,
      });
    }
  }
  componentDidMount() {
    // this.myChart1 = echarts.init(document.getElementById(`myChart1`))
    // this.myChart2 = echarts.init(document.getElementById(`myChart2`))

    // this.initCharts({
    //   yData: [1, 10, 2, 8, 5, 6, 32, 6, 2, 7], //this.breathe.arr,
    //   xData: new Array(10).fill(0),
    //   index: 0 + 1,
    //   name: 0,
    //   myChart: this.myChart1,
    //   color: '#f9c935',
    // })
    // this.initCharts({
    //   yData: [1, 10, 2, 8, 5, 6, 32, 6, 2, 7], //this.move.arr,
    //   xData: new Array(10).fill(0),
    //   index: 0 + 2,
    //   name: 0,
    //   myChart: this.myChart2,
    //   color: '#2ac1e9',
    // })
    document.title='大自然'
    window.addEventListener("mouseout", () => {});
    document.addEventListener("DOMMouseScroll", () => {}, false);

    this.breathe = new stack(20);
    this.move = new stack(20);

    pageClose = false;
    const doc = document.documentElement;
    doc.style.fontSize = `${window.innerWidth / 100}px`;
    doc.addEventListener("DOMContentLoaded", Resize);

    window.addEventListener("resize", Resize);
    timerErr = setInterval(() => {
      if (pageClose) {
        return;
      }
      if (wsFlag) {
        ws = new WebSocket(`ws://192.168.31.40:8080/serial/${id}`);
        ws.onmessage = (e) => {
          this.message(e);
        };
        ws.onerror = (e) => {
          // an error occurred
          wsFlag = true;
        };
        ws.onclose = (e) => {
          wsFlag = true;
        };
        configWs = new WebSocket(`ws://192.168.31.40:8080/dataSyc/${id}`);

        configWs.onopen = () => {
          // connection opened
        };

        configWs.onmessage = (e) => {
          const objData = JSON.parse(e.data);
          nowId = objData.id;
          if (objData.hasOwnProperty("gaussian")) {
            this.setState({
              valueg1: objData.gaussian,
            });
          }

          if (objData.hasOwnProperty("item")) {
            this.setState({
              item: objData.item,
              buttonFlag: true,
            });
            buttonFlag = true;
          }
          if (objData.hasOwnProperty("end")) {
            endFlag = true;
          }
          if (objData.hasOwnProperty("start")) {
            endFlag = false;
          }

          if (objData.hasOwnProperty("camera")) {
            cameraX = objData.camera.x;
            cameraY = objData.camera.y;
            cameraZ = objData.camera.z;
          }
          if (objData.hasOwnProperty("rotation")) {
            rotation = objData.rotation;
          }
          if (objData.hasOwnProperty("color")) {
            this.setState({
              valuej1: objData.color,
            });
          }
          if (objData.hasOwnProperty("cameraRotation")) {
            cameraRotationX = objData.cameraRotation._x;
            cameraRotationY = objData.cameraRotation._y;
            cameraRotationZ = objData.cameraRotation._z;
          }
          if (objData.hasOwnProperty("item")) {
            this.setState({
              item: objData.item,
            });
          }
          if (objData.hasOwnProperty("smooth")) {
            this.setState({
              valuel: objData.smooth,
            });
          }
          if (objData.hasOwnProperty("filter")) {
            this.setState({
              filter: objData.filter,
            });
          }
          if (objData.hasOwnProperty("value1")) {
            this.setState({
              value1: objData.value1,
            });
          }
          if (objData.hasOwnProperty("bed")) {
            this.setState({
              bed: objData.bed,
            });
          }
        };
        configWs.onerror = (e) => {
          // an error occurred
        };
        configWs.onclose = (e) => {};
      }
    }, 1000);

    function Resize() {
      doc.style.fontSize = `${window.innerWidth / 100}px`;
    }

    configWs = new WebSocket(`ws://192.168.31.40:8080/dataSyc/${id}`);

    configWs.onopen = () => {
      // connection opened
    };

    configWs.onmessage = (e) => {
      const objData = JSON.parse(e.data);
      nowId = objData.id;
      if (objData.hasOwnProperty("gaussian")) {
        this.setState({
          valueg1: objData.gaussian,
        });
      }

      if (objData.hasOwnProperty("item")) {
        this.setState({
          item: objData.item,
          buttonFlag: true,
        });
        buttonFlag = true;
      }
      if (objData.hasOwnProperty("end")) {
        endFlag = true;
      }
      if (objData.hasOwnProperty("start")) {
        endFlag = false;
      }

      if (objData.hasOwnProperty("camera")) {
        cameraX = objData.camera.x;
        cameraY = objData.camera.y;
        cameraZ = objData.camera.z;
      }
      if (objData.hasOwnProperty("rotation")) {
        rotation = objData.rotation;
      }
      if (objData.hasOwnProperty("color")) {
        this.setState({
          valuej1: objData.color,
        });
      }
      if (objData.hasOwnProperty("cameraRotation")) {
        cameraRotationX = objData.cameraRotation._x;
        cameraRotationY = objData.cameraRotation._y;
        cameraRotationZ = objData.cameraRotation._z;
      }
      if (objData.hasOwnProperty("item")) {
        this.setState({
          item: objData.item,
        });
      }
      if (objData.hasOwnProperty("smooth")) {
        this.setState({
          valuel: objData.smooth,
        });
      }
      if (objData.hasOwnProperty("filter")) {
        this.setState({
          filter: objData.filter,
        });
      }
      if (objData.hasOwnProperty("value1")) {
        this.setState({
          value1: objData.value1,
        });
      }
      if (objData.hasOwnProperty("bed")) {
        this.setState({
          bed: objData.bed,
        });
      }
    };
    configWs.onerror = (e) => {
      // an error occurred
    };
    configWs.onclose = (e) => {};

    ws = new WebSocket(`ws://192.168.31.40:8080/serial/${id}`);
    ws.onopen = () => {
      // connection opened
    };

    ws.onmessage = (e) => {
      this.message(e);
    };
    ws.onerror = (e) => {
      // an error occurred
      wsFlag = true;
    };
    ws.onclose = (e) => {
      wsFlag = true;
    };
  }

  setIsModalVisible(value) {
    this.setState({
      isModalVisible: value,
    });
  }

  showModal() {
    // this.setIsModalVisible(true)

    const page = document.querySelector(".reportInput");
    page.style.visibility = "unset";
    page.style.transform = `translateY(0)`;
    page.style.opacity = 1;
    page.style.transition = `all 0.4s`;
  }

  hiddenReport() {
    const page = document.querySelector(".reportInput");
    page.style.transform = `translateY(40px)`;
    page.style.opacity = 0;
    page.style.transition = `all 0.4s`;
    page.style.visibility = "hidden";
    setTimeout(() => {
      // page.style.visibility = "hidden";
      // const qrCode = document.querySelector(".qrCode");
      // qrCode.style.visibility = "hidden";

      // const page1 = document.querySelector(".inputcontet");
      // page1.style.transform = `translateY(0)`;
      // page1.style.opacity = 1;
    }, 380);
    this.setState({
      name: "",
      sex: 1,
      phone: "",
    });
  }

  hiddenRealReport() {
    const page = document.querySelector(".reportPage");
    page.style.display = "none";
    this.setState({
      name: "",
      phone: "",
      sex: 1,
    });
  }

  showReport() {
    if (
      this.state.name == "" ||
      this.state.sex == "" ||
      this.state.phone == ""
    ) {
      message.error("请输入完整信息");
    } else {
      // const page = document.querySelector(".inputcontet");
      // page.style.transform = `translateY(40px)`;
      // page.style.opacity = 0;
      // page.style.transition = `all 0.4s`;

      // const qrCode = document.querySelector(".qrCode");
      // qrCode.style.visibility = "unset";
      // qrCode.style.opacity = 1;
      // qrCode.style.transition = `all 0.4s`;

      const page1 = document.querySelector(".reportInput");
      page1.style.transform = `translateY(40px)`;
      page1.style.opacity = 0;
      page1.style.transition = `all 0.4s`;
      setTimeout(() => {
        page1.style.visibility = "hidden";
      }, 380);

      const breath = this.state.breatheData;
      const move = this.state.moveData;
      const press = this.state.press;
      this.setState({
        nowBreath: breath,
        nowMove: move,
        nowPress: press,
      });
      const page = document.querySelector(".reportPage");
      // page.style.transform = `translateY(40px)`
      // page.style.opacity = 0
      // page.style.transition = `all 0.4s`
      // setTimeout(() => {
      //   page.style.visibility = 'hidden'
      // }, 380)

      page.style.display = "flex";
    }
  }

  handleOk() {
    this.setIsModalVisible(false);
  }

  handleCancel() {
    this.setIsModalVisible(false);
  }

  constructor(props) {
    super(props);
    this.start = React.createRef();
    this.drop = React.createRef();
    this.num = React.createRef();
    this.state = {
      filter: 17,
      // Number(localStorage.getItem("filter"))
      //   ? Number(localStorage.getItem("filter"))
      //   : 17, //过滤值
      windowWidth: window.innerWidth,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      postitonX: window.innerWidth > 768 ? 760 : 760, //250,
      postitonY: window.innerWidth > 768 ? -400 : -400, //-250,
      postitonZ: window.innerWidth > 768 ? 100 : 100, //-450,
      time: 0,
      valuej1: 1200,
      loading: false,
      // Number(localStorage.getItem("valuej1"))
      //   ? Number(localStorage.getItem("valuej1"))
      //   : 1200, // 饱和度
      valuej2: Number(localStorage.getItem("valuej2"))
        ? Number(localStorage.getItem("valuej2"))
        : 1200, // 饱和度
      valuej3: Number(localStorage.getItem("valuej3"))
        ? Number(localStorage.getItem("valuej3"))
        : 1200, // 饱和度
      valuej: Number(localStorage.getItem("valuej"))
        ? Number(localStorage.getItem("valuej"))
        : 1200, // 饱和度
      valueg1: 3,
      //  Number(localStorage.getItem("valueg1"))
      //   ? Number(localStorage.getItem("valueg1"))
      //   : 3, // 高斯
      value1: 0.23,
      // Number(localStorage.getItem("value1"))
      //   ? Number(localStorage.getItem("value1"))
      //   : 0.23, // z
      valuef1: Number(localStorage.getItem("valuef1"))
        ? Number(localStorage.getItem("valuef1"))
        : 1000,
      valuel: 6,
      // Number(localStorage.getItem("valuel"))
      //   ? Number(localStorage.getItem("valuel"))
      //   : 6, // 数据连贯性
      bedFetchData1: 0,
      bedFetchData2: 0,
      numArr32: [],
      isModalVisible: false,
      num: 1,
      item: 0,
      cameraZ: 0,
      cameraFlag: false,
      id: 0,
      nowBreath: 0,
      nowMove: 0,
      nowPress: 0,
      cameraY: window.innerWidth > 1020 ? 1400 : 1000,
      display: false,
      click: false,
      bed: 'X7臻耀系列',
      sleep_pos: "--",
      breatheData: 0,
      moveData: 0,
      press: 0,
      phone: "",
      name: "",
      sex: 1,
      recomBed: [
        {
          img: "./img/X7.png",
          bedName: "X7臻耀系列",
          num: 5,
        },
        {
          img: "./img/gj.png",
          bedName: "S冠军系列",
          num: 4,
        },
        {
          img: "./img/S3.png",
          bedName: "S3系列",
          num: 4,
        },
      ],
      recomItem: 0,
      hardness: 50,
      spine: "",
      buttonFlag: false,
    };
    this.cameraX = 0;
    this.cameraY = 1400;
    this.cameraZ = 0;
    this.breatheData = React.createRef();
    this.moveData = React.createRef();
    this.sleepData = React.createRef();
    this.spineData = React.createRef();
    this.img = React.createRef();
    this.select = React.createRef();
  }

  componentWillUnmount() {
    pageClose = true;
    if (ws) {
      ws.close();
    }
    if (configWs) {
      configWs.close();
    }
  }

  changeButtonFlag(value) {
    this.setState({
      buttonFlag: value,
    });
  }
  changeValueg(value) {
    this.setState({ valueg: value });
  }
  changeValuej(value) {
    this.setState({ valuej: value });
  }
  changeFliter(value) {
    this.setState({ fliter: value });
  }
  changeRotation(x, y, z) {
    if (x !== undefined) {
      this.setState({
        rotationX: x,
      });
    }
    if (y !== undefined) {
      this.setState({
        rotationY: y,
      });
    }
    if (z !== undefined) {
      this.setState({
        rotationZ: z,
      });
    }
  }

  changeEnd() {
    if (configWs.readyState === 1) {
      configWs.send(
        JSON.stringify({
          end: "end",
        })
      );
    }
  }

  changeStart() {
    if (configWs.readyState === 1) {
      configWs.send(
        JSON.stringify({
          start: "start",
        })
      );
    }
  }

  showRecom() {
    const page = document.querySelector(".recomPage");
    page.style.visibility = "unset";
    page.style.transform = `translateY(0)`;
    page.style.opacity = 1;
    page.style.transition = `all 0.4s`;

    this.changeBedType();
  }

  hiddenRecom() {
    const page = document.querySelector(".recomPage");
    page.style.transform = `translateY(40px)`;
    page.style.opacity = 0;
    page.style.transition = `all 0.4s`;
    setTimeout(() => {
      page.style.visibility = "hidden";
    }, 380);
  }

  changeItem() {
    const img = document.querySelector(".viewImg");
    rotateZ += 1;
    img.style.transform = `rotateZ(${rotateZ * 90}deg)`;
    img.style.transition = `all 0.5s`;
    buttonFlag = true;
    this.setState({
      buttonFlag: true,
    });
    if (this.state.item <= 1) {
      changeItem = this.state.item + 1;
      this.setState(
        {
          item: this.state.item + 1,
        },
        () => {
          if (this.state.item === 1) {
            this.changeRotation(-Math.PI / 2, 0, 0);
            this.setState({
              cameraZ: 0,
            });
            if (configWs.readyState === 1) {
              configWs.send(
                JSON.stringify({
                  item: this.state.item,
                  rotation: [-Math.PI / 2, 0, 0],
                  id,
                })
              );
            }
          } else if (this.state.item === 2) {
            this.changeRotation(-Math.PI / 8, 0, 2);
            this.setState({
              cameraZ: 2,
            });
            if (configWs.readyState === 1) {
              configWs.send(
                JSON.stringify({
                  item: this.state.item,
                  rotation: [-Math.PI / 8, 0, 2],
                  id,
                })
              );
            }
          }
        }
      );
    } else {
      changeItem = 0;
      this.setState(
        {
          item: 0,
        },
        () => {
          if (this.state.item === 0) {
            this.changeRotation(0, 0, 0);
            this.setState({
              cameraZ: 0,
            });
            if (configWs.readyState === 1) {
              configWs.send(
                JSON.stringify({
                  item: this.state.item,
                  rotation: [0, 0, 0],
                  id,
                })
              );
            }
          }
        }
      );
    }

    // if (index === 3) {
    //   this.setState({
    //     display: !this.state.display,
    //   })
    // } else if (index === 0) {
    //   this.changeRotation(0, 0, 0)
    //   this.setState({
    //     cameraZ: 0,
    //   })
    //   if (configWs.readyState === 1) {
    //     configWs.send(
    //       JSON.stringify({
    //         item: index,
    //         rotation: [0, 0, 0],
    //         id,
    //       }),
    //     )
    //   }
    // } else if (index === 1) {
    //   this.changeRotation(-Math.PI / 2, 0, 0)
    //   this.setState({
    //     cameraZ: 0,
    //   })
    //   if (configWs.readyState === 1) {
    //     configWs.send(
    //       JSON.stringify({
    //         item: index,
    //         rotation: [-Math.PI / 2, 0, 0],
    //         id,
    //       }),
    //     )
    //   }
    // } else if (index === 2) {
    //   this.changeRotation(-Math.PI / 8, 0, 0)
    //   this.setState({
    //     cameraZ: 2,
    //   })
    //   if (configWs.readyState === 1) {
    //     configWs.send(
    //       JSON.stringify({
    //         item: index,
    //         rotation: [-Math.PI / 8, 0, 0],
    //         id,
    //       }),
    //     )
    //   }
    // }
  }
  handleBedChange(value) {
    this.setState({ bed: value });
  }
  changeCameraFlag(value) {
    cameraFlag = value;
  }

  getBlobPng() {
    const node = document.getElementById("node");

    domtoimage
      .toBlob(node)
      .then((blob) => {
        // 调用file-save方法 直接保存图片

        saveAs(blob, `${this.state.name}.png`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  changeBed(value) {
    this.select.current.blur();
    this.setState({
      bed: value,
    });
    axios
      .get(
        `http://192.168.31.40:8080/setBedName?bedName=${bedArr.indexOf(value)}`
      )
      .then((res) => {});
    if (configWs.readyState === 1) {
      configWs.send(
        JSON.stringify({
          bed: value,
        })
      );
    }

    this.changeBedType(value);
  }

  changeBedType(input) {
    const value = input || this.state.bed;
    if (value === "新幻境系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            { bedName: "意境系列", img: "./img/yj.png", num: 5 },
            { bedName: "强护脊系列", img: "./img/qhj.png", num: 4 },
            { bedName: "净界系列", img: "./img/jj.png", num: 4 },
            { bedName: "Z6心境系列", img: "./img/Z6.png", num: 3 },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            { bedName: "强护脊系列", img: "./img/qhj.png", num: 5 },
            { bedName: "净界系列", img: "./img/jj.png", num: 4 },
            { bedName: "Z6心境系列", img: "./img/Z6.png", num: 4 },
            { bedName: "正棕Z5系列", img: "./img/Z5.png", num: 3 },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            { bedName: "净界系列", img: "./img/jj.png", num: 5 },
            { bedName: "Z6心境系列", img: "./img/Z6.png", num: 4 },
            { bedName: "正棕Z5系列", img: "./img/Z5.png", num: 3 },
            { bedName: "强护脊系列", img: "./img/qhj.png", num: 4 },
          ],
        });
      }
    } else if (value === "新梦境系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 5,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 4,
            },
            {
              img: "./img/Z5.png",
              bedName: "正棕Z5系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 5,
            },

            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 4,
            },
            {
              img: "./img/Z5.png",
              bedName: "正棕Z5系列",
              num: 3,
            },
            {
              img: "./img/xmj.png",
              bedName: "新梦境系列",
              num: 4,
            },
          ],
        });
      }
    } else if (value === "正棕Z5系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 5,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 4,
            },
            {
              img: "./img/Z5.png",
              bedName: "正棕Z5系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 5,
            },

            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 4,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      }
    } else if (value === "Z6心境系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 5,
            },
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 5,
            },

            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 4,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      }
    } else if (value === "净界系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 5,
            },

            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 4,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      }
    } else if (value === "强护脊系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 5,
            },

            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      }
    } else if (value === "意境系列") {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 4,
            },
            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 3,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/yj.png",
              bedName: "意境系列",
              num: 5,
            },

            {
              img: "./img/jj.png",
              bedName: "净界系列",
              num: 4,
            },
            {
              img: "./img/qhj.png",
              bedName: "强护脊系列",
              num: 4,
            },
            {
              img: "./img/Z6.png",
              bedName: "Z6心境系列",
              num: 3,
            },
          ],
        });
      }
    } else if (
      value === "X7臻耀系列" ||
      value === "S冠军系列" ||
      value === "S3系列"
    ) {
      if (this.state.recomItem == 0) {
        this.setState({
          recomBed: [
            {
              img: "./img/X7.png",
              bedName: "X7臻耀系列",
              num: 5,
            },
            {
              img: "./img/gj.png",
              bedName: "S冠军系列",
              num: 4,
            },
            {
              img: "./img/S3.png",
              bedName: "S3系列",
              num: 4,
            },
          ],
        });
      } else if (this.state.recomItem == 1) {
        this.setState({
          recomBed: [
            {
              img: "./img/gj.png",
              bedName: "S冠军系列",
              num: 5,
            },
            {
              img: "./img/X7.png",
              bedName: "X7臻耀系列",
              num: 4,
            },
            {
              img: "./img/S3.png",
              bedName: "S3系列",
              num: 4,
            },
          ],
        });
      } else if (this.state.recomItem == 2) {
        this.setState({
          recomBed: [
            {
              img: "./img/S3.png",
              bedName: "S3系列",
              num: 5,
            },

            {
              img: "./img/X7.png",
              bedName: "X7臻耀系列",
              num: 4,
            },
            {
              img: "./img/gj.png",
              bedName: "S冠军系列",
              num: 4,
            },
          ],
        });
      }
    } else {
      this.setState({
        recomBed: [],
      });
    }
  }

  showQrcode(){
    const page = document.querySelector(".reportInput1");
    page.style.visibility = "unset";
    page.style.transform = `translateY(0)`;
    page.style.opacity = 1;
    page.style.transition = `all 0.4s`;
  }

  hiddenQrcode(){
    const page = document.querySelector(".reportInput1");
    page.style.transform = `translateY(40px)`;
    page.style.opacity = 0;
    page.style.visibility = 'hidden'
    page.style.transition = `all 0.4s`;
   
  }

  onSexChange(e) {
    this.setState({
      sex: e.target.value,
    });
  }

  render() {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "4rem",
            height: "4rem",
            zIndex: 500,
          }}
          onClick={() => {
            this.setState({ recomItem: 0 });
          }}
        ></div>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "4rem",
            height: "4rem",
            zIndex: 500,
          }}
          onClick={() => {
            this.setState({ recomItem: 1 });
          }}
        ></div>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "4rem",
            height: "4rem",
            zIndex: 500,
          }}
          onClick={() => {
            this.setState({ recomItem: 2 });
          }}
        ></div>
        <div
          style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            // className="fontLight"
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              zIndex: 200,
              display: "flex",
              alignItems: "end",
              width: "65%",
            }}
          >
            <div style={{ width: "20%", marginRight: 30 }}>
              <img src={nature} style={{ width: "100%" }} alt="" />
            </div>
            {/* <Select defaultValue="梦境经典" style={{width: 240}} onChange={this.handleBedChange.bind(this)}>
              {bedArr.map((item, index) => {
                return (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                )
              })}
              <img src={down} alt="" />
            </Select> */}
            {/* <select id="group" value="2">
              <option value="1">Dimond111111111111111</option>
              <option value="2">vertical</option>
            </select> */}

            <Select
              ref={this.select}
              showSearch
              placeholder="请选择床垫类型"
              optionFilterProp="children"
              onChange={this.onChange}
              onSearch={this.onSearch}
              maxTagCount={12}
              size="large"
              // options={[{
              //   title : false
              // }]}
              // min-width={300}
              value={this.state.bed}
              listHeight={400}
              style={{ minWidth: "10%" }}
              onSelect={(value) => {
                this.changeBed(value);
              }}
              dropdownMatchSelectWidth={300}
            >
              {bedArr.map((item, index) => {
                return (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </div>

          <div
            className="com"
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              backgroundColor: "rgba(0,0,0,0)",
              zIndex: 2,
              width: "100%",
              fontWeight: "normal",
              color: "rgb(149 148 147)",
            }}
          >
            <div className="font">
              <img
                className="viewImg"
                onClick={this.changeItem.bind(this)}
                style={{ width: "50px", height: "50px" }}
                src={view}
                alt=""
              />
              <span style={{ lineHeight: "50px", marginLeft: 10 }}>
                {itemArr[this.state.item]}
              </span>
            </div>

            <div className="dataContent fontFounder">
              <div style={{ fontSize: "0.8rem" }}>
                <div className="comfortTitle">床垫舒适度</div>
                <div className="postContent">
                  <div className="postInfo">
                    <div className="post">睡姿:{this.state.sleep_pos}</div>
                    <div className="spine">脊柱:{this.state.spine}</div>
                  </div>
                  <div className="postImg">
                    <img
                      src={sleep1}
                      style={{
                        display:
                          this.state.sleep_pos === "侧躺" ? "unset" : "none",
                      }}
                      alt=""
                    />
                    <img
                      src={sleep2}
                      style={{
                        display:
                          this.state.sleep_pos === "平躺" ? "unset" : "none",
                      }}
                      alt=""
                    />
                    <img
                      src={sleep3}
                      style={{
                        display:
                          this.state.sleep_pos != "侧躺" &&
                          this.state.sleep_pos != "平躺"
                            ? "unset"
                            : "none",
                      }}
                      alt=""
                    />
                  </div>
                </div>
                <div className="degreeProgress">
                  <div className="progressStrip"></div>
                  {this.state.bed ? (
                    <div
                      className="progressRound"
                      style={{
                        position: "absolute",
                        left: `${this.state.hardness}%`,
                      }}
                    ></div>
                  ) : null}
                </div>
                <div className="degreeInfo">
                  <div>偏软</div>
                  <div>偏硬</div>
                </div>
              </div>
              <div className="dataItem">
                <img className="dataItemImg" src={item} alt="" />
                <div>
                  <div>呼吸</div>
                  <div>{this.state.breatheData.toFixed(0)}次/min</div>
                </div>
              </div>
              <div className="dataItem">
                <img className="dataItemImg" src={item} alt="" />
                <div>
                  <div>体动</div>
                  <div>{this.state.moveData}次/min</div>
                </div>
              </div>
              <div className="dataItem">
                <img className="dataItemImg" src={item} alt="" />
                <div>
                  <div>平均压力</div>
                  <div>{Number(this.state.press).toFixed(0)}mmhg</div>
                </div>
              </div>
              {/* <Link to="/re"> */}

              <div
                className="reportButton button"
                onClick={() => {
                  this.showModal();
                }}
              >
                <img src={report} alt="" />
              </div>
              {/* </Link> */}
              {/* <Link to="/report"> */}
              <div
                className="reComButton button"
                onClick={() => {
                  this.showRecom();
                }}
              >
                <img src={recommend} alt="" />
              </div>
              {/* </Link> */}
            </div>
            {/* <div
              style={{
                display: "flex",
                width: "65%",
                backgroundColor: "rgba(0,0,0,0)",
              }}
            >
              <div className="smooth">
                <div>坐垫润滑程度</div>
                <Slider
                  min={0.1}
                  max={8}
                  onChange={(value) => {
                    localStorage.setItem("valueg1", value);
                    this.setState({ valueg1: value });
                    if (configWs.readyState === 1) {
                      configWs.send(
                        JSON.stringify({
                          gaussian: value,
                        })
                      );
                    }
                  }}
                  value={this.state.valueg1}
                  step={0.1}
                  // value={}
                  style={{ flex: 1 }}
                />
              </div>
              <div className="color">
                <div>坐垫颜色饱和度</div>
                <div style={{ display: "flex" }}>
                  <Input
                      value={this.state.valuej}
                      onChange={e => {
                        const value = e.target.value
                        localStorage.setItem('valuej', value)
                        this.setState({valuej: e.target.value})
                      }}
                    />
                    <Input
                      value={this.state.valuej1}
                      onChange={e => {
                        const value = e.target.value
                        localStorage.setItem('valuej1', value)
                        this.setState({valuej1: e.target.value})
                      }}
                    />
                    <Input
                      value={this.state.valuej2}
                      onChange={e => {
                        const value = e.target.value
                        localStorage.setItem('valuej2', value)
                        this.setState({valuej2: e.target.value})
                      }}
                    />
                    <Input
                      value={this.state.valuej3}
                      onChange={e => {
                        const value = e.target.value
                        localStorage.setItem('valuej3', value)
                        this.setState({valuej3: e.target.value})
                      }}
                    />

                  <Slider
                    min={100}
                    max={1200}
                    onChange={(value) => {
                      localStorage.setItem("valuej1", value);
                      this.setState({ valuej1: value });
                      if (configWs.readyState === 1) {
                        configWs.send(
                          JSON.stringify({
                            color: value,
                          })
                        );
                      }
                    }}
                    value={this.state.valuej1}
                    step={10}
                    
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="position">
                <div>positionZ</div>
                <Slider
                  min={0.01}
                  max={0.3}
                  onChange={(value) => {
                    localStorage.setItem("value1", value);
                    this.setState({ value1: value });
                    if (configWs.readyState === 1) {
                      configWs.send(
                        JSON.stringify({
                          value1: value,
                        })
                      );
                    }
                  }}
                  value={this.state.value1}
                  step={0.01}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "65%",
                backgroundColor: "rgba(0,0,0,0)",
              }}
            >
              <div className="data">
                <div>数据连贯性</div>
                <Slider
                  min={1}
                  max={20}
                  onChange={(value) => {
                    this.setState({ valuel: value });
                    localStorage.setItem("valuel", value);
                    if (configWs.readyState === 1) {
                      configWs.send(
                        JSON.stringify({
                          smooth: value,
                        })
                      );
                    }
                  }}
                  value={this.state.valuel}
                  step={1}
                  style={{ flex: 1 }}
                />
              </div>
              <div className="filter">
                <div>过滤值</div>
                <Slider
                  min={1}
                  max={100}
                  onChange={(value) => {
                    this.setState({ filter: value });
                    localStorage.setItem("filter", value);
                    if (configWs.readyState === 1) {
                      configWs.send(
                        JSON.stringify({
                          filter: value,
                        })
                      );
                    }
                  }}
                  value={this.state.filter}
                  step={1}
                  style={{ flex: 1 }}
                />
              </div>
            </div> */}
          </div>

          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              backgroundColor: "#070822",
            }}
            ref={this.canvas}
          >
            <Com
              valueg={this.state.valueg1}
              valuej={this.state.valuej}
              valuej1={this.state.valuej1}
              valuej2={this.state.valuej2}
              valuej3={this.state.valuej3}
              value={this.state.value1}
              valuef={this.state.valuef}
              valuel={this.state.valuel}
              rotationY={this.state.rotationY}
              rotationZ={this.state.rotationZ}
              rotationX={this.state.rotationX}
              cameraZ={this.state.cameraZ}
              cameraFlag={this.state.cameraFlag}
              buttonFlag={this.state.buttonFlag}
              item={this.state.item}
            >
              {/* <video src={video}></video> */}
              <Canvas
                gl={{ antialias: false, alpha: false }}
                style={{
                  width: window.innerWidth > 768 ? "100%" : "100%",
                  height: "100%",
                  backgroundColor: "black",
                }}
                camera={{
                  zoom: 1,
                  fov: 65,
                  position: [0, this.state.cameraY, this.state.cameraZ],
                  rotation: [-Math.PI / 2, 0, 0],
                  near: 1,
                  far: 10000,
                }}
                raycaster={{ params: { Points: { threshold: 0.1 } } }}
              >
                <pointLight position={[-3000, 13000, -6000]} />
                <ambientLight intensity={0.01} />
                <color attach="background" args={["#070822"]} />
                <Controls
                  item={this.state.item}
                  buttonFlag={this.state.buttonFlag}
                  changeButtonFlag={this.changeButtonFlag.bind(this)}
                  // cameraFlag={this.state.cameraFlag}
                  changeCameraFlag={this.changeCameraFlag.bind(this)}
                  changeEnd={this.changeEnd.bind(this)}
                  changeStart={this.changeStart.bind(this)}
                />
                {/* <OrthographicCamera left={-window.innerWidth*0.65/2} right={window.innerWidth*0.65/2} top={window.innerHeight/2} bottom={-window.innerHeight/2} near={1} far={10000} 
                 /> */}
                <Particles
                  item={this.state.item}
                  cameraFlag={this.state.cameraFlag}
                  changeRotation={this.changeRotation.bind(this)}
                  fliter={this.state.fliter}
                  postitonX={this.state.postitonX}
                  postitonY={this.state.postitonY}
                  postitonZ={this.state.postitonZ}
                  rotationY={this.state.rotationY}
                  rotationZ={this.state.rotationZ}
                  rotationX={this.state.rotationX}
                  valuej={this.state.valuej}
                  valuej1={this.state.valuej1}
                  valuej2={this.state.valuej2}
                  valuej3={this.state.valuej3}
                  valueg={this.state.valueg1}
                  value={this.state.value1}
                  valuel={this.state.valuel}
                  // item={this.state.item}
                  lfc={this.lfc}
                  balance={this.balance}
                  footForm={this.footForm}
                  train={this.train}
                  pronation={this.pronation}
                  cameraX={this.cameraX}
                  cameraY={this.cameraY}
                  cameraZ={this.cameraZ}
                  pointCount={1024}
                  id={this.state.id}
                />
              </Canvas>
            </Com>
            {/* </div> */}
          </div>

          <div
            className="reportInput"
            onClick={() => {
              this.hiddenReport();
            }}
          >
            <div
              className="inputContent"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <div className="inputcontet">
                <div className="inputItem">请输入信息</div>
                <div className="inputItem">
                  <div className="itemName">姓名</div>
                  <Input
                    value={this.state.name}
                    onChange={(e) => {
                      this.setState({
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="inputItem">
                  <div className="itemName">性别</div>
                  <Radio.Group
                    onChange={this.onSexChange}
                    value={this.state.sex}
                  >
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                  </Radio.Group>
                </div>
                <div className="inputItem">
                  <div className="itemName">联系方式</div>
                  <Input
                    value={this.state.phone}
                    // type={'number'}
                    onChange={(e) => {
                      // const value=e.target.value

                      this.setState({
                        phone: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="reportButton">
                  <Button
                    onClick={() => {
                      this.showReport();
                    }}
                  >
                    生成报告
                  </Button>
                </div>
              </div>
              {/* <div className="qrCode">
                <QRCode
                  value={`http://192.168.31.220:3000/#/report?bedName=${
                    this.state.recomBed[0]?.bedName
                  }&bedImg=${this.state.recomBed[0]?.img}&bedNum=${
                    this.state.recomBed[0]?.num
                  }&nowBreath=${this.state.nowBreath.toFixed(0)}&nowMove=${
                    this.state.nowMove
                  }&nowPress=${this.state.nowPress.toFixed(0)}&name=${
                    this.state.name
                  }&sex=${this.state.sex}&phone=${this.state.phone}`}
                />
              </div> */}
            </div>
          </div>
          <div
            className="recomPage"
            onClick={() => {
              this.hiddenRecom();
            }}
          >
            {/* <div className="recomBgContent"> */}
            <div className="recomBg"></div>
            {/* </div> */}

            <div className="recomContent">
              {this.state.recomBed.map((item, index) => {
                return (
                  <div className="recomItem">
                    <div
                      className="recomInfos"
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="recomImg"
                        style={{
                          backgroundImage: `url(${item.img})`,
                          width: "100%",
                        }}
                      >
                        {/* <img src={bed1} alt="" /> */}
                      </div>
                      <div className="recomName">{item.bedName}</div>
                    </div>
                    <div className="recomed">
                      推荐指数:&nbsp;
                      {new Array(5).fill(0).map((items, indexs) => {
                        return (
                          <img
                            key={indexs}
                            style={{
                              display: indexs < item.num ? "unset" : "none",
                            }}
                            src={star}
                            alt=""
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {this.state.recomBed.length == 0 ? (
                <div style={{ fontSize: "2rem" }}>
                  Please select the current mattress style
                </div>
              ) : null}

              {/* <div className="recomItem">
                <div className="recomInfos"  style={{height : '100%' , display : 'flex' , alignItems : 'center'}}>
                  <div className="recomImg" style={{   
                    backgroundImage: "url('./img/bed1.png')" ,
                    width : '100%' }}>
                
                  </div>
                  <div className="recomName">意境床垫</div>
                </div>
                <div className="recomed">
                  推荐指数:
                  {new Array(5).fill(0).map((item, index) => {
                  
                    return (
                      <img
                        key={index}
                        style={{ display: index < 4 ? "unset" : "none" }}
                        src={star}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
              <div className="recomItem">
                <div className="recomInfos" style={{height : '100%' , display : 'flex' , alignItems : 'center'}}>
                  <div className="recomImg" style={{   
                    backgroundImage: "url('./img/bed1.png')" ,
                  width : '100%' }}>
               
                  </div>
                  <div className="recomName">意境床垫</div>
                </div>
                <div className="recomed">
                  推荐指数:
                  {new Array(5).fill(0).map((item, index) => {
               
                    return (
                      <img
                        key={index}
                        style={{ display: index < 4 ? "unset" : "none" }}
                        src={star}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
              <div className="recomItem">
                <div className="recomInfos" style={{height : '100%' , display : 'flex' , alignItems : 'center'}}>
                  <div className="recomImg" style={{   
                    backgroundImage: "url('./img/bed1.png')" ,
                    width : '100%' }}>
               
                  </div>
                  <div className="recomName">意境床垫</div>
                </div>
                <div className="recomed">
                  推荐指数:
                  {new Array(5).fill(0).map((item, index) => {
               
                    return (
                      <img
                        key={index}
                        style={{ display: index < 4 ? "unset" : "none" }}
                        src={star}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
              <div className="recomItem">
                <div className="recomInfos" style={{height : '100%' , display : 'flex' , alignItems : 'center'}}>
                  <div className="recomImg" style={{   
                    backgroundImage: "url('./img/bed1.png')" ,
                    width : '100%' }}>
           
                  </div>
                  <div className="recomName">意境床垫</div>
                </div>
                <div className="recomed">
                  推荐指数:
                  {new Array(5).fill(0).map((item, index) => {
               
                    return (
                      <img
                        key={index}
                        style={{ display: index < 4 ? "unset" : "none" }}
                        src={star}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div
          className="reportPage homeReportPage"
          onClick={() => {
            this.hiddenRealReport();
          }}
        >
           <div
            className="reportInput1"
            onClick={(event) => {
              this.hiddenQrcode();
              event.stopPropagation();
            }}
          >
            <div
              className="inputContent"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <div className="qrCode">
                <QRCode
                  value={`http://192.168.31.220:3000/#/report?bedName=${
                    this.state.recomBed[0]?.bedName
                  }&bedImg=${this.state.recomBed[0]?.img}&bedNum=${
                    this.state.recomBed[0]?.num
                  }&nowBreath=${this.state.nowBreath.toFixed(0)}&nowMove=${
                    this.state.nowMove
                  }&nowPress=${this.state.nowPress.toFixed(0)}&name=${
                    this.state.name
                  }&sex=${this.state.sex}&phone=${this.state.phone}`}
                />
              </div>
            </div>
          </div>
          <div
            id="node"
            className="reportContent"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            
            <div className="reportTitle">
              <img src={nature} alt="" />
              <img src={titleRight} alt="" />
            </div>
            <div className="reportMain fontFounder">专属定制报告</div>
            <div className="personContent">
              <div className="personImg">
                <img src={body} alt="" />
              </div>
              <div className="personInfo">
                <p>姓名: {this.state.name}</p>
                <p>性别: {this.state.sex == 1 ? "男" : "女"}</p>
                <p>联系方式: {this.state.phone}</p>
              </div>
            </div>

            <div className="reportDataContent">
              <div className="dataItem">
                <img className="dataItemImg" src={item} alt="" />
                <div>
                  <div>呼吸</div>
                  <div>{this.state.nowBreath}次/min</div>
                </div>
              </div>
              <div className="dataItem">
                <img className="dataItemImg" src={item} alt="" />
                <div>
                  <div>体动</div>
                  <div>{this.state.nowMove}次/min</div>
                </div>
              </div>
              <div className="dataItem">
                <img className="dataItemImg" src={item} alt="" />
                <div>
                  <div>平均压力</div>
                  <div>{this.state.nowPress.toFixed(0)}mmhg</div>
                </div>
              </div>
            </div>

            <div className="reportRecom">
              <img src={recomBox} alt="" />
              <div className="reportRecomBed">
                <div className="reportRecomInfo">
                  <div className="reportRecomImg">
                    <img src={this.state.recomBed[0]?.img} alt="" />
                  </div>
                  <div className="reportRecomName">
                    {this.state.recomBed[0]?.bedName}
                  </div>
                </div>
                <div className="reportRecomed">
                  推荐指数:&nbsp;
                  {new Array(5).fill(0).map((item, index) => {
                    return (
                      <img
                        key={index}
                        style={{
                          display:
                            index < this.state.recomBed[0]?.num
                              ? "unset"
                              : "none",
                        }}
                        src={star}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: "80%",
              backgroundColor: "#0f0f40",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={(event) => {
                // this.getBlobPng();
                this.showQrcode()
                event.stopPropagation();
              }}
            >
              导出专属报告
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default Anta;
