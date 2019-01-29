sslssso = new sslssso();
var console = window.console || { log: function() {} };

function Observable(){
	
    this.listen = function(type, method, scope, context) {
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    }
    this.fireEvent =  function(type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (typeof(context)!=="undefined" && context !== handler.context) continue;
            if (handler.method.call(
                handler.scope, this, type, data
            )===false) {
                return false;
            }
        }
        return true;
    }
};

function sslssso (){
   
    var obs = new Observable();
   
    this.listen = function(type, method, scope, context){
    	obs.listen(type,method,scope,context);
    }
    
    this.logout = function (){
		var message = {action: "logout"};
		postSSOMessage(message, _getUrl());
	}
	
    this.login = function (jwt){
		var message = {action: "login",jwt:jwt};
		postSSOMessage(message, _getUrl());
	}
	   
	var _getScriptURL = (function() {
	        var scripts = document.getElementsByTagName('script');
	        var index = scripts.length - 1;
	        var myScript = scripts[index];
	        return function() { return myScript.src; };
	 })();
	 
	
	function _getIframeUrl(){
		return 'https://auth.dblog.pl/sslo.html';
	}	
	
    function _getUrl(){
    	
    	//https://gist.github.com/jlong/2428561
    	var parser = document.createElement('a');
    	parser.href = _getScriptURL();
    	return parser.protocol + "//"+ parser.host
    }
    
    function postSSOMessage(message,domain){
    	var win = document.getElementById("sslo.engrave.iframe").contentWindow;
    	console.log("[SSLO] postMessage "+message.action+" to "+_getUrl());
    	if (window.attachEvent) {   // IE before version 9
  			win.postMessage(JSON.stringify(message), "*");	
		} else {
			win.postMessage(message, _getUrl());
		}
    }
    
    function dispatchEvent(eventName, detail){
    	console.log ("[SSLO] dispatchEvent "+eventName);
    	obs.fireEvent(eventName, detail);
    }

	function _listener(event){
		
		if (  _getUrl().lastIndexOf(event.origin ) == -1){
			return;
		}

		var data = event.data; //Chrome, firefox, IE11 , etc
		if (event.data && !event.data.action){ //<=IE8 & IE9 porque no soporta JSON en objetos de mensaje
			data  =  eval('(' + event.data+ ')');
		}

		if (data && data .action == "sso.onlogout"){
			console.log("[SSLO] received event onlogout");
			if (typeof(onLogout) == "function")
				onLogout();
			dispatchEvent('sso.onlogout'); 
		} else if (data && data.action == "sso.onload") {
			console.log("[SSLO] received event onload ");
			if (typeof(onLoad) == "function")
				onLoad();
			dispatchEvent('sso.onload'); 
			
		}else if (data && data.action == "sso.onidentification") {
			console.log("[SSLO] received event onidentification ");
			if (typeof(onIdentification) == "function")
				onIdentification(data);
			dispatchEvent('sso.onidentification',data);
		}	
	}
	
	function _init(){

		console.log ("[SSLO] SSOServerUrl= " +_getUrl());
		
		//Message listener for SSO events (created by the SSO iframe)
		if (window.addEventListener){
			addEventListener("message", _listener, false)
		} else {
			attachEvent("onmessage", _listener)
		}
					
		//Creates the iframe with reference to server SSO functions
		var iframeUrl = _getIframeUrl()
		console.log ("[SSLO] create iframe: "+ iframeUrl);
	    var iframe = document.createElement('iframe');
		iframe.style.display = "none";
		iframe.src = iframeUrl;
		iframe.id = 'sslo.engrave.iframe';
		document.body.appendChild(iframe);
	}
	
	function init(conf){
		if (conf){
			config = conf;
		}	
	}
	
	if (window.addEventListener) {
		// W3C standard
	  window.addEventListener('load', _init, false); // NB **not** 'onload'
	} else if (window.attachEvent){
		 // Microsoft
	  window.attachEvent('onload', _init);
	}

}	
	
	



