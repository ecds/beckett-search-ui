import React, { useEffect, useRef } from "react";
import { Outlet, useLocation  } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

/**
 * Root component containing all other site components, except ErrorPage.
 *
 * @returns {React.Component} React component.
 */
export function Root() {
    const location = useLocation();
    const trackerRef = useRef();

    useEffect(() => {
        // window?.ga("send", "pageview");
        trackerRef.current?.setAttribute("src", "https://matomo.ecdsdev.org/matomo.php?idsite=59&rec=1");
    }, [location]);

    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
            <img
              ref={trackerRef}
              referrerPolicy="no-referrer-when-downgrade"
              src="https://matomo.ecdsdev.org/matomo.php?idsite=59&amp;rec=1"
              alt=""
              style={{ border: 0 }}
            />
        </>
    );
}
