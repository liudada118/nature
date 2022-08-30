var numjs = {

    reshape(input, height, width) {
        /**
         * 对一维矩阵进行维度变化
         * input: 输入的矩阵
         * height: 需要调整成的高度
         * width: 需要调整成的长度
         * return：
         */

        // 初始化空的数组
        if (input.length === 0 ||typeof(input) == "undefined") return null

        let size = height * width;

        if (input.length != size) {
            // console.info('input length != ' + size);
            return
        }

        var res = new Array(height);
        for (let a = 0; a < res.length; a++) {
            res[a] = new Array(width);
        }
        //对空的数组填入对应的值
        let cur = 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                res[i][j] = input[cur];
                cur = cur + 1;
            }
        }

        return res;
    },

    arraySlice(input, row_start, row_end, col_start, col_end) {
        /**
         * 对输入矩阵进行切片
         * input: 输入的矩阵
         * row start: 开始切片的行数
         * row end: 结束切片的行数（返回的矩阵包括这一行）
         * col start: 开始切片的列数
         * col end: 结束切片的列数 （返回的矩阵包括这一列）
         * return: 切好片的矩阵
         */
        if(typeof(input) == "undefined") return 
        let copy = Array.from(input);
        return copy.slice(row_start, row_end + 1).map(i => i.slice(col_start, col_end + 1))
    },

    sum(input) {
        /**
         * input:输入的数组/矩阵
         * return：矩阵数据的和
         */
        if (input == null || input.length == 0 || typeof(input) == "undefined") return 0
        let res = 0;
        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input[0].length; j++) {
                res = res + input[i][j];
            }
        }
        return res
    },

    isSmaller(input, threshold) {
        /**
         * 判断输入矩阵的和是否比threshold小
         * input：输入矩阵
         * return：true为更小，false为更大
         */
        let sum = this.sum(input);
        if (sum < threshold) return true
        else return false
    },

    isBigger(input, threshold) {
        /**
         * 判断输入矩阵的和是否比threshold小
         * input：输入矩阵
         * return：true为更大，false为更小
         */
        let sum = this.sum(input);
        if (sum > threshold) return true
        else return false
    },

    isEqual(input, threshold) {
        /**
         * 判断输入矩阵的和是否与threshold相等
         * input：输入矩阵
         * return：true为相等，false为不相等
         */
        let sum = this.sum(input);
        if (sum === threshold) return true
        else return false
    },

    min(input) {
        /**
         * 找出矩阵中最小的值
         * input：输入矩阵
         * return：矩阵中最小的值
         */
        if (input == null || input.length == 0 || typeof(input) == "undefined") return
        let res = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input.length[0]; j++) {
                if (res < input[i][j]) {
                    res = input[i][j]
                }
            }
        }
        return res
    },

    max(input) {
        /**
         * 找出矩阵中最大的值
         * input：输入矩阵
         * return：矩阵中最大的值
         */
        if (input == null || input.length == 0 || typeof(input) == "undefined") return
        let res = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input.length[0]; j++) {
                if (res > input[i][j]) {
                    res = input[i][j]
                }
            }
        }
        return res
    },

    maxIndex(curArray, maxArray) {
        /**
         * curArray:当前传入的压力矩阵的index
         * maxArray:目前为止最大的压力矩阵的index
         * return: 两个矩阵结合出最大的矩阵的index
         */
        let res = maxArray;
        if (curArray[0] < maxArray[0]) res[0] = curArray[0];
        if (curArray[1] > maxArray[1]) res[1] = curArray[1];
        if (curArray[2] < maxArray[2]) res[2] = curArray[2];
        if (curArray[3] > maxArray[3]) res[3] = curArray[3];
        return res
    },

}

export default numjs