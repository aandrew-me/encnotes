import MenuItem from "./MenuItem";

function Sidebar({
	notes,
	setNotes,
	onAddNote,
	onDeleteNote,
	activeNote,
	setActiveNote,
	width,
	backupNotes,
	searchTxt,
	setSearchTxt,
	loadingTxt,
}) {
	const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);
	let cssWidth = "w-3/12";
	if (width <= 750 && !activeNote) {
		cssWidth = "w-full";
	} else if (width <= 750 && activeNote) {
		cssWidth = "hidden";
	}

	function handleSearch(e) {
		setSearchTxt(e.target.value);
		let newNotesArray = [];

		if (e.target.value.length > 0) {
			backupNotes.map((note) => {
				if (
					note.title
						.toLowerCase()
						.includes(e.target.value.toLowerCase())
				) {
					newNotesArray.push(note);
				} else {
					for (const item of note.body) {
						if (
							item.data.text
								.toLowerCase()
								.includes(e.target.value.toLowerCase())
						) {
							newNotesArray.push(note);
							break;
						}
					}
				}
			});
			setNotes(newNotesArray);
		} else {
			setNotes(backupNotes);
		}
	}

	return (
		<>
			<div
				className={
					"flex flex-col h-full app-sidebar shadow-xl relative overflow-y-auto " +
					cssWidth
				}
			>
				<div className="flex flex-row w-full justify-between">
					<div className="flex justify-center items-center p-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path
								fillRule="evenodd"
								d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
								clipRule="evenodd"
							/>
							<path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
						</svg>

						<h1 className=" text-2xl p-1">Notes</h1>
					</div>

					<MenuItem />
				</div>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-16 h-16 absolute bottom-2 right-2 cursor-pointer text-gray-500"
					onClick={onAddNote}
				>
					<path
						fillRule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
						clipRule="evenodd"
					/>
				</svg>
				{/* Searchbox */}
				<div className="relative flex items-center rounded-xl focus-within:shadow-lg bg-bg-primary m-2 p-1">
					<div className="grid place-items-center h-full w-12 text-text-primary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>

					<input
						onChange={handleSearch}
						placeholder="Search"
						type="search"
						value={searchTxt}
						className="rounded-xl outline-none bg-bg-primary w-full p-1"
					/>
				</div>

				<div className="border-t border-bg-primary"></div>

				<p className="text-center text-lg p-2">{loadingTxt}</p>

				{/* Notes in here */}
				<div>
					{sortedNotes.map((note) => {
						const noteBody = note.body;
						return (
							<div
								key={Math.random()
									.toFixed(10)
									.toString()
									.slice(2)}
								className={
									"flex flex-row justify-between align-middle p-3 cursor-pointer " +
									(note.id == activeNote ? "bg-selected" : "")
								}
								id={note.id}
							>
								<div
									className="flex flex-col py-1 flex-1"
									onClick={() => {
										setActiveNote(note.id);
									}}
								>
									<strong>{note.title}</strong>
									<p className="text-text-secondary">
										{noteBody[0] && noteBody[0].data.text}
									</p>
									<small className="text-text-muted">
										Last Modified{" "}
										{new Date(
											note.lastModified
										).toLocaleDateString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</small>
								</div>

								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5 text-red-500"
										onClick={() => {
											document
												.getElementById(note.id)
												.classList.add("fadeOut");
												onDeleteNote(note.id);
										}}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</div>
							</div>
						);
					})}
				</div>
				<div></div>
			</div>
		</>
	);
}

export default Sidebar;
