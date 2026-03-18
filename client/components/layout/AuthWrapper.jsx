import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthWrapper({ children }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/auth/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    router.push('/auth/login');
                } else {
                    setIsLoading(false); // User is fine, stop loading
                }
            } catch (err) {
                router.push('/auth/login');
            }
        };
        checkAuth();
    }, [router]);

    if (isLoading) return <div>Loading...</div>; // Prevent flash of private content

    return children;
}