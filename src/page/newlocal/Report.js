/** @format */

import React from "react";
import nature from "../../assets/images/nat.png";
import item from "../../assets/image1/item.png";
import titleRight from "../../assets/image1/titleRight.png";
import body from "../../assets/image1/body.png";
import recomBox from "../../assets/image1/recomBox.png";
import bed1 from "../../assets/images/bed1.png";
import star from "../../assets/image1/star.png";
import { Button } from "antd";
import { useState } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useEffect } from "react";
import html2canvas from "html2canvas";
export default function Report(props) {
console.log(props)
const [img, setImg] = useState()
function Resize() {
  const doc = document.documentElement;
  doc.style.fontSize = `${window.innerWidth / 100}px`;
  console.log(doc.style.fontSize )
}

useEffect(() => {
  // handleRenderCanvas()
  document.title='大自然'
  const doc = document.documentElement;
    doc.style.fontSize = `${window.innerWidth / 100}px`;
    doc.addEventListener("DOMContentLoaded", Resize);

    window.addEventListener("resize", Resize);
} ,[])

const getQuery = (val) => {
  console.log(window.location.search)
  const w = window.location.search.indexOf('?');
  const query = window.location.search.substring(w + 1);

  const vars = query.split('&').reduce((res,item) => {
    var parts = item.split('=')
    res[parts[0]] = parts[1]
    return res
  } , {});
  // for (let i = 0; i < vars.length; i++) {
  //   const pair = vars[i].split('=');
  //   if (pair[0] == val) { return pair[1]; }
  // }
  return vars;
}

// const handleRenderCanvas = () => {
//   const canvas1 = document.querySelector('.reportContent')
//   const _this = this;
//   var copyDom = canvas1; //要保存的dom
//   var width = copyDom.offsetWidth; //dom宽
//   var height = copyDom.offsetHeight; //dom高
//   var scale = 1; //放大倍数
//   console.log(window.devicePixelRatio)
//   html2canvas(copyDom, {
//     dpi: 5,
//     scale: scale,
//     width: width,
//     heigth: height,
//     useCORS: true, // 【重要】开启跨域配置
//   }).then(function (canvas) {
//     const imgUrl = canvas.toDataURL("image/png"); // 获取图片的url
//     console.log(imgUrl)
//     setImg(imgUrl)
//     // const elA = document.createElement("a");
//     // elA.download = +new Date() + ".png";
//     //  elA.href = imgUrl ;
//     // elA.click();
//     // elA.remove();
//   });
// };

const value = getQuery()
console.log(value)

const getBlobPng = () => {

  console.log("png");
  const node = document.getElementById("node");
  console.log(node)
  domtoimage.toBlob(node).then((blob) => {
    // 调用file-save方法 直接保存图片
    console.log(blob)
    saveAs(blob, `${value.name}.png`);
   
  }).catch((err) => {
    console.log(err)
  })
  ;
}
  return (
    <div
      className="reportPage"
     
    >
      {/* <img src={img} alt="" /> */}
      <div
        id="node"
        className="reportContent"
        onClick={(event) => {
        
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
            <p>姓名: {decodeURI(value.name)}</p>
            <p>性别: {value.sex == 1 ? "男" : "女"}</p>
            <p>联系方式: {decodeURI(value.phone)}</p>
          </div>
        </div>

        <div className="reportDataContent">
          <div className="dataItem">
            <img className="dataItemImg" src={item} alt="" />
            <div>
              <div>呼吸</div>
              <div>{value.nowBreath}次/min</div>
            </div>
          </div>
          <div className="dataItem">
            <img className="dataItemImg" src={item} alt="" />
            <div>
              <div>体动</div>
              <div>{value.nowMove}次/min</div>
            </div>
          </div>
          <div className="dataItem">
            <img className="dataItemImg" src={item} alt="" />
            <div>
              <div>平均压力</div>
              <div>{value.nowPress}mmhg</div>
            </div>
          </div>
        </div>

        <div className="reportRecom">
          <img src={recomBox} alt="" />
          <div className="reportRecomBed">
            <div className="reportRecomInfo">
              <div className="reportRecomImg">
                <img src={value.bedImg} alt="" />
              </div>
              <div className="reportRecomName">
                {decodeURI(value.bedName)}
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
                        index < Number(value.bedNum) ? "unset" : "none",
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
      {/* <div
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
            getBlobPng();
            
          }}
        >
          生成专属报告
        </Button>
      </div> */}
    </div>
  );
}
