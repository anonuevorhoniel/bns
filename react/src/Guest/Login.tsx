import { LoginForm } from "@/components/login-form";
import { Toaster } from "sonner";
import capital from "../../public/capitol.jpg";

export default function Login() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10"
      style={{
        backgroundImage: `url(${capital || capital})`,
        backgroundSize: 'cover', // Optional: makes the image cover the entire background
        backgroundRepeat: 'no-repeat', // Optional: prevents repeating
      }}
    >
      <title>BNS | Login</title>
      <Toaster />
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
