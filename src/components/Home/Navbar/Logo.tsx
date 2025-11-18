import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/Logo.png"
        alt="Logo of Electro Point"
        width={32}
        height={32}
      />
    </Link>
  );
};

export default Logo;
