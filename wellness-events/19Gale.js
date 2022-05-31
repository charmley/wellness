/*
 * Copyright (c) 2016- 2021 19Labs Inc.
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

function isNineteenGaleAPIDefined() {
    return typeof NineteenGaleAPI != "undefined";
}

function isBridgeDefined() {
    return typeof bridge != "undefined";
}

const Navigation = {
    LOGIN: 'login',
    SIGNUP: 'signup',
    CALLCENTER: 'callcenter',
    CLINIC: 'clinic',
    WELLNESS: 'wellness',
    SENSORS: 'sensors',
    INTAKE: 'intake'
}

const BASE36 = 36;
const STRING_SUBSET = 7;

const NineteenGaleBridge = {

    hex: function (buffer) {
        const hexCodes = [];
        const view = new DataView(buffer);
        for (let i = 0; i < view.byteLength; i += 4) {
            const value = view.getUint32(i)
            const stringValue = value.toString(16)
            const padding = '00000000'
            const paddedValue = (padding + stringValue).slice(-padding.length)
            hexCodes.push(paddedValue);
        }
        return hexCodes.join("");
    },

    sha256: async function (str) {
        const buffer = new TextEncoder("utf-8").encode(str);
        return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
            return this.hex(hash);
        });
    },
    bridge: null,

    GALE_APIKEY: "notset",

    setApiKey: function (key) {
        GALE_APIKEY = key;
    },

    setBridge() {
        bridge = window.bridge;
        this.setOnEventListeners();
    },

    setOnEventListeners() {
        const commands = {
            "sensordata": NineteenGaleBridge.onSensorData,
            "intake": NineteenGaleBridge.onIntakeData,
            "loginchange": NineteenGaleBridge.onLoginChanged,
            "languagechange": NineteenGaleBridge.onLanguageChanged,
            "sessionchange": NineteenGaleBridge.onSessionChanged,
            "callend" : NineteenGaleBridge.onCallEnd,
            "callstart" : NineteenGaleBridge.onCallStart,
            "stopvideo": window.stopVideo(),
            "loginerror": NineteenGaleBridge.onLoginError,
            "signupsuccess": NineteenGaleBridge.onSignupSuccess,
            "updateusersuccess": NineteenGaleBridge.onUpdateUserSuccess,
            "updateusererror": NineteenGaleBridge.onUpdateUserError,
            "loginsuccess": NineteenGaleBridge.onLoginSuccess
        }
        for (let key in commands) {
            bridge.addEventListener(key, commands[key])
        }
        this.setEventListenersWithParameters()
    },

    setEventListenersWithParameters() {
        const commands = {
            "proxycomplete": NineteenGaleBridge.onProxyComplete,
            "signuperror": NineteenGaleBridge.onSignupError,
            "sensormeasurementdata": NineteenGaleBridge.onSensorMeasurementData,
            "apierror": NineteenGaleBridge.onAPIError
        }
        const parameterEventListener = (e) => {
            const data = e.data
            const command = e.type
            const callback = commands[command]
            callback(data)
        }
        for (let key in commands) {
            bridge.addEventListener(key, parameterEventListener)
        }
    },

    getCurrentUser: async function () {
        console.log("get current user ");
        if (isBridgeDefined()) {
            islogin = false;
            return await bridge.getCurrentUser();
        }
        return { "islogin": false }
    },

    getSerial: async function () {
        if (isBridgeDefined()) {
            return await bridge.getSerial();
        }
    },

    getName: async function () {
        if (isBridgeDefined()) {
            return await bridge.getName();
        }
    },
    
    getLocation: async function () {
        if (isBridgeDefined()) {
            const data = await bridge.getLocation();
            return data
        }
    },


    getCurrentLanguage: async function () {
        console.log("get current language ");
        if (isNineteenGaleAPIDefined() && isBridgeDefined()) {
            console.log(NineteenGaleAPI)
            console.log("calling getCurrentLanguage");
            language = await bridge.getCurrentLanguage();
            console.log("application lanaguage is " + language);
            return language;
        } else {
            console.log(navigator.language)
            return navigator.language;
        }
    },

    setIntake: function (intake) {
        console.log("set intake ");
        if (isBridgeDefined()) {
            console.log("calling setIntake");
            bridge.updateIntake(intake);
        }
    },

    setIntakeHealthHistory: function (healthHistory) {
        console.log("set intake health history");
        if (isNineteenGaleAPIDefined()) {
            console.log("calling setIntakeHealthHistory");
            bridge.setIntakeHealthHistory(healthHistory);
        }
    },

    addExternalDocument: function (document) {
        console.log("add external document");
        if (isNineteenGaleAPIDefined()) {
            console.log("calling addExternalDocument");
            bridge.addExternalDocument(document);
        }
    },

    showLogin: function () {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.LOGIN);
        }
    },

    showSignup: function () {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.SIGNUP);
        }
    },


    showCallCenter: function () {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.CALLCENTER);
        }
    },
    showClinic: function (name) {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.CLINIC, name);
        }
    },
    showWellness: function () {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.WELLNESS);
        }
    },
    showSensors: function () {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.SENSORS);
        }
    },

    showIntake: function () {
        if (isBridgeDefined()) {
            bridge.navigate(Navigation.INTAKE);
        }
    },

    submitProxyUrl: function (url, body) {
        if (isBridgeDefined()) {
            console.log("nine submit:" + url + " :" + body);
            bridge.submitProxyUrl(url, body);
        }
    },

    getIntakeData: async function () {
        if (isBridgeDefined()) {
            const data = await bridge.getIntake();
            return data;
        }
        return { 'islogin': false };
    },

    getSensorData: async function () {
        if (isBridgeDefined()) {

            const data = await bridge.getSensorData();
            return data;
        } else
            return { 'islogin': false };
    },

    getProxyResult: async function () {
        if (isBridgeDefined()) {
            return await bridge.getProxyResult();
        }
        return {}
    },

    showSensor: function (sensor) {
        if (isBridgeDefined()) {
            bridge.showSensor(sensor);
        }
    },

    showSummary: function () {
        if (isBridgeDefined()) {
            bridge.navigate('summary');
        }
    },

    submitSummary: function () {
        console.log("submit summary");
        if (isBridgeDefined()) {
            bridge.submitHealthData();
        }
    },

    shareSummary: function () {
        console.log("share summary");
        if (isBridgeDefined()) {
            bridge.submitHealthData();
        }
    },

    showNewSession: function () {
        console.log("show save session");
        if (isBridgeDefined()) {
            bridge.navigate('newSession');
        }
    },

    submitHealthData: function () {
        console.log("submit");
        if (isBridgeDefined()) {
            bridge.submitHealthData();
        }
    },

    sendSummaryEmail: function (recipients, customBody) {
        console.log("send summary email");
        if (isBridgeDefined()) {
            bridge.sendSummaryEmail(recipients, customBody);
        }
    },

    getClinics: async function () {
        if (isBridgeDefined()) {
            console.log("get clinics ");
            return await bridge.getClinics();
        }
    },

    requestMessagePort: function (nonce, hash) {
        if (isNineteenGaleAPIDefined()) {
            console.log("request message port ");
            NineteenGaleAPI.requestMessagePort(nonce, hash);
        }
    },

    getSensors: async function () {
        if (isBridgeDefined()) {
            console.log("show sensors ");
            return await bridge.getSensors();
        }
    },

    saveCurrentPatientProfile: function () {
        if (isBridgeDefined()) {
            console.log("save current patient profile ");
            bridge.saveCurrentPatientProfile();
        }
    },

    setNote: function (note) {
        if (isBridgeDefined()) {
            bridge.setNote(note);
        }
    },

    setMeasurement: function (measurementData) {
        if (isBridgeDefined()) {
            console.log("set measurement ");
            bridge.setMeasurement(measurementData);
        }
    },

    authenticate: function (user, profile) {
        if (isBridgeDefined()) {
            console.log("authenticate ");
            bridge.authenticate(user, profile);

        }
    },

    getMeasurementFileByUri: async function (uri) {
        if (isBridgeDefined()) {
            console.log("getMeasurementFileByUri");
            return await bridge.getMeasurementFileByUri(uri)
        }
    },

    getPdfByUri: async function (uri) {
        if (isBridgeDefined()) {
            console.log("getPdfByUri");
            return await bridge.getPdfByUri(uri)
        }

    },

    getPdfData: async function () {
        if (isBridgeDefined()) {
            console.log("getPdfData");
            return await bridge.getPdfData()
        }
    },

    getMeasurementFileData: async function () {
        if (isBridgeDefined()) {
            console.log("getMeasurementFileData");
            return await bridge.getMeasurementFileData()
        }
    },

    addBloodPressureData: function (bloodPressureData) {
        if (isBridgeDefined()) {
            console.log("add blood pressure data ");
            bridge.addBloodPressureData(bloodPressureData);
        }
    },

    addPulseOxData: function (pulseOxData) {
        if (isBridgeDefined()) {
            console.log("add pulse ox data ");
            bridge.addPulseOxData(pulseOxData);
        }
    },

    addThermometerData: function (thermometerData) {
        if (isBridgeDefined()) {
            console.log("add thermometer data ");
            bridge.addThermometerData(thermometerData);
        }
    },

    addGlucometerData: function (glucometerData) {
        if (isBridgeDefined()) {
            console.log("add glucometer data ");
            bridge.addGlucometerData(glucometerData);
        }
    },

    addWeightScaleData: function (weightScaleData) {
        if (isBridgeDefined()) {
            console.log("add weight scale data ");
            bridge.addWeightScaleData(weightScaleData);
        }
    },

    addSpirometerData: function (spirometerData) {
        if (isBridgeDefined()) {
            console.log("add spirometer data ");
            bridge.addSpirometerData(spirometerData);
        }
    },

    addMultifunctionData: function (multifunctionData) {
        if (isBridgeDefined()) {
            console.log("add multifunction data ");
            bridge.addMultifunctionData(multifunctionData);
        }
    },

    print: function () {
        if (isBridgeDefined()) {
            bridge.print();
        }
    },

    endSession: function () {
        if (isBridgeDefined()) {
            console.log("end session ");
            bridge.endSession();
        }
    },

    onLanguageChanged: function () {

    },

    setOnLanguageChanged: function (callback) {
        this.onLanguageChanged = callback;
    },
    onProxyComplete: function () {

    },

    setOnProxyComplete: function (callback) {
        this.onProxyComplete = callback;
    },

    onSessionChanged: function () {

    },

    setOnSessionChanged: function (callback) {
        this.onSessionChanged = callback;
    },

    onCallStart: function () {

    },

    setOnCallStart: function (callback) {
        this.onCallStart = callback
    },

    onCallEnd: function () {

    },

    setOnCallEnd: function (callback) {
        this.onCallEnd = callback
    },

    onSensorMeasurementData: function (data) {

    },

    setOnSensorMeasurementData: function (callback) {
        this.onSensorMeasurementData = callback;
    },

    onSensorData: function () {

    },

    setOnSensorData: function (callback) {
        this.onSensorData = callback;
    },

    onIntakeData: function () {

    },

    setOnIntakeData: function (callback) {
        this.onIntakeData = callback;
    },

    onLoginChanged: function () {

    },

    setOnLoginChanged: function (callback) {
        this.onLoginChanged = callback;
    },

    onLoginError: function () {

    },

    setOnLoginError: function (callback) {
        this.onLoginError = callback;
    },

    onLoginSuccess: function () {

    },

    setOnLoginSuccess: function (callback) {
        this.onLoginSuccess = callback;
    },

    onSignupSuccess: function () {

    },

    setOnSignupSuccess: function (callback) {
        this.onSignupSuccess = callback;
    },

    onUpdateUserSuccess: function () {

    },

    setOnUpdateUserSuccess: function (callback) {
        this.onUpdateUserSuccess = callback;
    },

    onUpdateUserError: function () {

    },

    setOnUpdateUserError: function (callback) {
        this.onUpdateUserError = callback;
    },

    onSignupError: function (errors) {

    },

    setOnSignupError: function (callback) {
        this.onSignupError = callback;
    },

    onAPIError(error) {

    },

    setOnAPIError: function (callback) {
        this.onAPIError = callback;
    },

    Units: {
        FAHRENHEIT: "fahrenheit",
        CELSIUS: "celsius",
        MG_DL: "mg/dL",
        MMOL_L: "mmol/L",
        LBS: "lbs",
        KG: "kg",
        L_M: "L/m",
        L: "L",
        PERCENT: "%",
        CM: "cm",
        FT: "ft"
    },

    Labels: {
        PEF: "PEF",
        FVC: "FVC",
        FEF2575: "FEF2575",
        FEV6: "FEV6",
        FEV1: "FEV1",
        FEV1_FVC: "FEV1_FVC",

        BLOOD_SUGAR: "BLOOD_SUGAR",
        KETONE: "KETONE",
        LACTATE: "LACTATE",
        CHOLESTEROL: "CHOLESTEROL",
        URIC_ACID: "URIC_ACID"
    }

};


