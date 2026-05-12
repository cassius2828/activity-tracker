import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import HowItWorksSection from "../components/Home/HowItWorksSection";
import LiveActivitySection from "../components/Home/LiveActivitySection";
import CtaSection from "../components/Home/CtaSection";

const Home = () => (
  <div className="relative text-left" style={{ background: "var(--bg)" }}>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <LiveActivitySection />
    <CtaSection />
  </div>
);

export default Home;
