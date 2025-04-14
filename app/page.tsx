'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/login')
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-3xl font-extrabold">Coming soon</h1>
    </main>
  );
}
