import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import gtm from "@lib/gtm";
import Ban from "@icons/Ban";

const Home = () => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Helmet>
        <title>home page</title>
      </Helmet>
      <div>
        home <Ban />
      </div>
    </>
  );
};

export default Home;
