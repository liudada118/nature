import React, { useEffect, useState } from 'react';

let firstData, lastData;
export default function Data() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:19999');

    ws.onopen = () => {
      // connection opened
      console.info('connect success');
    };
    ws.onmessage = (e) => {
      let jsonObject = JSON.parse(e.data);
      //处理空数组
      console.log(jsonObject);
      if (jsonObject.data != null) {
        let wsPointData = jsonObject.data;

        let ndata = wsPointData;

        // for (let i = 0; i < 8; i++) {
        //   for (let j = 0; j < 32; j++) {
        //     [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
        //       wsPointData[(15 - i) * 32 + j],
        //       wsPointData[i * 32 + j],
        //     ];
        //   }
        // }

        // for (let i = 0; i < 32; i++) {
        //   for (let j = 16; j < 24; j++) {
        //     [wsPointData[i * 32 + j], wsPointData[i * 32 + 31 + 16 - j]] = [
        //       wsPointData[i * 32 + 31 + 16 - j],
        //       wsPointData[i * 32 + j],
        //     ];
        //   }
        // }


        // 32*32
        // let a = [];
        // for (let i = 0; i < 32; i++) {
        //   a[i] = [];
        //   for (let j = 0; j < 32; j++) {
        //     a[i].push(wsPointData[i * 32 + j]);
        //   }
        // }

        // // wsPointData = a;
        // console.log(a);
        // setData(a);


        // 32*64
        if (wsPointData[wsPointData.length - 1] == 0) {
          firstData = [...wsPointData];
          firstData.pop();
          // 右边线序
          // for (let i = 0; i < 32; i++) {
          //   for (let j = 0; j < i; j++) {
          //     [firstData[i * 32 + j], firstData[(j) * 32 + i]] = [firstData[(j) * 32 + i], firstData[i * 32 + j]]
          //   }
          // }
          // for (let i = 0; i < 32; i++) {
          //   for (let j = 0; j < 8; j++) {
          //     [firstData[i * 32 + j], firstData[i * 32 + 16 - j]] = [firstData[i * 32 + 16 - j], firstData[i * 32 + j]]
          //   }
          // }

          // for(let i = 0 ; i < 16 ; i++){
          // 	for(let j = 0 ; j < 32 ; j++){
          // 		[firstData[i*32 + j] ,firstData[(31-i)*32+j] ] = [firstData[(31-i)*32+j],firstData[i*32 + j]  ]
          // 	}
          // }

          // for(let i = 0; i < 32 ; i++){
          // 	for(let j = 0 ; j < 8 ; j ++){
          // 		[firstData[i*32 + 15 + j] , firstData[i*32 + 31 - j]] = [ firstData[i*32 + 31 - j],firstData[i*32 + 15 + j]]
          // 	}
          // }
        }
        else if (wsPointData[wsPointData.length - 1] == 1) {
          lastData = [...wsPointData];
          lastData.pop();
          // for(let i = 0 ; i < 32 ; i ++ ){
          //   for(let j = 0 ; j < 9 ; j ++){
          //     [lastData[i*32 + 16-j] , lastData[i*32 + j]] = [lastData[i*32 + j] ,lastData[i*32 + 16-j] ]
          //   }
          // }
          // 左边线序
          // for (let i = 0; i < 16; i++) {
          //   for (let j = 0; j < 32; j++) {
          //     [lastData[i * 32 + j], lastData[(31 - i) * 32 + j]] = [lastData[(31 - i) * 32 + j], lastData[i * 32 + j]]
          //   }
          // }

          // for (let i = 0; i < 32; i++) {
          //   for (let j = 0; j < 8; j++) {
          //     [lastData[i * 32 + 15 + j], lastData[i * 32 + 31 - j]] = [lastData[i * 32 + 31 - j], lastData[i * 32 + 15 + j]]
          //   }
          // }

          //  for(let i = 0 ; i < 32 ; i++){
          // 	for(let j = 0 ; j <i ; j++){
          // 		[lastData[i*32+j] , lastData[(j)*32+i]] = [lastData[(j)*32+i],lastData[i*32+j] ]
          // 	}
          // }
          // for(let i = 0; i < 32 ; i++){
          // 	for(let j = 0 ; j < 8  ; j ++){
          // 		[lastData[i*32  + j] , lastData[i*32 + 16 - j]] = [ lastData[i*32 + 16 - j],lastData[i*32 + j]]
          // 	}
          // }

          // 添加

          let a = [];
          for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 32; j++) {
              a.push(firstData[i * 32 + j]);
            }
            for (let j = 0; j < 32; j++) {
              a.push(lastData[i * 32 + j]);
            }
          }
          // console.log(a)
          wsPointData = a;
          

          let b = []
        for (let i = 0; i < 32; i++) {
          b[i] = []
          for (let j = 0; j < 64; j++) {
            b[i].push(wsPointData[i * 64 + j])
          }
        }

        // wsPointData = a;
        // console.log(a)
        setData(b)
          // setData(a);
        }

      }
    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };
  }, []);

  return (
    <div style={{  paddingTop: '100px', color: 'white' }}>
      <div>
        座椅
        {data.map((items, indexs) => {
          return (
            <div key={indexs} style={{ display: 'flex' }}>
              {items && items.length
                ? items.map((item, index) => {
                    return (
                      <div key={index} style={{ width: '30px', color: '#000' }}>
                        {item}
                      </div>
                    );
                  })
                : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
