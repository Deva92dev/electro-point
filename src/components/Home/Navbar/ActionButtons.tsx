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
  LogOut,
  Monitor,
  Moon,
  ShoppingCart,
  Sun,
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

  const handleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

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

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCart}
        className="relative text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ShoppingCart className="w-5 h-5" aria-label="Shopping Cart Icon" />
        {mounted && count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
            {count}
          </span>
        )}
      </Button>

      {/* Auth Logic */}
      {isPending ? (
        <div className="w-8 h-8 flex items-center justify-center">
          <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : session ? (
        // Logged In
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
                href="/favorites"
                className="cursor-pointer w-full flex items-center"
              >
                <HeartIcon className="mr-2 w-4 h-4" />
                <span>Favorites</span>
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
        // Guest State
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold cursor-pointer">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 cursor-pointer">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
