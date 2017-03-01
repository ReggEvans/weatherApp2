//************************************************************************************
//API KEYS
//************************************************************************************
var weatherURL = 'https://api.darksky.net/forecast/e26e2e8d0cba22e89ce2429b7448b155/'
var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
var reverseGoogle = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='

//************************************************************************************
//Query Selectors
//************************************************************************************
var currentLinkNode = document.querySelector('#switch-current')
var dailyLinkNode = document.querySelector('#switch-daily')
var hourlyLinkNode = document.querySelector('#switch-hourly')
var currentNode = document.querySelector('#current-weather')
var dailyNode = document.querySelector('#daily-weather')
var hourlyNode = document.querySelector('#hourly-weather')
var locationNode = document.querySelector('#location')
var searchFieldNode = document.querySelector('#search-field')
var weatherTypeNode = document.querySelector('#weather-type')

//************************************************************************************
//EVENT LISTENERS
//************************************************************************************
currentLinkNode.addEventListener('click', handleCurrentCoords)
dailyLinkNode.addEventListener('click', handleDailyCoords)
hourlyLinkNode.addEventListener('click', handleHourlyCoords)
searchFieldNode.addEventListener('keydown', inputSearch)
window.addEventListener('hashchange', getLocation)

//************************************************************************************
//Controller Function
//************************************************************************************
var WeatherRouter = Backbone.Router.extend({
	routes: {
		":lat/:lng/current": "showCurrentPage",
		":lat/:lng/daily": "showDailyPage",
		":lat/:lng/hourly": "showHourlyPage",
		"*default": "redirectToCurrent",
	},

	redirectToCurrent: function() {
		navigator.geolocation.getCurrentPosition(handleCoordsObj)
	},

	showCurrentPage: function(lat, lng) {
		var weatherPromise = $.getJSON(weatherURL + lat + ',' + lng + '?callback=?')
		weatherPromise.then(handleCurrentResponse)
	},

	showDailyPage: function(lat, lng) {
		var weatherPromise = $.getJSON(weatherURL + lat + ',' + lng + '?callback=?')
		weatherPromise.then(handleDailyResponse)
	},

	showHourlyPage: function(lat, lng) {
		var weatherPromise = $.getJSON(weatherURL + lat + ',' + lng + '?callback=?')
		weatherPromise.then(handleHourlyResponse)
	},
})



//************************************************************************************
//HANDLE COORDS OBJECT FUNCTION
//************************************************************************************
function handleCoordsObj(coordsObj) {
	var lat = coordsObj.coords.latitude
	var lng = coordsObj.coords.longitude
	hashString = lat + '/' + lng + '/current'
	location.hash = hashString
	hideGif()
}

//************************************************************************************
//HANDLE COORDS FUNCTIONS
//************************************************************************************
function handleCurrentCoords (str) {
	var hashStr = location.hash.substr(1)
	var	hashSplit = hashStr.split('/')
	hashSplit[2] = 'current'
	var newHashLocation = hashSplit.join('/')
	newHashLocation = '#' + newHashLocation
	location.hash = newHashLocation
}

function handleDailyCoords (str) {
	var hashStr = location.hash.substr(1)
	var	hashSplit = hashStr.split('/')
	hashSplit[2] = 'daily'
	var newHashLocation = hashSplit.join('/')
	newHashLocation = '#' + newHashLocation
	location.hash = newHashLocation
}

function handleHourlyCoords (str) {
	var hashStr = location.hash.substr(1)
	var	hashSplit = hashStr.split('/')
	hashSplit[2] = 'hourly'
	var newHashLocation = hashSplit.join('/')
	newHashLocation = '#' + newHashLocation
	location.hash = newHashLocation
}

//************************************************************************************
//WRITE CURRENT DATA TO THE PAGE
//************************************************************************************
function handleCurrentResponse(weatherObj) {
	var num = weatherObj.currently.temperature
	var temp = num.toString()[0] + [1];
	var weatherHTMLString = ''
	weatherHTMLString += ''
	weatherHTMLString += '<div id="temperature">'
	weatherHTMLString += 	'<h1>' + temp + '&deg;' + '</h1>'
	weatherHTMLString += '</div>'
	weatherHTMLString += '<div  id="icon-type">'
	weatherHTMLString += 	'<canvas id="current-icon" class="weather-icon" width="90" height="90"></canvas>'
	weatherHTMLString += 	'<span id="weather-type">' + weatherObj.currently.summary + '</span>'
	weatherHTMLString += '</div>'
	currentNode.innerHTML = weatherHTMLString
	animateCurrentIcons(weatherObj)
	hideGif()
}

//************************************************************************************
//WRITE DAILY DATA TO THE PAGE
//************************************************************************************
function handleDailyResponse(weatherObj) {
	var weatherHTMLString = ''
	var i = 1
	while (i < 7) {
		weatherHTMLString += ''
		weatherHTMLString += '<div id="list">'
		weatherHTMLString += 	'<div id="list-icon">'
		weatherHTMLString += 	'<canvas id="daily-icon' + i + '" class="weather-icon" width="40" height="40"></canvas>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += 	'<div id="list-time">'
		weatherHTMLString += 		'<h3>' + moment.unix(weatherObj.daily.data[i].time).format("dddd") + '</h3>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += 	'<div id="list-temp">'
		weatherHTMLString += 		'<h3>' + weatherObj.daily.data[i].temperatureMin.toString()[0] + [1] + '&deg;' + ' / ' + weatherObj.daily.data[0].temperatureMax.toString()[0] + [1] + '&deg;' + '</h3>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += 	'<div id="list-rain">'
		weatherHTMLString += 		'<h3>' + Math.round(weatherObj.daily.data[i].precipProbability * 100) + '%' + '</h3>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += '</div>'
		i++
	} 
	dailyNode.innerHTML = weatherHTMLString
	animateDailyIcons(weatherObj)
}

//************************************************************************************
//WRITE HOURLY DATA TO THE PAGE
//************************************************************************************
function handleHourlyResponse(weatherObj) {
	var weatherHTMLString = ''
	var i = 1
		while (i < 7) {
		weatherHTMLString += ''
		weatherHTMLString += '<div id="list">'
		weatherHTMLString += 	'<div id="list-icon">'
		weatherHTMLString += 	'<canvas id="hourly-icon' + i + '" class="weather-icon" width="40" height="40"></canvas>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += 	'<div id="list-time">'
		weatherHTMLString += 		'<h3>' + moment.unix(weatherObj.hourly.data[i].time).format("LT") + '</h3>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += 	'<div id="list-temp">'
		weatherHTMLString += 		'<h3>' + weatherObj.hourly.data[i].temperature.toString()[0] + [1] + '&deg;' + '</h3>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += 	'<div id="list-rain">'
		weatherHTMLString += 		'<h3>' + Math.round(weatherObj.hourly.data[i].precipProbability * 100) + '%' + '</h3>'
		weatherHTMLString += 	'</div>'
		weatherHTMLString += '</div>'
		i++
		} 
	hourlyNode.innerHTML = weatherHTMLString
	animateHourlyIcons(weatherObj)
}

//************************************************************************************
//WEATHER ICONS
//************************************************************************************
function animateCurrentIcons(weatherObj) {
	var skycons = new Skycons({"color": "white"})
  	skycons.add(document.getElementById("current-icon"), weatherObj.currently.icon)
  	skycons.play()
}

function animateDailyIcons(weatherObj) {
	var skycons = new Skycons({"color": "white"})
	var i = 1
	while (i < 7) {
	  	skycons.add(document.getElementById("daily-icon" + i ), weatherObj.daily.data[i].icon)
	  	i++
  }
  	skycons.play()
}

function animateHourlyIcons(weatherObj) {
	var skycons = new Skycons({"color": "white"})
	var i = 1
	while (i < 7) {
	  	skycons.add(document.getElementById("hourly-icon" + i), weatherObj.hourly.data[i].icon)
	  	i++
  }
  	skycons.play()
}

//************************************************************************************
//SEARCH BAR FUNCTION
//************************************************************************************
function inputSearch(e) {
	if (e.keyCode === 13) {
	    //create an li element: method one - set user text as li's text content, as told by amanda. method two - 
	    var targetValue = e.target.value
	    
	    var googlePromise  = $.getJSON(googleURL + targetValue)

	    googlePromise.then(handleGoogleResponse)

	    e.target.value = ''
	}
}

function handleGoogleResponse(coordsObj) {
	var lat = coordsObj.results[0].geometry.location.lat
	var lng = coordsObj.results[0].geometry.location.lng
	hashString = lat + '/' + lng + '/current'
	location.hash = hashString
}

//************************************************************************************
//GET LOCATION
//************************************************************************************
function getLocation() {
	var newStr = ''
	var hashStr = location.hash.substr(1),
		hashSplit = hashStr.split('/')
		newStr = hashSplit[0] + ',' + hashSplit[1]
	
	var reverseGooglePromise  = $.getJSON(reverseGoogle + newStr)

	reverseGooglePromise.then(handleReverseGoogleResponse)
}

function handleReverseGoogleResponse(coordsObj) {
	var city = coordsObj.results[0].address_components[3].long_name
	var cityString = ''
	cityString += 	'<h4>' + city + '</h4>'
	locationNode.innerHTML = cityString
}

//************************************************************************************
//HIDE GIF FUNCTION
//************************************************************************************
function hideGif() { // hides loading gif once bills are displayed
    var loadingIcon = document.querySelector('.spinner')
    loadingIcon.style.display = 'none'
}



var rtr = new WeatherRouter()

Backbone.history.start()