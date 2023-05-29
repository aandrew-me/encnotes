import axios from "axios";
import { useRef, useState } from "react";
import Editor from "./Editor";
import { AES } from "crypto-js";

const url = localStorage.getItem("api-url");

let timeoutId;
function Main({ activeNote, onUpdateNote, width, setActiveNote }) {
	const inputTitle = useRef();

	const [saveState, setSaveState] = useState("saved");

	const onEditField = () => {
		setSaveState("saving");
		const titleData = inputTitle.current.value;
		const encryptedTitle = AES.encrypt(titleData, activeNote.itemKey).toString()
		const dateNow = Date.now()

		onUpdateNote({
			...activeNote,
			title: titleData,
			lastModified: dateNow,
		});

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			axios
				.put(
					url + "/api/notes",
					{ id: activeNote.id, title: encryptedTitle, lastModified: dateNow, hasTitle: true, hasBody: false },
					{
						headers: {
							Authorization: localStorage.getItem("cookie"),
						},
					}
				)
				.then((response) => {
					console.log(response.data);
					setSaveState("saved");
				})
				.catch((error) => {
					console.log(error);
					setSaveState("error");
				});
		}, 1000);
	};
	let cssWidth = "w-9/12";
	if (width <= 750 && !activeNote) {
		cssWidth = "hidden";
	} else if (width <= 750 && activeNote) {
		cssWidth = "w-full";
	}

	if (!activeNote) {
		return (
			<>
				<div className={"empty flex flex-col h-full " + cssWidth}></div>
			</>
		);
	}

	return (
		<div
			className={
				"flex flex-col h-full p-2 app-main " + cssWidth
			}
		>
			{saveState === "saved" && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-8 h-8 fixed top-5 right-5 text-green-500"
				>
					<path
						fillRule="evenodd"
						d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
						clipRule="evenodd"
					/>
				</svg>
			)}

			{saveState === "saving" && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-6 h-6 fixed top-5 right-5 z-10 text-gray-700 spin"
				>
					<path
						fillRule="evenodd"
						d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
						clipRule="evenodd"
					/>
				</svg>
			)}

			{saveState === "error" && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-7 h-8 fixed top-5 right-5 z-10 text-red-600"
				>
					<path
						fillRule="evenodd"
						d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
						clipRule="evenodd"
					/>
				</svg>
			)}

			<div>
				<svg
					onClick={()=>{setActiveNote("")}}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className={"w-9 h-9 inline-block text-gray-600 cursor-pointer " + (width >= 750 ? "hidden":"")}
				>
					<path
						fillRule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
						clipRule="evenodd"
					/>
				</svg>

				<input
					type="text"
					className={"relative m-1 border border-none p-3 text-2xl outline-none inputTitle " + (width >= 750 ? "indent-8" : "") }
					placeholder="Note Title"
					value={activeNote.title}
					onChange={(e) => onEditField()}
					ref={inputTitle}
				/>
			</div>

			<div className="border-t border-gray-700"></div>
			<Editor setSaveState={setSaveState} onUpdateNote={onUpdateNote} activeNote={activeNote}/>
		</div>
	);
}

export default Main;
