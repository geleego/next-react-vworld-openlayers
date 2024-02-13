export default class NumFormats {

    /**
     * 숫자 형식 수정 (정수, 콤마처리, 소수점 자릿수 처리)
     * @param {number|string} value 
     * @param {number} digits 
     */
    static numberFormats = (value, maximumSignificatDigits=3) => {
        if (isNaN(value)) { 
            return ;
        }
        return new Intl.NumberFormat(
            'kr-IN',
            { maximumSignificatDigits }
        ).format(+value)
    }

};
