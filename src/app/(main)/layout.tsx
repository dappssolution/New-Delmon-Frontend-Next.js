import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import FeaturesSection from "@/src/components/common/FeaturesSection";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[56px] lg:pt-[140px]">{children}</main>
      <FeaturesSection />
      <Footer />
    </>
  );
}
