"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
];

// beautification later write each features what you implement or (better than other) in readme this way you will create content easily
const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-row gap-4">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            href={`${link.href}`}
            key={link.href}
            className={`
                    relative block transition-colors duration-200
                ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }
                `}
          >
            {link.label}
          </Link>
        );
      })}
    </ul>
  );
};

export default NavLinks;
