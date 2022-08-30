/** @format */

export function addSide(arr, width, height, wnum, hnum, sideNum) {
  let narr = new Array(height)
  let res = []
  for (let i = 0; i < height; i++) {
    narr[i] = []

    for (let j = 0; j < width; j++) {
      if (j == 0) {
        narr[i].push(...new Array(wnum).fill(sideNum >= 0 ? sideNum : 1), arr[i * width + j])
      } else if (j == width - 1) {
        narr[i].push(arr[i * width + j], ...new Array(wnum).fill(sideNum >= 0 ? sideNum : 1))
      } else {
        narr[i].push(arr[i * width + j])
      }
    }
  }
  for (let i = 0; i < height; i++) {
    res.push(...narr[i])
  }

  return [
    ...new Array(hnum * (width + 2 * wnum)).fill(sideNum >= 0 ? sideNum : 1),
    ...res,
    ...new Array(hnum * (width + 2 * wnum)).fill(sideNum >= 0 ? sideNum : 1),
  ]
}

export function interp(smallMat, bigMat, height, width) {
  for (let x = 1; x <= height; x++) {
    for (let y = 1; y <= width; y++) {
      bigMat[height * 2 * (2 * y - 2) + (2 * x - 1) - 1] = smallMat[height * (y - 1) + x - 1] * 10
    }
  }
}

export class stack {
  constructor(num) {
    this.num = num
    this.arr = []
  }
  dataStable(num) {
    if (this.arr.length < this.num) {
      this.arr.push(num)
    } else {
      this.arr.push(num)
      this.arr.shift()
    }
  }
}

export function gaussBlur_1(scl, tcl, w, h, r) {
  var rs = Math.ceil(r * 2.57) // significant radius
  for (var i = 0; i < h; i++)
    for (var j = 0; j < w; j++) {
      var val = 0,
        wsum = 0
      for (var iy = i - rs; iy < i + rs + 1; iy++)
        for (var ix = j - rs; ix < j + rs + 1; ix++) {
          var x = Math.min(w - 1, Math.max(0, ix))
          var y = Math.min(h - 1, Math.max(0, iy))
          var dsq = (ix - j) * (ix - j) + (iy - i) * (iy - i)
          var wght = Math.exp(-dsq / (2 * r * r)) / (Math.PI * 2 * r * r)
          val += scl[y * w + x] * wght
          wsum += wght
        }
      tcl[i * w + j] = Math.round(val / wsum)
    }
}

export function jet(min, max, x) {
  let red, g, blue
  let dv
  red = 1.0
  g = 1.0
  blue = 1.0
  if (x < min) {
    x = min
  }
  if (x > max) {
    x = max
  }
  dv = max - min
  if (x < min + 0.25 * dv) {
    // red = 0;
    // g = 0;
    // blue = 1.0;

    red = 0
    g = (4 * (x - min)) / dv
  } else if (x < min + 0.5 * dv) {
    red = 0
    blue = 1 + (4 * (min + 0.25 * dv - x)) / dv
  } else if (x < min + 0.75 * dv) {
    red = (4 * (x - min - 0.5 * dv)) / dv
    blue = 0
  } else {
    g = 1 + (4 * (min + 0.75 * dv - x)) / dv
    blue = 0
  }
  var rgb = []
  rgb[0] = parseInt(255 * red + '')
  rgb[1] = parseInt(255 * g + '')
  rgb[2] = parseInt(255 * blue + '')
  return rgb
}


export function jet1(min,value1,value2,value3, max, x) {
  // console.log(value1,value2,value3)
  let red, g, blue
  let dv
  red = 1.0
  g = 1.0
  blue = 1.0
  if (x < min) {
    x = min
  }
  // if (x > max) {
  //   x = max
  // }
  dv = max - min
  if (x < value1) {
    // red = 0;
    // g = 0;
    // blue = 1.0;

    red = 1
    g = 1
    blue = 1
  } else if (x < value2) {
    g = 0
    red = 0
    blue = 1 
  } else if (x < value3) {
    red = 0
    blue = 0
    g = 1
  } else {
    g = 0 
    blue = 0
    red = 1
  }
  var rgb = []
  rgb[0] = parseInt(255 * red + '')
  rgb[1] = parseInt(255 * g + '')
  rgb[2] = parseInt(255 * blue + '')
  return rgb
}