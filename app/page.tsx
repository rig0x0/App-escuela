import { LoginCard } from "@/components/login-card";

export default function Login() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Login</h1>
      <LoginCard/>
    </div>
  );
}
