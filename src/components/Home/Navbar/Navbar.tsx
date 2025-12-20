import ActionButtons from "./ActionButtons";
import Dropdown from "./Dropdown";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="shrink-0">
          <Logo />
        </div>
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <div className="hidden md:block">
          <ActionButtons />
        </div>
        <Dropdown />
      </div>
    </nav>
  );
};

export default Navbar;
