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
import { useCartStore } from "@/store/cart-store";
import { getCart } from "@/utils/actions/mutations";
import {
  Box,
  HeartIcon,
  Loader,
  LogIn,
  LogOut,
  Moon,
  ShoppingCart,
  Sun,
  User,
  UserPlus,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ActionButtons = () => {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const toggleCart = useCartStore((state) => state.toggleCart);
  const syncWithServer = useCartStore((state) => state.syncWithServer);
  const isSynced = useCartStore((state) => state.isSynced);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncCart = async () => {
      if (session?.user && !isSynced) {
        try {
          const serverItems = await getCart();
          if (serverItems) {
            syncWithServer(serverItems);
          }
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      }
    };
    syncCart();
  }, [session, syncWithServer, isSynced]);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-muted-foreground hover:text-foreground relative w-10 h-10"
        suppressHydrationWarning
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Cart Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCart}
        className="relative text-muted-foreground hover:text-foreground cursor-pointer w-10 h-10"
      >
        <ShoppingCart className="w-5 h-5" />
        {mounted && count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
            {count}
          </span>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full w-10 h-10 ring-2 ring-transparent hover:ring-primary/20 transition-all"
          >
            {session?.user?.image ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={session.user.image} alt={session.user.name} />
                <AvatarFallback>
                  {session.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              // Generic Icon for Guests / Loading
              <User className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {session ? (
            // LOGGED IN MENU
            <>
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
                  href="/favorites"
                  className="cursor-pointer w-full flex items-center"
                >
                  <HeartIcon className="mr-2 w-4 h-4" /> Favorites
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/orders"
                  className="cursor-pointer w-full flex items-center"
                >
                  <Box className="mr-2 w-4 h-4" /> Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </>
          ) : (
            // GUEST MENU
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/login"
                  className="cursor-pointer w-full flex items-center"
                >
                  <LogIn className="mr-2 w-4 h-4" /> Log In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/signup"
                  className="cursor-pointer w-full flex items-center font-semibold text-primary"
                >
                  <UserPlus className="mr-2 w-4 h-4" /> Sign Up
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButtons;
