import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/FB_IMG_1767617453285.png";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  onOpenTutorial: () => void;
};

const Navbar = ({ onOpenTutorial }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Scholarships", path: "/scholarships" },
    { name: "Personnel", path: "/personnel" },
    { name: "Student Life", path: "/organizations" },
    { name: "Enrollment", path: "/enrollment" },
    { name: "Announcements", path: "/announcements" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      {/* TOP BAR */}
      <div className="flex items-center h-20 w-full px-4">

        {/* LOGO — FAR LEFT */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img
            src={logo}
            alt="BCSI Logo"
            className="h-12 w-12 object-contain"
          />
          <div className="leading-tight">
            <div className="font-serif font-bold text-sm md:text-base">
              Binmaley Catholic School Inc.
            </div>
            <div className="hidden md:block text-xs opacity-90">
              Excellence in Catholic Education
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV (CENTER AREA, CONSTRAINED) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* DESKTOP TUTORIAL — RIGHT */}
        <div className="hidden lg:block">
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenTutorial}
            className="flex items-center gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            Tutorial
          </Button>
        </div>

        {/* MOBILE MENU BUTTON — TRUE FAR RIGHT */}
        <div className="ml-auto lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* MOBILE SLIDE-IN MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-primary text-primary-foreground z-50 lg:hidden shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* DRAWER LINKS */}
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenTutorial();
                  }}
                  className="w-full mt-4 flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Tutorial
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
