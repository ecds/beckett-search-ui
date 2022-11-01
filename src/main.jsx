import React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EntitiesSearchPage } from "./pages";
import "./assets/index.css";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EntitiesSearchPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root"),
);
