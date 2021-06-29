try {
	chrome.runtime.onMessageExternal.addListener(async function (request, sender, sendResponse) {
		if (request.diagnostic == "public") {
			const data = await GetAPIHardwareInfo();
			let jdata = JSON.stringify(data, null, 2)
			console.log(jdata);
			sendResponse(jdata);
		}
	});
	// Extension API: chrome.system
	const fetchMemory = () => {
		return new Promise((resolve, reject) => {
			chrome.system.memory.getInfo((data) => {
				resolve(data);
			});
		});
	};
	const fetchCpu = () => {
		return new Promise((resolve, reject) => {
			chrome.system.cpu.getInfo((data) => {
				resolve(data);
			});
		});
	};
	const fetchstorage = () => {
		return new Promise((resolve, reject) => {
			chrome.system.storage.getInfo((data) => {
				resolve(data);
			});
		});
	};
	const GetAPIHardwareInfo = () => {
		return new Promise(async (resolve, reject) => {
			const memory = await fetchMemory();
			const cpu = await fetchCpu();
			const storage = await fetchstorage();
			let info = {
				memory,
				cpu,
				storage
			}
			resolve(info);
		});
	};
} catch (e) {
	console.log("Exception: " + e);
}
