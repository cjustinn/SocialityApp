import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import 'firebase/auth';
import {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_ID,
    APP_ID,
    MEASUREMENT_ID
} from '@env';

const config = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};

export const app = getApps().length > 0 ? getApp() : initializeApp(config);
export const _auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export const auth = _auth ? getAuth() : _auth;
export const parseFirebaseErrorCode = code => {
    let msg = "";

    switch(code) {
        case "auth/invalid-email":
            msg = "The entered email address is invalid."
            break;
        case "auth/wrong-password":
            msg = "The entered password is incorrect."
            break;
        default:
            msg = code;
            break;
    }

    return msg;
}