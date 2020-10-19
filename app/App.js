/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Vibration,
} from 'react-native';
import { TimePicker } from './components/TimePicker';

const Sound = require('react-native-sound');

Sound.setCategory('Playback');

const screen = Dimensions.get('window');
const circleWidth = screen.width / 1.5;

const formatNumber = (number) => `0${number}`.slice(-2);

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return {
    minutes,
    seconds,
  };
};

const getRange = (length) => {
  const range = [];
  for (let i = 0; i < length; i++) {
    range.push(i);
  }
  return range;
}

const START_MINUTES = 0;
const START_SECONDS = 5;

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS
];

const REPEAT_VIBRATE = true;

class App extends React.Component {
  state = {
    timeRemaining: 0,
    isRunning: false,
    minutes: START_MINUTES,
    seconds: START_SECONDS,
    userSetMinutes: START_MINUTES,
    userSetSeconds: START_SECONDS,
  };

  constructor() {
    super();
    this.handleStart = this.start.bind(this);
    this.handleStop = this.stop.bind(this);
    this.handleMinutesChange = this.setMinutes.bind(this);
    this.handleSecondsChange = this.setSeconds.bind(this);
    this.alarmSoundAsset = require('./alarm.mp3');
    this.initAlarmSound();
  }

  initAlarmSound() {
    this.isAlarmAvailable = false;
    this.alarm = new Sound(this.alarmSoundAsset, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return console.error(error);
      }

      this.isAlarmAvailable = true;
    });
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.timeRemaining === 0 && prevState.timeRemaining !== 0) {
      // play sound and vibrate since count down is now finished
      this.alarm.play();
      Vibration.vibrate(PATTERN, REPEAT_VIBRATE);

      if (this.interval) {
        clearInterval(this.interval);
      }
      this.setState({
        minutes: this.state.userSetMinutes,
        seconds: this.state.userSetSeconds,
      });
    }
  }

  start() {
    if (!this.state.minutes && !this.state.seconds) {
      return alert('Select a value !!!');
    }

    this.setState({
      timeRemaining: this.state.seconds + this.state.minutes * 60,
      isRunning: true,
    });

    this.interval = setInterval(() => {
      const timeRemaining = this.state.timeRemaining - 1;
      const { minutes, seconds } = formatTime(timeRemaining);

      this.setState({
        timeRemaining,
        minutes,
        seconds
      });
    }, 1000);
  }

  stop() {
    if (this.alarm && this.alarm.isPlaying) {
      this.alarm.stop();
      Vibration.cancel();
      this.initAlarmSound();
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.setState({
      isRunning: false,
      minutes: this.state.userSetMinutes,
      seconds: this.state.userSetSeconds,
    });
  }

  setSeconds(seconds) {
    if (this.state.isRunning) {
      return this.setState({
        seconds
      });
    }
    return this.setState({
      seconds,
      userSetSeconds: seconds,
    });
  }

  setMinutes(minutes) {
    if (this.state.isRunning) {
      return this.setState({
        minutes
      });
    }
    return this.setState({
      minutes,
      userSetMinutes: minutes,
    });
  }

  render() {
    const pickerItems = getRange(60).map(i => ({ label: formatNumber(i), value: i }));

    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TimePicker items={pickerItems} value={this.state.minutes} onValueChange={this.handleMinutesChange} />
          <Text style={styles.timerText}>:</Text>
          <TimePicker items={pickerItems} value={this.state.seconds} onValueChange={this.handleSecondsChange} />
        </View>
        {!this.state.isRunning ? (
          <TouchableOpacity
            onPress={this.handleStart}
            style={styles.button}
          >
            <Text style={styles.buttonText}>  Start </Text>
          </TouchableOpacity>
        ) : (
            <TouchableOpacity
              onPress={this.handleStop}
              style={[styles.button, styles.buttonStopped]}
            >
              <Text style={styles.buttonText}>  Stop </Text>
            </TouchableOpacity>
          )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3057',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 10,
    borderColor: '#00587a',
    width: circleWidth,
    height: circleWidth,
    borderRadius: circleWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonStopped: {
    borderColor: '#008891'
  },
  buttonText: {
    fontSize: 45,
    color: '#89AAFF',
  },
  timerText: {
    fontSize: 90,
    color: '#fff'
  }
})


export default App;
