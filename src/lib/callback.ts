// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from './supabaseClient';

// export default function AuthCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     supabase.auth.onAuthStateChange((event) => {
//       if (event === 'SIGNED_IN') {
//         router.push('/dashboard'); // Redirect after confirmation
//       }
//     });
//   }, []);

//   return <div>Confirming your email...</div>;
// }