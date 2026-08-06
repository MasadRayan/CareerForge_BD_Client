import AnalysisCV from "../Features/AnalysisCV";
import FAQ from "../Features/FAQ";
import Features from "../Features/Features";
import HowItWorks from "../Features/HowItWorks";
import PricingSection from "../Features/PricingSection";
import Stats from "../Features/Stats";
import Banner from "./Banner";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <AnalysisCV></AnalysisCV>
            <Stats></Stats>
            <HowItWorks></HowItWorks>
            <Features></Features>
            <PricingSection></PricingSection>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;