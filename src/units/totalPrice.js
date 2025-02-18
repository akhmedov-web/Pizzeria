export const totalPrice=(arr)=>{
    return arr.reduce((a,c)=>a+c.quantity*c.price, 0)
}