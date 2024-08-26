'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Heading } from '@biom3/react';

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 1 second
    const timer = setTimeout(() => {
      router.push('/');
    }, 1000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      Logging out...
    </Box>
  );
};

export default LogoutPage;
