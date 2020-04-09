import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native';
import VerifyPhoneNum from './VerifyPhoneNum';

const Server = "http://192.168.1.37:5000/api/";
// const Server = "https://foodtopia20.appspot.com/api/";
const AppVersion = "1.0.0";

const readToken = async () => {
    try {
        const result = await AsyncStorage.getItem('token');
        return result;
    } catch (err) {
        console.log('Token read error');
        return "";
    }
}

const fetchJSON = async (apiName, body = {}, method = 'POST') => {
    let token = await readToken();
    if (token == null)
        token = '';
    try {
        let response = await fetch(Server + AppVersion + '/' + apiName,
            {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                    'x-app-version': AppVersion
                },
                body: method === 'GET'? undefined : JSON.stringify(body)
            });

        if (response.status == 200) {
            // console.log(response)
            let responseJSON = await response.json();
            return responseJSON;
        }
        else {
            // console.log(response.status)
            let result = await response.json();
            switch (result.msg) {
                case 'INVALID_USER':
                    return 'INVALID_USER';
                case 'STOCK_ERROR':
                    return result
                default: return null;
            }
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}

const logout = async (navigation) => {
    const keys = await AsyncStorage.getAllKeys();
    VerifyPhoneNum.signOut();
    await AsyncStorage.multiRemove(keys);
    navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'loginScreen' }]
    }));
}

exports.fetchJSON = fetchJSON;
exports.appVersion = AppVersion;
exports.logout = logout;