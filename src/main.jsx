import React from "react";
import * as ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import EntitiesSearch from "./pages/EntitiesSearch";
import { LettersSearchPage, ErrorPage } from "./pages";
import { Root } from "./Root";
import "./assets/index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            // { index: true, element: <HomePage /> },
            {
                path: "entities",
                element: <EntitiesSearch />,
            },
            {
                path: "letters",
                element: <LettersSearchPage />,
            },
        ],
    },
]);

ReactDOM.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
    document.getElementById("root"),
);
