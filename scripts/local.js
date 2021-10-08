/*
 * Copyright (c) 2018 19Labs Inc.. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. 
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution. 
 * 
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// set the api key, if this is not set then no PII will be forwarded
function setApiKey() {
   // NineteenGale.setApiKey("229917BE7C3E9B2E88CD01627E2448B8C15572AC8B2C8452AAB8000F9DC92D09");
NineteenGale.setApiKey("CC7EF0386079F583ED5FBA8C6054A1130D34E6C4F299122120070569F9E3FBEA"); // noamwell
}

// set the receiver for login changed events
function onLoginChanged() {
    console.log("login changed")
    // getCurrent user information and pass to callback for display
    NineteenGale.getCurrentUser(showUser);
    onLanguageChanged();
    onSensorData();
    onIntakeData();
   
}
NineteenGale.onLoginChanged = onLoginChanged;

// set the receive for language changed events
function onLanguageChanged() {
    console.log("languaged changed")

    var language = NineteenGale.getCurrentLanguage();
    console.log("current href " + location.href);
    console.log("language " + language);

    var langel = document.getElementById("lang");
    console.log("lanaguage is " + language);
    if ((typeof langel !== 'undefined')&&(langel != null)) {
        if (language.indexOf("es") >= 0) {
            langel.innerText = "Espanol"
        } else {
            langel.innerText = "English"
        }
    }
    setLanguage(language);
}
NineteenGale.setOnLanguageChanged(onLanguageChanged);

function onSessionChanged(){
    console.log("sessin data changed");
    onLanguageChanged();
    onSensorData();
    onIntakeData();
}

NineteenGale.onSessionChanged = onSessionChanged;

function onProxyComplete(code){
    console.log("proxy complete "+code);
    NineteenGale.getProxyResult(processResult)
}

function processResult(result){
    console.log("url result :"+JSON.stringify(result));
}

NineteenGale.setOnProxyComplete(onProxyComplete);

var language = NineteenGale.getCurrentLanguage();


// set the reciever for sensor data events
function onSensorData() {
    // retreive the sensore data and pass to the callback
    console.log("call get Sensor Data");
    NineteenGale.getSensorData(showSensor);
}
NineteenGale.onSensorData = onSensorData;

function showSensor(data) {
    var dataElement = document.getElementById("sensorData");
    dataElement.innerText=JSON.stringify(data);
}

function onIntakeData() {
    console.log("on intake data");
    NineteenGale.getIntakeData(showIntake)
}
NineteenGale.onIntakeData = onIntakeData;

function showIntake(data) {
    var dataElement = document.getElementById("intakeData");
    dataElement.innerText=JSON.stringify(data);
}


function showUser(user) {
    console.log(JSON.stringify(user));
    if (user == null){
        user = {}
    }
    
    var userel = document.getElementById("user");
     console.log(" is user logged in " + user.islogin +" isdefined "+userel);
   
    var intake = NineteenGale.getIntake()
    console.log("intake "+intake);
    intake = {"personalInfo":{"firstName":"Aaron","lastName":"Cook","dateOfBirth":"1948-02-14","gender":"Male","genderIndex":2},"insurance":{"hasInsurance":false,"noInsurance":true,"insurancePlanNotListed":false,"insuranceName":"","insuranceID":""},"sessionid":"e0a15299-3cb2-4c61-bd76-9841adffb939","patientContactInfo":{"email":"","phoneNumber":""},"patientPhysiqueInfo":{"height":{"cm":"","feet":"5","inch":"9","heightUnit":"ft"},"weight":{"weight":"165","weightUnit":"lbs"}},"patientPreferredFilterInfo":{"filterIndex":5}}
    NineteenGale.setIntake(intake);
    if ((typeof userel != 'undefined') && (userel != null)) {
        if (user.islogin) {
            userel.innerText = welcome + user.firstName + " " + user.lastName;
        } else {
            userel.innerText = JSON.stringify(user);

        }
    }
}


function showSensors() {
    NineteenGale.showSensors();
}

function showWellness() {
    NineteenGale.showWellness();
}

function showLogin(){
    NineteenGale.showLogin();
}

function showCallCenter(){
    NineteenGale.showCallCenter();
}

function showCallCenter(){
    NineteenGale.showIntake();
}

function showClinic(name){
    NineteenGale.showClinic(name);
}

function stopVideo(){
    
}

function selectClinic(element){
    var text =  document.getElementById("clinic");
    console.log("text element is "+text);
    console.log('Select clinic' +text.value);
    NineteenGale.showClinic(text.value)
    
  }




