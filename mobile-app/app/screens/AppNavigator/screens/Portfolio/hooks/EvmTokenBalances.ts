import { useEffect, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { WalletToken, useNetworkContext } from "@waveshq/walletkit-ui";
import { utils } from "ethers";
import { batch, useSelector } from "react-redux";
import { RootState } from "@store";
import { TokenData } from "@defichain/whale-api-client/dist/api/tokens";
import { useLogger } from "@shared-contexts/NativeLoggingProvider";
import { useWalletContext } from "@shared-contexts/WalletContext";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { fetchEvmWalletDetails, fetchEvmTokenBalances } from "@store/evm";

interface AssociatedToken {
  [key: string]: TokenData;
}

export function useEvmTokenBalances(): { evmTokens: WalletToken[] } {
  const { evmAddress } = useWalletContext();
  const [evmTokens, setEvmTokens] = useState<WalletToken[]>([]);
  const [allTokensWithAddress, setAllTokensWithAddress] =
    useState<AssociatedToken>({});
  const blockCount = useSelector((state: RootState) => state.block.count);
  const { network } = useNetworkContext();
  const logger = useLogger();

  const { allTokens } = useSelector((state: RootState) => state.wallet);
  const { evmWalletDetails, evmTokenBalances } = useSelector(
    (state: RootState) => state.evm,
  );
  const dispatch = useAppDispatch();

  const getEvmTokens = async () => {
    const dfiToken: WalletToken = {
      id: "0-EVM",
      symbol: "DFI",
      symbolKey: "DFI",
      isDAT: true,
      isLPS: false,
      isLoanToken: false,
      amount: "0",
      name: "DeFiChain for EVM",
      displaySymbol: "EvmDFI",
      avatarSymbol: "EvmDFI",
    };
    try {
      const evmDfiBalance = formatEther(
        BigInt(evmWalletDetails?.coin_balance ?? 0),
      );
      dfiToken.amount = evmDfiBalance;
      setEvmTokens(
        evmTokenBalances.reduce(
          (current: WalletToken[], each) => {
            const tokenAddress = each?.token?.address;
            const tokenDetails = allTokensWithAddress[tokenAddress] ?? null;
            if (tokenDetails) {
              return [
                ...current,
                {
                  id: `${tokenDetails.id}-EVM`,
                  symbol: tokenDetails.symbol,
                  symbolKey: tokenDetails.symbolKey,
                  isDAT: tokenDetails.isDAT,
                  isLPS: tokenDetails.isLPS,
                  isLoanToken: tokenDetails.isLoanToken,
                  name: `${tokenDetails.name} for EVM`,
                  displaySymbol: tokenDetails.displaySymbol,
                  avatarSymbol: tokenDetails.symbol,
                  amount: formatUnits(
                    BigInt(each.value),
                    +each?.token?.decimals,
                  ),
                },
              ];
            }
            return current;
          },
          [dfiToken],
        ),
      );
    } catch (e) {
      logger.error(e);
      setEvmTokens([dfiToken]);
    }
  };

  useEffect(() => {
    batch(() => {
      dispatch(fetchEvmWalletDetails({ network, evmAddress }));
      dispatch(fetchEvmTokenBalances({ network, evmAddress }));
    });
  }, [network, evmAddress, blockCount]);

  useEffect(() => {
    setAllTokensWithAddress(
      Object.keys(allTokens).reduce((current, each) => {
        const tokenDetails = allTokens[each];
        const key = getAddressFromDST20TokenId(tokenDetails.id);
        return Object.assign(current, { [key]: tokenDetails });
      }, {}),
    );
  }, [allTokens]);

  useEffect(() => {
    getEvmTokens();
  }, [evmWalletDetails]);

  return { evmTokens };
}

function getAddressFromDST20TokenId(tokenId: string): string {
  const parsedTokenId = BigInt(tokenId);
  const numberStr = parsedTokenId.toString(16); // Convert parsedTokenId to hexadecimal
  const paddedNumberStr = numberStr.padStart(38, "0"); // Pad with zeroes to the left
  const finalStr = `ff${paddedNumberStr}`;
  return utils.getAddress(finalStr);
}
