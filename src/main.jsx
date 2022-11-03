import React from "react";
import * as ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EntitiesSearchPage, ErrorPage, LettersSearchPage } from "./pages";
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
                element: <EntitiesSearchPage />,
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
