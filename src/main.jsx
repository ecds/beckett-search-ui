import React from "react";
import * as ReactDOM from "react-dom";
import { SearchkitClient, SearchkitProvider } from "@searchkit/client";
import App from "./components/App";
import "./assets/index.css";

const skClient = new SearchkitClient({ itemsPerPage: 25 });

ReactDOM.render(
    <React.StrictMode>
        <SearchkitProvider client={skClient}>
            <App />
        </SearchkitProvider>
    </React.StrictMode>,
    document.getElementById("root"),
);
