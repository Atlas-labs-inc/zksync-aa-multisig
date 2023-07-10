import { AtlasEnvironment } from "atlas-ide";

import * as deployFactory from "./deploy-factory";
import * as deployMultisig from "./deploy-multisig";

async function main(atlas: AtlasEnvironment) {
    const aaFactoryAddress = await deployFactory.main(atlas);
    await deployMultisig.main(atlas, aaFactoryAddress);
}
