const { ethers } = require('ethers')

const {abi:uniswapPoolAbi} = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const {abi:quoterAbi} = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')

const ERC20_ABI = require('./ercabi')

const INFURA_URL = `https://mainnet.infura.io/v3/606a8808ffc640b087084666a0db0952`

const provider = new ethers.providers.JsonRpcBatchProvider(INFURA_URL)

const quoterAddress = `0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6`


const {getPoolImmutables} = require('./helpers')

//Function to get Exchange value of a particular pool for a prticular amount of token0 for token1
const getPrice = async (poolAddress,inputAmount) =>{
    const poolContract = new ethers.Contract(
        poolAddress,
        uniswapPoolAbi,
        provider
    )

    const tokenAddress0 = await poolContract.token0()
    const tokenAddress1 = await poolContract.token1()

    const tokenContract0 = new ethers.Contract(
        tokenAddress0,
        ERC20_ABI,
        provider
      )

    const tokenContract1 = new ethers.Contract(
        tokenAddress1,
        ERC20_ABI,
        provider
      )

    const tokenSymbol0 = await tokenContract0.symbol()
    const tokenSymbol1 = await tokenContract1.symbol()
    const tokenDecimals0 = await tokenContract0.decimals()
    const tokenDecimals1 = await tokenContract1.decimals()

    const quoterContract = new ethers.Contract(
        quoterAddress,
        quoterAbi,
        provider
    )

    const immutables = await getPoolImmutables(poolContract)

    const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        tokenDecimals0
      )
    
      const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        immutables.token0,
        immutables.token1,
        immutables.fee,
        amountIn,
        0
      )

    
      const amountOut = ethers.utils.formatUnits(quotedAmountOut, tokenDecimals1)
    
      console.log('=========')
      console.log(`${inputAmount} ${tokenSymbol0} will be swapped for ${amountOut} ${tokenSymbol1}`)
      console.log('=========')
    
}

const runner = async() =>{
    const amount = 10
    const poolAddress = `0xcbcdf9626bc03e24f779434178a73a0b4bad62ed`

    getPrice(poolAddress, amount)
}

runner()
