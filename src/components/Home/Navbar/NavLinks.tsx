"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
];

const NavLinks = ({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <ul className={`flex gap-1 ${className}`}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={`${link.href}`}
              onClick={onClick}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 block
                ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
