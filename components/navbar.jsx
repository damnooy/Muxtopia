import Link from "next/link";
import LogoType from "./logo/logo-type";

export default function Navbar() {
  return (
    <nav className="fixed top-2 inset-x-0 w-full z-20">
      <div className="container mx-auto px-4">
        <div className="w-full h-16 bg-gray-800 border-2 border-gray-900 rounded-full mt-4 flex items-center justify-between px-4 shadow-xl shadow-gray-800/40">
          <LogoType className="text-white h-6 ml-2" />
          <div className="flex items-center text-white gap-4 md:gap-12 text-sm">
            <Link href="/">Home</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/generate" className="px-4 py-2 rounded-full bg-primary hover:bg-purple-700 transition-all duration-500">
              Create Music
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
