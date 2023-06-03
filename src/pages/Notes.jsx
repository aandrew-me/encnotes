import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import axios from "axios";
import { AES, enc } from "crypto-js";

function Notes() {
	const url = localStorage.getItem("api-url");
	const [notes, setNotes] = useState([]);
	const [backupNotes, setBackupNotes] = useState([]);
	const [activeNote, setActiveNote] = useState("");
	const [width, setWidth] = useState(window.innerWidth);
	const [searchTxt, setSearchTxt] = useState("");
	const [loadingTxt, setLoadingTxt] = useState("Loading...");

	useEffect(() => {
		window.addEventListener("resize", () => {
			setWidth(innerWidth);
		});

		const masterKey = localStorage.getItem("masterKey");

		if (masterKey === "" || masterKey === null) {
			localStorage.setItem("cookie", "");
			window.location.href = "/login";
		}

		axios
			.get(url + "/api/notes", {
				headers: {
					Authorization: localStorage.getItem("cookie"),
				},
			})
			.then((data) => {
				const userNotes = data.data.notes;
				let newNotes = [];
				try {
					userNotes.forEach((note) => {
						const encItemKey = note.itemKey;
						const itemKey = AES.decrypt(encItemKey, masterKey).toString(enc.Utf8)
						note.title = AES.decrypt(note.title, itemKey).toString(
							enc.Utf8
						);

						note.itemKey = itemKey
						note.body = JSON.parse(
							AES.decrypt(note.body, itemKey).toString(enc.Utf8)
						);

						newNotes.push(note);
						setNotes(newNotes);
						setBackupNotes(newNotes);
					});
				} catch (error) {
					console.log(error);
				}
			})
			.catch((err) => {
				console.log(err);
				window.location.href = "/login";
			})
			.finally(() => {
				setLoadingTxt("");
			});
	}, []);

	const onAddNote = () => {
		setSearchTxt("");
		const randomBytes = new Uint8Array(32);
		crypto.getRandomValues(randomBytes);
		const itemKey = Array.from(randomBytes)
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");

		const masterKey = localStorage.getItem("masterKey");

		if (masterKey === "" || masterKey === null) {
			localStorage.setItem("cookie", "");
			window.location.href = "/login";
		}
		const encItemKey = AES.encrypt(itemKey, masterKey).toString();

		const encryptedTitle = AES.encrypt("Untitled Note", itemKey).toString();
		const encryptedBody = AES.encrypt(JSON.stringify([]), itemKey).toString();

		const note = {
			title: "Untitled Note",
			body: [],
			lastModified: Date.now(),
			itemKey,
		};
		const encNote = {
			title: encryptedTitle,
			body: encryptedBody,
			lastModified: Date.now(),
			itemKey: encItemKey,
		};
		axios
			.post(url + "/api/notes", encNote, {
				headers: {
					Authorization: localStorage.getItem("cookie"),
				},
			})
			.then((response) => {
				note.id = response.data.note.id;
				setNotes([note, ...backupNotes]);
				setBackupNotes([note, ...backupNotes]);
				setActiveNote(note.id);
			});
	};

	const onDeleteNote = (id) => {
		const newNotesArray = notes.filter((note) => note.id !== id);
		axios
			.delete(url + "/api/notes", {
				headers: {
					Authorization: localStorage.getItem("cookie"),
				},
				data: {
					id: id,
				},
			})
			.then((response) => {
				console.log(response.data);
				setActiveNote("")
				setNotes(newNotesArray);
				setBackupNotes(newNotesArray);
			})
			.catch((error) => console.log(error));

	};

	const getActiveNote = () => {
		return notes.find((note) => {
			if (note.id === activeNote) {
				return note;
			}
		});
	};

	const onUpdateNote = (updatedNote) => {
		const updatedNotesArray = notes.map((note) => {
			if (note.id === activeNote) {
				return updatedNote;
			}
			return note;
		});

		setNotes(updatedNotesArray);
		setBackupNotes(updatedNotesArray);
	};

	return (
		<div className=" bg-slate-100 flex flex-row h-full w-full">
			<Sidebar
				notes={notes}
				onAddNote={onAddNote}
				onDeleteNote={onDeleteNote}
				activeNote={activeNote}
				setActiveNote={setActiveNote}
				width={width}
				setNotes={setNotes}
				backupNotes={backupNotes}
				setBackupNotes={setBackupNotes}
				searchTxt={searchTxt}
				setSearchTxt={setSearchTxt}
				loadingTxt={loadingTxt}
			/>
			<Main
				activeNoteObject={getActiveNote()}
				realActiveNote={activeNote}
				onUpdateNote={onUpdateNote}
				width={width}
				setActiveNote={setActiveNote}
			/>
		</div>
	);
}

export default Notes;
