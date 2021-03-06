import fallbackImage from '../media/image-not-available.png'

// clear UI and render Trips
export const renderTrips = () => {
  clearResults()
  getTrips()
}

// fetch Trips and add event listener to remove buttons based on the trip id
export const getTrips = async () => {
  try {
    const result = await fetch('http://localhost:3000/trips')
    const trips = await result.json()
    clearResults()
    clearError()
    if (trips.length > 0) {
      trips.forEach(trip => createTrip(trip))
      addEventListenersToRemoveButtons()
    }
  } catch (e) {
    setError("We couldn't fetch your trips. Please try again later.")
  }
}

// Helper to create a trip based on inputs
const createTrip = trip => {
  const {location, img, date, id, difference, weather} = trip
  const tripHtml = `<div class="trip"">
    <div id="trip-image">
      <img src="${img || fallbackImage}" alt="${location}" />
    </div>
    <div id="trip-data">
      <h2 id="trip-location">My trip to: ${location}</h2>
      <h3 id="trip-time">Departing: ${date}</h3>
      <div id="trip-buttons">
        <button disabled>Save Trip</button>
        <button id="remove" data-key="${id}">Remove Trip</button>
      </div>
      <p id="trip-waiting-time">${location} is ${difference} days away</p>
        ${
          weather.high && weather.low && weather.summary
            ? `<div id="trip-weather">
            <div id="trip-weather-data">
              <p id="trip-weather-headline">Typical weather for then is:</p>
              <p id="trip-weather-conditions">
                High – ${weather.high}, Low – ${weather.low}
              </p>
              <p id="trip-weather-summary">${weather.summary}</p>
              </div>
          </div>`
            : '<p>No weather forecast available</p>'
        }
        
    </div>
  </div>`
  addTripToDOM(tripHtml)
}

// Helper to set an error globally
const setError = (message = '') => {
  const error = `<div id='error'>${message ||
    "We're unable to fulfill you're request. Please try again later."}</div>`
  document.querySelector('main').insertAdjacentHTML('afterbegin', error)
}

// Helper to remove the error globally
const clearError = () => {
  const error = document.getElementById('error')
  error && error.remove()
}

// Extend Options – remove a trip
const removeTrip = async id => {
  try {
    const result = await fetch(`http://localhost:3000/trip?id=${id}`, {
      method: 'DELETE',
    })
    if (await result.ok) {
      renderTrips()
    }
  } catch (e) {
    setError("We couldn't delete your trip")
  }
}

// Helper to add a trip to the DOM
const addTripToDOM = trip => {
  let results = document.getElementById('results')
  if (!results) {
    results = "<section id='results'></section>"
    document.querySelector('main').insertAdjacentHTML('afterbegin', results)
  }
  document.getElementById('results').insertAdjacentHTML('beforeend', trip)
}

// Helper to clear the results
const clearResults = () => {
  const results = document.getElementById('results')
  results && results.remove()
}

// Adds the events listeners to the remove buttons
const addEventListenersToRemoveButtons = () => {
  const tripRemoveButtons = document.querySelectorAll('.trip #remove')
  tripRemoveButtons.forEach(trip => {
    trip.addEventListener('click', () => removeTrip(trip.dataset.key))
  })
}
