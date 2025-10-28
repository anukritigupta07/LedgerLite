import SignInForm from "./_component/signin-form";
import Logo from "../../components/logo/logo";
import { useTheme } from "../../context/theme-provider";

const SignIn = () => {
  const { theme } = useTheme();

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white">
      {/* Left Section – Logo + Form */}
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center md:justify-start mb-6">
          <Logo url="/" />
        </div>

        {/* Sign-in Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-[#f5faff] dark:bg-[#e0f0ff] rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 animate-fadeIn">
            <SignInForm />
          </div>
        </div>
      </div>

      {/* Right Section – Soft Blue Opalite */}
      <div className="hidden lg:flex bg-[#f0f8ff] p-10 items-center justify-center">
        {/* Optional: you can add illustration or leave solid soft color */}
        <div className="text-center text-[#002B4C] max-w-md">
          {/* Optional tagline */}
          <h2 className="text-2xl font-bold mb-2">
            Manage your finances effortlessly
          </h2>
          <p className="text-[#333333]/80">
            Track spending, visualize income, and get insights to make smarter financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
