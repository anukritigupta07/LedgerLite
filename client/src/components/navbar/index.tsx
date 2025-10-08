import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../routes/common/routePath";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "../../app/hook";
import Logo from "../logo/logo"; 

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview" },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions" },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports" },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings" },
  ];

  return (
    <>
      <header
        className={cn(
          "w-full px-4 py-3 pb-3 lg:px-14 bg-white text-[#333333] shadow-sm border-b border-[#e5e7eb]",
          pathname === PROTECTED_ROUTES.OVERVIEW && "!pb-3"
        )}
      >
        <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto">
          <div className="w-full flex items-center justify-between">
            {/* Left side - Logo + Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden !cursor-pointer
                !bg-[#002B4C]/10 !text-[#002B4C] hover:!bg-[#002B4C]/20"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Logo */}
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-3 overflow-x-auto">
              {routes?.map((route) => (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    `w-full lg:w-auto font-medium py-4.5 border-none
                     text-[#333333]/80 hover:text-[#14A0C4] hover:bg-[#14A0C4]/10
                     focus:bg-[#14A0C4]/10 transition !bg-transparent !text-[14.5px]`,
                    pathname === route.href && "text-[#14A0C4] font-semibold"
                  )}
                  asChild
                >
                  <NavLink to={route.href}>{route.label}</NavLink>
                </Button>
              ))}
            </nav>

            {/* Mobile Navigation Drawer */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="bg-white border-r border-[#e5e7eb]">
                <nav className="flex flex-col gap-y-2 pt-9">
                  {routes?.map((route) => (
                    <Button
                      key={route.href}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        `w-full font-medium py-4.5 border-none
                         text-[#333333]/90 hover:bg-[#14A0C4]/10 hover:text-[#14A0C4]
                         focus:bg-[#14A0C4]/10 transition !bg-transparent justify-start`,
                        pathname === route.href &&
                          "!bg-[#14A0C4]/10 text-[#14A0C4] font-semibold"
                      )}
                      asChild
                    >
                      <NavLink to={route.href}>{route.label}</NavLink>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Right side - User actions */}
            <div className="flex items-center space-x-4">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Logout confirmation dialog */}
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;
