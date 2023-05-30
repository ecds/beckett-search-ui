import React from "react";
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import "./Footer.css";
import logo from "../assets/EU_shield_hz_rv.png";

/**
 * Footer component containing branding.
 *
 * @returns {React.Component} React component.
 */
function Footer() {
    return (
        <footer className="main-footer">
            <EuiFlexGroup direction="column">
                <EuiFlexItem grow={false}>
                    <p>
                        <img src={logo} alt="" />
                    </p>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <p>
                        201 DOWMAN DRIVE. ATLANTA, GEORGIA 30322 USA
                        404.727.6123
                    </p>
                    <p>
                        COPYRIGHT © 2017 EMORY UNIVERSITY - ALL RIGHTS RESERVED
                    </p>
                </EuiFlexItem>
            </EuiFlexGroup>
        </footer>
    );
}

export default Footer;
