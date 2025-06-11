import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  return (
    <div className="min-h-screen z-50 fixed w-full top-0 left-0 overflow-hidden flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
