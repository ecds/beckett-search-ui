import React from "react";
import * as ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EuiProvider } from "@elastic/eui";
import {
    EntitiesSearchPage,
    EntityPage,
    entityLoader,
    ErrorPage,
    HomePage,
    LetterPage,
    letterLoader,
    LettersSearchPage,
    TimeLinePage,
    FaqPage,
    faqLoader,
    AboutPages,
    FilmInterviewsPages,
    FormPage,
} from "./pages";
import { Root } from "./Root";
import { getFromApi } from "./common";
import "./assets/index.css";

/* eslint-disable jsdoc/require-jsdoc */
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "entities",
                element: <EntitiesSearchPage />,
            },
            {
                path: "entities/:entityId",
                element: <EntityPage />,
                loader: entityLoader,
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
            {
                path: "timeline",
                element: <TimeLinePage />,
            },
            {
                path: "faq",
                element: <FaqPage />,
                loader: faqLoader,
            },
            {
                path: "film-interviews",
                element: <FilmInterviewsPages />,
                loader: faqLoader,
            },
            {
                path: "about",
                element: <AboutPages />,
                loader: () =>
                    getFromApi(
                        "/about_pages/089a36da-04b2-4f3b-a64b-0b63c5cc2d62",
                    ),
            },
            {
                path: "about/project-history",
                element: <AboutPages />,
                loader: () =>
                    getFromApi(
                        "/about_pages/4cea642f-d355-4e6f-aa3e-21534ae8f67d",
                    ),
            },
            {
                path: "about/letters",
                element: <AboutPages />,
                loader: () =>
                    getFromApi(
                        "/about_pages/21ab27de-dbc6-403b-b0ac-546164ac1c75",
                    ),
            },
            {
                path: "about/entities",
                element: <AboutPages />,
                loader: () =>
                    getFromApi(
                        "/about_pages/4990f98e-6a33-4f86-b1cb-f5e304988f86",
                    ),
            },
            {
                path: "about/abbreviations",
                element: <AboutPages />,
                loader: () =>
                    getFromApi(
                        "/about_pages/c98f6be1-1401-4c64-b225-39d39f4f68de",
                    ),
            },
            {
                path: "form",
                element: <FormPage />,
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
