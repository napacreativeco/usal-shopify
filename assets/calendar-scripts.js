
function offsetLocalTimezone (d) {
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}
function formatDate (date) {
  let d = new Date(date);

  let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 10)
    day = '0' + day;

  return [year, month, day].join('-');
}

document.addEventListener('DOMContentLoaded', function() {
  var eventInfoElement = document.getElementById("calendar-event-info");
  var eventInfoTitleElement = eventInfoElement.querySelector('.event-info-title');
  var eventInfoDateElement = eventInfoElement.querySelector('.event-info-date');
  var eventInfoLocationElement = eventInfoElement.querySelector('.event-info-location');
  var eventInfoPriceElement = eventInfoElement.querySelector('.event-info-price');
  var eventInfoImageElement = eventInfoElement.querySelector('.event-info-image');
  var eventInfoSoldoutElement = eventInfoElement.querySelector('.event-info-soldout');
  var eventInfoViewButton = eventInfoElement.querySelector('a.button');
  
  var container = document.querySelector('.calendar-page-container');
  var loaderElement = container.querySelector('.calendar-loader');
  var eventInfoCloseDelay = false;

  var calendarEl = document.getElementById('calendar');

  container.parentNode.style.position = 'relative';

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    timeZone: 'PST',
    locale: Shopify.locale,
    dateAlignment: 'month',
    progressiveEventRendering: false,
    headerToolbar: {
      right: 'custom3',
      left: 'title custom1,custom2'
    },
    customButtons: {
        custom1: {
            text: 'PREV',
            click: function() {
              calendar.prev();
            }
        },
        custom2:  {
            text: 'NEXT',
            click: function() {
                calendar.next();
            }
        },
        custom3:  {
            text: '*',
            click: function(e) {
                e.preventDefault();
            }
        }
    },
    views: {
        dayGridMonth: { 
            titleFormat: { month: 'long' }
        }
    },
    dayHeaders: false,
    displayEventTime: false,
    height: 'auto',
    loading: function(isLoading) {
        loaderElement.style.visibility = isLoading ? 'visible' : 'hidden';
    },
    events: function (fetchInfo, onSuccess, onFailure) {
        const url = new URL('https://94qrm2we1l.execute-api.us-east-1.amazonaws.com/production/storefront/calendar');
        const params = {
            shop: Shopify.shop,
            startDate: formatDate(fetchInfo.start),
            endDate: formatDate(fetchInfo.end),
            currentDate: formatDate(new Date()),
            lang: Shopify.locale,
        };

        url.search = new URLSearchParams(params).toString();

        fetch(url.toString()).then(function(response) {
            return response.json();
        }).then(function (result) {
            onSuccess(result.schedule); // DONT DELETE

            // James
            // Try to use .indexOf() to find the index number of the matching Product Id.
            // or
            // Try matching them by Title string?
            var eventTitle = document.querySelector('.fc-event-title');
            var eventHolder = [];
            var prodOBJ = [];
            for (let i = 0; i < result.events.length; i++) {
              eventHolder.push(result.events[i]);                
            }
            console.log(eventHolder);

            fetch(window.Shopify.routes.root + 'products.json')
            .then(response => response.json())
            .then(data => {
              var prodData = JSON.stringify(data)
              console.log(prodData);
              
              for (let x = 0; x < eventHolder.length; x++) {
                
              }

            });
            eventTitle.insertAdjacentHTML('afterend', '<span class="day-event--price">$' + eventHolder[2].min_price + '</p>'); 


            
            
        }).catch(function (error) {
            console.log('[Evey] Failed to fetch events', error);
            onFailure(error);
        });

    },
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      // Source
      var sourceEvent = info.event.extendedProps.source_data;
      // Title
      eventInfoTitleElement.innerHTML = info.event.title;
      // Date
      const dateString = new Intl.DateTimeFormat(Shopify.locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(info.event.allDay ? {} : { hour: 'numeric', minute: '2-digit' }),
      }).format(offsetLocalTimezone(new Date(info.event.start)));
      eventInfoDateElement.innerHTML = dateString;
      // Location
      eventInfoLocationElement.innerHTML = sourceEvent.location_url ? `<a href=${sourceEvent.location_url}>${sourceEvent.location}</a>` : sourceEvent.location;
      // Pricing
      eventInfoPriceElement.innerHTML = sourceEvent.min_price == sourceEvent.max_price ? sourceEvent.min_price_formatted : `${sourceEvent.min_price_formatted} - ${sourceEvent.max_price_formatted}`;
      // Sold Out
      eventInfoSoldoutElement.style.display = sourceEvent.is_available ? 'none' : 'block';
      // Event Link
      eventInfoViewButton.setAttribute('href', info.event.url);
      // Image
      if (sourceEvent.image_url) {
        eventInfoImageElement.querySelector('img').setAttribute('src', sourceEvent.image_url);
        eventInfoImageElement.style.display = 'block';
      } else {
        eventInfoImageElement.style.display = 'none';
      }


      // Show Pop-up
      eventInfoElement.style.visibility = 'visible';

      // Wait before allowing closeout
      setTimeout(function () { eventInfoCloseDelay = false; }, 500);
        eventInfoCloseDelay = true;
      },
  });
  calendar.render();
  
  // Place Year in Title Bar
  var myLocationElement = document.querySelector('.fc-custom3-button');
  // var date = calendar.getDate();
  var date = calendar.view.currentEnd;
  myLocationElement.innerText = date.getFullYear();


  console.log(calendar.view.currentEnd)

  $('.fc-button').on('click', function() {
    var date = calendar.getDate();
    myLocationElement.innerText = date.getFullYear();
  })

  //  Close Overlay
  document.addEventListener('click', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (target.id !== eventInfoElement.id && !eventInfoElement.contains(target)) {
      if (eventInfoElement.style.visibility === 'visible' && !eventInfoCloseDelay) {
        eventInfoElement.style.visibility = 'hidden';
      }
    }
  });

});
