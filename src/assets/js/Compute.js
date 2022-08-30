import numjs from './numjs';
import preprocess from './preprocess'

var Compute = {

    pressureAreaSize(box_matrix) {
        /**
         * 计算矩阵中有压力的面积大小
         */
        let size = 0;
        if (box_matrix.length === 0) return size
        for (let i = 0; i < box_matrix.length; i++) {
            for (let j = 0; j < box_matrix[0].length; j++) {
                if (box_matrix[i][j] > 1) size = size + 1;
            }
        }
        return size
    },

    pressureAreaRatio(box_matrix) {
        /**
         * 计算脚压力的面积比例
         */
        if (box_matrix.length === 0) return 0;

        let selectedArea = 0; //有压力的元素
        let totalArea = 0; //所有元素

        for (let i = 0; i < box_matrix.length; i++) {
            for (let j = 0; j < box_matrix[0].length; j++) {
                totalArea = totalArea + 1;
                if (box_matrix[i][j] > 1) {
                    selectedArea = selectedArea + 1;
                }
            }
        }

        let ratio = selectedArea / totalArea; // 有压力的元素和所有元素的比例
        return ratio
    },


    archDetectedByPressure(mid_matrix, total_pressure, threshold_1, threshold_2) {
        /**
         * 检测高足弓，扁平足和正常足
         * mid_matrix: 脚中间部分压力矩阵(2D矩阵)
         * threshold_1: 阈值1, 如果脚中间部分压力占总压力比例小于等于这个值，则判定为高足弓
         * threshold_2: 阈值2，如果脚中间部分压力占总压力的比例大于这个值，判定为扁平足
         * return: -1 为高足弓，0为正常，1为扁平足
         */

        if (mid_matrix.length === 0) return

        let mid_total_pressure = numjs.sum(mid_matrix);

        let ratio = mid_total_pressure / total_pressure;

        if (ratio <= threshold_1) return -1 //如果以上的比例小于阈值_1,判断为高足弓
        if (threshold_1 < ratio && ratio <= threshold_2) return 0 // 如果阈值_1 < 比例 <= 阈值_2, 判断为正常
        if (ratio > threshold_2) return 1 //如果比例 >= 阈值_2, 判断为扁平足
        else return null

    },



    supinationRightDetection(mid_matrix, threshold_1, threshold_2, threshold_3, threshold_4) {
        /**
         * 判断脚内翻，外翻，正常
         * input: 压力矩阵（2D矩阵）
         * threshold_1: 阈值1
         * threshold_2: 阈值2
         * threshold_3: 阈值3
         * threshold_4: 阈值4
         * return: -2 为过度翻，-1位外翻， 1为内翻，2为过度内翻， 0为正常
         */
        if (mid_matrix.length === 0) return

        let two_part = preprocess.leftRightDivision(mid_matrix);

        let left_part = two_part[0];

        let right_part = two_part[1];

        let mid_total_pressure = numjs.sum(mid_matrix);

        //右边的压力减去左边的压力
        let diff = numjs.sum(right_part) / mid_total_pressure - numjs.sum(left_part) / mid_total_pressure;

        //过度外翻
        if (diff <= threshold_1) return -2

        //外翻
        if (threshold_1 < diff && diff <= threshold_2) return -1

        //内翻
        if (threshold_3 < diff && diff <= threshold_4) return 1

        //过度内翻
        if (diff > threshold_4) return 2

        else return 0
    },



    supinationLeftDetection(mid_matrix, threshold_1, threshold_2, threshold_3, threshold_4) {
        /**
         * 判断脚内翻，外翻，正常
         * input: 压力矩阵（2D矩阵）
         * threshold_1: 阈值1
         * threshold_2: 阈值2
         * threshold_3: 阈值3
         * threshold_4: 阈值4
         * return: -2 为过度翻，-1位外翻， 1为内翻，2为过度内翻， 0为正常
         */

        if (mid_matrix.length === 0) return //如果中间部分矩阵为空，返回

        let two_part = preprocess.leftRightDivision(mid_matrix);

        let left_part = two_part[0];

        let right_part = two_part[1];

        let mid_total_pressure = numjs.sum(mid_matrix);

        //左边的压力减去右边的压力
        let diff = numjs.sum(left_part) / mid_total_pressure - numjs.sum(right_part) / mid_total_pressure;
        // console.log(diff)

        //过度外翻
        if (diff <= threshold_1) return -2

        //外翻
        if (threshold_1 < diff && diff <= threshold_2) return -1

        //内翻
        if (threshold_3 < diff && diff <= threshold_4) return 1

        //过度内翻
        if (diff > threshold_4) return 2

        else return 0
    },


    pressureBalance(left_part, right_part) {
        /**
         * left_part: 左脚的压力矩阵
         * right_part: 右脚的矩阵
         * return: [-1,1]的浮点数，-1表示压力全部在左边，1表示压力全部在右边
         */
        let left_sum = numjs.sum(left_part);
        let right_sum = numjs.sum(right_part);
        let total_sum = left_sum + right_sum;
        let left_ratio = left_sum / total_sum;
        let right_ratio = right_sum / total_sum;
        let diff = right_ratio - left_ratio;

        return diff
    },


    pressureCentriod(box_matrix) {
        /**
         * box_matrix: 压力矩阵
         * return: [-1,1]的浮点数，-1表示脚重心全部在前面，1表示脚重心全部在后面
         */
        let foot = preprocess.topDownDivision(box_matrix); //把脚分为上下两个部分

        let top_sum = numjs.sum(foot[0]); //对上半部分的脚压力求和
        let bottom_sum = numjs.sum(foot[1]); //对下半部分的脚压力求和

        let total_sum = top_sum + bottom_sum; //整只脚的压力和

        let top_ratio = top_sum / total_sum; //上半部分压力占总压力的比例
        let bottom_ratio = bottom_sum / total_sum; //下半部分占总压力的比例
        let diff = bottom_ratio - top_ratio; //下半部分减去上半部分压力比例的差
        // console.log(diff)
        return diff
    },


    computeAll(bigArrg ,height ,width) {
        /**
         * Input:压力矩阵(1D)
         * return: Dictionary(包含左右脚长宽，左脚高低足弓判断，左脚内翻外翻判断，鞋码，压力面积占比，左右平衡和压力前后中心)
         * 
         */
        if (bigArrg === null || typeof(bigArrg) == "undefined") return
        if( bigArrg.length === 0 ) return 
        let feet = preprocess.footPreprocess(bigArrg,height ,width);
        let left_foot = feet[0];
        let right_foot = feet[1];
        let toe_ratio = 0.2;
        let mid_ratio = 0.7;

        let left_arch = NaN;
        let left_supination = NaN;
        let left_pressureArea = 0;
        let left_pressureCentriod = NaN;

        // let right_arch = null;
        // let right_supination = null;
        // let right_pressureArea = 0;


        if (left_foot.length != 0) {
            let midPart_leftFoot = preprocess.footDivision(left_foot, toe_ratio, mid_ratio);
            let left_total_pressure = numjs.sum(left_foot);
            left_arch = this.archDetectedByPressure(midPart_leftFoot, left_total_pressure, 0.30, 0.50);
            left_supination = this.supinationLeftDetection(midPart_leftFoot, -0.15, 0.15, 0.30, 0.5);
            left_pressureArea = this.pressureAreaRatio(left_foot);
            left_pressureCentriod = this.pressureCentriod(left_foot);
        }

        // if (right_foot.length != 0) {
        //     let midPart_rightFoot = preprocess.footDivision(right_foot, toe_ratio, mid_ratio);
        //     let right_total_pressure = numjs.sum(right_foot);
        //     right_arch = Compute.archDetectedByPressure(midPart_rightFoot, right_total_pressure, 0.30, 0.50);
        //     right_supination = Compute.supinationRightDetection(midPart_rightFoot, -0.15, 0.15, 0.30, 0.5);
        //     right_pressureArea = Compute.pressureAreaRatio(right_foot)
        // }

        let balance = Compute.pressureBalance(left_foot, right_foot);

        let res = { LA: left_arch, LS: left_supination, LPA: left_pressureArea, balance: balance, LPC: left_pressureCentriod };

        return res

    }

}

export default Compute