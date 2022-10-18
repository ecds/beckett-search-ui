import React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchkitClient, SearchkitProvider } from "@searchkit/client";
import EntitiesSearch from "./pages/EntitiesSearch";
import "./assets/index.css";

const skClient = new SearchkitClient({ itemsPerPage: 25 });

ReactDOM.render(
    <React.StrictMode>
        <SearchkitProvider client={skClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<EntitiesSearch />} />
                </Routes>
            </BrowserRouter>
        </SearchkitProvider>
    </React.StrictMode>,
    document.getElementById("root"),
);
