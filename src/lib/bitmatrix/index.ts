/* eslint-disable @typescript-eslint/no-unused-vars */
const poolLbtcLiquidity = 1000000;
const poolUsdtLiquidity = 50000000000;
const lpFeeRate = 500;

const fees = {
  baseFee: 1200,
  orderingFee: 1,
  serviceFee: 650,
  // dynamic input
  commitmentTxFee: 100,
};

const div = (input1: number, input2: number) => Math.floor(input1 / input2);

export type FundingOutput = {
  fundingOutput1Value: number;
  fundingOutput2Value: number;
  fundingOutput1Address: string;
  fundingOutput2Address: string;
  fundingOutput1AssetId: string;
  fundingOutput2AssetId: string;
};

// all amounts satoshi
export const lbtcToUsdtSwapAmountCalculate = (
  lbtcAmount: number,
  slippage?: number,
): number => {
  // step1   (lp fee calculate)
  const lpFee = div(lbtcAmount, lpFeeRate);

  // step 2 (sub fee amount)
  const lbtcAmountSubFee = lbtcAmount - lpFee;

  // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
  const lbtcPoolTotalAmount = poolLbtcLiquidity + lbtcAmountSubFee;

  // step 4 (lbtPoolTotalAmount with rate 16)
  const lbtcPoolTotalAmountWithRate = div(lbtcPoolTotalAmount, 16);

  // step 5 (lbtPoolAmount  with rate 16)
  const lbtcPoolAmountWithRate = div(poolLbtcLiquidity, 16);

  // step 6 (usdtPoolAmount  with rate 2 million)
  const usdtPoolAmountWithRate = div(poolUsdtLiquidity, 2000000);

  // step 7 (mul step 5 , step6)
  const poolRateMul = lbtcPoolAmountWithRate * usdtPoolAmountWithRate;

  // step 8 (div step7  step4)
  const poolRateMulWithLbtcPoolRate = div(
    poolRateMul,
    lbtcPoolTotalAmountWithRate,
  );

  // step 9  (step8 * 2 million)
  const poolRateMulWithLbtcPoolRateMul = poolRateMulWithLbtcPoolRate * 2000000;

  // step 10  (Pool Tether liquidity - 9.step)
  const finalTetherPoolLiquidity =
    poolUsdtLiquidity - poolRateMulWithLbtcPoolRateMul;

  //step11 ( step 10 - 1milion)
  const usdtAmount = finalTetherPoolLiquidity - 1000000;

  const slippageAmount = div(usdtAmount, 200);

  console.log(usdtAmount);
  console.log(slippageAmount);
  return usdtAmount - slippageAmount;
};

export const usdtToLbtcSwapAmountCalculate = (
  usdtAmount: number,
  slippage?: number,
): number => {
  // validation
  if (usdtAmount < 50000000)
    console.log('Usdt amount must greaten or at least minimum equal 50000000');

  // step1 (fee calculation)
  const lpFee = div(usdtAmount, lpFeeRate);

  // step2 (input new value without fee  input - step1)
  const usdtAmountWithoutFee = usdtAmount - lpFee;

  // step3 (total usd pool amount poolUsdtLiquidity + step2)
  const totalUsdtLiquidity = poolUsdtLiquidity + usdtAmountWithoutFee;

  // step4  (usdt Liquidty rate calculation step3 % 2mn)
  const usdtLiquidtyRate = div(totalUsdtLiquidity, 2000000);

  // step5 (Pool L-BTC liquidity % 16)
  const x = div(poolLbtcLiquidity, 16);

  // step6 (Pool USDT liquidity % 2MN)
  const y = div(poolUsdtLiquidity, 2000000);

  // step 7 (constant x*y = k step5*step6)
  const constant = x * y;

  // step 8 (constant * usdtLiquidtyRate  step7*step4
  const constantRate = div(constant, usdtLiquidtyRate);

  //step 9 (step 8 * 16)
  const lbtcAmount = constantRate * 16;

  //step 10 (poolLbtcLiquidity - step9)
  const remainingLbtcAmount = poolLbtcLiquidity - lbtcAmount;

  return remainingLbtcAmount;
};

// step1
export const lbtcToUsdtSwap = (lbtcAmount: number): FundingOutput => {
  const fundingOutput1Value = lbtcAmount;
  const fundingOutput2Value =
    fees.baseFee + fees.commitmentTxFee + fees.orderingFee + fees.serviceFee;

  const fundingOutput1Address =
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg';
  const fundingOutput2Address =
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg';

  const fundingOutput1AssetId =
    '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';

  const fundingOutput2AssetId =
    '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

export const usdtToLBtcSwap = (usdtAmount: number): FundingOutput => {
  const fundingOutput1Value = usdtAmount;
  const fundingOutput2Value =
    fees.baseFee + fees.commitmentTxFee + fees.orderingFee + fees.serviceFee;

  const fundingOutput1Address =
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg';
  const fundingOutput2Address =
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg';

  const fundingOutput1AssetId =
    '213cbc4df83abc230852526b1156877f60324da869f0affaee73b6a6a32ad025';

  const fundingOutput2AssetId =
    '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};

// export const createCommitmentOutputTweakKey = () => {

// }

// case1
export const createCommitmentTx = () => {
  // case1
  const txId =
    'e9e6cb2b46152684ca2c3f58622f63d5eb45806edced1a0769f2fe895ffc2b53';

  const targetAssetId =
    '43a2f4ef8ce286e57ab3e39e6da3741382ba542854a1b28231a7a5b8ba337fcd';

  const methodCall = '01';

  const pubkey =
    '0253b4443cb73ac1dbe0d0e31c9db5cdce831280fd94ba9c13eb1ea0791819d70e';

  const slippage = '8813a60e00000000';

  const orderingFee = '01000000';

  const callData = targetAssetId + methodCall + pubkey + slippage + orderingFee;

  const commitmentOutputTapscriptTemplate =
    '630401000000b200c86920' +
    targetAssetId +
    '876700c86920' +
    targetAssetId +
    '879169043c000000b221' +
    pubkey +
    'ac68';

  console.log('calldata ', callData);
  console.log(
    'commitmentOutputTapscriptTemplate',
    commitmentOutputTapscriptTemplate,
  );

  const constLength = '020000000102';

  const rpcTxId = Buffer.from(txId, 'hex').reverse().toString('hex');

  const constLength2 = '0000000000ffffffff';

  const constLength3 =
    '0100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000000000516a4c4e';

  const constLength4 =
    '01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401';

  // (KUTU 1 DEĞERİ + BF + OF)
  const inputAmountTotal = '0000000000001839';

  const constLength5 = '0022';

  // tweak internal key 1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624 with script data taproot result
  const scriptPubKey =
    '51207db641e850bc86817f01d33c820107468fbd44cbc152093aaee32cae0dda13fc';

  const constLength6 =
    '01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000028a0022';

  const constLength7 =
    '01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14010000000000000064';

  const constLength8 = '00007ba513000000010151000000010151000000000000000000';

  const templateResult =
    constLength +
    rpcTxId +
    constLength2 +
    rpcTxId +
    constLength3 +
    callData +
    constLength4 +
    inputAmountTotal +
    constLength5 +
    scriptPubKey +
    constLength6 +
    scriptPubKey +
    constLength7 +
    constLength8;

  // send raw transaction
  console.log(templateResult);
};

// case2
export const createCommitmentTx2 = (): void => {
  // case1
  const txId =
    'ace894699ce96862f6b93e7276a1a9a449a52ece9603d2f144c800019b5f3365';

  const targetAssetId =
    '43a2f4ef8ce286e57ab3e39e6da3741382ba542854a1b28231a7a5b8ba337fcd';

  const methodCall = '02';

  const pubkey =
    '0253b4443cb73ac1dbe0d0e31c9db5cdce831280fd94ba9c13eb1ea0791819d70e';

  const slippage = '9f39000000000000';

  const orderingFee = '01000000';

  const callData = targetAssetId + methodCall + pubkey + slippage + orderingFee;

  const commitmentOutputTapscriptTemplate =
    '630401000000b200c86920' +
    targetAssetId +
    '876700c86920' +
    targetAssetId +
    '879169043c000000b221' +
    pubkey +
    'ac68';

  console.log('calldata ', callData);
  console.log(
    'commitmentOutputTapscriptTemplate',
    commitmentOutputTapscriptTemplate,
  );

  const constLength = '020000000102';

  const rpcTxId = Buffer.from(txId, 'hex').reverse().toString('hex');

  const constLength2 = '0000000000ffffffff';

  const constLength3 =
    '0100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401000000000000000000516a4c4e';

  const constLength4 =
    '01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401';

  // (KUTU 1 DEĞERİ + BF + OF)
  const inputAmountTotal = '000000000000073b';

  const constLength5 = '0022';

  // tweak internal key 1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624 with script data taproot result
  const scriptPubKey =
    '51207db641e850bc86817f01d33c820107468fbd44cbc152093aaee32cae0dda13fc';

  const constLength6 =
    '0125d02aa3a6b673eefaaff069a84d32607f8756116b52520823bc3af84dbc3c2101';

  // BE
  const input8Byte = '000000002cb41780';

  const constLength7 = '0022';

  const constLength8 =
    '01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14010000000000000064';

  const constLength9 = '00007ba513000000010151000000010151000000000000000000';

  const templateResult =
    constLength +
    rpcTxId +
    constLength2 +
    rpcTxId +
    constLength3 +
    callData +
    constLength4 +
    inputAmountTotal +
    constLength5 +
    scriptPubKey +
    constLength6 +
    input8Byte +
    constLength7 +
    scriptPubKey +
    constLength8 +
    constLength9;

  // send raw transaction
  console.log(templateResult);
};
