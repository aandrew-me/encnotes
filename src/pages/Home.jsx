import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
	//   { name: 'Features', href: '#' },
];

export default function Home() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="home">
			<header className="absolute inset-x-0 top-0 z-50">
				<nav
					className="flex items-center justify-between p-6 lg:px-8"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="#" className="m-1.5 p-1.5">
							<img
								className="h-10 w-auto"
								src="/logo.png"
								alt=""
							/>
						</a>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="text-sm font-semibold leading-6 text-gray-900"
							>
								{item.name}
							</a>
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<a
							href="/login"
							className="text-sm font-semibold leading-6 text-white"
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-50" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon
									className="h-6 w-6"
									aria-hidden="true"
								/>
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-gray-500/10">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
										>
											{item.name}
										</a>
									))}
								</div>
								<div className="py-6">
									<a
										href="/login"
										className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white  hover:bg-selected"
									>
										Log in
									</a>
								</div>
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</header>

			<div className="relative isolate px-6 pt-14 lg:px-8">
				<div
					className="overflow-hidden -z-10 absolute blur-3xl inset-x-0 sm:top-[-20rem] top-[-10rem] transform-gpu"
					id="gradient"
				>
					<svg
						className="relative -translate-x-1/2 -z-10 h-[21.1875rem] left-[calc(50%-11rem)] max-w-none rotate-[30deg] sm:h-[42.375rem] sm:left-[calc(50%-30rem)]"
						viewBox="0 0 1155 678"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
							fillOpacity=".3"
						></path>
						<defs>
							<linearGradient
								gradientUnits="userSpaceOnUse"
								id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
								x1="1155.49"
								x2="-78.208"
								y1=".177"
								y2="474.645"
							>
								<stop stopColor="#844fe0"></stop>
								<stop stopColor="#f35899" offset="1"></stop>
							</linearGradient>
						</defs>
					</svg>
				</div>

				<div className="mx-auto max-w-2xl py-32">
					<div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
							EncNotes
						</h1>
						<p className="mt-6 text-lg leading-8 text-white">
							EncNotes is a secure way to store your Notes in the
							cloud. Your notes are encrypted, so only you can see
							them. (Still in development)
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<a
								href="/signup"
								className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Get started
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
