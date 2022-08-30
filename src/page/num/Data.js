/** @format */

import React, {useEffect,useState} from 'react'

export default function Data() {
    const [data, setData] = useState([]);
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.31.40:8080/serial/11')

    ws.onopen = () => {
      // connection opened
      console.info('connect success')
    }
    ws.onmessage = e => {
      let jsonObject = JSON.parse(e.data)
      //处理空数组
      console.log(jsonObject)
      if (jsonObject.data != null) {
        const wsPointData = jsonObject.data

        let ndata = wsPointData

        let a = []
        for (let i = 0; i < 32; i++) {
          a[i] = []
          for (let j = 0; j < 64; j++) {
            a[i].push(wsPointData[i * 32 + j])
          }
        }

        // wsPointData = a;
        console.log(a)
        setData(a)
      }
    }
    ws.onerror = e => {
      // an error occurred
    }
    ws.onclose = e => {
      // connection closed
    }
  }, [])
  return (
    <div style={{position: 'fixed', top: '100px', color: 'white'}}>
      <div>
        {data.map((items, indexs) => {
          return (
            <div key={indexs} style={{display: 'flex'}}>
              {items && items.length
                ? items.map((item, index) => {
                    return (
                      <div key={index} style={{width: '30px', color: '#000'}}>
                        {item}
                      </div>
                    )
                  })
                : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
