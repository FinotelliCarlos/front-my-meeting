import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-slate-900 px-5 py-4 flex items-center justify-between">
      <Image
        src="/favicon.png"
        alt="My Meeting Icon"
        width={40}
        height={40}
        className="animate-pulse"
      />

      <Image src="/logo.svg" alt="My Meeting logo" width={120} height={40} />
    </header>
  );
};

export default Header;
