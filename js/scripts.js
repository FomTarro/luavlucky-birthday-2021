
var _time = 0;
var _angle = 0;
var _mode = "forward";
var _desiredTime = 3600;
var _paused = false;
var _timer;
var _timer_ms = 0;

_rotationTotal = 0;

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

function Pause(event){
	_paused = !_paused;
	if(_paused){
		window.clearInterval(_timer);
		document.getElementById('timerDisplay').classList.add('paused')
		document.getElementById('tips').innerHTML = "<h1>[flip your phone to count the other way]</h1><h2>[tap and hold the timer to resume]</h2>"
	}
	else{
		document.getElementById('timerDisplay').classList.remove('paused')
		_timer = window.setInterval(Timer, 10);
		document.getElementById('tips').innerHTML = "<h1>[flip your phone to count the other way]</h1><h2>[tap and hold the timer to pause]</h2>"
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

function SetOffset(){

	document.getElementById('timerDisplay').innerText = toHHMMSS(_time);
	// document.getElementById('calibrate').style.display = "none";
	document.getElementById('calibrate').classList.add('fade-away')
	document.getElementById('tips').style.display = "block";
	document.getElementById('batteryzone').style.display = "block";
	_timer = window.setInterval(Timer, 10);
	document.getElementById("eventHaver").addEventListener('mousedown', Pause);
}

function Timer(){

	_timer_ms = _timer_ms + 1;

	if(_timer_ms >= 100){
		if(_mode == "forward"){
			_time = _time + 1;
		}
		else if(_mode == "backward"){
			_time = _time - 1;
		}

		_time = Math.max(0, _time);
		_time = Math.min(_desiredTime, _time);
		
		document.getElementById('timerDisplay').innerText = toHHMMSS(_time);
		_timer_ms = 0;
	}
}

function mHandler(event){
	document.getElementById('tips').innerHTML = `<h1>${event.alpha} - ${event.beta} - ${event.gamma}</h1>`
	// _rotationTotal += event.rotationRate.gamma;
	// _rotationTotal = _rotationTotal % 360;
	// _angle = Math.abs(_rotationTotal);
	// //document.getElementById('timerDisplay').innerText = _angle;
	// if(_angle <= 270 && _angle > 90){
	// 	_mode = "backward"
	// 	document.getElementById('flip').className = "flipped";
	// }
	// else if(_angle >= 270 || _angle <= 90){
	// 	_mode = "forward"
	// 	document.getElementById('flip').className = "normal";
	// }
}

window.addEventListener('deviceorientation', mHandler);
