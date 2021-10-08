/*
 * Copyright (c) 2016- 2021 19Labs Inc.
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


var NineteenGale = {

hex:  function hex(buffer) {
        var hexCodes = [];
        var view = new DataView(buffer);
        for (var i = 0; i < view.byteLength; i += 4) {
          var value = view.getUint32(i)
          var stringValue = value.toString(16)
           var padding = '00000000'
          var paddedValue = (padding + stringValue).slice(-padding.length)
          hexCodes.push(paddedValue);
        }
        return hexCodes.join("");
      },

sha256: function sha256(str) {
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
		   return NineteenGale.hex(hash);
    });
  },
  


GALE_APIKEY: "notset",

setApiKey: function setApiKey(key){
    GALE_APIKEY=key;
},

stopVideo: function(){

},

getCurrentUser: function getCurrentUser(callback) {
    if (GALE_APIKEY.indexOf("notset")<0){
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != 'undefined') {
            callback(JSON.parse(NineteenGaleAPI.getCurrentUser(nonce,hash)));
        }
        else {
            islogin=false;
            return callback({ "islogin": false });
        }
      });
    } else {
        callback(JSON.parse(NineteenGaleAPI.getCurrentUser()));
    }
},

getCurrentLanguage: function getCurrentLanguage(){
    console.log("get current language ");
    if (typeof NineteenGaleAPI != 'undefined') {
        console.log("calling getCurrentLanguage");
        var language = NineteenGaleAPI.getCurrentLanguage();
        console.log("application lanaguage is "+language);
        return language;
    } else {
        return navigator.language;
    }
},

getIntake: function getIntake(){
    console.log("get intake ");
    if (typeof NineteenGaleAPI != 'undefined') {
        console.log("calling getIntake");
        var intake = NineteenGaleAPI.getIntake();
        console.log("intake is "+intake);
        return intake;
    } else {
        return "";
    }
},

setIntake: function setIntake(intake){
    console.log("set intake " + intake);
    if (typeof NineteenGaleAPI != 'undefined') {
        console.log("calling setIntake");
        NineteenGaleAPI.setIntake(intake);
        console.log("intake is "+intake);
    }
},

showLogin: function showLogin() {
    if (typeof NineteenGaleAPI != "undefined") {
        NineteenGaleAPI.showLogin();
    }
},

showSignup: function showSignup() {
    if (typeof NineteenGaleAPI != "undefined") {
        NineteenGaleAPI.showSignup();
    }
},


showCallCenter: function showCallCenter() {
    if (typeof NineteenGaleAPI != "undefined") {
        NineteenGaleAPI.showCallCenter();
    }
},
showClinic: function showClinic(name) {
    if (typeof NineteenGaleAPI != "undefined") {
        NineteenGaleAPI.showClinic(name);
    }
},
showWellness: function showWellness() {
    if (typeof NineteenGaleAPI != "undefined") {
        NineteenGaleAPI.showWellness();
    }
},
showSensors: function showSensors() {
    if (typeof NineteenGaleAPI != "undefined") {
        NineteenGaleAPI.showSensors();
    }
},
onIntakeData: function(){

},
onSensorData: function(){

},
onLanguageChanged: function(){

},


setOnLanguageChanged: function setOnLanguageChanged(callback){
    this.onLanguageChanged = callback;
},

onSessionChanged: function(){

},
onLoginChanged: function(){

},

onProxyComplete: function(){

},
setOnProxyComplete: function setOnProxyComplete(callback){
    this.onProxyComplete = callback;
},

showIntake: function showIntake() {
    if (typeof NineteenGaleAPI != "undefined") {
        var nonce = Math.random().toString(36).substring(7);
        this.sha256(nonce + GALE_APIKEY).then(function(hash) {
            if (typeof NineteenGaleAPI != "undefined") {
                console.log("show intake n:"+nonce+" k: "+GALE_APIKEY+" H: "+hash);
                NineteenGaleAPI.showIntake(nonce,hash);
            }       
          });
    }
},

submitProxyUrl: function getSubmitProxy(url,body) {  
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            console.log("nine submit:"+url+" :"+body);
            NineteenGaleAPI.submitProxyUrl(nonce,hash,url,body);
        }       
      });
},
getIntakeData: function getIntakeData(callback) {  
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            var data = NineteenGaleAPI.getIntakeData(nonce,hash);
            var jsdata = JSON.parse(data);
            callback(jsdata);
        } else {
            callback();
        }
        return;      
      });
},

getSensorData: function getSensorData(callback) {  
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            var data = NineteenGaleAPI.getCurrentData(nonce,hash);
            console.log("sensor: "+data);
            var jsdata = JSON.parse(data);
            callback(jsdata);
        } else {
            callback();
        }
        return;      
      });
},

getProxyResult: function getProxyResult(callback) {  
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            callback(JSON.parse(NineteenGaleAPI.getProxyResult(nonce,hash)));
        } else {
            callback();
        }
        return;      
      });
},

showSensor: function showSensor(sensor) {  
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.showSensor(nonce,hash,sensor);
        }
        return;      
      });
},
showSummary: function showSummary() {  
    console.log("show summary");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.showSummary(nonce,hash);
        }
        return;      
      });
},
submitSummary: function submitSummary() {  
    console.log("show summary");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.submitHealthData(nonce,hash);
        }
        return;      
      });
},
shareSummary: function shareSummary() {  
    console.log("show summary");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.submitHealthData(nonce,hash);
        }
        return;      
      });
},
showNewSession: function showNewSession() {  
    console.log("show save session");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.showNewSession(nonce,hash);
        }
        return;      
      });
},
showSaveSession: function showSaveSession() {  
    console.log("show save session");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.showSaveSession(nonce,hash);
        }
        return;      
      });
},
showRestoreSession: function showRestoreSession() {  
    console.log("show restore");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.showRestoreSession(nonce,hash);
        }
        return;      
      });
},

submitHealthData: function submitHealthData() {  
    console.log("submit");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.submitHealthData(nonce,hash);
        }
        return;      
      });
},

sendSummaryEmail: function sendSummaryEmail(recipients, customBody) {
    console.log("send summary email");
    var nonce = Math.random().toString(36).substring(7);
    this.sha256(nonce + GALE_APIKEY).then(function(hash) {
        if (typeof NineteenGaleAPI != "undefined") {
            NineteenGaleAPI.sendSummaryEmail(nonce, hash, recipients, customBody);
        }
        return;
      });
},

showKeyboard: function (){

},
hideKeyboard: function (){

}

};


