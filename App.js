import React, { Component } from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import GetSms from 'react-native-get-sms-android'

const WELCOME_TEXT = 'React Native SMS Retriever';
const PHONE_NUMBER_TITLE = 'Request phone number';
const ADD_SMS_LISTENER_TITLE = 'Add SMS listener';

export default class App extends Component {

  // Actions

  _onPhoneNumberPressed = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      alert(`Phone Number: ${phoneNumber}`);
    } catch (error) {
      alert(`Phone Number Error: ${JSON.stringify(error)}`);
    }
  };

  _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();

      if (registered) {
        SmsRetriever.addSmsListener(this._onReceiveSms);
      }

      alert(`SMS Listener Registered: ${registered}`);
    } catch (error) {
      alert(`SMS Listener Error: ${JSON.stringify(error)}`);
    }
  };

  // Handlers

  _onReceiveSms = (event) => {
    alert(event.message);
    SmsRetriever.removeSmsListener();
  };

  getSms = () => {
    var filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      // the next 4 filters should NOT be used together, they are OR-ed so pick one
      read: 0, // 0 for unread SMS, 1 for SMS already read
      _id: 4096, // specify the msg id
      address: 'HPZINGUP', // sender's phone number
      body: 'Verification code for ZingUpLife is:', // content to match
      // the next 2 filters can be used for pagination
      indexFrom: 0, // start from index 0
      maxCount: 10, // count of SMS to return each time
    };
    GetSms.list(JSON.stringify(filter), (fail) => {
      console.log("Failed with this error: " + fail)
    },
      (count, smsList) => {
        console.log('Count: ', count);
        console.log('List: ', smsList);
        var arr = JSON.parse(smsList);

        arr.forEach(function (object) {
          console.log("Object: " + object);
          console.log("-->" + object.date);
          console.log("-->" + object.body);
        })
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{WELCOME_TEXT}</Text>

        <View style={styles.space} />

        <Button
          style={styles.button}
          title={ADD_SMS_LISTENER_TITLE}
          onPress={() => this.getSms()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center'
  },
  space: {
    margin: 20
  }
});