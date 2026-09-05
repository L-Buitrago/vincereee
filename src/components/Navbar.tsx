import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";


const navLinks = [
  { label: "Plataforma", href: "/plataforma/dashboard" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20" : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="font-display text-xl font-medium tracking-tight text-white">
          VincereAT
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button size={"sm" as any} variant={"outline" as any} className="font-display font-semibold border-white/10 text-white hover:bg-white/5 bg-transparent">Admin</Button>
            </Link>
          )}
          {user ? (
            <Link to="/plataforma/dashboard">
              <Button size={"sm" as any} className="font-display font-semibold bg-gradient-to-r from-white/90 to-white/70 text-black hover:from-white hover:to-white/80">Meu Dashboard</Button>
            </Link>
          ) : (
              <Link to="/auth">
                <Button size={"sm" as any} variant={"ghost" as any} className="font-display font-semibold text-white/70 hover:text-white hover:bg-white/5">Entrar / Cadastrar</Button>
              </Link>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant={"ghost" as any} size={"icon" as any} className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"right" as any} className="bg-black/95 backdrop-blur-xl border-white/5">
            <SheetTitle className="font-display text-lg text-white">Menu</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-white/50 hover:text-sky-400 hover:scale-105 inline-block transform transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full font-display font-semibold border-white/10 text-white bg-transparent">Admin</Button>
                </Link>
              )}
              {user ? (
                <Link to="/plataforma/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full font-display font-semibold bg-gradient-to-r from-white/90 to-white/70 text-black">Meu Dashboard</Button>
                </Link>
              ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full font-display font-semibold border-white/10 text-white bg-transparent">Entrar / Cadastrar</Button>
                  </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
