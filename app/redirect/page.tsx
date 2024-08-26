'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiomeCombinedProviders, Body, Box, Button } from '@biom3/react';
import { passportInstance } from '../page';

const RedirectPage: React.FC = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!passportInstance) {
      console.log('No passport found when redirecting');
      router.push('/');
      setErrorMsg('Passport instance not found.');
      return;
    }

    (async () => {
      try{
        await passportInstance.loginCallback();
        router.push('/');
      }
      catch (error: any) {
        setErrorMsg(`Error: ${error.message}`);
      }
    })();

  }, [router, passportInstance]);

  const onClickHome = () => {
    router.push('/');
  };

  return (
    <BiomeCombinedProviders>
      <Box>
        Redirecting...
        <Box>
          {errorMsg}
        </Box>
        <Box>
          {errorMsg && <Button onClick={onClickHome}>Return Home</Button>}
        </Box>
      </Box>
    </BiomeCombinedProviders>
  );
};

export default RedirectPage;
