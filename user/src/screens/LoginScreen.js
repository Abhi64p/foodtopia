import React, { Component } from 'react';
import {
    View, Text, TouchableNativeFeedback, TextInput, Modal, TouchableOpacity,
    Animated, Dimensions, Image, BackHandler
} from 'react-native';
import CardView from 'react-native-cardview';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import VerifyPhoneNum from '../utils/VerifyPhoneNum';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';

const Common = require('../utils/Common');

class LoginScreen extends Component {

    state = {
        phoneNumber: "",
        otp: "",
        phoneNumberError: false,
        otpError: false,
        showPhoneNumberInput: true,
        exitTransitionValue: new Animated.Value(1),
        entryTransitionValue: new Animated.Value(0),
        popupVisible: false,
        popupText: '',
        statusText: '',
        verifying: false
    }

    render() {
        let lineY = 2 * Dimensions.get('window').height / 5;
        return (
            <View style={{ flex: 1, borderTopColor: '#1e88e5', alignItems: 'center', borderTopWidth: lineY }}>
                <View style={{ transform: [{ translateY: -3 * lineY / 4 }], alignItems: 'center', justifyContent: 'center' }}
                    opacity={this.state.popupVisible ? 0.3 : 1.0}>
                    <Text
                        style={{
                            height: 120, textAlignVertical: 'center', fontSize: 30, color: 'white', fontWeight: 'bold'
                        }}
                    >
                        Foodtopia
                        </Text>
                </View>
                <CardView cardElevation={this.state.popupVisible ? 0 : 5} cornerRadius={5} opacity={this.state.popupVisible ? 0.5 : 1.0}
                    style={{ width: '80%', height: '60%', transform: [{ translateY: -2 * lineY / 3 }] }}>
                    {this.state.showPhoneNumberInput && <Animated.View style={{
                        alignItems: 'center', justifyContent: 'center', width: '100%', flex: 1,
                        opacity: this.state.exitTransitionValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        transform: [{ translateX: this.state.exitTransitionValue.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }]
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 35, color: '#1e88e5', marginBottom: 20 }}>Sign Up</Text>
                        <Text style={{ color: 'grey' }}>Enter Phone Number</Text>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={{
                                borderBottomColor: this.state.phoneNumberError ? '#e53935' : '#64b5f6', width: '20%',
                                paddingRight: 5, textAlignVertical: 'center', borderBottomWidth: 1, textAlign: 'right'
                            }}>+91</Text>
                            <TextInput style={{
                                width: '40%', height: 50, borderBottomWidth: 1, textAlign: 'left', backgroundColor: 'white',
                                fontSize: 15, borderBottomColor: this.state.phoneNumberError ? '#e53935' : '#64b5f6'
                            }} placeholder='Phone Number' defaultValue={this.state.phoneNumber} keyboardType='numeric'
                                onChangeText={(text) => { this.state.phoneNumber = text; }}
                            />
                        </View>
                    </Animated.View>}
                    {!this.state.showPhoneNumberInput && <Animated.View style={{
                        width: '100%', flex: 1,
                        opacity: this.state.entryTransitionValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        transform: [{ translateX: this.state.entryTransitionValue.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }]
                    }}>
                        <View style={{ width: 30, height: 30, marginLeft: 20, marginTop: 20 }}>
                            <TouchableNativeFeedback onPress={this.backPressed}>
                                <View style={{ width: 30, height: 30 }}>
                                    <Image source={require('../icons/back.png')} style={{ width: 25, height: 25 }} resizeMode='contain' />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'absolute' }}>
                            <Text style={{ color: 'grey' }}>Enter OTP</Text>
                            <TextInput style={{
                                width: '70%', height: 50, borderBottomWidth: 1, textAlign: 'center', backgroundColor: 'white',
                                fontSize: 15, borderBottomColor: this.state.otpError ? '#e53935' : '#64b5f6', marginTop: 20
                            }} placeholder='OTP' onChangeText={(text) => { this.state.otp = text }} keyboardType="numeric"
                                defaultValue={this.state.otp} />
                        </View>
                    </Animated.View>}
                </CardView>
                <View opacity={this.state.popupVisible ? 0.3 : 1.0}
                    style={{ alignItems: 'center', justifyContent: 'center', transform: [{ translateY: -2 * lineY / 5 }] }}>
                    <Text>{this.state.statusText}</Text>
                </View>
                <View style={{ alignItems: 'center', position: 'absolute', bottom: 5 }}
                    opacity={this.state.popupVisible ? 0.3 : 1.0}>
                    <TouchableNativeFeedback onPress={this.continuePressed} disabled={this.state.verifying}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: 250, height: 50,
                            borderRadius: 20, backgroundColor: '#1e88e5'
                        }}>
                            {
                                !this.state.verifying && <Text style={{ fontSize: 15, color: 'white' }}>
                                    {this.state.showPhoneNumberInput ? 'Continue' : 'Verify'}
                                </Text>
                            }
                            {
                                this.state.verifying && <LoadingView color='white' />
                            }
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={{ padding: 10, fontSize: 10 }}>Before using the app, you must VERIFY your phone number</Text>
                </View>
                <Modal
                    visible={this.state.popupVisible}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%', elevation: 5,
                            borderRadius: 10, borderWidth: 2, backgroundColor: 'white', borderColor: 'white'
                        }}>
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>{this.state.popupText}</Text>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={this.popupDismiss}>
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>Try again?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View >
        );
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        if (this.state.showPhoneNumberInput)
            return false;
        else {
            this.backPressed();
            return true;
        }
    }

    continuePressed = async () => {
        if (this.state.showPhoneNumberInput) {
            let phoneNumber = this.state.phoneNumber;
            let error = false;

            if (phoneNumber.length !== 10)
                error = true;
            else if (phoneNumber.replace(/[0-9]/g, '').length !== 0)
                error = true;

            if (error)
                this.setState({ phoneNumberError: true });
            else {
                VerifyPhoneNum.sendOTP(phoneNumber, (result, code) => {
                    switch (result) {
                        case 'OTP_DETECTED':
                            this.setState({ otp: code, otpError: false, statusText: "" });
                            this.continuePressed();
                            break;
                        case 'OTP_SENT':
                            this.setState({ statusText: "OTP send to +91 " + this.state.phoneNumber });
                            break;
                        case 'OTP_FAILED': this.setState({ statusText: "Failed to send OTP, try again." });
                            break;
                    }
                });
                this.setState({ phoneNumberError: false });
                Animated.timing(this.state.exitTransitionValue, { toValue: 0, duration: 100, useNativeDriver: true, delay: 0 }).start((result) => {
                    this.setState({ showPhoneNumberInput: false });
                    Animated.timing(this.state.entryTransitionValue, { toValue: 1, duration: 100, useNativeDriver: true, delay: 0 }).start();
                });
            }
        }
        else {
            let otp = this.state.otp;
            let error = false;

            if (otp.length === 0)
                error = true;
            else if (otp.replace(/[0-9]/g, '').length !== 0)
                error = true;

            if (error)
                this.setState({ otpError: true });
            else {
                this.setState({ otpError: false, statusText: 'Please Wait...', verifying: true });
                VerifyPhoneNum.verifyOTP(otp, (result) => {
                    switch (result) {
                        case 'VERIFICATION_SUCCESS':
                            this.login();
                            break;
                        case 'VERIFICATION_FAILED':
                        case 'ERROR':
                            this.setState({
                                statusText: "OTP verification failed. Try again.",
                                otpError: true,
                                verifying: false
                            });
                            break;
                    }
                });
            }
        }
    }

    backPressed = () => {
        Animated.timing(this.state.entryTransitionValue, { toValue: 0, duration: 100, useNativeDriver: true, delay: 0 }).start((result) => {
            this.setState({ showPhoneNumberInput: true });
            Animated.timing(this.state.exitTransitionValue, { toValue: 1, duration: 100, useNativeDriver: true, delay: 0 }).start(this.startEntryAnimation);
        });
    }

    login = async () => {
        let responseJSON = await Common.fetchJSON('mauth', {
            phoneNumber: this.state.phoneNumber,
            fcmToken: this.props.fcmToken
        });
        if (responseJSON != null) {
            switch (responseJSON.status) {
                case "user-verified": {
                    await AsyncStorage.setItem("isLoggedIn", "true");
                    await AsyncStorage.setItem("token", responseJSON.token);
                    await AsyncStorage.setItem("fcmToken", this.props.fcmToken);
                    this.props.navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'oneTimeProfileScreen' }]
                    }));
                    break;
                }
            }
        }
        else
            this.setState({ popupVisible: true, popupText: 'Network error, try again later!' });
    }

    popupDismiss = () => {
        this.setState({ popupVisible: false });
        this.login();
    }

}

const mapStateToProps = (state) => {
    return {
        fcmToken: state.settings.fcmToken
    }
}

export default connect(mapStateToProps)(LoginScreen);