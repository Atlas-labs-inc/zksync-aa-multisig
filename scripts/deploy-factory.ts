import * as ethers from "ethers";
import { Web3Provider, Wallet, utils, ContractFactory } from 'zksync-web3';
import { AtlasEnvironment } from "atlas-ide";

import AAFactoryArtifact from "../artifacts/AAFactory";
import TwoUserMultisigArtifact from "../artifacts/TwoUserMultisig";


export async function main (atlas: AtlasEnvironment) {
  const provider = new Web3Provider(atlas.provider);
  const connectedChainID = (await provider.getNetwork()).chainId
  if(connectedChainID !== 280 && connectedChainID !== 324) {
      throw new Error("Must be connected to zkSync within Atlas");
  }
  const wallet = provider.getSigner();
  // Getting the bytecodeHash of the account
  const factory = new ContractFactory(
      AAFactoryArtifact.AAFactory.abi,
      AAFactoryArtifact.AAFactory.evm.bytecode.object,
      wallet,
      "create"
  );
  
  const additionalFactoryDeps = [`0x${TwoUserMultisigArtifact.TwoUserMultisig.evm.bytecode.object}`]
  const additionalDeps = additionalFactoryDeps
            ? additionalFactoryDeps.map((val) => ethers.utils.hexlify(val))
            : [];
  const factoryDeps = [...additionalDeps];

  const aaFactory = await factory.deploy(
      ...[utils.hashBytecode(`0x${TwoUserMultisigArtifact.TwoUserMultisig.evm.bytecode.object}`)],
      {
        customData: {
          factoryDeps,
        },
      }
  );

  console.log(`AA factory address: ${aaFactory.address}`);
  return aaFactory.address;
}

