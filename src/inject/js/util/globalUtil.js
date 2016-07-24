var util = {
	getUrlForParam : function(params){
		var queryString = util.getSerializedQueryString();
		
		return !!queryString ? 'https://' + location.hostname + location.pathname + '?' + queryString.join('&')
			:'https://' + location.hostname + location.pathname;
	},
	getSerializedQueryString : function(params){
		var paramKeys = Object.keys(params || {});
		if(paramKeys.length === 0){
			//no query string, just return it
			return '';
		}

		//prepare the query string
		var queryString = [];
		paramKeys.map( function (paramKey) {
			var paramVal = params[paramKey];
			queryString.push(paramKey + '=' + paramVal);
		});
		
		return queryString.join('&');
	},
    getUrlVars: function() {
        var vars = {},
            hash;

        var url = location.href;
        if(url.indexOf('?') === -1){
        	//no query string
        	return vars;
        }
        //query string
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}

export default util;