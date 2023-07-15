
import { Result, $update, Opt } from 'azle';
import {
    BitcoinNetwork,
    managementCanister,
    Satoshi
} from 'azle/canisters/management';

const BITCOIN_API_CYCLE_COST = 100_000_000n;

$update;
export async function getBalance(
    address: string
): Promise<Result<Satoshi, string>> {
    return await managementCanister
        .bitcoin_get_balance({
            address,
            min_confirmations: Opt.None,
            network: BitcoinNetwork.Regtest
        })
        .cycles(BITCOIN_API_CYCLE_COST)
        .call();
}