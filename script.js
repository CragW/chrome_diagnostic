var gExtensionID = "cfkgaipiaaeddfjnkjfofolainpfapeb";
var gIntervalRefresh = 10000;

/**
 * System Hardware Info Analysis
 *
 * @objHwData object type JSON data
 */
function HardwareInfoAnalysis(objHwData) {
	try{
		// system.cpu
		if (objHwData.hasOwnProperty('cpu')) {
			document.getElementById("archName").innerHTML = objHwData.cpu.archName;
			document.getElementById("features").innerHTML = objHwData.cpu.features;
			document.getElementById("modelName").innerHTML = objHwData.cpu.modelName;
			document.getElementById("numOfProcessors").innerHTML = objHwData.cpu.numOfProcessors;
			// processor details
			var parentNode = document.getElementById("wrapper-cpu");
			parentNode.querySelectorAll('*').forEach(n => n.remove());
			for (var i = 0; i < objHwData.cpu.processors.length; i++) {
				newElementCard = document.createElement("div");
				newElementCard.classList.add('fancy-card');
				// processor number
				newElementNum = document.createElement("p");
				newNodeTextNum = document.createTextNode("CPU " + (i + 1));
				newElementNum.appendChild(newNodeTextNum);
				newElementCard.appendChild(newElementNum);
				// processor usage
				newElementAvail = document.createElement("p");
				var availProcessorPercentage = (100 * (parseInt(objHwData.cpu.processors[i].usage.idle, 10) / parseInt(objHwData.cpu.processors[i].usage.total, 10))).toFixed(2);
				newNodeTextAvail = document.createTextNode(availProcessorPercentage + "%");
				newElementAvail.appendChild(newNodeTextAvail);
				newElementCard.appendChild(newElementAvail);
				// attach to parent
				parentNode.appendChild(newElementCard);
			}
		} else {
			console.warn("Warning: no system.cpu object");
		}
		// system.memory
		if (objHwData.hasOwnProperty('memory')) {
			document.getElementById("availableCapacity").innerHTML = objHwData.memory.availableCapacity;
			document.getElementById("capacity").innerHTML = objHwData.memory.capacity;
		} else {
			console.warn("Warning: no system.memory object");
		}
		// system.storage
		var parentNode = document.getElementById("wrapper-storage");
		parentNode.querySelectorAll('*').forEach(n => n.remove());
		if (objHwData.hasOwnProperty('storage')) {
			for (var i = 0; i < objHwData.storage.length; i++) {
				newElementCard = document.createElement("div");
				newElementCard.classList.add('fancy-card');
				// storage number
				newElementTmp = document.createElement("p");
				newNodeTextTmp = document.createTextNode("Storage " + (i + 1));
				newElementTmp.appendChild(newNodeTextTmp);
				newElementCard.appendChild(newElementTmp);
				// storage capacity
				newElementTmp = document.createElement("p");
				newNodeTextTmp = document.createTextNode("Capacity: " + objHwData.storage[i].capacity);
				newElementTmp.appendChild(newNodeTextTmp);
				newElementCard.appendChild(newElementTmp);
				// storage id
				newElementTmp = document.createElement("p");
				newNodeTextTmp = document.createTextNode("ID: " + objHwData.storage[i].id);
				newElementTmp.appendChild(newNodeTextTmp);
				newElementCard.appendChild(newElementTmp);
				// storage name
				newElementTmp = document.createElement("p");
				newNodeTextTmp = document.createTextNode("name: " + objHwData.storage[i].name);
				newElementTmp.appendChild(newNodeTextTmp);
				newElementCard.appendChild(newElementTmp);
				// storage type
				newElementTmp = document.createElement("p");
				newNodeTextTmp = document.createTextNode("Type: " + objHwData.storage[i].type);
				newElementTmp.appendChild(newNodeTextTmp);
				newElementCard.appendChild(newElementTmp);
				// attach to parent
				parentNode.appendChild(newElementCard);
			}
		} else {
			console.warn("Warning: no system.storage object");
		}
	} catch (e) {
		console.error("FAIL: " + e)
	}
}

/**
 * Messaging to Chrome Extension
 *
 * Reference: https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage
 */
function MessagingChromeExtension() {
	if (gExtensionID == "") {
		console.error("Error: Extension ID can't be null");
		return;
	}
	// Make a simple request to Chrome Extension
	chrome.runtime.sendMessage(gExtensionID, { diagnostic: "public" },
		function (response) {
			var lastError = chrome.runtime.lastError;
			if (lastError) {
				console.log(lastError.message);
				return;
			}
			// DoSomething with message response
			try {
				const objHwData = JSON.parse(response);
				console.log(objHwData);
				HardwareInfoAnalysis(objHwData);
			} catch (e) {
				console.error("FAIL: " + e)
			}
		});
}

window.onload = function () {
	setInterval(function () { MessagingChromeExtension() }, gIntervalRefresh);
}

if ("serviceWorker" in navigator) {
	// register service worker
	navigator.serviceWorker.register("service-worker.js")
		.then(reg => console.log('Service Worker registered!', reg))
		.catch(err => console.log('Error!', err));
}
