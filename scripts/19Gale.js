/*
 * Copyright (c) 2016- 2021 19Labs Inc.
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

function isNineteenGaleAPIDefined() {
    return typeof NineteenGaleAPI != "undefined";
}

const BASE36 = 36;
const STRING_SUBSET = 7;

var NineteenGale = {

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

    sha256: function (str) {
        const buffer = new TextEncoder("utf-8").encode(str);
        return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
            return NineteenGale.hex(hash);
        });
    },

    GALE_APIKEY: "notset",

    setApiKey: function (key) {
        GALE_APIKEY = key;
    },

    getCurrentUser: function (callback) {
        if (GALE_APIKEY.indexOf("notset") < 0) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    callback(JSON.parse(NineteenGaleAPI.getCurrentUser(nonce, hash)));
                }
                else {
                    return callback({});
                }
            });
        } else {
            callback(JSON.parse(NineteenGaleAPI.getCurrentUser()));
        }
    },

    /***
     * @returns {string}: String code representing the current language that the GALE device is using
     */
    getCurrentLanguage: function () {
        console.log("get current language ");
        if (isNineteenGaleAPIDefined()) {
            console.log("calling getCurrentLanguage");
            let language = NineteenGaleAPI.getCurrentLanguage();
            console.log("application lanaguage is " + language);
            return language;
        } else {
            return navigator.language;
        }
    },

    /***
     * @returns {JSON}: intake object (see the IntakeObject object at the bottom of the file) and passes it to the callback
     * example: 
     * {personalInfo : {"firstName":"John","lastName":"Doe","dateOfBirth":"2021-09-17","gender":"Other","genderIndex":3,"cardId":""},
     *    insurance : {"hasInsurance":false,"noInsurance":true,"insurancePlanNotListed":false,"insuranceName":"","insuranceID":""},
     *    guestVisitNotes: "notes",
     *    patientPhysiqueInfo : {"height":{"cm":"","feet":"5","inch":"5","heightUnit":"ft"},"weight":{"weight":"5","weightUnit":"lbs"}}
     *
     * The following componenents of the intake string have predefined valid values
     *
     * {string} gender: Gender.FEMALE|Gender.MALE|Gender.OTHER|Gender.PREFER_NOT_TO_SAY
     * {int} genderIndex: GenderIndex.FEMALE|GenderIndex.MALE|GenderIndex.OTHER|GenderIndex.PREFER_NOT_TO_SAY
     * {string} heightUnit: Units.FT|Units.CM
     * {string} weightUnit: Units.LBS|Units.KG 
     * 
     * @param {function} callback handles the intake data once it is returned from GALE
     */
    getIntakeData: function (callback) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                const data = NineteenGaleAPI.getIntakeData(nonce, hash);
                const jsdata = JSON.parse(data);
                callback(jsdata);
            } else {
                callback();
            }
            return;
        });
    },



    getLocation: function (callback) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                const data = NineteenGaleAPI.getLocation(nonce, hash);
                const jsdata = JSON.parse(data);
                callback(jsdata);
            } else {
                console.log("no gale api present")
                callback()
            }
            return;
        });
    },


    getSerial: function (callback) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                const data = NineteenGaleAPI.getSerial(nonce, hash);
                callback(data)
            } else {
                console.log("no gale api present")
                callback()
            }
            return;
        });
    },

    /**
     * 
     * @param {string} intake a string in intake format: (see the IntakeObject object at the bottom of the file)
     * example: '{personalInfo : {"firstName":"John","lastName":"Doe","dateOfBirth":"2021-09-17","gender":"Other","genderIndex":3,"cardId":""},
     *    insurance : {"hasInsurance":false,"noInsurance":true,"insurancePlanNotListed":false,"insuranceName":"","insuranceID":""},
     *    guestVisitNotes: "notes",
     *    patientPhysiqueInfo : {"height":{"cm":"","feet":"5","inch":"5","heightUnit":"ft"},"weight":{"weight":"5","weightUnit":"lbs"}}'
     * 
     * The following componenents of the intake string have predefined valid values
     * 
     * {string} gender: Gender.FEMALE|Gender.MALE|Gender.OTHER|Gender.PREFER_NOT_TO_SAY
     * {int} genderIndex: GenderIndex.FEMALE|GenderIndex.MALE|GenderIndex.OTHER|GenderIndex.PREFER_NOT_TO_SAY
     * {string} heightUnit: Units.FT|Units.CM
     * {string} weightUnit: Units.LBS|Units.KG 
     */
    setIntake: function (intake) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                console.log("calling setIntake");
                NineteenGaleAPI.setIntake(nonce, hash, intake);
            }
        });

    },

    /**
     * Set the intake health history data using a formatted string
     * @param {string} healthHistory A string formatted into the health history format
     * e.g. '{"allergies":"peanuts","medications":"tylenol","conditions":"asthma","medicalHistory":"The patient's medical history"}'
   */
    setIntakeHealthHistory: function (healthHistory) {
        console.log("set intake health history");
        if (isNineteenGaleAPIDefined()) {
            console.log("calling setIntakeHealthHistory");
            NineteenGaleAPI.setIntakeHealthHistory(nonce,hash,healthHistory);
        }
    },

    //--------------------NAVIGATION FUNCTIONS--------------------//

    /*
    * Navigates GALE to the relevant screen
     */

    showLogin: function () {
        if (isNineteenGaleAPIDefined()) {
            NineteenGaleAPI.showLogin();
        }
    },

    showSignup: function () {
        if (isNineteenGaleAPIDefined()) {
            NineteenGaleAPI.showSignup();
        }
    },


    showCallCenter: function () {
        if (isNineteenGaleAPIDefined()) {
            NineteenGaleAPI.showCallCenter();
        }
    },

    /**
     * 
     * @param {string} name: The display name of the clinic
     */
    showClinic: function (name) {
        if (isNineteenGaleAPIDefined()) {
            NineteenGaleAPI.showClinic(name);
        }
    },

    showWellness: function () {
        if (isNineteenGaleAPIDefined()) {
            NineteenGaleAPI.showWellness();
        }
    },

    showSensors: function () {
        if (isNineteenGaleAPIDefined()) {
            NineteenGaleAPI.showSensors();
        }
    },

    showSummary: function () {
        console.log("show summary");
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                NineteenGaleAPI.showSummary(nonce, hash);
            }
            return;
        });
    },

    showIntake: function () {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("show intake n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    NineteenGaleAPI.showIntake(nonce, hash);
                }
            });
        }
    },
    /**
     * 
     * @param {string} sensor: The name of the sensor to navigate to
     * Options: 
     * SensorsNames.BLOOD_PRESSURE_MONITOR
     * SensorsNames.INTERNAL_CAMERA
     * SensorsNames.PULSE_OXIMETER
     * SensorsNames.STETHOSCOPE
     * SensorsNames.THERMOMETER
     * SensorsNames.GLUCOMETER
     * SensorsNames.WEIGHT_SCALE
     * SensorsNames.MULTIFUNCTION_TEST
     * SensorsNames.SPIROMETER
     * SensorsNames.EXTERNAL_APP
     *           
     */
    showSensor: function (sensor) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                NineteenGaleAPI.showSensor(nonce, hash, sensor);
            }
            return;
        });
    },


    //--------------------END OF NAVIGATION FUNCTIONS--------------------//



    submitProxyUrl: function (url, body) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                console.log("nine submit: " + url + " :" + body);
                NineteenGaleAPI.submitProxyUrl(nonce, hash, url, body);
            }
        });
    },

    /**
     * Prints the current screen that GALE is displaying
    */
    print: function () {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                console.log("print");
                NineteenGaleAPI.print(nonce, hash);
            }
        });
    },

    /**
     * @returns {JSON} JSON representation of all sensor measurements for the current session
     * @param {function} callback 
     */
    getSensorData: function (callback) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                const data = NineteenGaleAPI.getCurrentData(nonce, hash);
                const jsdata = JSON.parse(data);
                callback(jsdata);
            } else {
                callback();
            }
            return;
        });
    },

    getProxyResult: function (callback) {
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                callback(NineteenGaleAPI.getProxyResult(nonce, hash));
            } else {
                callback();
            }
            return;
        });
    },

    /**
     * Mimics the action of hitting the Share button in patient summary
     */
    shareSummary: function () {
        console.log("share summary");
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                NineteenGaleAPI.submitHealthData(nonce, hash);
            }
            return;
        });
    },


    /**
     * Mimics the action of hitting the new session menu option
     */
    showNewSession: function () {
        console.log("show new session");
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                NineteenGaleAPI.showNewSession(nonce, hash);
            }
            return;
        });
    },


    /**
     * Sends an email containing the pdf summary of the patient profile
     * In order to use this the user must be logged in to an account on the GALE device
     * @param {string} recipients: Comma seperated list of all the intended email recipients
     * @param {string} customBody: The body text to be attached to the email
     */
    sendSummaryEmail: function (recipients, customBody) {
        console.log("send summary email");
        const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
        this.sha256(nonce + GALE_APIKEY).then(function (hash) {
            if (isNineteenGaleAPIDefined()) {
                NineteenGaleAPI.sendSummaryEmail(nonce, hash, recipients, customBody);
            }
            return;
        });
    },

    /**
     * Mimics the functionality of hitting the Save menu option
     */
    saveHealthData: function () {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("save health data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    NineteenGaleAPI.saveHealthData(nonce, hash);
                }
            });
        }
    },

    /**
     * Returns a JSON representation of all of the clinics currently configured on the GALE device
     * @param {function} callback 
     */
    getClinics: function (callback) {
        if (GALE_APIKEY.indexOf("notset") < 0) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("get clinics n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    callback(JSON.parse(NineteenGaleAPI.getClinics(nonce, hash)));
                }
            });
        }
    },

    /**
     * Requests a message port be opened on the GALE device to allow the handling of WebMessageEvents to and from the device
     * @returns {string} "OK" if the port opened successfully
     * @param {function} callback 
     */
    requestMessagePort: function (callback) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("request message port n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    callback(NineteenGaleAPI.requestMessagePort(nonce, hash));
                }
            });
        }
    },

    /**
     * @returns {JSON}: JSON representation of all sensors currently configured to the GALE device
     * @param {function} callback 
     */
    getSensors: function (callback) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("show intake n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    callback(JSON.parse(NineteenGaleAPI.getSensors(nonce, hash)));
                }
            });
        }
    },

    /**
     * Saves the current patient profile to the GALE device
     */
    saveCurrentPatientProfile: function () {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("save current patient profile n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    NineteenGaleAPI.saveCurrentPatientProfile(nonce, hash);
                }
            });
        }
    },

    /**
     * Sets a note and saves it to the health history
     * The note must not be longer than 512 characters
     * @param {string} note: The string value of the note that is to be set
     */
    setNote: function (note) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("set note n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    NineteenGaleAPI.setNote(nonce, hash, note);
                }
            });
        }
    },


    /**
     * Ends current GALE session
     */
    endSession: function () {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("end session n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    NineteenGaleAPI.endSession(nonce, hash);
                }
            });
        }
    },

    /**
     * @param {function} callback
     * @returns {JSON} A JSON representation of all Pdf files stored on the device.
     *                 Each file object within the Pdf files JSON has a uri attribute which can be used to reference the file using getPdfFileByURI
     */
    getPdfData: function (callback) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    callback(JSON.parse(NineteenGaleAPI.getPdfData(nonce, hash)));
                }
            });
        }
    },


    /**
     * @param {function} callback 
     * @returns {JSON} A JSON representation of all measurement files stored on the device.
     *                 Each file object within the measurement files JSON has a uri attribute which can be used to reference the file using getMeasurementFileByUri
     */
    getMeasurementFileData: function (callback) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    callback(JSON.parse(NineteenGaleAPI.getMeasurementFileData(nonce, hash)));
                }
            });
        }
    },

    /**
     * Takes a file uri as a reference, exposes the relevant file to the captive webpage and returns a reference to the newly exposed file.
     * The reference will take the form of https://{captivewebpageurl}/public/{filename} and the reference can be used as if the file were a part of the webpages directory
     * 
     * @param {string} uri The uri that references a measurement file. The uri can be obtained from getMeasurementFileData
     * @param {function} callback 
     * 
     * @returns {string} Returns a string that can be used to reference the relevant file.
     */
    getMeasurementFileByUri: function (uri, callback) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    callback(NineteenGaleAPI.getMeasurementFileByUri(nonce, hash, uri));
                }
            });
        }
    },

    /**
     * Takes a file uri as a reference, exposes the relevant file to the captive webpage and returns a reference to the newly exposed file.
     * The reference will take the form of https://{captivewebpageurl}/public/{filename} and the reference can be used as if the file were a part of the webpages directory
     * 
     * @param {string} uri The uri that references a Pdf file. The uri can be obtained from getPdfFileData
     * @param {function} callback
     * 
     * @returns {string} Returns a string that can be used to reference the relevant file.
     *
     */
    getPdfByUri: function (uri, callback) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    callback(NineteenGaleAPI.getPdfByUri(nonce, hash, uri));
                }
            });
        }
    },

    /**
     * 
     *  {string} name: string of length <= 20
     *  {string} value: string of length <= 20
     *  {string} units: string of length <= 20
     *  {string} device: string of length <= 128
     *  {string(optional)}: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     * @param {Object} measurementData {SensorKeys.NAME: name, SensorKeys.VALUE: value, SensorKeys.UNITS: units, SensorKeys.TIMESTAMP: timestamp}
     */
    setMeasurement: function (measurementData) {
        const { name, value, units, device, timestamp } = measurementData;
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("set measurement n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.setMeasurement(nonce, hash, name, value, units, device, timestamp);
                    } else {
                        NineteenGaleAPI.setMeasurement(nonce, hash, name, value, units, device);
                    }
                }
            });
        }
    },

    authenticate: function (user, profile) {
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("authenticate n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    NineteenGaleAPI.authenticate(nonce, hash, user, profile);
                }
            });
        }
    },

    /**
     * 
     * Optionally, a timestamp can be added to the data as it is being entered
     * Timestamps in GALE are stored in UTC, so any timestamp that is added using
     * the API should also be in UTC
     * 
     * 
     * 
     * timestamp format -> String: timestamp = "yyyy-MM-dd HH:mm"
     * e.g.
     * addBloodPressureData(highPressure, lowPressure, pulse, timestamp)
     * 
     * addBloodPressureData("120", "80", "60", "2021-11-04 14:02")
     */


    /**
     * 
     *  {string} highPressure 
     *  {string} lowPressure 
     *  {string} pulse 
     *  {string(optional)} timestamp: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     * @param {Object} bloodPressureData {SensorKeys.HIGH_PRESSURE: highPressure, SensorKeys.LOW_PRESSURE: lowPressure, SensorKeys.PULSE}
     */

    addBloodPressureData: function (bloodPressureData) {
        const { highPressure, lowPressure, pulse, timestamp } = bloodPressureData;
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add blood pressure data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addBloodPressureData(nonce, hash, highPressure, lowPressure, pulse, timestamp);
                    } else {
                        NineteenGaleAPI.addBloodPressureData(nonce, hash, highPressure, lowPressure, pulse);
                    }
                }
            });
        }
    },


    /**
     * 
     *  {string} oxygen 
     *  {string} pulse 
     *  {string} perfusion 
     *  {string(optional)} respirationRate
     *  {string(optional)} timestamp: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     * @param {Object} pulseOxData {SensorKeys.OXYGEN: oxygen, SensorKeys.PULSE: pulse, SensorKeys.PERFUSION: perfusion, SensorKeys.RESPIRATION_RATE: respirationRate}
     */

    addPulseOxData: function (pulseOxData) {
        let { oxygen, pulse, perfusion, respirationRate, timestamp } = pulseOxData;
        if (!respirationRate) {
            respirationRate = "";
        }
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add pulse ox data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addPulseOxData(nonce, hash, oxygen, pulse, perfusion, respirationRate, timestamp);
                    } else {
                        NineteenGaleAPI.addPulseOxData(nonce, hash, oxygen, pulse, perfusion, respirationRate);
                    }
                }
            });
        }
    },

    /**
     * 
     *  {string} temperature 
     *  {string} unit: Units.FAHRENHEIT|Units.CELSIUS
     *  {*} timestamp: "YYYY-MM-DD HH:mm"
     * 
     * @param {Object} thermometerData {SensorKeys.TEMPERATURE: temperature, SensorKeys.UNIT: unit}
     */

    addThermometerData: function (thermometerData) {
        const { temperature, unit, timestamp } = thermometerData;
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add thermometer data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addThermometerData(nonce, hash, temperature, unit, timestamp);
                    } else {
                        NineteenGaleAPI.addThermometerData(nonce, hash, temperature, unit);
                    }
                }
            });
        }
    },

    /**
     * 
     *  {string} bloodSugar 
     *  {string} unit: Units.MG_DL|Units.MMOL_L
     *  {string(optional)} timestamp: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     *  @param {Object} glucometerData {SensorKeys.bloodSugar: bloodSugar, SensorKeys.UNIT: unit}
     */

    addGlucometerData: function (glucometerData) {
        const { bloodSugar, unit, timestamp } = glucometerData;
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add glucometer data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addGlucometerData(nonce, hash, bloodSugar, unit, timestamp);
                    } else {
                        NineteenGaleAPI.addGlucometerData(nonce, hash, bloodSugar, unit);
                    }
                }
            });
        }
    },

    /**
     * 
     *  {string} weight 
     *  {string} unit: Units.LBS|Units.KG 
     *  {string(optional)} bmi
     *  {string(optional)} timestamp: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     *  @param {Object} weightScaleData {SensorKeys.WEIGHT: weight, SensorKeys.UNIT: unit, SensorKeys.BMI: bmi}
     */

    addWeightScaleData: function (weightScaleData) {
        let { weight, unit, bmi, timestamp } = weightScaleData;
        if (!bmi) {
            bmi = "";
        }
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add weight scale data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addWeightScaleData(nonce, hash, weight, unit, bmi, timestamp);
                    } else {
                        NineteenGaleAPI.addWeightScaleData(nonce, hash, weight, unit, bmi);
                    }
                }
            });
        }
    },

    /**
     * 
     *  {string} label: Labels.PEF|Labels.FVC|Labels.FEF2575|Labels.FEV6|Labels.FEV1|Labels.FEV1_FVC
     *  {string} value 
     *  {string} unit: Units.L_M|Units.L|Units.PERCENT
     *  {string(optional)} timestamp: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     *  @param {Object} spirometerData {SensorKeys.LABEL: label, SensorKeys.VALUE: value, SensorKeys.UNIT: unit}
     */

    addSpirometerData: function (spirometerData) {
        const { label, value, unit, timestamp } = spirometerData;
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add spirometer data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addSpirometerData(nonce, hash, label, value, unit, timestamp);
                    } else {
                        NineteenGaleAPI.addSpirometerData(nonce, hash, label, value, unit);
                    }
                }
            });
        }
    },

    /**
     * 
     *  {string} label: Labels.BLOOD_SUGAR|Labels.KETONE|Labels.LACTATE|Labels.CHOLESTEROL|Labels.URIC_ACID
     *  {string} value 
     *  {string} unit: Units.MG_DL|Units.MMOL_L
     *  {string(optional)} timestamp: "YYYY-MM-DD HH:mm" timestamp must be in UTC
     * 
     *  @param {Object} multifunctionData {SensorKeys.LABEL: label, SensorKeys.VALUE: value, SensorKeys.UNIT: unit}
     */

    addMultifunctionData: function (multifunctionData) {
        const { label, value, unit, timestamp } = multifunctionData;
        if (isNineteenGaleAPIDefined()) {
            const nonce = Math.random().toString(BASE36).substring(STRING_SUBSET);
            this.sha256(nonce + GALE_APIKEY).then(function (hash) {
                if (isNineteenGaleAPIDefined()) {
                    console.log("add multifunction data n: " + nonce + " k: " + GALE_APIKEY + " H: " + hash);
                    if (timestamp) {
                        NineteenGaleAPI.addMultifunctionData(nonce, hash, label, value, unit, timestamp);
                    } else {
                        NineteenGaleAPI.addMultifunctionData(nonce, hash, label, value, unit);
                    }
                }
            });
        }
    },


    showKeyboard: function () {

    },

    hideKeyboard: function () {

    },

    //----------------Event Handlers----------------//

    //The following section is devoted to event handlers. Users can set a function to get called
    //when a GALE event occurs by using the relevant setter functions.

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


    /**
     * onAPIError can be used to receive error feedback from GALE when using the API.
     * @param {string} error A stringified error object containing a message and a code
     * error {message: "error message", code: "error code"}
     */
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
    },

    Gender: {
        FEMALE: "female",
        MALE: "male",
        OTHER: "other",
        PREFER_NOT_TO_SAY: "prefer_not_to_say"
    },

    GenderIndex: {
        FEMALE: "1",
        MALE: "2",
        OTHER: "3",
        PREFER_NOT_TO_SAY: "4"
    },

    intakeObject: {
        "personalInfo": { "firstName": "", "lastName": "", "dateOfBirth": "YYYY-MM-DD", "gender": "", "genderIndex": 0, "cardId": "" },
        "insurance": { "hasInsurance": false, "noInsurance": false, "insurancePlanNotListed": false, "insuranceName": "", "insuranceID": "" },
        "guestVisitNotes": "", "patientPhysiqueInfo": { "height": { "cm": "", "feet": "", "inch": "", "heightUnit": "" }, "weight": { "weight": "", "weightUnit": "" } },
        "patientContactInfo": { "email": "", "phoneNumber": "" },
        "sessionid": "",
        "patientPreferredFilterInfo": { "filterIndex": 0 }
    },

    SensorNames: {
        BLOOD_PRESSURE_MONITOR: "Blood Pressure Monitor",
        INTERNAL_CAMERA: "Internal Camera",
        PULSE_OXIMETER: "Pulse Oximeter",
        STETHOSCOPE: "Stethoscope",
        THERMOMETER: "Thermometer",
        GLUCOMETER: "Glucometer",
        WEIGHT_SCALE: "Weight Scale",
        MULTIFUNCTION_TEST: "Multifunction Test",
        SPIROMETER: "Spirometer",
        EXTERNAL_APP: "External App",
    },

    SensorKeys: {
        NAME: "name",
        DATA: "data",
        UNIT: "unit",
        BMI: "bmi",
        HIGH_PRESSURE: "highPressure",
        LOW_PRESSURE: "lowPressure",
        PULSE: "pulse",
        OXYGEN: "oxygen",
        PERFUSION: "perfusion",
        RESPIRATION_RATE: "respirationRate",
        TEMPERATURE: "temperature",
        BLOOD_SUGAR: "bloodSugar",
        WEIGHT: "weight",
        LABEL: "label",
        VALUE: "value",
        TIMESTAMP: "timestamp",
        URI: "uri",
    }

};


