import Features from "../Features/Features";
import HowItWorks from "../Features/HowItWorks";
import Stats from "../Features/Stats";
import Banner from "./Banner";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Stats></Stats>
            <HowItWorks></HowItWorks>
            <Features></Features>
        </div>
    );
};

export default Home;