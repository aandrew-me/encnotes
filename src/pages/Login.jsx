import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SHA256, PBKDF2 } from "crypto-js";

function Login() {
	const url = localStorage.getItem("api-url");
	const emailInput = useRef();
	const [errorMsg, setErrorMsg] = useState("");
	const form = useRef();

	// Check if already logged in
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const emailParam = urlParams.get("email");

		if (emailParam) {
			emailInput.current.value = emailParam;
		}
		axios
			.post(
				url + "/api/login",
				{},
				{
					headers: {
						Authorization: localStorage.getItem("cookie"),
					},
				}
			)
			.then((response) => {
				console.log(response);
				if (response.data.status === "true") {
					window.location.href = "/notes";
				}
			})
			.catch((error) => {
				console.log(error.response.data.message);
			});
	}, []);

	function handleLogin(e) {
		e.preventDefault();
		const formEmail = form.current.elements.email.value
		const password = form.current.elements.password.value;

		if (formEmail && password) {
			const hash = SHA256(formEmail).toString();
			const salt = hash.substring(0, 32);

			var derivedKey = PBKDF2(password, salt, {
				keySize: 512 / 32,
				iterations: 10000,
			}).toString();

			const masterKey = derivedKey.substring(0, 64);
			const serverPassword = derivedKey.substring(64, 128);

			const data = {
				email: formEmail,
				password: serverPassword,
			};
			console.log(data);
			axios
				.post(url + "/api/login", data)
				.then((response) => {
					console.log(response);
					if (response.data.status == "true") {
						const session_id =
							response.headers["authorization"].split(";")[0];
						localStorage.setItem("cookie", session_id);
						localStorage.setItem("masterKey", masterKey);
						window.location.href = "/notes";
					}
				})
				.catch((error) => {
					console.log(error);
					if (error.response) {
						if (
							error.response.data.message ===
							"You need to verify your Email"
						) {
							window.location.href = `/verify?email=${formEmail}`
							
						} else {
							setErrorMsg(error.response.data.message);
						}
					} else {
						setErrorMsg(error.message);
					}
				});
		}
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 px-5">
				<div>
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-text-primary">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form
							className="space-y-6"
							action="#"
							method="POST"
							onSubmit={handleLogin}
							ref={form}
						>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium leading-6 text-text-primary"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										ref={emailInput}
										autoFocus
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										placeholder="Email"
										required
										className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-text-muted focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-text-primary"
									>
										Password
									</label>
								</div>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										placeholder="Password"
										required
										className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-text-muted focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Sign in
								</button>
							</div>

							<p className="text-red-600 text-center font-bold">
								{errorMsg}
							</p>
						</form>

						<p className="mt-10 text-center text-sm text-gray-500">
							Not a user?{" "}
							<a
								href="/signup"
								className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
							>
								Sign up
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
