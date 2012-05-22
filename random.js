(function(){
var expires = 600000;
var getArchive = function(callback) {
	var httpRequest = new XMLHttpRequest();
	var ajax = function () {
		httpRequest.open('GET', 'http://threewordphrase.com/archive.htm', true);
		httpRequest.send(null);
	}
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState != 4) return;
		if (httpRequest.status === 200) return callback(httpRequest.responseText);
		ajax();
	};
	ajax();
};
var parseArchive = function (text) {
	var parser = document.createElement('div');
	parser.innerHTML = text;
	var nodes =  Array.prototype.slice.call(parser.getElementsByClassName('links')[0].children);
	var comics = [];
	getLinks(nodes, comics, function (comics) {
		window.localStorage['_random_links'] = JSON.stringify({
			timestamp: new Date().getTime(),
			links: comics
		});
		makeLink(comics);
	});
};
var getLinks = function (nodes, comics, callback) {
	if (!nodes || !nodes.length) return callback(comics);
	var node = nodes.splice(0,1)[0];
	if (node.tagName === 'A') comics.push(node.href);
	setTimeout(function () {
		getLinks(nodes, comics, callback);
	}, 0);
};
var makeLink = function (links) {
	var href = links[Math.floor(Math.random()*links.length)];
	var link = document.createElement('a');
	link.href = href;
	link.innerHTML = 'RANDOM';
	link.style.position = "fixed";
	link.style.top = "1em";
	link.style.left = "1em";
	link.style.fontFamily = "sans-serif";
	link.style.fontSize = "16px";
	document.body.appendChild(link);
};
var storedLinks = JSON.parse(window.localStorage['_random_links'] || "null");
if (!storedLinks || new Date().getTime() - storedLinks.timestamp > expires) {
	getArchive(parseArchive);
} else {
	makeLink(storedLinks.links);
}
})();
