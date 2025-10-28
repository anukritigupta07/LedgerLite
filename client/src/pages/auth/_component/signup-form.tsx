import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "../../../routes/common/routePath";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl,Form,FormField,FormItem,FormMessage,FormLabel } from "../../../components/ui/form";
import { useRegisterMutation } from "../../../features/auth/authAPI";

// Validation schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    register(values)
      .unwrap()
      .then(() => {
        form.reset();
        toast.success("Sign up successful");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data?.message || "Failed to sign up");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fadeIn">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Header */}
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold text-[#002B4C] animate-slideIn">
                Create your account
              </h1>
              <p className="text-sm text-[#333333]/80">
                Fill in your details to get started
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="animate-slideIn delay-100">
                    <FormLabel className="text-[#002B4C] font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="border-gray-300 focus:border-[#14A0C4] focus:ring-[#14A0C4]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="animate-slideIn delay-200">
                    <FormLabel className="text-[#002B4C] font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="border-gray-300 focus:border-[#14A0C4] focus:ring-[#14A0C4]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="animate-slideIn delay-300">
                    <FormLabel className="text-[#002B4C] font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="border-gray-300 focus:border-[#14A0C4] focus:ring-[#14A0C4]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sign Up Button */}
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#14A0C4] hover:bg-[#1092B3] text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2 animate-slideIn delay-400"
              >
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                Sign up
              </Button>

              {/* Divider */}
              <div className="relative text-center text-sm mt-1 animate-slideIn delay-500">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <span className="relative bg-white px-2 text-[#333333]/70">
                  Or continue with
                </span>
              </div>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full bg-[#002B4C] hover:bg-[#00345E] text-white font-medium py-2 rounded-md transition flex items-center justify-center gap-2 animate-slideIn delay-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#fff" d="M44.5 20H24v8h11.9C34.1 34 29 38 24 38c-7 0-13-6-13-13s6-13 13-13c3.3 0 6.4 1.3 8.8 3.3l6.7-6.7C36 3.3 30.3 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c12 0 22-9 24-21z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-[#333333]/80 animate-slideIn delay-700">
              Already have an account?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="text-[#14A0C4] font-medium hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
