import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/Signup"));
const Notes = lazy(() => import("./pages/Notes"));
const Rawdata = lazy(() => import("./pages/Rawdata"));
const Settings = lazy(() => import("./pages/Settings"));
const Verify = lazy(() => import("./pages/Verify"));

// Setting API URL
// localStorage.setItem("api-url", "https://encnotes.andrewru.repl.co");
localStorage.setItem("api-url", "https://encnotes.domcloud.io");
// localStorage.setItem("api-url", "http://127.0.0.1:3000")
const localTheme = localStorage.getItem("theme");
if (localTheme) {
	document.documentElement.setAttribute("theme", localTheme);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <NotFound />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
	{
		path: "/notes",
		element: <Notes />,
	},
	{
		path: "/raw",
		element: <Rawdata />,
	},
	{
		path: "/settings",
		element: <Settings />,
	},
	{
		path: "/verify",
		element: <Verify />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Suspense
		fallback={
			<h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-text-primary">
				Loading...
			</h1>
		}
	>
		<RouterProvider router={router} />
	</Suspense>
);
