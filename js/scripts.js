
var _time = 0;
var _mode = 1;
var _desiredTime = 3600;
var _paused = false;
var _timer;
var _timer_ms = 0;
var _supportsOrientation = false;

navigator.getBattery().then(function(battery) {
	document.getElementById('percentzone').innerHTML = "<h3>[battery level: " + Math.floor(battery.level * 100) + "%]</h3>";
	document.getElementById('chargingzone').innerHTML = "<h4>[battery: " + (battery.charging ? "charging" : "not charging") + "]</h4>";
	battery.addEventListener('levelchange', function() {
		document.getElementById('percentzone').innerHTML = "<h3>[battery level: " + Math.floor(battery.level * 100) + "%]</h3>";
	});
	battery.addEventListener('chargingchange', function() {
    	console.log("Battery charging? " + (battery.charging ? "Yes" : "No"));
    document.getElementById('chargingzone').innerHTML = "<h4>[battery: " + (battery.charging ? "charging" : "not charging") + "]</h4>";
  });
});

function pause(event){
	_paused = !_paused;
	if(_paused){
		window.clearInterval(_timer);
		document.getElementById('timerDisplay').classList.add('paused')
		document.getElementById('pause').innerHTML = "[tap the timer to resume]"
	}
	else{
		document.getElementById('timerDisplay').classList.remove('paused')
		_timer = window.setInterval(timer, 10);
		document.getElementById('pause').innerHTML = "[tap the timer to pause]"
	}
}

function toHHMMSS(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function desktopFlip(){
	if(_timer){
		mHandler({beta: -1 * _mode});
	}
}

function setOffset(){

	if (typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function") {
        // (optional) Do something before API request prompt.
        DeviceMotionEvent.requestPermission()
            .then( response => {
            // (optional) Do something after API prompt dismissed.
            if ( response == "granted" ) {
				window.addEventListener('deviceorientation', mHandler);
				_supportsOrientation = true;
				document.getElementById('advice').innerHTML = '[flip your phone to count the other way]'
            }else{
				document.getElementById('advice').innerHTML = '<a onclick="desktopFlip()">[tap here to count the other way]</a>'
				_supportsOrientation = false;
			}
        }).catch( console.error )
    } else 
		if(window.DeviceOrientationEvent && 'ontouchstart' in window){
			window.addEventListener('deviceorientation', mHandler);
			_supportsOrientation = true;
			document.getElementById('advice').innerHTML = '[flip your phone to count the other way]'
		}else{
			document.getElementById('advice').innerHTML = '<a onclick="desktopFlip()">[tap here to count the other way]</a>'
			_supportsOrientation = false;
		}{
    }

	document.getElementById('timerDisplay').innerText = toHHMMSS(_time);
	document.getElementById('calibrate').classList.add('fade-away')
	_timer = window.setInterval(timer, 10);
	document.getElementById("timerDisplay").addEventListener('mousedown', pause);
}

function timer(){
	_timer_ms = _timer_ms + 1;

	if(_timer_ms >= 100){
		if(_mode > 0){
			_time = _time + 1;
		}
		else if(_mode <= 0){
			_time = _time - 1;
		}

		_time = Math.max(0, _time);
		_time = Math.min(_desiredTime, _time);
		var arrow = (_mode > 0) ? ' ↑ ' : ' ↓ ';
		document.getElementById('timerDisplay').innerText = arrow + toHHMMSS(_time) + arrow
		_timer_ms = 0;
	}
}

function mHandler(event){
	var beta = event.beta ? event.beta : 0;
	if(beta < 0){
		_mode = -1;
		if(_supportsOrientation == true){
			document.getElementById('flip').className = "flipped";
		}
	}
	else{
		_mode = 1
		if(_supportsOrientation == true){
			document.getElementById('flip').className = "normal";
		}
	}
}
