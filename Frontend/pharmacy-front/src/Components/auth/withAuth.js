import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      // If the token exists, the user is logged in
      if (token) {
        if (role === 'reception') {
            router.push('/reception');
          } else if (role === 'pharmacy') {
            router.push('/pharmacy');
          } else if (role === 'doctor') {
            router.push('/doctor');
          }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;