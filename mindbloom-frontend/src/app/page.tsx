// mindbloom-frontend/src/app/page.tsx
import { redirect } from 'next/navigation';

// This is the main landing page of your application.
// We are redirecting users to the login page.
export default function RootPage() {
  redirect('/login');
}
