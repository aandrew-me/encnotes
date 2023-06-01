import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "./pages/Login";
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import Notes from "./pages/Notes"
import Rawdata from "./pages/Rawdata"
import Settings from "./pages/Settings"
import Verify from "./pages/Verify"

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
		path:"/settings",
		element: <Settings/>
	},
	{
		path:"/verify",
		element: <Verify/>
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<RouterProvider router={router} />
);
