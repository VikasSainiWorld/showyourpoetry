import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign In — ShowYourPoetry",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gold/6 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
