import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

/**
 * Root component containing all other site components, except ErrorPage.
 *
 * @returns {React.Component} React component.
 */
export function Root() {
    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    );
}
