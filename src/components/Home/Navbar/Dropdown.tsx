"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden ml-auto">
      <Button variant="ghost" size="icon" onClick={toggleMenu}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl px-6 flex flex-col gap-6 animate-in slide-in-from-top-5 fade-in duration-200 z-50">
          <nav className="flex flex-col space-y-4">
            <NavLinks
              className="flex-col gap-2"
              onClick={() => setIsOpen(false)}
            />
          </nav>
          <div className="h-px w-full bg-border" />
          <div className="flex flex-col gap-3">
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Log in
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center bg-primary text-primary-foreground">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
