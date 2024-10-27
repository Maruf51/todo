import Navbar from "@/components/navbar/Navbar";
import Todo from "@/components/todo/Todo";

export default function Home() {
  return (
    <>
      <div className='bg-image w-full h-[35vh] bg-cover absolute after:absolute after:top-0 after:left-0 after:w-[200%] after:h-full' />
      <div className=" z-10 relative max-w-[800px] h-full px-5 md:px-10 mx-auto overflow-hidden flex flex-col">
        <Navbar />
        <Todo />
      </div>
    </>
  );
}
