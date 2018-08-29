module.exports = function(_date) {
	var date;
	if (_date) {
		date = _date;
	} else {
		date = new Date();
	}
	var HOUR = date.getHours(),
		MINUTES = date.getMinutes(),
		SECONDS = date.getSeconds();
	HOUR = HOUR < 10 ? '0' + HOUR : HOUR;
	MINUTES = MINUTES < 10 ? '0' + MINUTES : MINUTES;
	SECONDS = SECONDS < 10 ? '0' + SECONDS : SECONDS;
	return HOUR + ':' + MINUTES + ':' + SECONDS
}

// example
// module.exports.timeNow = () => {
	// return
// }

// usage
// const { timeNow } = require('time-now.js')