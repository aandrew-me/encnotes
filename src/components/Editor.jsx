import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";

import { useEffect, useRef } from "react";
import axios from "axios";
import { AES } from "crypto-js";

let timeoutId;
let editor;

export default function Editor({ setSaveState, onUpdateNote, activeNoteObject }) {
	const url = localStorage.getItem("api-url");
	const activeId = useRef();

	useEffect(() => {
		if (activeNoteObject) {
			if (editor && editor.clear) {
				if (activeId.current !== activeNoteObject.id) {
					if (activeNoteObject.body.length == 0) {
						editor.clear();
					} else {
						editor.render({ blocks: activeNoteObject.body });
					}
					activeId.current = activeNoteObject.id

				} 
			} else {
				editor = new EditorJS({
					placeholder: "Your Note Body",
					holder: "editorjs",
					data: {
						blocks: activeNoteObject.body,
					},
					tools: {
						embed: Embed,
						table: Table,
						list: List,
						warning: Warning,
						code: Code,
						linkTool: LinkTool,
						image: SimpleImage,
						raw: Raw,
						header: {
							class: Header,
							inlineToolbar: true,
						},
						quote: Quote,
						marker: Marker,
						checklist: CheckList,
						delimiter: Delimiter,
						inlineCode: InlineCode,
						simpleImage: SimpleImage,
					},
				});
			}
		}

	}, [activeNoteObject]);

	function handleInput() {
		setSaveState("saving");
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			editor.save().then((data) => {
				const dateNow = Date.now();
				const itemKey = activeNoteObject.itemKey;

				const encryptedBody = AES.encrypt(
					JSON.stringify(data.blocks),
					itemKey
				).toString();

				onUpdateNote({
					...activeNoteObject,
					body: data.blocks,
					lastModified: dateNow,
				});

				axios
					.put(
						url + "/api/notes",
						{
							id: activeNoteObject.id,
							body: encryptedBody,
							lastModified: dateNow,
							hasTitle: false,
							hasBody: true,
						},
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
			});
		}, 1000);
	}

	return (
		<div
			onInput={() => {
				handleInput();
			}}
			onKeyUp={() => {
				handleInput();
			}}
			id="editorjs"
			className={"m-1 p-3 inputBody w-full leading-3 overflow-auto " + (activeNoteObject ? "" : "hidden")}
		></div>
	);
}
