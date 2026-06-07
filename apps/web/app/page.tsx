import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col ">
      <Navbar />
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="rounded-full  bg-zinc-100 px-4 py-1 cursor-pointer hover:scale-105 hover:font-medium transition-all duration-500">
          fucking landing page
        </h1>
      </div>
    </main>
  );
}
