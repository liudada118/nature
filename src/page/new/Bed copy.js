/** @format */

import React, {useMemo, useRef} from 'react'
import {Canvas, useFrame} from 'react-three-fiber'
import Controls from './Controls'
import {TextureLoader} from 'three'
import Compute from '../../assets/js/Compute'
import './anta copy.css'
import {Slider} from 'antd'
import litter from '@/assets/images/litter.png'
import nature from '@/assets/images/nat.png'
import side from '@/assets/images/sidenormal.png'
import {interp, gaussBlur_1, jet, addSide, stack} from '@/assets/js/util'
import * as echarts from 'echarts'

const SEPARATION = 20,
  AMOUNTX = 64 + 2 * 4,
  AMOUNTY = 128 + 2 * 4
let ws, configWs
let pageClose = false

let newState = [0, 0, 0],
  oldState = [0, 0, 0]

let sleepType
let timerErr
let wsFlag = false
let computeResult
const itemArr = ['俯视图', '平视图', '三维图', '设置']
let cameraPosition = {}
let cameraX = 0
let cameraRotationX = 0
let cameraRotationY = 0
let cameraRotationZ = 0
let cameraY = 1400
let cameraZ = 0
let rotation = [0, 0, 0]
let cameraFlag = false
const id = new Date().getTime()
let nowId

function Particles(props) {
  let bigArrg = new Array(AMOUNTX * AMOUNTY).fill(1)
  let bigArrp = new Array(AMOUNTX * AMOUNTY).fill(1)
  let smoothBig = new Array(AMOUNTX * AMOUNTY).fill(1)
  const spite = new TextureLoader().load(require('../../assets/images/circle.png'))
  const attrib = useRef()

  //变量放到内存，高速调用
  const [positions, colors] = useMemo(() => {
    let positions = [],
      colors = []
    let i = 0,
      j = 0
    for (let iy = 0; iy < AMOUNTX; iy++) {
      for (let ix = 0; ix < AMOUNTY; ix++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 - 1500 + ix // x
        positions[i + 1] = 0 // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2 + 500 // z

        colors[i] = 1
        colors[i + 1] = 0.1
        colors[i + 2] = 0

        i += 3
        j++
      }
    }

    return [new Float32Array(positions), new Float32Array(colors)]
    // }, [pointCount]);
  })

  let fSmooth = 0,
    LSmooth = 0
  useFrame(state => {
    // state.camera.lookAt(0,0,0)
    // console.log(cameraFlag)
    if (props.item === 2) {
      // state.camera.position.z = 2
    } else {
      state.camera.position.z = 0
    }

    if (
      (parseInt(cameraPosition.x) !== parseInt(state.camera.position.x) ||
        parseInt(cameraPosition.y) !== parseInt(state.camera.position.y) ||
        parseInt(cameraPosition.z) !== parseInt(state.camera.position.z)) &&
      cameraFlag
    ) {
      if (configWs.readyState === 1) {
        configWs.send(
          JSON.stringify({
            camera: state.camera.position,
            cameraRotation: state.camera.rotation,
            id,
          }),
        )
      }
    }
    // console.log('changeCamera', state.camera.rotation, state.camera.position, cameraFlag)

    if (ws.readyState === 1) {
      state.camera.position.x = cameraX
      state.camera.position.y = cameraY
      state.camera.position.z = cameraZ
      // state.camera.rotation.x = cameraRotationX
      // state.camera.rotation.y = cameraRotationY
      // state.camera.rotation.z = cameraRotationZ
      // console.log(state.camera.rotation.x)
    }
    // console.log(JSON.stringify(oldState) != JSON.stringify(newState),[state.camera.rotation.x,state.camera.rotation.y,state.camera.rotation.z,] ,newState,'rotation')
    if (ws.readyState === 1 && JSON.stringify(oldState) != JSON.stringify(newState)) {
      // console.log('change', newState)
      // state.camera.rotation.x = newState[0]
      // state.camera.rotation.y = newState[1]
      // state.camera.rotation.z = newState[2]
      oldState = newState
      state.scene.children[2].rotation.x = newState[0]
      state.scene.children[2].rotation.y = newState[1]
      state.scene.children[2].rotation.z = newState[2]
      // console.log(state.scene)

    }

    //线性插值
    interp(props.wsPointData, bigArrp, 64 + 4, 32 + 4)

    //高斯滤波
    gaussBlur_1(bigArrp, bigArrg, 128 + 2 * 4, 64 + 2 * 4, props.valueg)
    //缩放

    if (props.wsPointData.length > 0) {
      let i = 0,
        j = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const value = bigArrg[j] * 20

          //柔化处理smooth
          smoothBig[j] = smoothBig[j] + (value - smoothBig[j] + 0.5) / props.valuel

          positions[i + 1] = smoothBig[j] * props.value // y
          const rgb = jet(0, props.valuej, smoothBig[j])
          colors[i] = rgb[0] / 255
          colors[i + 1] = rgb[1] / 255
          colors[i + 2] = rgb[2] / 255

          i += 3
          j++
        }
      }

      attrib.current.geometry.attributes.position.needsUpdate = true
      attrib.current.geometry.attributes.color.needsUpdate = true
      // count += 0.1;
    }
    cameraPosition = {...state.camera.position}
  })

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
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          needsUpdate={true}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
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
  )
}

// 由于canvas不能重新渲染，也不会重新渲染，但是如果直接改变父组件的state，整个组件都会重新渲染体验不好（闪频情况），于是用一个不渲染组件包起来
class Com extends React.Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.valueg != this.props.valueg ||
      nextProps.valuej != this.props.valuej ||
      nextProps.value != this.props.value ||
      nextProps.valuef != this.props.valuef ||
      nextProps.valuel != this.props.valuel ||
      nextProps.rotationX != this.props.rotationX ||
      nextProps.rotationY != this.props.rotationY ||
      nextProps.rotationZ != this.props.rotationZ ||
      nextProps.cameraZ != this.props.cameraZ
    )
  }
  render() {
    return <>{this.props.children}</>
  }
}

class Anta extends React.Component {
  message(e) {
    if (wsFlag) {
      wsFlag = false
    }
    let jsonObject = JSON.parse(e.data)
    //处理空数组
    if (jsonObject.data != null) {
      this.wsPointData = jsonObject.data
      this.wsPointData1 = this.wsPointData

      this.wsPointData1 = this.wsPointData1.map(a => {
        if (a < this.state.filter) {
          return 0
        } else {
          return a
        }
      })
      /**
       * 添加边框(避免高斯溢出)
       * */
      this.wsPointData = addSide(this.wsPointData1, 64, 32, 2, 2, 0)

      /**
       * 计算压力最大面积，最大值，平均值
       * */
    } else {
      this.breathe.dataStable(jsonObject.breath)
      this.move.dataStable(jsonObject.bodyMove)
      // console.log(this.breathe.arr)
      this.initCharts({
        yData: this.breathe.arr,
        xData: new Array(20).fill(0),
        index: 0 + 1,
        name: 0,
        myChart: this.myChart1,
      })
      this.initCharts({
        yData: this.move.arr,
        xData: new Array(20).fill(0),
        index: 0 + 2,
        name: 0,
        myChart: this.myChart2,
      })
    }
  }
  componentDidMount() {
    this.wsPointData = new Array(36 * 68).fill(1)
    this.wsPointData1 = new Array(2048).fill(0)
    this.myChart1 = echarts.init(document.getElementById(`myChart1`))
    this.myChart2 = echarts.init(document.getElementById(`myChart2`))
    this.breathe = new stack(20)
    this.move = new stack(20)

    pageClose = false
    const doc = document.documentElement
    doc.style.fontSize = `${window.innerWidth / 100}px`
    doc.addEventListener('DOMContentLoaded', Resize)

    window.addEventListener('resize', Resize)
    timerErr = setInterval(() => {
      if (pageClose) {
        return
      }
      if (wsFlag) {
        ws = new WebSocket(`ws://192.168.31.40:8080/serial/${id}`)
        ws.onmessage = e => {
          this.message(e)
        }
        ws.onerror = e => {
          // an error occurred
          wsFlag = true
        }
        ws.onclose = e => {
          wsFlag = true
        }
        configWs = new WebSocket(`ws://192.168.31.40:8080/dataSyc/${id}`)

        configWs.onopen = () => {
          // connection opened
        }

        configWs.onmessage = e => {
          const objData = JSON.parse(e.data)
          // console.log(objData)
          if (objData.hasOwnProperty('gaussian')) {
            this.setState({
              valueg1: objData.gaussian,
            })
          }
          // console.log(id != objData.id)
          if (objData.hasOwnProperty('camera') && id != objData.id) {
            // console.log(22222)
            cameraX = objData.camera.x
            cameraY = objData.camera.y
            cameraZ = objData.camera.z
          }
          if (objData.hasOwnProperty('cameraRotation') && id != objData.id) {
            // console.log(22222)
            cameraRotationX = objData.cameraRotation.x
            cameraRotationY = objData.cameraRotation.y
            cameraRotationZ = objData.cameraRotation.z
          }
          if (objData.hasOwnProperty('color')) {
            this.setState({
              valuej1: objData.color,
            })
          }
          if (objData.hasOwnProperty('smooth')) {
            this.setState({
              valuel: objData.smooth,
            })
          }
          if (objData.hasOwnProperty('filter')) {
            this.setState({
              filter: objData.filter,
            })
          }
        }
        configWs.onerror = e => {
          // an error occurred
        }
        configWs.onclose = e => {}
      }
    }, 1000)

    function Resize() {
      doc.style.fontSize = `${window.innerWidth / 100}px`
    }

    configWs = new WebSocket(`ws://192.168.31.40:8080/dataSyc/${id}`)

    configWs.onopen = () => {
      // connection opened
    }

    configWs.onmessage = e => {
      const objData = JSON.parse(e.data)
      nowId = objData.id
      if (objData.hasOwnProperty('gaussian')) {
        this.setState({
          valueg1: objData.gaussian,
        })
      }
      // console.log(objData.hasOwnProperty('item') && id != objData.id, 'open')
      if (objData.hasOwnProperty('item')) {
        oldState = newState
        newState =
          objData.item == 0
            ? [0, 0, 0]
            : objData.item == 1
            ? [-Math.PI / 2, 0, 0]
            : objData.item == 2
            ? [-Math.PI / 8, 0, 0]
            : oldState
        // console.log(newState)
      }
      // console.log(objData,objData.hasOwnProperty('camera') && id != objData.id)
      if (objData.hasOwnProperty('camera') && id != objData.id) {
        // console.log('changeCameraBefore',objData.camera)
        cameraX = objData.camera.x
        cameraY = objData.camera.y
        cameraZ = objData.camera.z
      }
      if (objData.hasOwnProperty('rotation') && id != objData.id) {
        // console.log('changeCameraBefore',objData.camera)
        rotation = objData.rotation
      }
      if (objData.hasOwnProperty('color')) {
        this.setState({
          valuej1: objData.color,
        })
      }
      if (objData.hasOwnProperty('item')) {
        this.setState({
          item: objData.item,
        })
      }
      if (objData.hasOwnProperty('smooth')) {
        this.setState({
          valuel: objData.smooth,
        })
      }
      if (objData.hasOwnProperty('filter')) {
        this.setState({
          filter: objData.filter,
        })
      }
    }
    configWs.onerror = e => {
      // an error occurred
    }
    configWs.onclose = e => {}

    ws = new WebSocket(`ws://192.168.31.40:8080/serial/${id}`)
    ws.onopen = () => {
      // connection opened
    }

    ws.onmessage = e => {
      this.message(e)
    }
    ws.onerror = e => {
      // an error occurred
      wsFlag = true
    }
    ws.onclose = e => {
      wsFlag = true
    }
  }

  constructor(props) {
    super(props)
    this.start = React.createRef()
    this.drop = React.createRef()
    this.num = React.createRef()
    this.state = {
      filter: Number(localStorage.getItem('filter')) ? Number(localStorage.getItem('filter')) : 2,
      windowWidth: window.innerWidth,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      postitonX: window.innerWidth > 768 ? 860 : 860, //250,
      postitonY: window.innerWidth > 768 ? -400 : -400, //-250,
      postitonZ: window.innerWidth > 768 ? 200 : 200, //-450,
      time: 0,
      valuej1: Number(localStorage.getItem('valuej1')) ? Number(localStorage.getItem('valuej1')) : 400,
      valueg1: Number(localStorage.getItem('valueg1')) ? Number(localStorage.getItem('valueg1')) : 2,
      value1: Number(localStorage.getItem('value1')) ? Number(localStorage.getItem('value1')) : 0.08,
      valuef1: Number(localStorage.getItem('valuef1')) ? Number(localStorage.getItem('valuef1')) : 1000,
      valuel: Number(localStorage.getItem('valuel')) ? Number(localStorage.getItem('valuel')) : 10,
      bedFetchData1: 0,
      bedFetchData2: 0,
      numArr32: [],
      num: 1,
      item: 0,
      cameraZ: 0,
      cameraFlag: false,
      id: 0,
      display: false,
      click: false,
    }
    this.cameraX = 0
    this.cameraY = 1400
    this.cameraZ = 0
    this.bedFetchData1 = React.createRef()
    this.lfc = React.createRef()
    this.balance = React.createRef()
    this.footForm = React.createRef()
    this.train = React.createRef()
    this.pronation = React.createRef()
    this.footType = React.createRef()
    this.press = React.createRef()
    this.pressArea = React.createRef()
    this.pressAver = React.createRef()
    this.pressMax = React.createRef()
    this.breathPause = React.createRef()
    this.stroke = React.createRef()
    this.sleepType = React.createRef()
    this.img = React.createRef()
  }

  componentWillUnmount() {
    pageClose = true
    if (ws) {
      console.log(1111)

      ws.close()
    }
    if (configWs) {
      console.log(1111)
      configWs.close()
    }
  }

  initCharts(props) {
    // console.log(props.xData, props.yData)
    let option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        show: 'true',
      },
      xAxis: {
        type: 'category',
        data: props.xData,
        axisLabel: {
          show: true,
          textStyle: {
            color: 'transparent',
          },
        },
      },
      grid: {
        top: this.state.windowWidth > 768 ? 40 : 20,
        left: this.state.windowWidth > 768 ? 40 : 10,
        bottom: this.state.windowWidth > 768 ? 40 : 10,
        right: this.state.windowWidth > 768 ? 40 : 10,
      },
      yAxis: {
        type: 'value',
        splitLine: {show: false},
        max: this.state.valuef1,
        axisLabel: {
          show: true,
          textStyle: {
            color: 'transparent',
          },
        },
      },
      series: [
        {
          symbol: 'none',
          data: props.yData,
          type: 'line',
          smooth: true,
          color: '#3591c3',

          itemStyle: {
            normal: {
              lineStyle: {
                color: '#00FF00',
              },
            },
          },
        },
        {},
      ],
    }

    option && props.myChart.setOption(option)

    window.addEventListener('resize', function () {
      props.myChart.resize()
    })
  }

  changeValueg(value) {
    this.setState({valueg: value})
  }
  changeValuej(value) {
    this.setState({valuej: value})
  }
  changeFliter(value) {
    this.setState({fliter: value})
  }
  changeRotation(x, y, z) {
    if (x !== undefined) {
      this.setState({
        rotationX: x,
      })
    }
    if (y !== undefined) {
      this.setState({
        rotationY: y,
      })
    }
    if (z !== undefined) {
      this.setState({
        rotationZ: z,
      })
    }
  }

  changeItem(index) {
    this.setState({
      item: index,
    })
    if (index === 3) {
      this.setState({
        display: !this.state.display,
      })
    } else if (index === 0) {
      this.changeRotation(0, 0, 0)
      this.setState({
        cameraZ: 0,
      })
      if (configWs.readyState === 1) {
        configWs.send(
          JSON.stringify({
            item: index,
            rotation: [0, 0, 0],
            id,
          }),
        )
      }
    } else if (index === 1) {
      this.changeRotation(-Math.PI / 2, 0, 0)
      this.setState({
        cameraZ: 0,
      })
      if (configWs.readyState === 1) {
        configWs.send(
          JSON.stringify({
            item: index,
            rotation: [-Math.PI / 2, 0, 0],
            id,
          }),
        )
      }
    } else if (index === 2) {
      this.changeRotation(-Math.PI / 8, 0, 0)
      this.setState({
        cameraZ: 2,
      })
      if (configWs.readyState === 1) {
        configWs.send(
          JSON.stringify({
            item: index,
            rotation: [-Math.PI / 8, 0, 0],
            id,
          }),
        )
      }
    }
  }

  changeCameraFlag(value) {
    console.log(111, value)
    cameraFlag = value
  }

  render() {
    return (
      <>
        {/* <div style={{backgroundColor: 'rgba(0,0,0,0)', position: 'fixed', color: 'white', zIndex: 5, top: 100}}>
          <div style={{fontSize : 30 , color : 'white'}}> {this.state.num}</div>
          {this.state.numArr32.map((items, index) => {
            return (
              <div style={{display: 'flex'}}>
                {items?.map((item, index) => {
                  return (
                    <div
                      style={{
                        width: 20,
                        color : item < 100 ? 'black' : 'white' 
                      }}>
                      {item}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div> */}
        <div style={{width: '100%', height: '100vh', overflow: 'hidden', position: 'relative'}}>
          <div style={{position: 'fixed', top: 30, left: 30, zIndex: 2, width: '10%'}}>
            <img src={nature} style={{width: '100%'}} alt="" />
          </div>

          <div
            className="com"
            style={{
              position: 'fixed',
              bottom: 30,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0)',
              zIndex: 2,
              width: '100%',
            }}>
            <div>
              {itemArr.map((item, index) => {
                return (
                  <button
                    key={item}
                    onClick={() => {
                      this.changeItem(index)
                    }}>
                    {item}
                  </button>
                )
              })}
            </div>
            <div style={{display: this.state.display ? 'unset' : 'none'}}>
              <div style={{display: 'flex', width: '65%', backgroundColor: 'rgba(0,0,0,0)'}}>
                <div className="smooth">
                  <div>坐垫润滑程度</div>
                  <Slider
                    min={0.1}
                    max={8}
                    onChange={value => {
                      localStorage.setItem('valueg1', value)
                      this.setState({valueg1: value})
                      if (configWs.readyState === 1) {
                        configWs.send(
                          JSON.stringify({
                            gaussian: value,
                          }),
                        )
                      }
                    }}
                    value={this.state.valueg1}
                    step={0.1}
                    // value={}
                    style={{flex: 1}}
                  />
                </div>
                <div className="color">
                  <div>坐垫颜色饱和度</div>
                  <Slider
                    min={100}
                    max={1200}
                    onChange={value => {
                      localStorage.setItem('valuej1', value)
                      this.setState({valuej1: value})
                      if (configWs.readyState === 1) {
                        configWs.send(
                          JSON.stringify({
                            color: value,
                          }),
                        )
                      }
                    }}
                    value={this.state.valuej1}
                    step={10}
                    // value={}
                    style={{flex: 1}}
                  />
                </div>
                <div className="position">
                  <div>positionZ</div>
                  <Slider
                    min={0.01}
                    max={0.3}
                    onChange={value => {
                      localStorage.setItem('value1', value)
                      this.setState({value1: value})
                    }}
                    value={this.state.value1}
                    step={0.01}
                    // value={}
                    style={{flex: 1}}
                  />
                </div>
              </div>
              <div style={{display: 'flex', width: '65%', backgroundColor: 'rgba(0,0,0,0)'}}>
                <div className="data">
                  <div>数据连贯性</div>
                  <Slider
                    min={1}
                    max={20}
                    onChange={value => {
                      this.setState({valuel: value})
                      localStorage.setItem('valuel', value)
                      if (configWs.readyState === 1) {
                        configWs.send(
                          JSON.stringify({
                            smooth: value,
                          }),
                        )
                      }
                    }}
                    value={this.state.valuel}
                    step={1}
                    // value={}
                    style={{flex: 1}}
                  />
                </div>
                <div className="filter">
                  <div>过滤值</div>
                  <Slider
                    min={1}
                    max={100}
                    onChange={value => {
                      this.setState({filter: value})
                      localStorage.setItem('filter', value)
                      if (configWs.readyState === 1) {
                        configWs.send(
                          JSON.stringify({
                            filter: value,
                          }),
                        )
                      }
                    }}
                    value={this.state.filter}
                    step={1}
                    // value={}
                    style={{flex: 1}}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'black'}} ref={this.canvas}>
            {/* <div style={{display : 'none'}}> */}
            <Com
              valueg={this.state.valueg1}
              valuej={this.state.valuej1}
              value={this.state.value1}
              valuef={this.state.valuef}
              valuel={this.state.valuel}
              rotationY={this.state.rotationY}
              rotationZ={this.state.rotationZ}
              rotationX={this.state.rotationX}
              cameraZ={this.state.cameraZ}
              cameraFlag={this.state.cameraFlag}>
              {/* <video src={video}></video> */}
              <Canvas
                gl={{antialias: false, alpha: false}}
                style={{width: window.innerWidth > 768 ? '65%' : '100%', height: '100%', backgroundColor: 'black'}}
                camera={{zoom: 1, fov: 65, position: [0, 1400, this.state.cameraZ], near: 1, far: 10000}}
                raycaster={{params: {Points: {threshold: 0.1}}}}>
                <pointLight position={[-3000, 13000, -6000]} />
                <ambientLight intensity={0.01} />
                <color attach="background" args={['#070822']} />
                <Controls cameraFlag={this.state.cameraFlag} changeCameraFlag={this.changeCameraFlag.bind(this)} />
                {/* <OrthographicCamera left={-window.innerWidth*0.65/2} right={window.innerWidth*0.65/2} top={window.innerHeight/2} bottom={-window.innerHeight/2} near={1} far={10000} 
                 /> */}
                <Particles
                  cameraFlag={this.state.cameraFlag}
                  changeRotation={this.changeRotation.bind(this)}
                  fliter={this.state.fliter}
                  postitonX={this.state.postitonX}
                  postitonY={this.state.postitonY}
                  postitonZ={this.state.postitonZ}
                  rotationY={this.state.rotationY}
                  rotationZ={this.state.rotationZ}
                  rotationX={this.state.rotationX}
                  valuej={this.state.valuej1}
                  valueg={this.state.valueg1}
                  wsPointData = {this.wsPointData}
                  wsPointData1 = {this.wsPointData1}
                  value={this.state.value1}
                  valuel={this.state.valuel}
                  item={this.state.item}
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

          <div className="content bed">
            <div className="realCharts">
              <div className="breathe">
                <div className="breatheInfo chartInfo">
                  <div className="breatheText">呼吸</div>
                  <div className="breatheData">16/次</div>
                </div>
                <div className="breatheChart">
                  <div id="myChart1" style={{flex: '0 0 40%', height: 150}}></div>
                </div>
              </div>
              <div className="move">
                <div className="moveInfo chartInfo">
                  <div className="moveText">体动</div>
                  <div className="breatheData">568</div>
                </div>
                <div className="breatheChart">
                  <div id="myChart2" style={{flex: '0 0 40%', height: 150}}></div>
                </div>
              </div>
            </div>
            <div className="bedComfor">
              <div className="bedComText">床垫舒适度</div>
              <div className="bedContent">
                <div className="bedData">
                  <div className="sleepPos">睡姿: 侧卧</div>
                  <div className="spine">脊柱: 正常</div>
                </div>
                <div className="bedImg">
                  <img src={litter} alt="" />
                </div>
              </div>
              <div className="bedStatus"></div>
            </div>
            <div className="recom"></div>
          </div>
        </div>
      </>
    )
  }
}

export default Anta
