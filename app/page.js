import LogoType from "@/components/logo/logo-type";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <div
        className="absolute inset-x-0 top-0 h-screen"
        style={{
          backgroundColor: `#e5e5f7`,
          opacity: `0.1`,
          backgroundImage: `repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 40px ), repeating-linear-gradient( #444cf755, #444cf7 )`,
        }}
      ></div>
      <div
        className="absolute inset-x-0 top-0 h-screen bg-gradient-to-t from-white to-transparent"
      ></div>
      <div className="container mx-auto px-4 relative">
        <div className="w-full h-16 bg-gray-800 border-2 border-gray-900 rounded-full mt-4 flex items-center justify-between px-4 shadow-xl shadow-gray-800/40">
          <LogoType className="text-white h-6 ml-2" />
          <div className="flex items-center text-white gap-12 text-sm">
            <Link href="/">Home</Link>
            <Link href="/">Explore</Link>
            <Link href="/" className="px-4 py-2 rounded-full bg-primary hover:bg-purple-700 transition-all duration-500">Create Music</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-36 items-center">
          <div>
            <h1 className="text-6xl leading-tight">Your Gateway to AI-Generated Music Magic!</h1>
          </div>
          <div>
            <p className="text-lg mb-4">
              Muxtopia is not just a website; it's a revolutionary platform that transforms your creative sparks into captivating melodies. Powered by
              cutting-edge AI technology and embraced by the decentralized web, Muxtopia is where music meets innovation.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary rounded-full text-white shadow shadow-primary/40 hover:shadow-lg transition-all duration-500 hover:shadow-primary/50 hover:bg-purple-700">Start for free</button>
          </div>
        </div>

        <div className="w-full relative aspect-[3/1]">
          <Image src="/music.webp" alt="Music" fill className="object-cover rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
