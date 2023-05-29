import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import axios from "axios";
import { AES, enc } from "crypto-js";

function Notes() {
	const url = localStorage.getItem("api-url");
	const noteId = useRef();
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
		axios
			.get(url + "/api/notes", {
				headers: {
					Authorization: localStorage.getItem("cookie"),
				},
			})
			.then((data) => {
				const userNotes = data.data.notes;
				let newNotes = [];
				console.log(userNotes);
				try {
					userNotes.forEach((note) => {
						const itemKey = note.itemKey;
						note.title = AES.decrypt(note.title, itemKey).toString(
							enc.Utf8
						);
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

	useEffect(() => {
		if (activeNote == " ") {
			setActiveNote(noteId.current);
		}
	}, [activeNote]);

	const onAddNote = () => {
		setSearchTxt("");
		const randomBytes = new Uint8Array(32);
		crypto.getRandomValues(randomBytes);
		const itemKey = Array.from(randomBytes)
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");

		const encryptedTitle = AES.encrypt("Untitled Note", itemKey).toString();
		const encryptedBody = AES.encrypt("[]", itemKey).toString();

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
			itemKey,
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
				noteId.current = note.id;
				setActiveNote(" ");
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
			})
			.catch((error) => console.log(error));
		setNotes(newNotesArray);
		setBackupNotes(newNotesArray);
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
				activeNote={getActiveNote()}
				onUpdateNote={onUpdateNote}
				width={width}
				setActiveNote={setActiveNote}
			/>
		</div>
	);
}

export default Notes;
