import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
