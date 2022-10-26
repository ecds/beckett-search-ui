import React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntitiesSearch from "./pages/EntitiesSearch";
import { LettersSearchPage } from "./pages";
import "./assets/index.css";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EntitiesSearch />} />
                <Route path="/letters" element={<LettersSearchPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root"),
);
