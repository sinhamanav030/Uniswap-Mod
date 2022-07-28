const axios = require('axios')
const {writeData} = require('./helpers')

const URL =`https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

const outputFileName = "poolData.txt"

//Function to get Top pool info from Uniwswap ordered by VOLUME in USD
const getData = async()=>{
    for(let skip=0;skip<1000;skip+=1000){
        let query =`{
            pools(
                first:10
                orderBy: volumeUSD
                orderDirection: desc
                skip:${skip}
            ){
                id
                token0 {
                id
                symbol
                name
                volume
                volumeUSD
                feesUSD
                decimals
                }
                token1 {
                id
                symbol
                decimals
                }
                token0Price
                token1Price
                feeTier
                sqrtPrice
                liquidity
                poolHourData
                poolDayData
            }
            } `

            res = await axios.post(URL,{
                query:query
            })

            if (res.data.data == undefined){
                break
            }


            const pools = res.data.data.pools

            const currentTime = Date.now()

            const timeStamp = `Data loaded at : ${currentTime}\n`

            await writeData(timeStamp,outputFileName )

            for(let obj of pools){
                await writeData(JSON.stringify(obj)+"\n",outputFileName)
            }


    }
}


const runner = async() =>{
    getData()
    await new Promise(r => setTimeout(r, 300000));
}

runner()
