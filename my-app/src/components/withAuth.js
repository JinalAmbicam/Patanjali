import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      // Check if the user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      // If the user is not logged in, redirect to the login page
      if (!isLoggedIn) {
        router.push('/');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
