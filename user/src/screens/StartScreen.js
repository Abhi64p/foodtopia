import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import messaging, { firebase } from '@react-native-firebase/messaging'
import { connect } from 'react-redux'

import { updateFCMToken } from '../actions/settingsActions'
import AndroidNotification from '../utils/AndroidNotification'

class StartScreen extends Component {

    componentDidMount() {
        this.initFirebase()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Foodtopia</Text>
            </View>
        )
    }

    checkLoginStatus = async () => {
        try {
            let isLoggedIn = await AsyncStorage.getItem("isLoggedIn")

            if (isLoggedIn === null)
                isLoggedIn = "false"

            if (isLoggedIn === "true")
                this.props.navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'mainScreen' }]
                }))
            else
                this.props.navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'loginScreen' }]
                }))
        } catch (err) {
            console.log(err)
        }
    }

    initFirebase = async () => {
        await this.registerAppWithFCM()
        await this.getMessagingToken()
        this.receiveForegroundMessages()
        this.receiveBackgroundMessages()
    }

    registerAppWithFCM = async () => {
        await messaging().registerForRemoteNotifications()
    }

    receiveForegroundMessages = () => {
        messaging().onMessage(async remoteMessage => {
            console.log('Foreground Message Received', remoteMessage)
            const { title, message } = remoteMessage.data
            AndroidNotification.showNotification(title, message)
        })
    }

    receiveBackgroundMessages = () => {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background Message Received', remoteMessage)
        })
    }

    getMessagingToken = async () => {
        const fcmToken = await firebase.messaging().getToken()
        this.props.updateFcmToken(fcmToken)
        this.checkLoginStatus()
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapDispatchToProps = (dispatch) => ({
    updateFcmToken: (fcmToken) => dispatch(updateFCMToken(fcmToken))
})

export default connect(null, mapDispatchToProps)(StartScreen)