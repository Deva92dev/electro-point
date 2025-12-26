export const ActionsSkeleton = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-muted/20 animate-pulse" />
    <div className="w-8 h-8 rounded-full bg-muted/20 animate-pulse" />
    <div className="w-8 h-8 rounded-full bg-muted/20 animate-pulse" />
  </div>
);

export const NavLinksSkeleton = () => (
  <div className="flex gap-1">
    <div className="h-9 w-16 bg-muted/20 rounded-full animate-pulse" />
    <div className="h-9 w-20 bg-muted/20 rounded-full animate-pulse" />
    <div className="h-9 w-16 bg-muted/20 rounded-full animate-pulse" />
  </div>
);

export const DropdownSkeleton = () => (
  <div className="md:hidden ml-auto">
    <button
      disabled
      className="h-10 w-10 flex items-center justify-center rounded-md opacity-50 cursor-not-allowed"
    >
      <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
        <div className="w-full h-0.5 bg-foreground/70 rounded-full" />
        <div className="w-full h-0.5 bg-foreground/70 rounded-full" />
        <div className="w-full h-0.5 bg-foreground/70 rounded-full" />
      </div>
    </button>
  </div>
);
