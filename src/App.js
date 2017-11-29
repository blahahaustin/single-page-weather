import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import logo from './logo.svg';
import './styles/App.css';
import './styles/weather-icons.min.css';

// Save the root URL for the API call and our API key.
const ROOT_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const API_KEY = '6a8b31e7cb833af88a3f7bf12d6825c1';

// Create the "App" component that holds all other components.
export default class App extends Component {

  // Call the constructor and initialize our state.
  constructor(props) {
    super();
    this.state = {
      location: '',
      iconURL: '',
      weather: '',
      temp: 0,
      tempUnit: 'C',
      iconClass: ''
    };

    // Bind the context of "this" for our getWeather function.
    this.getWeather = this.getWeather.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // When the component mounts, get the geolocation and call the
  // getWeather callback.
  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getWeather);
    }
    else {
      alert("Your browser doesn't support geolocation.")
    }
  }

  // The getWeather callback, makes the API call via axios and sets the state
  // for the rest of the application.
  getWeather(position) {

    // Get the lat and lon in easier to manage variables.
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Compose the url we'll pass to axios.
    const url = `${ROOT_URL}lat=${lat}&lon=${lon}&APPID=${API_KEY}`;

    // Make the API GET request, calling setState in the callback.
    const weatherData = axios.get(url).then(response => {
      this.setState({
        location: response.data.name,
        iconURL: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
        weather: response.data.weather[0].main,
        temp: response.data.main.temp - 273.15,
        tempUnit: 'C',
        iconClass: "wi wi-owm-" + response.data.weather[0].id
      })
    })
  }

  // Handle the click event.
  handleClick(e) {
    e.preventDefault();
    if (this.state.tempUnit == 'C') {
      this.setState({
        tempUnit: 'F',
        temp: (this.state.temp * 1.8) + 32 })
    }
    else if (this.state.tempUnit == 'F') {
      this.setState({
        tempUnit: 'C',
        temp: (this.state.temp - 32) / 1.8 });
    }
  }

  // Finally, call the render function to get everything on screen.
  render() {
    return (
      <div className="container-fluid">
        <div className="row text-center align-items-center">

          <div className="col-12 header">
            here's the weather in
          </div>

          <div className="col-12 location">
            {this.state.location}
          </div>

          <div className="col-12 col-md-6 push-md-6 icon">
            {/*<img src={this.state.iconURL} className="img-fluid"/>*/}
            <i className={this.state.iconClass}></i>
          </div>

          <div className="col-12 col-md-6 pull-md-6 weather">
            {this.state.weather}
          </div>

          <div className="col-12 temperature" onClick={this.handleClick}>
            {_.round(this.state.temp,2)}&#176;{this.state.tempUnit}
          </div>

      </div>
    </div>
    );
  }
}
