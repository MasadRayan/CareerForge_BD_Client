import { ScrollRestoration } from "react-router";
import AnalysisCV from "../Features/AnalysisCV";
import CertificatesSection from "../Features/CertificatesSection";
import FAQ from "../Features/FAQ";
import Features from "../Features/Features";
import FinalCTA from "../Features/FinalCTA";
import HowItWorks from "../Features/HowItWorks";
import PricingSection from "../Features/PricingSection";
import Stats from "../Features/Stats";
import TrustBand from "../Features/TrustBand";
import Banner from "./Banner";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <AnalysisCV></AnalysisCV>
            <Stats></Stats>
            <HowItWorks></HowItWorks>
            <Features></Features>
            <CertificatesSection></CertificatesSection>
            <PricingSection></PricingSection>
            <FAQ></FAQ>
            <FinalCTA></FinalCTA>
            <ScrollRestoration></ScrollRestoration>
        </div>
    );
};

export default Home;