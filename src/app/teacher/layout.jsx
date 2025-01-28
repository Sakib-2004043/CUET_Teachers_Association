"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import './layout.css'; // Assuming this CSS file exists in the same directory
import { useRouter } from 'next/navigation';
import { checkToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode'; // Fixed import syntax for jwt-decode

export default function subLayout({ children }) {
  const router = useRouter();

  const validateToken = async () => {
    const isValid = await checkToken(router);
    if (!isValid) {
      console.log('Redirected due to invalid token');
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedData = jwtDecode(token);
        console.log("Role:", decodedData.role);

        if (decodedData.role == "Admin") {
          router.push("/admin");
        }
        else if(decodedData.role == "Member"){
          router.push("/teacher")
        }
        else{
          router.push("/")
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    validateToken();
  }, [router]);

  return (
    <div className='total-screen'>
      <nav className="teacher-nav">
        <Link href="/teacher" className="teacher-link" onClick={validateToken}>
          Home
        </Link>
        <Link href="/teacher/poll" className="teacher-link" onClick={validateToken}>
          Poll
        </Link>
        <Link href="/teacher/profile" className="teacher-link" onClick={validateToken}>
          Profile
        </Link>
      </nav>
      <main className="teacher-content">
        {children}
      </main>
    </div>
  );
}
