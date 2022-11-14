/** @format */

import React from 'react'
import bed1 from '../../assets/images/bed1.png'
import star from '../../assets/image1/star.png'
import recomBox from '../../assets/image1/recomBox.png'
export default function Recom() {
  return (
    <div className="recomPage">
      <div className="recomBg">{/* <img src={recomBox} alt="" /> */}</div>
      <div className="recomContent">
        <div className="recomItem">
          <div className="recomInfo">
            <div className="recomImg">
              <img src={bed1} alt="" />
            </div>
            <div className="recomName">意境床垫</div>
          </div>
          <div className="recomed">
            推荐指数:
            {new Array(5).fill(0).map((item, index) => {
              console.log(index)
              return <img key={index} style={{display: index < 4 ? 'unset' : 'none'}} src={star} alt="" />
            })}
          </div>
        </div>
        <div className="recomItem">
          <div className="recomInfo">
            <div className="recomImg">
              <img src={bed1} alt="" />
            </div>
            <div className="recomName">意境床垫</div>
          </div>
          <div className="recomed">
            推荐指数:
            {new Array(5).fill(0).map((item, index) => {
              console.log(index)
              return <img key={index} style={{display: index < 4 ? 'unset' : 'none'}} src={star} alt="" />
            })}
          </div>
        </div>
        <div className="recomItem">
          <div className="recomInfo">
            <div className="recomImg">
              <img src={bed1} alt="" />
            </div>
            <div className="recomName">意境床垫</div>
          </div>
          <div className="recomed">
            推荐指数:
            {new Array(5).fill(0).map((item, index) => {
              console.log(index)
              return <img key={index} style={{display: index < 4 ? 'unset' : 'none'}} src={star} alt="" />
            })}
          </div>
        </div>
        <div className="recomItem">
          <div className="recomInfo">
            <div className="recomImg">
              <img src={bed1} alt="" />
            </div>
            <div className="recomName">意境床垫</div>
          </div>
          <div className="recomed">
            推荐指数:
            {new Array(5).fill(0).map((item, index) => {
              console.log(index)
              return <img key={index} style={{display: index < 4 ? 'unset' : 'none'}} src={star} alt="" />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
