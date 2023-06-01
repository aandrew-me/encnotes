import axios from "axios";
import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import PBKDF2 from "crypto-js/pbkdf2";
import SHA256 from "crypto-js/sha256";

function Signup() {
	const url = localStorage.getItem("api-url");
	const [errorMsg, setErrorMsg] = useState("");
	const [info, setInfo] = useState("");
	const form = useRef();
	const [token, setToken] = useState(null);
	const captchaRef = useRef(null);

	function handleSignup(e) {
		setErrorMsg("");
		setInfo("")
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
						setInfo(response.data.message + " Redirecting you to verification page");
						setTimeout(() => {
							window.location.href = `/verify?email=${email}`
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
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Password"
								/>
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
