import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-md mx-auto px-4 w-full flex flex-col text-center">
      <p className="mt-8">FRIENDLY USE, FEELS FUN</p>
      <img className="mx-auto  my-24 w-96 h-20" src="/logo-muxtopia.png" alt="" />
      <input type="text" placeholder="Enter Your DID" className="p-3 mb-4 text-dark" />
      <Link className="w-full p-3 bg-primary rounded-sm" href="/login">Login</Link>
    </div>
  )
}
