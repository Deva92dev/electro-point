"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { data: session } = useSession();

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={toggleMenu}>
        {isOpen ? (
          <X className="w-6 h-6" aria-label="close menu for navigation" />
        ) : (
          <Menu
            className="w-6 h-6"
            aria-label="hamburger menu for navigation"
          />
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl px-6 py-6 flex flex-col gap-6 animate-in slide-in-from-top-5 fade-in duration-200 z-50 h-[calc(100vh-5rem)]">
          <nav className="flex flex-col space-y-4">
            <NavLinks
              className="flex-col gap-4 text-lg"
              onClick={() => setIsOpen(false)}
            />
          </nav>

          <div className="h-px w-full bg-border" />

          {!session && (
            <div className="flex flex-col gap-3 mt-auto mb-10">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-center h-12 text-base"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center bg-primary text-primary-foreground h-12 text-base">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
