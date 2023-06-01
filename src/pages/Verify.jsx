import axios from "axios";
import { useRef, useState } from "react";

export default function Verify() {
	const url = localStorage.getItem("api-url");
	const urlParams = new URLSearchParams(window.location.search);
	const email = urlParams.get("email");

	const submit = useRef();
	const [errorMsg, setErrorMsg] = useState("");
	const [info, setInfo] = useState("");

	function sendEmail() {
		setInfo("")
		setErrorMsg("");
		console.log("Sending email to", email);
		axios
			.post(url + "/api/sendEmail", { email: email })
			.then((response) => {
				console.log(response);
				setInfo(response.data.message);
			})
			.catch((error) => {
				console.log(error);
				if (error.response) {
					setErrorMsg(error.response.data.message);
				} else {
					setErrorMsg(error.message);
				}
			});
	}

	function verifyEmail() {
		setErrorMsg("");
		setInfo("")
		const code = submit.current.value;
		if (email && code) {
			axios
				.get(url + `/api/verify?email=${email}&code=${code}`)
				.then((response) => {
					console.log(response);
					if (response.data.status === "true") {
						setInfo(
							response.data.message +
								" Redirecting you to login page."
						);
						setTimeout(() => {
							window.location.href = `/login?email=${email}`;
						}, 2000);
					}
				})
				.catch((error) => {
					console.log(error);
					setErrorMsg(error.response.data.message || error.message);
				});
		} else {
			setErrorMsg("Email and Code Required");
		}
	}
	return (
		<div>
			<main className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<h2 className="text-center">
					Enter the verification Code sent to your email
				</h2>
				<div className="text-center p-3 m-1">
					<input
						type="text"
						placeholder="Code"
						className="p-2 rounded-md text-gray-900"
						ref={submit}
					/>
					<button
						className="bg-green-600 p-2 rounded-md"
						onClick={verifyEmail}
					>
						Submit
					</button>
					<br />
					<button onClick={sendEmail} className="bg-blue-600 p-1.5 m-4 rounded">
						Send verification code again
					</button>
					<p className="p-4 font-semibold">{info}</p>
					<p className="text-red-600 p-4 font-semibold">{errorMsg}</p>
				</div>
			</main>
		</div>
	);
}
