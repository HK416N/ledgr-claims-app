const calculateSGD = (amount,rate) => {
    //Math.round(amount*rate) only returns the whole number. rounding amount*rate*100 gives 2dp when divided by 100
    return Math.round(amount*rate*100)/100 
}
module.exports = calculateSGD ;