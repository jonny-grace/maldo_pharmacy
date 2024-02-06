import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      // If the token doesn't exist, redirect to the login page
      if (!token) {
        router.push('/');
      } else if (role === 'reception') {
        // If the user is a receptionist, allow access to the /reception route
        router.push('/reception');
      } else if (role === 'pharmacy') {
        // If the user is a pharmacy staff, redirect to the /pharmacy route
        router.push('/pharmacy');
      } else if (role === 'doctor') {
        // If the user is a doctor, redirect to the /doctor route
        router.push('/doctor');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;