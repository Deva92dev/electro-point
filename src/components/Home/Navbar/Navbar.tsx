import ActionButtons from "./ActionButtons";
import Dropdown from "./Dropdown";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const Navbar = () => {
  return (
    <nav className="w-full h-20 bg-[image:var(--gradient-hero)]">
      <div className="flex flex-row md:hidden px-2 md:px-4 lg:px-8 items-center">
        <Logo />
        <Dropdown />
      </div>
      <div className="hidden md:flex md:flex-row md:justify-between md:gap-4 items-center p-4">
        <Logo />
        <NavLinks />
        <ActionButtons />
      </div>
    </nav>
  );
};

export default Navbar;
