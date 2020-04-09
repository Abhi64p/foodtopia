import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Dimensions,
    TouchableNativeFeedback
} from 'react-native';
import LoadingView from '../components/LoadingView';

const Common = require('../utils/Common');

class ProfileScreen extends Component {

    state = {
        showEditMenu: false,
        name: "",
        address: "",
        pincode: "",
        loadedName: "",
        loadedAddress: "",
        loadedPincode: "",
        loadedPhone: "",
        nameError: false,
        addressError: false,
        pincodeError: false,
        modalHeight: 0,
        updating: false,
        networkError: false,
        loading: true,
        loadingError: false,
        logoutPopup: false
    }

    componentDidMount() {
        this.state.modalHeight = Dimensions.get('window').height * 0.5;
        this.loadContents();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.topBar, { elevation: this.getElevation() }]}
                    opacity={this.getOpacity()}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>Profile</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 10 }}>
                        <TouchableOpacity onPress={this.aboutPressed}>
                            <Image source={require('../icons/info.png')} resizeMode='contain' style={{ width: 30, padding: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.contents} opacity={this.getOpacity()}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image source={require('../icons/photo.png')} resizeMode='contain'
                            style={{ width: '90%', height: '90%' }} />
                    </View>
                    {
                        !this.state.loading && <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ flex: 4, marginLeft: 20, width: '90%' }}>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ flex: 2 }}>Phone:</Text>
                                    <Text style={{ flex: 4 }}>{this.state.loadedPhone}</Text>
                                    <Text style={{ flex: 1 }} />
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ flex: 2 }}>Name:</Text>
                                    <Text style={{ flex: 4 }}>{this.state.loadedName}</Text>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={this.editMenuPressed}>
                                        <Image source={require('../icons/edit.png')} resizeMode='contain'
                                            style={{ width: 30, height: 30, padding: 10 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ flex: 2 }}>Address:</Text>
                                    <Text style={{ flex: 4 }}>{this.state.loadedAddress}</Text>
                                    <Text style={{ flex: 1 }} />
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ flex: 2 }}>Pincode:</Text>
                                    <Text style={{ flex: 4 }}>{this.state.loadedPincode}</Text>
                                    <Text style={{ flex: 1 }} />
                                </View>
                            </View>
                            <TouchableNativeFeedback style={{ flex: 1 }} onPress={() => { this.setState({ logoutPopup: true }); }}>
                                <View style={{
                                    width: '60%', height: 40, backgroundColor: '#f44336', borderRadius: 5,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    }
                    {
                        this.state.loading && <View style={{ flex: 1, justifyContent: 'center' }}>
                            <LoadingView />
                        </View>
                    }
                </View>
                <Modal
                    visible={this.state.showEditMenu}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '80%', height: this.state.modalHeight, elevation: 5,
                            borderRadius: 10, borderWidth: 2, backgroundColor: 'white', borderColor: 'white'
                        }}>
                            <View style={{ width: '100%', alignItems: 'flex-end', marginRight: 10, marginTop: 10, flex: 1 }}>
                                <TouchableOpacity onPress={this.editMenuDismiss}>
                                    <Image source={require('../icons/close.png')} resizeMode='contain'
                                        style={{ width: 30, height: 30 }} />
                                </TouchableOpacity>
                            </View>
                            <TextInput onChangeText={(text) => { this.state.name = text }} defaultValue={this.state.name}
                                style={{
                                    width: '80%', borderWidth: 1, borderRadius: 10, padding: 10,
                                    borderColor: this.state.nameError ? '#e53935' : '#64b5f6', flex: 1, marginTop: 10
                                }}
                                placeholder='Name'
                            />
                            <TextInput onChangeText={(text) => { this.state.address = text }} defaultValue={this.state.address}
                                style={{
                                    width: '80%', borderWidth: 1, borderRadius: 10, padding: 10,
                                    borderColor: this.state.addressError ? '#e53935' : '#64b5f6', flex: 1, marginTop: 10
                                }}
                                placeholder='Address'
                            />
                            <TextInput onChangeText={(text) => { this.state.pincode = text }} defaultValue={this.state.pincode}
                                style={{
                                    width: '80%', borderWidth: 1, borderRadius: 10, padding: 10,
                                    borderColor: this.state.pincodeError ? '#e53935' : '#64b5f6', flex: 1, marginTop: 10
                                }}
                                placeholder='Pincode'
                                keyboardType='numeric'
                            />
                            {
                                !this.state.updating && <TouchableOpacity style={{ flex: 2, justifyContent: 'center' }}
                                    onPress={this.editMenuUpdate}>
                                    <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>
                                        {this.state.networkError ? 'Error, Try again?' : 'Update'}
                                    </Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.updating && <View style={{ flex: 2, justifyContent: 'center' }}><LoadingView /></View>
                            }
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.loadingError}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%', elevation: 5,
                            borderRadius: 10, borderWidth: 2, backgroundColor: 'white', borderColor: 'white'
                        }}>
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>
                                Can't connect to server, try again!
                                </Text>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={this.loadContents}>
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>Try Again?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.logoutPopup}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%', elevation: 5,
                            borderRadius: 10, borderWidth: 2, backgroundColor: 'white', borderColor: 'white'
                        }}>
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>Confirm logout</Text>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={this.logout}>
                                    <Text style={{ color: '#f44336', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Logout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}
                                    onPress={() => { this.setState({ logoutPopup: false }); }}>
                                    <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        );
    }

    aboutPressed = () => {
        this.props.navigation.navigate('aboutScreen');
    }

    editMenuUpdate = () => {
        const name = this.state.name;
        const address = this.state.address;
        const pincode = this.state.pincode;

        let nameError = false;
        let addressError = false;
        let pincodeError = false;

        if (name.length === 0)
            nameError = true;
        if (address.length === 0)
            addressError = true;
        if (pincode.length !== 6)
            pincodeError = true;

        if (!(nameError || addressError || pincodeError)) {
            this.updateDetails();
            this.setState({ updating: true, networkError: false });
        }
        else
            this.setState({ nameError, addressError, pincodeError })
    }

    updateDetails = async () => {
        let responseJSON = await Common.fetchJSON('mauth',
            {
                name: this.state.name,
                address: this.state.address,
                pincode: this.state.pincode
            }, 'PUT');

        if (responseJSON != null) {
            console.log(responseJSON);
            this.setState({
                showEditMenu: false,
                updating: false,
                networkError: false,
                loadedName: this.state.name,
                loadedAddress: this.state.address,
                loadedPincode: this.state.pincode
            });
        }
        else
            this.setState({ updating: false, networkError: true });
    }

    editMenuDismiss = () => {
        this.setState({ showEditMenu: false });
    }

    editMenuPressed = () => {
        this.setState({ showEditMenu: true });
    }

    loadContents = async () => {
        this.setState({ loadingError: false, loading: true });
        let user = await Common.fetchJSON('mauth', {}, 'GET');
        if (user != null)
            this.setState({
                loading: false,
                loadedPhone: user.phoneNumber,
                loadedName: user.name,
                loadedAddress: user.address,
                loadedPincode: user.pincode
            });
        else
            this.setState({ loadingError: true, loading: false });
    }

    logout = async () => {
        await this.setState({ logoutPopup: false })
        Common.logout(this.props.navigation);
    }

    getOpacity = () => {
        if (this.state.logoutPopup)
            return 0.3;
        if (this.state.loadingError)
            return 0.3;
        if (this.state.showEditMenu)
            return 0.3;
        return 1;
    }

    getElevation = () => {
        if (this.state.logoutPopup)
            return 0;
        if (this.state.loadingError)
            return 0;
        if (this.state.showEditMenu)
            return 0;
        return 2;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    contents: {
        width: '100%',
        flex: 10
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})

export default ProfileScreen;