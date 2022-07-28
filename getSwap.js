const axios = require(`axios`)

const {writeData} = require('./helpers')

const URL =`https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

const outputFilePrefix = "swapData"

//Function to get swap info for a particular pool address
const swapData  = async(poolAddress)=>{
    let query = `{
        swaps(first:10,orderBy: timestamp, orderDirection: desc, where:
            { pool: "${poolAddress}" }
        ) {
            pool {
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            }
            sender
            recipient
            amount0
            amount1
            }
        }`
    
    
    const res = await axios.post(URL,{
        query:query
    })

    const swaps = res.data.data.swaps

    const currentTime = Date.now()

    const timeStamp = `Data loaded at : ${currentTime}\n`

    const outFileName = outputFilePrefix + "-"+poolAddress+".txt"

    await writeData(timeStamp,outFileName)

    for(let obj of swaps){
        await writeData(JSON.stringify(obj)+"\n",outFileName)
    }    
}

const runner = async() =>{
    swapData(`0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8`)
    await new Promise(r => setTimeout(r, 300000));
}

runner()

    