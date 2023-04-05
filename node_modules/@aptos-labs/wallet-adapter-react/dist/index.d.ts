import { AccountInfo, NetworkInfo, WalletName, WalletInfo, Wallet, SignMessagePayload, SignMessageResponse } from '@aptos-labs/wallet-adapter-core';
export { NetworkName, WalletName, WalletReadyState } from '@aptos-labs/wallet-adapter-core';
import { Types } from 'aptos';
import { ReactNode, FC } from 'react';

interface WalletContextState {
    connected: boolean;
    account: AccountInfo | null;
    network: NetworkInfo | null;
    connect(walletName: WalletName): void;
    disconnect(): void;
    wallet: WalletInfo | null;
    wallets: Wallet[];
    signAndSubmitTransaction<T extends Types.TransactionPayload, V>(transaction: T, options?: V): Promise<any>;
    signTransaction<T extends Types.TransactionPayload, V>(transaction: T, options?: V): Promise<any>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse | null>;
    signMessageAndVerify(message: SignMessagePayload): Promise<boolean>;
}
declare function useWallet(): WalletContextState;

interface AptosWalletProviderProps {
    children: ReactNode;
    plugins: Wallet[];
    autoConnect?: boolean;
}
declare const AptosWalletAdapterProvider: FC<AptosWalletProviderProps>;

export { AptosWalletAdapterProvider, AptosWalletProviderProps, useWallet };
