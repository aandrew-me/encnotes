import axios from "axios";
import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import PBKDF2 from "crypto-js/pbkdf2";
import SHA256 from "crypto-js/sha256";

function Signup() {
	const url = localStorage.getItem("api-url");
	const [errorMsg, setErrorMsg] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [info, setInfo] = useState("");
	const form = useRef();
	const [token, setToken] = useState(null);
	const captchaRef = useRef(null);

	function handleSignup(e) {
		setErrorMsg("");
		setInfo("");
		e.preventDefault();

		const email = form.current.elements.email.value;
		const password = form.current.elements.password.value;

		if (email && password) {
			const hash = SHA256(form.current.elements.email.value).toString();
			const salt = hash.substring(0, 32);

			var derivedKey = PBKDF2(password, salt, {
				keySize: 512 / 32,
				iterations: 10000,
			}).toString();

			// const masterKey = derivedKey.substring(0, 64);
			const serverPassword = derivedKey.substring(64, 128);

			const data = {
				email,
				password: serverPassword,
				captcha: token,
			};
			axios
				.post(url + "/api/register", data)
				.then((response) => {
					if (response.data.status == "true") {
						console.log(response);
						setInfo(
							response.data.message +
								" Redirecting you to verification page"
						);
						setTimeout(() => {
							window.location.href = `/verify?email=${email}`;
						}, 2000);
					}
				})
				.catch((error) => {
					console.log(error);
					captchaRef.current.resetCaptcha();
					if (error.response) {
						setErrorMsg(error.response.data.message);
					} else {
						setErrorMsg(error.message);
					}
				});
		}
	}
	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-text-primary">
						Create a new Account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form
						ref={form}
						className="space-y-6"
						action="#"
						method="POST"
						onSubmit={handleSignup}
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
									autoFocus
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									placeholder="Email"
									className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
							<div className="mt-2 flex items-center bg-white rounded-md border-0 text-gray-900 shadow-sm px-1">
								<input
									id="password"
									name="password"
									type={passwordVisible ? "text" : "password"}
									autoComplete="current-password"
									required
									className="block w-full p-2 rounded-md sm:text-sm sm:leading-6 placeholder:text-gray-400"
									placeholder="Password"
								/>
								{/* Eye icon */}
								{passwordVisible && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-6 h-6"
										cursor={"pointer"}
										onClick={() => {
											setPasswordVisible(false);
										}}
									>
										<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
										<path
											fillRule="evenodd"
											d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}

								{/* Closed eye icon */}
								{!passwordVisible && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-6 h-6"
										cursor={"pointer"}
										onClick={() => {
											setPasswordVisible(true);
										}}
									>
										<path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
										<path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
										<path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
									</svg>
								)}
							</div>
						</div>
						<div className="flex justify-center">
							<HCaptcha
								sitekey="22aad46a-63ba-4bbd-8537-8de00f3982dd"
								onVerify={setToken}
								ref={captchaRef}
							/>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Sign up
							</button>
							<p className="text-red-600 text-center font-bold m-2">
								{errorMsg}
							</p>

							<p className="m-2 text-text-primary text-center">
								{info}
							</p>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
						Already a user?{" "}
						<a
							href="/login"
							className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
						>
							Sign in
						</a>
					</p>
				</div>
			</div>
		</>
	);
}

export default Signup;
