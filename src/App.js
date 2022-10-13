/** @format */

import React from 'react'
import {BrowserRouter, Routes, Route, Link, HashRouter} from 'react-router-dom'
import Bed from './page/home/Bed'
import New from './page/new/Bed'
import Recom from './page/new/Recom'
import Report from './page/new/Report'
import './app.css'
// import Demo from './page/home/Demo'
import Col from './page/col/Bed'
import Col1 from './page/col copy/Bed'
import Data from './page/num/Data'
import Num from './page/num/Num'
export default function App() {
  return (
    <HashRouter >
      <Routes>
        <Route path="/" element={<New />} />
        <Route path="/re" element={<Recom />} />
        <Route path="/report" element={<Report />} />
        {/* <Route path="/" element={<Data />} /> */}
        {/* <Route path="/num" element={<Num />} /> */}
        {/* <Route path="/col" element={<Col />} />
        <Route path="/col1" element={<Col1 />} /> */}
        {/* <Route path="/demo" element={<Demo />} /> */}
      </Routes>
    </HashRouter>
  )
}
