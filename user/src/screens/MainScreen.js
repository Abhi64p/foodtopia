import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated, Text } from 'react-native';
import { connect } from 'react-redux'

import ProfileScreen from './ProfileScreen';
import ProductServiceScreen from './ProductServiceScreen';
import CartScreen from './CartScreen';
import OrderHistoryScreen from './OrderHistoryScreen';

import { changeScreen } from '../actions/settingsActions'

class MainScreen extends Component {

    state = {
        homeSelected: true,
        cartSelected: false,
        orderHistorySelected: false,
        profileSelected: false,
        homeSlideUpValue: new Animated.Value(1),
        cartSlideUpValue: new Animated.Value(0),
        orderHistorySlideUpValue: new Animated.Value(0),
        profileSlideUpValue: new Animated.Value(0)
    }

    componentDidUpdate(prevProps) {
        const { mainScreen } = this.props
        if (prevProps.mainScreen !== mainScreen) {
            switch (mainScreen) {
                case 'home':
                    this.homePressed()
                    break
                case 'cart':
                    this.cartPressed()
                    break
                case 'orderHistory':
                    this.orderHistoryPressed()
                    break
                case 'profile':
                    this.profilePressed()
                    break
                default: break
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contents}>
                    {this.state.homeSelected && <ProductServiceScreen navigation={this.props.navigation} cartPressed={this.cartPressed} />}
                    {this.state.cartSelected && <CartScreen navigation={this.props.navigation} />}
                    {this.state.orderHistorySelected && <OrderHistoryScreen
                        navigation={this.props.navigation}
                        route={this.props.route}
                    />}
                    {this.state.profileSelected && <ProfileScreen navigation={this.props.navigation} />}
                </View>
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={() => { this.props.changeScreen('home') }}>
                        <Animated.View style={{
                            transform: [{ translateY: this.state.homeSlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [8, -2] }) }],
                            alignItems: 'center'
                        }}>
                            <Image style={styles.bottomBarIconStyle}
                                source={this.state.homeSelected ? require('../icons/filled/home.png') : require('../icons/outline/home.png')} />
                        </Animated.View>
                        <Animated.View style={{
                            opacity: this.state.homeSlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                            transform: [{ translateY: -7 }]
                        }}>
                            <Text>Home</Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.changeScreen('cart') }}>
                        <Animated.View style={{
                            transform: [{ translateY: this.state.cartSlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [8, -2] }) }],
                            alignItems: 'center'
                        }}>
                            <Image style={styles.bottomBarIconStyle}
                                source={this.state.cartSelected ? require('../icons/filled/cart.png') : require('../icons/outline/cart.png')} />
                        </Animated.View>
                        <Animated.View style={{
                            opacity: this.state.cartSlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                            transform: [{ translateY: -7 }]
                        }}>
                            <Text>Cart</Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.changeScreen('orderHistory') }}>
                        <Animated.View style={{
                            transform: [{ translateY: this.state.orderHistorySlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [8, -2] }) }],
                            alignItems: 'center'
                        }}>
                            <Image style={styles.bottomBarIconStyle}
                                source={this.state.orderHistorySelected ? require('../icons/filled/history.png') : require('../icons/outline/history.png')} />
                        </Animated.View>
                        <Animated.View style={{
                            opacity: this.state.orderHistorySlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                            transform: [{ translateY: -7 }]
                        }}>
                            <Text>History</Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.changeScreen('profile') }}>
                        <Animated.View style={{
                            transform: [{ translateY: this.state.profileSlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [8, -2] }) }],
                            alignItems: 'center'
                        }}>
                            <Image style={styles.bottomBarIconStyle}
                                source={this.state.profileSelected ? require('../icons/filled/profile.png') : require('../icons/outline/profile.png')} />
                        </Animated.View>
                        <Animated.View style={{
                            opacity: this.state.profileSlideUpValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                            transform: [{ translateY: -7 }]
                        }}>
                            <Text>Profile</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    homePressed = () => {
        if (!this.state.homeSelected) {
            if (this.state.cartSelected)
                this.startCartSlideDownAnimation();
            else if (this.state.orderHistorySelected)
                this.startOrderHistorySlideDownAnimation();
            else if (this.state.profileSelected)
                this.startProfileSlideDownAnimation();

            this.startHomeSlideUpAnimation();

            this.setState({
                homeSelected: true,
                cartSelected: false,
                orderHistorySelected: false,
                profileSelected: false
            });
        }
    }

    cartPressed = () => {
        if (!this.state.cartSelected) {
            if (this.state.homeSelected)
                this.startHomeSlideDownAnimation();
            else if (this.state.orderHistorySelected)
                this.startOrderHistorySlideDownAnimation();
            else if (this.state.profileSelected)
                this.startProfileSlideDownAnimation();

            this.startCartSlideUpAnimation();

            this.setState({
                homeSelected: false,
                cartSelected: true,
                orderHistorySelected: false,
                profileSelected: false
            });
        }
    }

    orderHistoryPressed = () => {
        if (!this.state.orderHistorySelected) {
            if (this.state.homeSelected)
                this.startHomeSlideDownAnimation();
            else if (this.state.cartSelected)
                this.startCartSlideDownAnimation();
            else if (this.state.profileSelected)
                this.startProfileSlideDownAnimation();

            this.startOrderHistorySlideUpAnimation();

            this.setState({
                homeSelected: false,
                cartSelected: false,
                orderHistorySelected: true,
                profileSelected: false
            });
        }
    }

    profilePressed = () => {
        if (!this.state.profileSelected) {
            if (this.state.homeSelected)
                this.startHomeSlideDownAnimation();
            else if (this.state.cartSelected)
                this.startCartSlideDownAnimation();
            else if (this.state.orderHistorySelected)
                this.startOrderHistorySlideDownAnimation();

            this.startProfileSlideUpAnimation();

            this.setState({
                homeSelected: false,
                cartSelected: false,
                orderHistorySelected: false,
                profileSelected: true
            });
        }
    }

    startHomeSlideUpAnimation = () => {
        Animated.timing(this.state.homeSlideUpValue, { toValue: 1, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startHomeSlideDownAnimation = () => {
        Animated.timing(this.state.homeSlideUpValue, { toValue: 0, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startCartSlideUpAnimation = () => {
        Animated.timing(this.state.cartSlideUpValue, { toValue: 1, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startCartSlideDownAnimation = () => {
        Animated.timing(this.state.cartSlideUpValue, { toValue: 0, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startOrderHistorySlideUpAnimation = () => {
        Animated.timing(this.state.orderHistorySlideUpValue, { toValue: 1, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startOrderHistorySlideDownAnimation = () => {
        Animated.timing(this.state.orderHistorySlideUpValue, { toValue: 0, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startProfileSlideUpAnimation = () => {
        Animated.timing(this.state.profileSlideUpValue, { toValue: 1, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

    startProfileSlideDownAnimation = () => {
        Animated.timing(this.state.profileSlideUpValue, { toValue: 0, duration: 300, useNativeDriver: true, delay: 0 }).start();
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contents: {
        width: '100%',
        flex: 10,
    },
    bottomBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        elevation: 2,
        backgroundColor: 'white'
    },
    bottomBarIconStyle: {
        width: 30,
        height: 30
    }
})

const mapStateToProps = state => ({
    mainScreen: state.settings.mainScreen
})

const mapDispatchToProps = dispatch => ({
    changeScreen: (screen) => dispatch(changeScreen(screen))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)