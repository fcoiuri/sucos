import React from 'react';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';

const withAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('token');
        if (!session) {
          redirect('/');
        }
      }
    }, []);

    // if (!session) {
    //   return null;
    // }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
