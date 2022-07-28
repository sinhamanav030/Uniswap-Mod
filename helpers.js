const fs = require('fs')

const writeData=async (data,file)=>{

    await fs.appendFile(file,data,err=>{
        if (err) throw err;
    });

}

const getPoolImmutables = async (poolContract) => {
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ])
    const immutables = {
      token0: token0,
      token1: token1,
      fee: fee
    }
  
    return immutables
  }


module.exports = {writeData,getPoolImmutables}