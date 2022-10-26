import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

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
        </>
    );
}
