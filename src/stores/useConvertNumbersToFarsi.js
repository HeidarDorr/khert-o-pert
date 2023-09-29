export default function convertNumbersToFarsi(nums) {
    let numsF = []

    String(nums).split('').forEach(n => {
        if (n == 0) n = '۰'
        if (n == 1) n = '۱'
        if (n == 2) n = '۲'
        if (n == 3) n = '۳'
        if (n == 4) n = '۴'
        if (n == 5) n = '۵'
        if (n == 6) n = '۶'
        if (n == 7) n = '۷'
        if (n == 8) n = '۸'
        if (n == 9) n = '۹'

        numsF.push(n)
    })
    
    numsF = numsF.join('')

    return numsF
}