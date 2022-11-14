/** @format */

import React, {useMemo, useRef} from 'react'
import {Canvas, useFrame} from 'react-three-fiber'
import Controls from './Controls'
import {TextureLoader} from 'three'
import Compute from '../../assets/js/Compute'
import './anta copy.css'
import {Slider, Button, Select, message} from 'antd'
import litter from '../../assets/images/litter.png'
import 'antd/dist/antd.css'
import nature from '../../assets/images/nat.png'
import side from '../../assets/images/sidenormal.png'
import {CSVLink, CSVDownload} from 'react-csv'
import {interp, gaussBlur_1, jet, addSide} from '../../assets/js/util'
import './bed.scss'
let wsPointData = []
let collection = [] //JSON.parse(localStorage.getItem('collection')) ? JSON.parse(localStorage.getItem('collection')) : [['数据','软硬','床号','睡姿','性别','姓名','体重','城市','年龄','身高','其他','健康状况','基础病史','联系方式']]
let csvData
let wsPointData1 = new Array(2048).fill(0)
const SEPARATION = 20,
  AMOUNTX = 64 + 2 * 4,
  AMOUNTY = 128 + 2 * 4
let ws, configWs
const {Option} = Select
let smoothBig = new Array(AMOUNTX * AMOUNTY).fill(1)

let bigArrg = new Array(AMOUNTX * AMOUNTY).fill(1)
let bigArrp = new Array(AMOUNTX * AMOUNTY).fill(1)
let sleepType
let timerErr
let wsFlag = false
let computeResult
let firstData = new Array(1024).fill(1)
let lastData = new Array(1024).fill(1)
const itemArr = ['俯视图', '平视图', '三维图']
const bedArr = [
  '梦境经典',
  '新梦境Z-Classic',
  '心境系列',
  '尚境系列',
  '意境系列',
  '强护脊',
  '生态英雄',
  '净界系列',
  '正棕Z3系列',
  '正棕Z5系列',
  'Z6心境系列',
  '新幻境',
  '梵境系列',
  '翡洛奇（丝蒂娜）',
  '翡洛奇（苏菲雅）',
  '清雅系列',
  '舒适S3系列',
  'S2舒雅系列',
  'S-冠军系列',
  'X7臻耀系列',
  '快乐时光（思乐）',
  '快乐时光（思怡）',
  '学生垫',
  '婴堡系列（YB)',
  '婴堡系列（YC)',
  '婴堡系列（YE)',
  '乳胶床垫',
  '麻知眠',
  '清新PLUS系列',
  '荣耀V11',
]

let cameraPosition = {}
let cameraX = 0
let cameraY = 1400
let cameraZ = 0
const id = new Date().getTime()
let nowId

function Particles(props) {
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
console.log(1111111)
    if (props.item === 2) {
      state.camera.position.z = 2
    } else {
      state.camera.position.z = 0
    }

    if (
      parseInt(cameraPosition.x) !== parseInt(state.camera.position.x) ||
      parseInt(cameraPosition.y) !== parseInt(state.camera.position.y) ||
      parseInt(cameraPosition.z) !== parseInt(state.camera.position.z)
    ) {
      if (configWs.readyState === 1) {
        configWs.send(
          JSON.stringify({
            camera: state.camera.position,
            id,
          }),
        )
      }
    }
    if (id != nowId) {
      state.camera.position.x = cameraX
      state.camera.position.y = cameraY
      state.camera.position.z = cameraZ
    }

    //线性插值
    interp(wsPointData, bigArrp, 64 + 4, 32 + 4)

    //高斯滤波
    gaussBlur_1(bigArrp, bigArrg, 128 + 2 * 4, 64 + 2 * 4, props.valueg)
    //缩放

    if (wsPointData.length > 0) {
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
      rotation={[props.rotationX, props.rotationY, props.rotationZ]}>
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
      wsPointData = jsonObject.data
      // let arr = []

      // if(jsonObject.dataNum === 0){
      //   firstData = jsonObject.data
      // }else{
      //   lastData = jsonObject.data.+
      // }

      // for(let i = 0 ; i < 32 ; i ++){
      //   for(let j = 0 ; j < 32 ;j ++){
      //     arr.push(firstData[i*32 + j])
      //   }
      //   for(let j = 0 ; j < 32 ;j ++){
      //     arr.push(lastData[i*32 + j])
      //   }
      // }

      // wsPointData = arr

      wsPointData1 = [...wsPointData]

      wsPointData = wsPointData.map(a => {
        if (a < this.state.filter) {
          return 0
        } else {
          return a
        }
      })
      /**
       * 添加边框(避免高斯溢出)
       * */
      wsPointData = addSide(wsPointData, 64, 32, 2, 2, 0)

      /**
       * 计算压力最大面积，最大值，平均值
       * */
    } else {
    }
  }
  componentDidMount() {
    // myChart1 = echarts.init(document.getElementById(`myChart1`));
    // let numFlag = 0
    // const button1 = document.getElementById('button1')
    // const button2 = document.getElementById('button2')
    // const button3 = document.getElementById('button3')
    // setInterval(() => {
    //   if(numFlag < 360){
    //     // button1.click()
    //     this.submit()
    //     numFlag ++
    //   }else{
    //     numFlag = 0 
    //     button2.click()
    //     // button3.click();
    //     this.download()
    //   }
    // } ,500)

    const doc = document.documentElement
    doc.style.fontSize = `${window.innerWidth / 100}px`
    doc.addEventListener('DOMContentLoaded', Resize)

    window.addEventListener('resize', Resize)
    timerErr = setInterval(() => {
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

          if (objData.hasOwnProperty('gaussian')) {
            this.setState({
              valueg1: objData.gaussian,
            })
          }

          if (objData.hasOwnProperty('camera') && id != objData.id) {
            cameraX = objData.camera.x
            cameraY = objData.camera.y
            cameraZ = objData.camera.z
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

      if (objData.hasOwnProperty('camera') && id != objData.id) {
        cameraX = objData.camera.x
        cameraY = objData.camera.y
        cameraZ = objData.camera.z
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
      csvData: '',
      data: '0',
      number: JSON.parse(localStorage.getItem('collection'))
        ? JSON.parse(localStorage.getItem('collection')).length
        : 0,
      bed: '梦境经典',
      sleep: '0',
      valueArr: [],
      sex: '男',
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
    if (ws) {
      ws.close()
    }
  }

  initCharts(props) {
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

          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 1,
                  color: '#266689', // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: '#10152b', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
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

  submit() {
    message.info('采集成功')

    let data = [
      JSON.stringify(wsPointData1),
      this.state.data,
      this.state.bed,
      this.state.sleep,
      this.state.sex,
      ...this.state.valueArr,
    ]
    // let data = [JSON.stringify(bedArr)]

    // let data = []
    // for(let i = 0 ; i < bedArr.length; i++){
    //   data.push(bedArr[i])
    // }
    collection.push(data)

    localStorage.setItem('collection', JSON.stringify(collection))
    csvData = JSON.parse(localStorage.getItem('collection'))
    this.setState({
      csvData: JSON.parse(localStorage.getItem('collection')),
      number: this.state.number + 1,
    })
    // this.setState({})
  }

  changeItem(index) {
    this.setState({
      item: index,
    })
    if (index === 0) {
      this.changeRotation(0, 0, 0)
      this.setState({
        cameraZ: 0,
      })
    } else if (index === 1) {
      this.changeRotation(Math.PI / 2, 0, 0)
      this.setState({
        cameraZ: 0,
      })
    } else if (index === 2) {
      this.changeRotation(-Math.PI / 8, 0, 0)
      this.setState({
        cameraZ: 2,
      })
    }
  }

  changeCameraFlag(value) {
    this.setState({
      cameraFlag: value,
    })
  }
  download() {
    message.info('删除成功')
    collection = []
    localStorage.removeItem('collection')
    this.setState({number: 0})
  }

  handleChange(value) {
    this.setState({data: value})
  }
  handleBedChange(value) {
    this.setState({bed: value})
  }
  handleSleepChange(value) {
    this.setState({sleep: value})
  }
  handleSexChange(value) {
    this.setState({sex: value})
  }
  changeValue(value, e) {
    const valueArr = this.state.valueArr
    valueArr[value] = e.target.value
    this.setState({
      valueArr: valueArr,
    })
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
            style={{position: 'fixed', bottom: 30, left: 0, backgroundColor: '#070822', zIndex: 2, width: '100%'}}>
            <div>
              {itemArr.map((item, index) => {
                return (
                  <button
                    key={item}
                    onClick={() => {
                      if (configWs.readyState === 1) {
                        configWs.send(
                          JSON.stringify({
                            item: index,
                          }),
                        )
                      }

                      this.changeItem(index)
                    }}>
                    {item}
                  </button>
                )
              })}
            </div>
            <div style={{display: 'flex', width: '65%'}}>
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
            <div style={{display: 'flex', width: '65%'}}>
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

          <div
            style={{width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#070822'}}
            ref={this.canvas}>
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
              cameraZ={this.state.cameraZ}>
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

          <div className="content col">
            <div style={{marginBottom: 10, marginTop: '32%'}}>
              <Select
                defaultValue="梦境经典"
                style={{width: 140, marginRight: 10}}
                onChange={this.handleBedChange.bind(this)}>
                {bedArr.map((item, index) => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  )
                })}
              </Select>

              <Select defaultValue="0" style={{width: 140}} onChange={this.handleChange.bind(this)}>
                <Option value="0">过硬</Option>
                <Option value="1">偏硬</Option>
                <Option value="2">软硬适中</Option>
                <Option value="3">偏软</Option>
                <Option value="4">过软</Option>
              </Select>
            </div>
            <div style={{marginBottom: 10}}>
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="姓名"
                onChange={this.changeValue.bind(this, 0)}
              />
              <Select defaultValue={this.state.sex} style={{width: 140}} onChange={this.handleSexChange.bind(this)}>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </div>
            <div style={{marginBottom: 10}}>
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="体重"
                onChange={this.changeValue.bind(this, 1)}
              />
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="城市"
                onChange={this.changeValue.bind(this, 2)}
              />
            </div>
            <div style={{marginBottom: 10}}>
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="年龄"
                onChange={this.changeValue.bind(this, 3)}
              />
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="身高"
                onChange={this.changeValue.bind(this, 4)}
              />
            </div>
            <div style={{marginBottom: 10}}>
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="其他"
                onChange={this.changeValue.bind(this, 5)}
              />
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="健康状况"
                onChange={this.changeValue.bind(this, 6)}
              />
            </div>
            <div style={{marginBottom: 10}}>
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="基础病史"
                onChange={this.changeValue.bind(this, 7)}
              />
              <input
                type="text"
                style={{width: 140, marginRight: 10}}
                placeholder="联系方式"
                onChange={this.changeValue.bind(this, 8)}
              />
            </div>
            <div style={{marginBottom: 10}}>
              <Button
                id="button3"
                plain={true}
                style={{marginRight: 10, width: 140}}
                onClick={() => {
                  this.download()
                }}>
                删除数据
              </Button>
              <Select defaultValue="0" style={{width: 140}} onChange={this.handleSleepChange.bind(this)}>
                <Option value="0">平躺</Option>
                <Option value="1">侧睡</Option>
                <Option value="2">趴睡</Option>
                <Option value="3">重物</Option>
              </Select>
            </div>
            <div style={{marginBottom: 10}}>
              <Button id="button2" style={{width: 140, marginRight: 10}}>
                <CSVLink data={this.state.csvData} style={{color: 'black', textDecoration: 'none'}}>
                  下载数据
                </CSVLink>
              </Button>

              <Button
                id="button1"
                style={{width: 140}}
                plain={true}
                onClick={() => {
                  this.submit()
                }}>
                采集
              </Button>
            </div>

            <div style={{fontSize: 30, color: 'white'}}>{this.state.number}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Anta
