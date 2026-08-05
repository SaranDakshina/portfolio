import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="relative z-[1] flex-1">{children}</main>
      <Footer />
    </>
  );
}
