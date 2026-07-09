import ServiceSelector from "./sections/ServiceSelector";
import OrthoticsHero from "../../components/Home/OrthoticsSlider";
import MotionSection from "../../components/Home/MotionSection";
import InnovationSection from "../../components/Home/InnovationSection/InnovationSection";
import ComfortSection from "../../components/Home/ComfortSection/ComfortSection";
import StepsSection from "../../components/Home/StepsSection/StepsSection";
import ExperienceSection from "../../components/Home/ExperienceSection/ExperienceSection";
import VideoSection from "../../components/Home/VideoSection/VideoSection";
import InsightsSection from "../../components/Home/InsightsSection/InsightsSection";



function Home() {
  return (
    <>
      <ServiceSelector />
      <OrthoticsHero />
      <MotionSection />
      <InnovationSection />
      <ComfortSection />
      <StepsSection />
      <ExperienceSection />
      <VideoSection />
      <InsightsSection />
      {/* next sections will go here */}
    </>
  );
}

export default Home;
