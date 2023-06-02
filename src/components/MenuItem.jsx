import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";

export default function MenuItem() {
	const url = localStorage.getItem("api-url");
	const [theme, setTheme] = useState("light");
	function logout() {
		axios
			.get(url + "/api/logout", {
				headers: {
					Authorization: localStorage.getItem("cookie"),
				},
			})
			.then((response) => {
				console.log(response);
				localStorage.setItem("cookie", "");
				window.location.href = "/login";
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function handleTheme(e) {
		const theme = e.target.value;
		setTheme(theme)
		document.documentElement.setAttribute("theme", theme);
		localStorage.setItem("theme", theme);
	}

	useEffect(() => {
		const localTheme = localStorage.getItem("theme");
		if (localTheme) {
			document.documentElement.setAttribute("theme", localTheme);
		}
		setTheme(localTheme);
	}, []);

	return (
		<div className="m-2 w-56 text-right z-10">
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="inline-flex w-full justify-center rounded-lg bg-black bg-opacity-40 px-2 py-2 text-sm font-medium text-white hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path
								fillRule="evenodd"
								d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
								clipRule="evenodd"
							/>
						</svg>

						<ChevronDownIcon
							className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
							aria-hidden="true"
						/>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-selected shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						{/* Theme */}
						<div className="p-2 flex items-center justify-around">
							<label>Theme</label>
							<select
								className="p-2 rounded-md bg-bg-secondary"
								onChange={handleTheme}
								defaultValue={theme}
							>
								<option value="light">Light</option>
								<option value="dark">Dark</option>
							</select>
						</div>
						<div className="px-1 py-1 ">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={logout}
										className={`${
											active
												? "bg-violet-500 text-white"
												: "text-text-primary"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									>
										{active ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6 mr-3"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
												/>
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6 mr-3"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
												/>
											</svg>
										)}
										Log out
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
