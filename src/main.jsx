import React from "react";
import * as ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EuiProvider } from "@elastic/eui";
import {
    EntitiesSearchPage,
    ErrorPage,
    LetterPage,
    letterLoader,
    LettersSearchPage,
} from "./pages";
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
            {
                path: "letters/:letterId",
                element: <LetterPage />,
                loader: letterLoader,
            },
        ],
    },
]);

ReactDOM.render(
    <React.StrictMode>
        <EuiProvider colorMode="light">
            <RouterProvider router={router} />
        </EuiProvider>
    </React.StrictMode>,
    document.getElementById("root"),
);
