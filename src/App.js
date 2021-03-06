import React, { Component } from 'react';
import CurrentWeather from './CurrentWeather.js';
import SevenHour from './SevenHour.js';
import Search from './Search.js';
import Welcome from './Welcome.js';
import { currentWeather } from './cleaners.js';
import KEY from './apikeys.js';
import './App.css';
import TenDay from './TenDay.js';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentWeather: {},
      sevenHours: [],
      tenDays: [],
      location: '',
      lookup: false
    };
  }

  getWeather = location => {
    fetch(`http://api.wunderground.com/api/${KEY}/conditions/hourly/forecast10day/q/
      ${this.state.location}.json`)
      .then(response => response.json())
      .then(data => {
        let weatherData = currentWeather(data);
        this.setState({
          currentWeather: weatherData.currDayObj,
          sevenHours: weatherData.sevenHours,
          tenDays: weatherData.tenDays
        });
      })
      .catch(err => {
        localStorage.clear();
        window.location.reload();
        alert('Please enter a valid location.');
      });
  };

  componentDidMount = () => {
    if (localStorage.length) {
      let savedLocation = localStorage.getItem('inputLocation');

      this.filterLocation(savedLocation);
    }
  };

  filterLocation = location => {
    this.setState(
      {
        location: location,
        lookup: true
      },
      () => this.getWeather()
    );
    localStorage.setItem('inputLocation', location);
  };

  render() {
    return (
      <div className="App">
        {!this.state.lookup && <Welcome />}
        <section className="main-section">
          <Search
            location={this.state.location}
            filterLocation={this.filterLocation}
          />
          {this.state.lookup && (
            <CurrentWeather currentInformation={this.state.currentWeather} />
          )}
          {this.state.lookup && (
            <SevenHour sevenHours={this.state.sevenHours} />
          )}
          {this.state.lookup && <TenDay tenDays={this.state.tenDays} />}
        </section>
      </div>
    );
  }
}
