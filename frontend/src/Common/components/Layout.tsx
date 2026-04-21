import Navbar from "./Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <div className="pt-20">{children}</div>
    </>
  );
}