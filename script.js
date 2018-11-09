/* -------------------------------- Deklaracija varijabli ------------------------------------------*/
/*var geocoding_api_key = "AIzaSyArNKv1fk3_DoqwxIWm7QvjpKkZNL7u1HU"; Google maps geocoding api */
var accuweather_api_key = "SvftgDqH4f7cABbj95ZHpv0FL83efL7k"; //Limited trial 50 calls/day
var weather_icon_url = "https://developer.accuweather.com/sites/default/files/"; /*01-s.png*/
var lat;
var lon;
var response1;
var response2;
var response3;
var response4;
var locationKey = null;
var text = $("#my-location");
var xmlHttp1_location = new XMLHttpRequest();
var xmlHttp2_curWeather = new XMLHttpRequest();
var xmlHttp3_todayWeather = new XMLHttpRequest();
var xmlHttp4_5dayWeather = new XMLHttpRequest();

/* -------------------------------- Deklaracija Funkcija -------------------------------------------*/
function GetRequest()
{
    /*var theUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key="+geocoding_api_key+"";*/   /* google geocoding api url */
    var location_url = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+accuweather_api_key+"&q="+lat+"%2C"+lon+"&language=en&details=false&toplevel=true";

    xmlHttp1_location.onreadystatechange = function() 
    { 
        if (xmlHttp1_location.readyState == 4 && xmlHttp1_location.status == 200)
        {

            response1 = JSON.parse(xmlHttp1_location.responseText);
            text.html("Your Location: "+response1.LocalizedName+", "+response1.Country.LocalizedName);
            locationKey = response1.Key;

            /* Nakon što je dohvaćen locationKey može se napraviti novi zahtjev prema serveru za dohvaćanjem podataka o vremenu */
            var curWeather_url = "http://dataservice.accuweather.com/currentconditions/v1/"+locationKey+"?apikey="+accuweather_api_key+"&language=en&details=true";
            var todayWeather_url = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/"+locationKey+"?apikey="+accuweather_api_key+"&language=en&details=true&metric=true"
            var fiveDaysWeather_url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+locationKey+"?apikey="+accuweather_api_key+"&language=en&details=true&metric=true";
            
            /*Jquery provjera klase za izbornik kako bi se moglo prepoznati koji zahtjev da se pošalje serveru */
            if($("#now").hasClass("active") == true)
            {
                xmlHttp2_curWeather.open("GET", curWeather_url , true); // true za asinkroni zathjev
                xmlHttp2_curWeather.send();
            }
            else if($("#today").hasClass("active") == true)
            {
                xmlHttp3_todayWeather.open("GET", todayWeather_url , true); // true za asinkroni zathjev
                xmlHttp3_todayWeather.send();
            }
            else if($("#5days").hasClass("active") == true)
            {
                xmlHttp4_5dayWeather.open("GET", fiveDaysWeather_url , true); // true za asinkroni zathjev
                xmlHttp4_5dayWeather.send();
            }
        }
    }

    xmlHttp2_curWeather.onreadystatechange = function() 
    { 
        if (xmlHttp2_curWeather.readyState == 4 && xmlHttp2_curWeather.status == 200)
        {

            response2 = JSON.parse(xmlHttp2_curWeather.responseText);
            console.log(response2);
            setData_currentWeather();            
        }
    }

    xmlHttp3_todayWeather.onreadystatechange = function() 
    { 
        if (xmlHttp3_todayWeather.readyState == 4 && xmlHttp3_todayWeather.status == 200)
        {

            response3 = JSON.parse(xmlHttp3_todayWeather.responseText);
            console.log(response3);
            setData_todayWeather();            
        }
    }

    xmlHttp4_5dayWeather.onreadystatechange = function() 
    { 
        if (xmlHttp4_5dayWeather.readyState == 4 && xmlHttp4_5dayWeather.status == 200)
        {

            response4 = JSON.parse(xmlHttp4_5dayWeather.responseText);
            console.log(response4);
            setData_5dayWeather();       
        }
    }

    xmlHttp1_location.open("GET", location_url , true);
    xmlHttp1_location.send();
}

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        text.innerHTML = "Location is not supported by your browser.";
    }
};

function showPosition(position){
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    GetRequest();
}

/*----- Postavljanje vremenskih uvjeta u tablicu ------*/
function setData_currentWeather(){
    if(response2[0].WeatherIcon < 10)
    {
        $("#weather-icon").attr("src", weather_icon_url+="0"+response2[0].WeatherIcon+"-s.png");
    }
    else
    {
        $("#weather-icon").attr("src", weather_icon_url+=response2[0].WeatherIcon+"-s.png");
    }
    $("#weather").html(response2[0].WeatherText);
    $("#temperature").html(response2[0].Temperature.Metric.Value + " &degC");
    $("#realFeel").html(response2[0].RealFeelTemperature.Metric.Value + " &deg;C");
    $("#humidity").html(response2[0].RelativeHumidity + " %");
    $("#wind").html(response2[0].Wind.Direction.Localized+", "+response2[0].Wind.Speed.Metric.Value+" km/h");
    $("#weather-image-container").css("display", "block");
    $("#weather-conditions-container").css("display", "block");
}

function setData_todayWeather(){
    if(response3.DailyForecasts[0].Day.Icon < 10)
    {
        $("#today-weather-icon").attr("src", weather_icon_url+="0"+response3.DailyForecasts[0].Day.Icon+"-s.png");
    }
    else
    {
        $("#today-weather-icon").attr("src", weather_icon_url+=response3.DailyForecasts[0].Day.Icon+"-s.png");
    }
    $("#today_weather").html(response3.DailyForecasts[0].Day.IconPhrase);
    $("#today_max_temperature").html(Math.round(response3.DailyForecasts[0].Temperature.Maximum.Value) + " &degC");
    $("#today_min_temperature").html(Math.round(response3.DailyForecasts[0].Temperature.Minimum.Value) + " &deg;C");
    $("#today_wind").html(response3.DailyForecasts[0].Day.Wind.Direction.Localized+", "+response3.DailyForecasts[0].Day.Wind.Speed.Value+" km/h");
    $("#weather-image-container").css("display", "block");
    $("#weather-conditions-container").css("display", "block");
}

function setData_5dayWeather(){
    
    for(var i=0; i<5; i++)
    {
        var weather_icon_url_5days = "https://developer.accuweather.com/sites/default/files/";

        if(response4.DailyForecasts[i].Day.Icon < 10)
        {
           $("#day"+(i+1)+"-weather-icon").attr("src", weather_icon_url_5days+="0"+response4.DailyForecasts[i].Day.Icon+"-s.png");
        }
        else
        {
           $("#day"+(i+1)+"-weather-icon").attr("src", weather_icon_url_5days+=response4.DailyForecasts[i].Day.Icon+"-s.png");
        }

        $("#maxTemp"+(i+1)).html(Math.round(response4.DailyForecasts[i].Temperature.Maximum.Value));
        $("#minTemp"+(i+1)).html(Math.round(response4.DailyForecasts[i].Temperature.Minimum.Value));

    }

    $("#weather-conditions-container").css("display", "block");

}



/* ---------------------------------- Kraj Deklaracija Funkcija ------------------------------------*/

$(window).load(function(){
    var height = $(window).height() - $(".navbar").outerHeight();
    $(".sidebar").css("height", height);
    getLocation();
});

$(".sidebar-list a").click(function(){
    $(".sidebar-list a.active").removeClass("active");
    $(this).addClass("active");
});


/*
$("#today").click(function(){
    $.ajax({
        url:"today.html"
    }).done(function(data){
        $("#site-body").empty();
        $("#site-body").append(data);
    })
});

$("#tnow").click(function(){
    $.ajax({
        url:"index.html"
    }).done(function(data){
        $("#site-body").empty();
        $("#site-body").append(data);
    })
});*/