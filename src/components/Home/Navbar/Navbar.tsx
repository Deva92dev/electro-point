import { Suspense } from "react";
import dynamic from "next/dynamic";
import ActionButtons from "./ActionButtons";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { ActionsSkeleton, DropdownSkeleton } from "./ActionSkeleton";

const Dropdown = dynamic(() => import("./Dropdown"), {
  loading: () => <DropdownSkeleton />,
});

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-border/40 bg-background/80 md:backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="shrink-0">
          <Logo />
        </div>

        <div className="hidden lg:block">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Suspense fallback={<ActionsSkeleton />}>
            <ActionButtons />
          </Suspense>
          <div className="lg:hidden">
            <Dropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
