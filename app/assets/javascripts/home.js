// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';
MB_URL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var udn_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat volutpat consectetur. Maecenas diam est, mattis et tristique sed, vehicula sit amet purus. Nullam id laoreet arcu. Fusce tempor, nulla vitae hendrerit ultrices, nunc diam luctus ante, ornare placerat odio massa in urna. Sed auctor, sapien eu consequat mattis, tortor erat iaculis tellus, vitae vulputate justo elit sit amet leo. Curabitur egestas nibh sed vulputate porta. Suspendisse quis felis ut tellus hendrerit sagittis tempor eget dolor. Sed bibendum eu orci non rhoncus. Duis convallis augue at commodo mattis. Phasellus tempus lectus in lacus auctor, quis tincidunt est pharetra."
var event_udn = new NewsEvent(25.060897, 121.641675, "event-img-udn.jpg", "聯合總部", udn_content,new Date('2014-05-13T11:51:00'), "photo");
var moj_content = "Nunc lobortis sed lacus vitae sagittis. Aliquam porttitor mollis tellus, at placerat massa dapibus ac. Praesent porta enim massa, a condimentum nisi auctor sit amet. Sed fermentum, mi eget egestas ullamcorper, risus tellus suscipit ipsum, nec laoreet augue dolor in mi. Aenean non facilisis nibh. In ac pretium nulla. Duis lacus arcu, venenatis id purus adipiscing, facilisis varius nunc. Nullam non scelerisque augue. Aenean pharetra, turpis ac dignissim consectetur, neque sapien accumsan nulla, ac viverra libero risus non augue. Integer dignissim elit ut lectus porttitor convallis. Morbi vehicula magna vitae quam tempus mattis. Quisque turpis nisi, vulputate non tincidunt at, vestibulum eget felis. Vestibulum id luctus ante."
var event_moj = new NewsEvent(25.036423, 121.512462, "event-img-moj.jpg", "法務部", moj_content,new Date('2014-05-12T23:51:00'), "photo");
var ntu_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie ipsum vitae metus adipiscing, eu volutpat neque commodo. Etiam congue ultrices tortor vitae euismod. Nam eget bibendum lacus. Ut fringilla nunc in quam lobortis facilisis. Vivamus ultrices pharetra orci, at vulputate purus luctus in. Fusce eu lectus sit amet lacus porta porta at non nunc. Nullam urna neque, posuere non malesuada nec, mollis eu diam. In hac habitasse platea dictumst. Maecenas eget laoreet magna.";
var event_ntu = new NewsEvent(25.014902, 121.534429, "event-img-ntu.jpg", "National Taiwan University", ntu_content, new Date('2012-04-28T08:09:00'), "photo");
var pot_content = "民國八十年，鼎王麻辣鍋創始店，在美味齊聚、熱鬧擁擠的台中市忠孝夜市設立。在當時，麻辣鍋專賣仍屬創舉，要在各式小吃環伺的忠孝夜市中，贏得饕客的鍾愛，必須有其獨到之處，在創辦人 先生以其多年廚師經驗及用心的耕耘下，很快就掌握了顧客挑剔的味蕾，研發出獨步全台麻辣湯頭，從最初的小吃店，歷經不同階段的轉型蛻變，打造的餐飲空間設計，並首創服務人員，九十度鞠躬禮。";
var event_pot = new NewsEvent(25.050594, 121.558117, "event-img-pot.jpg", "鼎王麻辣鍋",pot_content, new Date('2014-04-10T23:11:10'), "photo" );

//define event
function NewsEvent(lat, lon, img_url, title, content, time, type ){
  
  this.latitude = lat;
  this.longitude = lon;
  this.image_url = img_url;
  this.title = title;
  this.content = content;
  this.time = time;
  this.type = type;

}

$(document).ready(function(){  
  
  map = L.map('map').setView([25.049235, 121.575930], 13);
  L.tileLayer(MB_URL, {attribution: MB_ATTR, id: 'examples.map-9ijuk24y'}).addTo(map);

  $('#time-container').html(new Date());

  news = new Array();
  news.push(event_udn);
  news.push(event_ntu);
  news.push(event_moj);
  news.push(event_pot);
  //a - b is from small to big, from past to current
  news.sort( function(a,b){ return a.time - b.time; } );
  //console.log(news);


  //place pin
  for (var i = 0; i < news.length; i++) {
    L.marker( [news[i].latitude, news[i].longitude], {tag: i} )
     .on('click', changeContent)
     .addTo(map);
  };


  //init with the first two data
  path = L.polygon([ [news[0].latitude, news[0].longitude], [news[1].latitude, news[1].longitude] ]).addTo(map);

});

//map zoom in 
//change content
//draw polygons
function changeContent(e){
  //console.log(e);
  tag = e.target.options.tag;
  console.log(e.target.options.tag);
  //map zoom
  map.setView(e.latlng, 13);
  //change content
  $('#news-img-container').html('<img id="news-img" src="/assets/' + news[tag].image_url + '" />');
  console.log(news[tag].title);
  $('#title-container').html('<h2 id="title">' + news[tag].title + "</h2>");
  $('#content-container').html('<p id="content">' + news[tag].content +'</p>');
  $('#time-container').html('<small id="time">' + news[tag].time + "</small>"); 
  //draw line
  //if pressed the first, draw 0 --> 1
  //else draw former to current
  map.removeLayer(path);
  if(tag == 0){
    path = L.polygon([ [news[0].latitude, news[0].longitude], [news[1].latitude, news[1].longitude] ]).addTo(map);
  }
  else{
    path = L.polygon([[news[tag-1].latitude,news[tag-1].longitude], [news[tag].latitude, news[tag].longitude] ]).addTo(map);
  }

}


