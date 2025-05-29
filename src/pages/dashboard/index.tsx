import withAuth from '@/components/withAuth';
import { useRouter } from 'next/navigation';

function index() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.replace('/login');
    };

    return (
        <>
            <div>Selamat datang di Admin Page!</div>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </>
    );
}

export default withAuth(index);
