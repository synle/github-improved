const util = {
	getUrlForParam(params) {
		const queryString = util.getSerializedQueryString(params);

		return !!queryString ? 'https://' + location.hostname + location.pathname + '?' + queryString
			:'https://' + location.hostname + location.pathname;
	},
	getSerializedQueryString(params) {
		const paramKeys = Object.keys(params || {});
		if(paramKeys.length === 0){
			//no query string, just return it
			return '';
		}

		//prepare the query string
		const queryString = [];
		paramKeys.map( (paramKey) => {
			const paramVal = params[paramKey];
			queryString.push(paramKey + '=' + paramVal);
		});

		return queryString.join('&');
	},
    getUrlVars() {
        var vars = {},
            hash;

        const url = location.href;
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
