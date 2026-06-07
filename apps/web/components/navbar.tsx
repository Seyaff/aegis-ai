import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between max-w-3xl w-full rounded-full m-2 mx-auto px-4 py-1 bg-zinc-100 backdrop:blur-2xl">
      <div>
        <div>head</div>
      </div>
      <div className="space-x-4">
        <Button className="border bg-white text-black  hover:bg-white border-zinc-200 rounded-full px-4">
          <Link href={"/login"}>Login</Link>
        </Button>
        <Button className="text-white bg-black px-4 rounded-full ">
          <Link href={"/signup"}>Signup</Link>
        </Button>
      </div>
    </nav>
  );
}
