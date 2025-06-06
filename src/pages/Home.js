import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  HomeClients,
  HomeHero,
  HomeOverview,
  HomeRoles,
  HomeFeatures,
  HomeTestimonials,
} from "../components/home";
import gtm from "../lib/gtm";

const Home = () => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Helmet>
        <title>Material Kit Pro2222</title>
      </Helmet>
      <div>
        {"home"}
        <HomeHero />
        <HomeOverview />
        <HomeRoles />
        <HomeTestimonials />
        <HomeFeatures />
        <HomeClients />
      </div>
    </>
  );
};

export default Home;
