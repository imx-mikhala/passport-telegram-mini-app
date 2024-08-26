'use client'

import { useState } from "react";
import { passport } from '@imtbl/sdk';
import { ethers, providers } from "ethers";
import { BiomeCombinedProviders, Body, Box, Button, Heading } from "@biom3/react";
import { passportInstance } from "./page";

export default function Home() {
  const [zkEvmProvider, setZkEvmProvider] = useState<any>();
  const [passportWalletAddress, setPassportWalletAddress] = useState<string>("");
  const [verifiedSignature, setVerifiedSignature] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>();

  const onConnect = async () => {
    if (!passportInstance) {
      console.error('Passport not found.');
      setErrorMsg('Passport instance not found.');
      return;
    }

    console.log(passportInstance);

    try {
      const provider = passportInstance.connectEvm();

      const [walletAddress] = await provider.request({
        method: 'eth_requestAccounts',
      });

      const user = await passportInstance.getUserInfo();
      console.log('User info:', user);
      setUserInfo(user);

      setPassportWalletAddress(walletAddress);
      setZkEvmProvider(new providers.Web3Provider(provider));
      console.log('Wallet address:', walletAddress);
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message);
    }
  };

  const onPersonalSign = async () => {
    if (!zkEvmProvider) {
      console.error('Call connect first.');
      setErrorMsg('Call connect before personal sign');
      return;
    }

    const signer = zkEvmProvider.getSigner();
    const message = "Testing message.";
    let signature: string;
    try {
      signature = await signer.signMessage(message);

      const digest = ethers.utils.hashMessage(message);
      const contract = new ethers.Contract(
        passportWalletAddress,
        ['function isValidSignature(bytes32, bytes) public view returns (bytes4)'],
        zkEvmProvider,
      );
    
      const isValidSignatureHex = await contract.isValidSignature(digest, signature);
      const ERC_1271_MAGIC_VALUE = '0x1626ba7e';

      console.log('isValidSignatureHex', isValidSignatureHex === ERC_1271_MAGIC_VALUE);
      setVerifiedSignature(isValidSignatureHex === ERC_1271_MAGIC_VALUE ? 'Verified' : 'Not verified');
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message);
    }
  };

  const onLogout = async () => {
    if (!passport) {
      console.error('Passport instance not found.');
      return;
    }

    try {
      await passportInstance.logout();
      console.log(`Logged out of ${passportWalletAddress}`);
      setPassportWalletAddress("");
      setZkEvmProvider(null);
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message);
    }
  }

  const addPadding = () => {
    return (<Box sx={{ paddingY: 'base.spacing.x2' }} />)
  }

  return (
    <main>
      <BiomeCombinedProviders>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingX: 'base.spacing.x2',
            paddingY: 'base.spacing.x4',
          }}
        >
          <Heading>Passport & Telegram</Heading>
          {addPadding()}
          <Button
            onClick={onConnect}
          >
            Connect to Passport
          </Button>
          {addPadding()}
          <Button
            onClick={onPersonalSign}
          >
            Personal Sign
          </Button>
          {addPadding()}
          <Box>
            {userInfo && <Body>User info: {JSON.stringify(userInfo)}</Body>}
            {addPadding()}
            {passportWalletAddress && <Body>Wallet address: {passportWalletAddress}</Body>}
            {addPadding()}
            {verifiedSignature && <Body>Signature verification result: {verifiedSignature}</Body>}
          </Box>
          {addPadding()}
          <Button
            onClick={onLogout}
          >
            Logout
          </Button>
          {addPadding()}
          <Box>
            {errorMsg && <Body sx={{ color: 'red' }}>Error: {errorMsg}</Body>}
          </Box>
        </Box>
      </BiomeCombinedProviders>
    </main>
  );
}
