/** @format */

import React from 'react'
import nature from '../../assets/images/nat.png'
import item from '../../assets/image1/item.png'
import titleRight from '../../assets/image1/titleRight.png'
import body from '../../assets/image1/body.png'
import recomBox from '../../assets/image1/recomBox.png'
import bed1 from '../../assets/images/bed1.png'
import star from '../../assets/image1/star.png'
export default function Report() {
  return (
    <div className="reportPage">
      <div className="reportContent">
        <div className="reportTitle">
          <img src={nature} alt="" />
          <img src={titleRight} alt="" />
        </div>
        <div className="reportMain">专属定制报告</div>
        <div className="personContent">
          <div className="personImg">
            <img src={body} alt="" />
          </div>
          <div className="personInfo">
            <p>姓名</p>
            <p>性别</p>
            <p>联系方式</p>
          </div>
        </div>

        <div className="reportDataContent">
          <div className="dataItem">
            <img className="dataItemImg" src={item} alt="" />
            <div>
              <div>呼吸</div>
              <div>32次/min</div>
            </div>
          </div>
          <div className="dataItem">
            <img className="dataItemImg" src={item} alt="" />
            <div>
              <div>体动</div>
              <div>6次/min</div>
            </div>
          </div>
          <div className="dataItem">
            <img className="dataItemImg" src={item} alt="" />
            <div>
              <div>平均压力</div>
              <div>38mmhg</div>
            </div>
          </div>
        </div>

        <div className="reportRecom">
          <img src={recomBox} alt="" />
          <div className="reportRecomBed">
            <div className="reportRecomInfo">
              <div className="reportRecomImg">
                <img src={bed1} alt="" />
              </div>
              <div className="reportRecomName">意境床垫</div>
            </div>
            <div className="reportRecomed">
              推荐指数:
              {new Array(5).fill(0).map((item, index) => {
                console.log(index)
                return <img key={index} style={{display: index < 4 ? 'unset' : 'none'}} src={star} alt="" />
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
