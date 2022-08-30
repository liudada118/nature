import numjs from './numjs';

var preprocess = {

    boxFind(input) {
        /**
         * 在输入矩阵之中，找到有压力的范围, 要求输入一个2D矩阵
         * input: 压力矩阵
         * return: 返回有压力的部分的矩阵
         */
        if (input === null || typeof(input) == "undefined") return
        if( input.length === 0 ) return 
        let top = 100;
        let left = 100;
        let bottom = 0;
        let right = 0;

        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input[0].length; j++) {
                if (input[i][j] >= 5) {
                    if (i < top) top = i;
                    if (i > bottom) bottom = i;
                    if (j < left) left = j;
                    if (j > right) right = j;
                }
            }
        }
        // console.log(top, bottom, left, right)
        let box_matrix = numjs.arraySlice(input, top, bottom, left, right); //根据找到的index，找出脚范围内的压力矩阵

        return box_matrix
    },

    boxIndexFind(input) {
        /**
         * 在输入矩阵之中，找到有压力的范围, 要求输入一个2D矩阵
         * input: 压力矩阵
         * return: 一个包含上面index，下面index，左边index和右边index的数组 [top, bottom, left, right]
         */

        if (input === null || typeof(input) == "undefined") return
        if( input.length === 0 ) return 
        let top = 100;
        let left = 100;
        let bottom = 0;
        let right = 0;

        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input[0].length; j++) {
                if (input[i][j] >= 5) {
                    if (i < top) top = i;
                    if (i > bottom) bottom = i;
                    if (j < left) left = j;
                    if (j > right) right = j;
                }
            }
        }

        return new Array(top, bottom, left, right);
    },

    leftRightDivision(input) {
        /**
         * 将一个矩阵根据宽度分成两个部分，要求2D矩阵
         * input: 压力矩阵
         * return: [左边的矩阵, 右边的矩阵]
         */
        if (input === null ||  typeof(input) == "undefined") return
        if(input.length === 0) return 
        let width = input[0].length;
        let new_width = Math.round(width / 2);

        let height = input.length - 1;

        let left_part = numjs.arraySlice(input, 0, height, 0, new_width - 1);
        let right_part = numjs.arraySlice(input, 0, height, new_width, width - 1);
        return new Array(left_part, right_part)
    },

    topDownDivision(input) {
        /** 
         * 将一个矩阵根据高度分成两个部分，要求一个2D矩阵
         * input: 压力矩阵
         * return: [上面的矩阵，下面的矩阵]
         * 
         */
        if (input === null || typeof(input) == "undefined") return
        if( input.length === 0 ) return 
        let height = input.length;
        let new_height = Math.round(height / 2);

        let width = input[0].length - 1;

        let top_part = numjs.arraySlice(input, 0, new_height - 1, 0, width - 1, 0, width);
        let bottom_part = numjs.arraySlice(input, new_height, height - 1, 0, width);

        return new Array(top_part, bottom_part)

    },

    footDivision(input, toe_ratio, mid_ratio) {
        /**
         * 根据比例，取出toe_ratio和mid_ratio中间的部分
         * box_matrix：矩阵数组
         * toe_ratio：脚趾的比例
         * mid_ratio：脚掌的比例
         */
        if (input === null || typeof(input) == "undefined") return
        if( input.length === 0 ) return 
        let toe_bottom_index = Math.round(toe_ratio * input.length) - 1;
        let mid_bottom_index = Math.round(mid_ratio * input.length) - 1;
        let mid_matrix = numjs.arraySlice(input, toe_bottom_index, mid_bottom_index, 0, input[0].length - 1);
        return mid_matrix
    },

    isGoodCondition(full_matrix) {
        /**
         *判断是否为良好的检测条件：在规定的矩阵外，是否会出现压力值。
         */
        let lli = 2
        let lri = 31
        let rli = 34
        let rri = 63
        let ti = 8
        let bi = 56

        let flag = true;
        full_matrix = numjs.reshape(full_matrix, 64, 64);
        let sum = numjs.sum(full_matrix);
        if(sum<=4096) flag = false;

        for (let i = 0; i < full_matrix.length; i++) {
            for (let j = 0; j < full_matrix[0].length; j++) {
                if ((i < ti || i > bi) && full_matrix[i][j] > 1) flag = false;
                if ((j < lli || j > rri) && full_matrix[i][j] > 1) flag = false;
                if ((j > lri && j < rli) && full_matrix[i][j] > 1) flag = false;
            }
        }
        return flag
    
    },

    footPreprocess(bigArrg , height ,width) {
        /**
         * bigArrg: 原始矩阵（1D）
         * return：Array（左脚矩阵，右脚矩阵） [[左脚],[右脚]]
         */
        if (bigArrg === null || typeof(bigArrg) == "undefined") return
        if( bigArrg.length === 0 ) return 
        let input = numjs.reshape(bigArrg, width, height);
        let feet = this.leftRightDivision(input);
        let left_part = feet[0];
        let right_part = feet[1];
        let left_foot = this.boxFind(left_part);
        let right_foot = this.boxFind(right_part);
        return new Array(left_foot, right_foot)
    }




}
export default preprocess