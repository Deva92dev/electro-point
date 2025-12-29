import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome" subTitle="Enter Your Credentials to log in">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
};

export default LoginPage;
