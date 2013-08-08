//init
var total_tabs = {};
var total_tabs_len = 0;
var max_tabs = 20;
chrome.tabs.query({},function(data){
  for(i in data){
		tab = data[i];
		tab.last_used = tab.id; //not very accurate
		total_tabs[tab.id] = tab;
		total_tabs_len++;
	}
});


//bind shit
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	delete total_tabs[tabId];
	total_tabs_len--;
});

chrome.tabs.onHighlighted.addListener(function(highlightInfo) {
	 if (typeof total_tabs[highlightInfo.tabIds[0]] !== 'undefined')
		total_tabs[highlightInfo.tabIds[0]].last_used = getTime();
});


chrome.tabs.onCreated.addListener(function(tab) {
	tab.last_used = getTime();
	total_tabs[tab.id] = tab;
	total_tabs_len++;
	if(total_tabs_len > max_tabs){
		chrome.tabs.remove(tab.id, redirect);
	}
});

function redirect(){
	//lru here..
	min_time= getTime();
	id = 0;
	w  = 0;
	for(i in total_tabs){
		if(min_time > total_tabs[i].last_used){
			id = total_tabs[i].index;
			w  = total_tabs[i].windowId;
			min_time = total_tabs[i].last_used;
		}
	}
	chrome.tabs.highlight({windowId:w,tabs:[id]},function(){});
}

function getTime(){
	return (new Date().getTime())/1000;//sec
}
