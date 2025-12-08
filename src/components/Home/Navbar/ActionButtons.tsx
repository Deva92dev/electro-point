"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import {
  Box,
  Loader,
  LogOut,
  Monitor,
  Moon,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ActionButtons = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleTheme}
        className="text-muted-foreground hover:text-foreground"
        title="Toggle Theme"
      >
        {!mounted ? (
          <Sun className="w-5 h-5" />
        ) : theme === "dark" ? (
          <Moon className="w-5 h-5" />
        ) : theme === "light" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Monitor className="w-5 h-5" />
        )}
      </Button>

      {/* Cart */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-foreground"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
      </Button>

      {/* Auth Logic */}
      {isPending ? (
        <div className="w-8 h-8 flex items-center justify-center">
          <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : session ? (
        // LOGGED IN STATE: Dropdown Menu
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full w-8 h-8 ring-2 ring-transparent hover:ring-primary/20 transition-all"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || ""}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="cursor-pointer w-full flex items-center"
              >
                <User className="mr-2 w-4 h-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/orders"
                className="cursor-pointer w-full flex items-center"
              >
                <Box className="mr-2 w-4 h-4" />
                <span>Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // GUEST STATE
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
