

$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };


  const hotelSelect = $('#hotel-choices')
  const restaurantSelect= $('#restaurant-choices')
  const activitySelect = $('#activity-choices')

  const hotelPanel = $('#hotelDiv')
  const restaurantPanel = $('#restaurantDiv')
  const activityPanel = $('#activityDiv')

  var hotelList = $('#hotelList')
  var restaurantList = $('#restaurantList')
  var activityList = $('#activityList')

  // var currentDay = $('.current-day'
  // Days
  function Day (n) {
    this.dayNum = n;
    this.hotel = [];
    this.restaurant = [];
    this.activity = [];
    this.markers = []
  }

  Day.prototype.expand = function () {
    this.hotel.forEach(function(hotel) {
      hotelList.append(addList(hotel))
    })
    this.restaurant.forEach(function(restaurant) {
      restaurantList.append(addList(restaurant))
    })
    this.activity.forEach(function(activity) {
      activityList.append(addList(activity))
    })
    this.markers.forEach(function(marker) {
      marker.setMap(currentMap)
      bounds.extend(marker.position)
    })
    currentMap.fitBounds(bounds)
  }
  const dayAdd = $('#day-add')
  const dayList = $('.day-buttons')
  const dayRemove = $('#day-remove')

  var dayTitle = $('#day-title')
  var currentDay = 1
  var dayNumber = 1
  var days = []
  var dayOne = new Day (1)
  var currentDayObj = dayOne
  //

  var hn = 1, rn = 1, an = 1;

  var dayOne = new Day(1)
  days.push(dayOne)
  //
  //
  //
  var hotelLocation, restaurantLocation, activityLocation

  hotelSelect.on('change', function(e) {
    hn = $(this).val()
  })

  restaurantSelect.on('change', function(e) {
    rn = $(this).val()
  })

  activitySelect.on('change', function(e) {
    an = $(this).val()
  })

  function findLocation (id, type) {
    var location = type[id-1].place.location
    return location
  }

  function drawMarker (type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }

  var markerArr = []

  var bounds = new google.maps.LatLngBounds()

    // var bounds = new google.maps.LatLngBounds();
    //     bounds.extend(marker1.position);
    //     bounds.extend(marker2.position);
    //     map.fitBounds(bounds);
    //     ...
    //     // now marker2 gets removed and the bounds should narrow
    //     bounds = new google.maps.LatLngBounds();
    //     bounds.extend(marker1.position);
    //     map.fitBounds(bounds);


  hotelPanel.on('click', 'button', function(e) {;
    var hotelSelected = hotelSelect.children()[hn-1]
    hotelSelected = $(hotelSelected).text()
    days[currentDay-1].hotel.push(hotelSelected)
    var latLong = findLocation(hn, hotels)
    var newMarker = drawMarker ('hotel', [latLong[0], latLong[1]])
    days[currentDay-1].markers.push(newMarker)
    bounds.extend(newMarker.position)
    currentMap.fitBounds(bounds);
    hotelList.append(addList(hotelSelected))

  })

  restaurantPanel.on('click', 'button', function(e) {
    var restaurantSelected = restaurantSelect.children()[rn-1]
    restaurantSelected = $(restaurantSelected).text()
    days[currentDay-1].restaurant.push(restaurantSelected)
    var latLong = findLocation(rn, restaurants)
    var newMarker = drawMarker ('restaurant', [latLong[0], latLong[1]])
    days[currentDay-1].markers.push(newMarker)
    bounds.extend(newMarker.position)
    currentMap.fitBounds(bounds);
    restaurantList.append(addList(restaurantSelected))
  })

  activityPanel.on('click', 'button', function(e) {
    var activitySelected = activitySelect.children()[an-1]
    activitySelected = $(activitySelected).text()
    days[currentDay-1].activity.push(activitySelected)
    var latLong = findLocation(an, activities)
    var newMarker = drawMarker ('activity', [latLong[0], latLong[1]])
    days[currentDay-1].markers.push(newMarker)
    bounds.extend(newMarker.position)
    currentMap.fitBounds(bounds);
    activityList.append(addList(activitySelected))
  })

  function findCoord (name, type) {
    for (var i = 0; i < type.length; i++) {
      if(type[i].name === name)
        return type[i].place.location
    }
  }

  function findDay (currentDay) {
    for (var i = 0; i < days.length; i++) {
      if(days[i].dayNum === currentDay) {
        return i
      }
    }
  }

  hotelList.on('click', 'button', function() {
    console.log('clicked')
    var targetText = $($(this).prev()).text()
    var parentNode = $($(this).parent())
    parentNode.remove()
    var targetNum = days[currentDay-1].hotel.lastIndexOf(targetText)
    days[currentDay-1].hotel.splice(targetNum, 1)
    findCoord(targetText, hotels)
  })

  restaurantList.on('click', 'button', function() {
    console.log('clicked')
    var targetText = $($(this).prev()).text()
    var parentNode = $($(this).parent())
    parentNode.remove()
    var targetNum = days[currentDay-1].restaurant.lastIndexOf(targetText)
    days[currentDay-1].hotel.splice(targetNum, 1)
    findCoord(targetText, restaurants)
  })

  activityList.on('click', 'button', function() {
    console.log('clicked')
    var targetText = $($(this).prev()).text()
    var parentNode = $($(this).parent())
    parentNode.remove()
    var targetNum = days[currentDay-1].activity.lastIndexOf(targetText)
    days[currentDay-1].hotel.splice(targetNum, 1)
    findCoord(targetText, activities)
  })

  function addList (textNode) {
    var targetNode = $('<span></span>').text(textNode).attr('class', "Title")
    return $('<div class="itinerary-item"></div>').append(targetNode).append('<button class="btn btn-xs btn-danger remove btn-circle">x</button>')
  }

  dayList.on('click', function(event) {
    var num = $(event.target).text()
    console.log(num)
    if(num % 1 === 0){
      currentDay = num
      newDayList(currentDay)
      clearItinery()
      bounds = new google.maps.LatLngBounds();
      currentMap = new google.maps.Map(mapCanvas, {
        center: fullstackAcademy,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styleArr
      });
      days[currentDay-1].expand()
    }
  })

  function newDayList (num) {
    dayTitle.text("Day " +num)
    var deleteBtn = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>').attr('id', 'day-remove')
    dayTitle.append(deleteBtn)
  }

  function clearItinery() {
    hotelList.empty()
    restaurantList.empty()
    activityList.empty()
  }

  dayTitle.on('click', 'button', function() {
      var targetId = 'btn'+currentDay
      targetBtn = $("#"+targetId)
      var num = Number(targetBtn.attr('id').slice(3))
      targetBtn.remove()
      var idx = removeDay(num)
      currentDay = days[idx].dayNum
      dayTitle.text("Day " + currentDay)
      var deleteBtn = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>').attr('id', 'day-remove')
      dayTitle.append(deleteBtn)
  })

  function removeDay (num) {
    var idx
    days.forEach(function(day, i) {
      if(day.dayNum == num) {
        days.splice(i,1)
        idx = i-1
      }
    })
    return idx
  }

  dayAdd.on('click', function() {
       //creates new day object that should store
      dayNumber = days[days.length-1].dayNum+1
      if (!days[dayNumber-1]) {
        var newDay = new Day(dayNumber);
        days.push(newDay);
        bounds = new google.maps.LatLngBounds();
        currentMap = new google.maps.Map(mapCanvas, {
          center: fullstackAcademy,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: styleArr
        });
      }
      var newBtn = $('<button class="btn btn-circle day-btn current-day">'+(dayNumber)+'</button>')
      newBtn.attr('id', 'btn'+dayNumber)
      newBtn.insertBefore(dayAdd)
  })

});





//Divs

// function hotelFinder (id) {
//   Hotel.findById(id)
//   .then(function(hotel) {
//     hotelLocation = hotel.place.location
//   })
// }
//
// function restaurantFinder (id) {
//   Restaurant.findById(id)
//   .then(function(restaurant) {
//     restaurantLocation = restaurant.place.location
//   })
// }
//
// function activityFinder (id) {
//   Activity.findById(id)
//   .then(function(activity) {
//     activityLocation = activity.place.location
//   })
// }


// restaurantPanel.on('click', 'button', function(e) {
//   restaurantSelector.value
// })
// activityPanel.on('click', 'button', function(e) {
//   activitySelector.value
// })
//
// dayAdd.on('click', function(e) {
//     var newDay = new Day (daysArray[daysArray.length-1].dayNum)
//   }
// })
