import { Link } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../routes/common/routePath";

const Logo = (props: { url?: string }) => {
  return (
    <Link
      to={props.url || PROTECTED_ROUTES.OVERVIEW}
      className="flex items-center gap-3 group"
    >
      {/* Logo Image */}
      <img
        src="/Logo.png" // ✅ served directly from public/
        alt="LedgerLite Logo"
        className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
      />

      {/* App Name */}
      <span className="font-bold text-2xl tracking-wide">
        <span className="text-[#002B4C]">Ledger</span>
        <span className="text-[#C1862A]">Lite</span>
      </span>
    </Link>
  );
};

export default Logo;
