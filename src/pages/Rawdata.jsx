import axios from "axios";
import { useEffect, useState } from "react";

export default function Rawdata() {
	const url = localStorage.getItem("api-url");
	const [jsonData, setJsonData] = useState("");

	useEffect(() => {
		axios
			.get(url + "/api/info", {
				headers: {
					Authorization: localStorage.getItem("cookie"),
				},
			})
			.then((data) => {
				console.log(data.data);
				setJsonData(JSON.stringify(data.data, null, "\t"));
			})
			.catch((error) => {
				console.log(error);
				window.location.href = "/login";
			});
	}, []);

	return (
		<div>
			<div className="break-words p-2">{jsonData}</div>
		</div>
	);
}
