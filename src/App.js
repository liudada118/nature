/** @format */

import React from 'react'
import {BrowserRouter, Routes, Route, Link, HashRouter} from 'react-router-dom'
import Bed from './page/home/Bed'
import New from './page/new/Bed'   // 大自然
import NewCopy from './page/newcopy/Bed'
import NewSelf from './page/newSelf/Bed'
import NewLocal from './page/newlocal/Bed'
import New1 from './page/new/BedNew'
import Recom from './page/new/Recom'
import Report from './page/new/Report'
import './app.css'
// import Demo from './page/home/Demo'
import Col from './page/col/Bed'
import Col1 from './page/colcopy/Bed'
import Data from './page/num/Data'
import Num from './page/num/Num'
export default function App() {
  return (
    <HashRouter >
      <Routes>
        {/* <Route path="/" element={<New />} />
        <Route path="/re" element={<Recom />} /> */}
        <Route path="/" element={<NewLocal />} />
        {/* <Route path="/" element={<Data />} /> */}
        {/* <Route path="/num" element={<Num />} /> */}
        {/* <Route path="/col" element={<Col />} />
        <Route path="/col1" element={<Col1 />} /> */}
        {/* <Route path="/demo" element={<Demo />} /> */}
      </Routes>
    </HashRouter>
  )
}
