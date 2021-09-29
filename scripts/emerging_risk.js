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
    NineteenGale.setApiKey("229917BE7C3E9B2E88CD01627E2448B8C15572AC8B2C8452AAB8000F9DC92D09"); // 19lasdev
    //  NineteenGale.setApiKey("6230568A49FDDC868924C87399072FFB9B6258BBED1B68C64BECA497C9010AD7"); // lhostg
    //  NineteenGale.setApiKey("9BA6764B51E1C0390EE466810F2AF3245DFBE945972F24F663FD7FA52FCCB63A"); // lhoprd
}

var currentUser;
var baseUrl = "https://lhotc.19labs.com/";
var answers = [];
var autosubmitted = false;

isAutoSubmit = function () {
    for (i = 0; i < answers.length; i++) {
        var doc = answers[i];
        console.log("answerd " + doc.doc_id + " " + doc.answer);
        if ((doc.doc_id = 'litw2020') && (doc.answer === 'y')) {
            console.log("auto submit is true");
            return true;
        }
    }
    return false;
}

// set the receiver for login changed events
function onLoginChanged() {
    console.log("login changed")
    // getCurrent user information and pass to callback for display
    NineteenGale.getCurrentUser(showUser);
    onLanguageChanged();
    console.log("call on sensor")
    onSensorData();
    autosubmitted=false;
}
NineteenGale.onLoginChanged = onLoginChanged;

// set the receive for language changed events
function onLanguageChanged() {
    console.log("languaged changed")

    var language = NineteenGale.getCurrentLanguage();
    console.log("current href " + location.href);
    console.log("language " + language);

    if (language.indexOf("es") >= 0) {
        console.log("Check spanish href " + location.href);

        if (window.location.href.indexOf("-es.html") == -1) {
            console.log("Switching to Spanish page");
            window.location.href = window.location.href.replace(".html", "-es.html");
        } else {
            console.log("Already on Spanish page, not switching");
        }
    } else {
        console.log("Check english " + window.location.href);

        if (window.location.href.indexOf("-es.html") != -1) {
            console.log("Switching to English page");
            window.location.href = window.location.href.replace("-es.html", ".html");
        } else {
            console.log("Already on English page, not switching");
        }
    }
}
NineteenGale.setOnLanguageChanged(onLanguageChanged);

var language = NineteenGale.getCurrentLanguage();
var measure = "Measure Now";
var share = "Shared"
var access = "Instant access to the care you need"
var wellcom = "Welcome "
var submit = "You can submit when you complete at least one measurement"
var submitNow = "Submit Now"
var complete = "Completed"
var incomplete = "Incomplete"
var submitted = "Submitted"
var notsubmitted = "Not Submitted"
if (language.indexOf("es") >= 0) {
    measure = "Mida ahora"
    shared = "Compartido"
    access = "Acceso instantáneo a la atención que necesita"
    wellcom = "Bienvenido "
    submit = "Puedes enviar cuando completes al menos una medición"
    submitNow = "Enviar ahora"
    submitted = "Enviados"
    complete = "Realizado"
    incomplete = "Incompleto"
    notsubmitted = "No enviados"
}

// set the reciever for sensor data events
function onSensorData() {
    // retreive the sensore data and pass to the callback
    NineteenGale.getSensorData(showSensorData);
}
NineteenGale.onSensorData = onSensorData;
var canSubmit = false;
function showSensorData(data) {
    console.log(JSON.stringify(data));

    var bpv = data["bloodpressure"];
    var healthrecord = data["healthrecord"];
    var vitals=data["vitals"];
    var scalev = data["weight_scale"];
    console.log("SCALEV "+JSON.stringify(scalev));

    $("#submit_action").find(".notes").text(submit);
    canSubmit = false;
    if (typeof bpv != 'undefined') {
        var bp = bpv.slice(-1)[0];
        $("#bp_status").removeClass("status--incomplete").addClass("status--complete");;
        $("#bp_status").find(".details").text(bp.highpressure + "/" + bp.lowpressure + "/" + bp.heartrate);
        $("#bp_status").find(".state-text").text(complete);
        $("#submit_action").find(".notes").text(submit);
        canSubmit = true;

    } else {
        $("#bp_status").removeClass("status--complete").addClass("status--incomplete");
        $("#bp_status").find(".details").text("");
        $("#bp_status").find(".state-text").text(incomplete);
    }


    var weightstatus = $("#weight_status");

    if (typeof scalev != 'undefined') {
        var scale = scalev.slice(-1)[0];
        $("#weight_status").removeClass("status--incomplete").addClass("status--complete");;
        $("#weight_status").find(".details").text((scale.weight * 2.20462).toFixed(2) + " lbs");
        $("#weight_status").find(".state-text").text(complete);
        $("#submit_action").find(".notes").text(submitNow);
        canSubmit = true;

    } else {
        $("#weight_status").removeClass("status--complete").addClass("status--incomplete");;
        $("#weight_status").find(".details").text("");
        $("weight_status").find(".state-text").text(incomplete);

    }

    $("#submit_status").removeClass('status--complete').addClass('status--incomplete');;
    console.log("health:"+healthrecord+" vitals:"+vitals);
    if (typeof healthrecord != 'undefined') {
        if (healthrecord) {
            $("#submit_status").removeClass('status--incomplete').addClass('status--complete');
            $("#submit_status").find(".state-text").text(submitted);
        }
    } else if (typeof vitals != 'undefined') {
        if (vitals) {
            $("#submit_status").removeClass('status--incomplete').addClass('status--complete');
            $("#submit_status").find(".state-text").text(submitted);
        }

    } 
        if (isAutoSubmit()) {
            console.log("autosubmit " + healthrecord+" vitals"+vitals);
            if ((!autosubmitted)&&(canSubmit)) {
                NineteenGale.submitHealthData();
                autosubmitted = true;
            }
        }else {
            console.log("no autosubmit");
        }

}

function continueWellness() {
    if (currentUser.islogin) {
        if (window.location.href.indexOf("index-healthhub") < 0) {
            window.location.href = './index-healthhub.html'
        }
    } else {
        showLogin();
    }
}
function showUser(user) {
    console.log(JSON.stringify(user));
    currentUser = user;
    console.log(" is user logged in " + user.islogin);
    if (currentUser.islogin) {
        var userid = {};
        userid.username = user.email;
        console.log("calling " + baseUrl + "getUserDocuments with" + JSON.stringify(userid));
        NineteenGale.submitProxyUrl(baseUrl + "getUserDocuments", JSON.stringify(userid));
    } else {
        console.log("not logged in");
    }



}

function postAnswer(doc_id, value,text) {
    if (currentUser.islogin) {
        var answer = {};
        answer.username = currentUser.email;
        answer.answer = value;
        answer.doc_id = doc_id;
        answer.text = text;

        console.log("calling " + baseUrl + "userResponse with" + JSON.stringify(answer));
        NineteenGale.submitProxyUrl(baseUrl + "userResponse", JSON.stringify(answer));
    } else {
        console.log("not logged in");
    }
}

function startVisit() {
    NineteenGale.showCallCenter();
    if (!currentUser.islogin) {
        NineteenGale.showLogin();
    }
}

function showSensor(sensor){
    autosubmitted = false;
    $("#submit_status").removeClass('status--complete').addClass('status--incomplete');;
    NineteenGale.showSensor(sensor);
}


function showWellness() {
    NineteenGale.showWellness();
}

function showSensors() {
    NineteenGale.showSensors();
}

function showCallCenter() {
    NineteenGale.showCallCenter();
}

function showLogin() {
    NineteenGale.showLogin();
}

function showCallCenter() {
    NineteenGale.showCallCenter();
}

function showClinic(name) {
    NineteenGale.showClinic(name);
}

function submitData() {
    if (canSubmit) {
        NineteenGale.showSummary();
    }
}


function onProxyComplete(code) {
    console.log("proxy complete " + code);
    NineteenGale.getProxyResult(processResult);
    onSensorData();
}

function processResult(result) {
    console.log("url result :" + JSON.stringify(result));
    var documents = result.documents;
    for (i = 0; i < documents.length; i++) {
        var doc = documents[i];
        console.log("got document " + doc.doc_id + " answer:" + doc.answer + " title:" + doc.title);
        if (typeof doc.answer === 'undefined') {
            console.log("show popup");
            if (language.indexOf("es") >= 0) {
                showModal(doc.text.es, doc.title.es, doc.yes.es, doc.no.es, doc.style, doc.doc_id);
            } else {
                showModal(doc.text.en, doc.title.en, doc.yes.en, doc.no.en, doc.style, doc.doc_id);
            }
        } else {
            answers.push(doc);
        }
    }
}



NineteenGale.setOnProxyComplete(onProxyComplete);

// Get the modal
var modal = document.getElementById("tcModal");


close_modal = function () {
    modal.style.display = "none";
}
accept_modal = function () {
    modal.style.display = "none";
    console.log("post accept");
    var textElement = document.getElementById("tc_doc");
    var doc_id = textElement.innerHTML;
    var  textPresentedElement = document.getElementById("tc_text"); 
    var  answered_text = textPresentedElement.innerHTML;
    postAnswer(doc_id, "y",answered_text);
    close_modal();
}
reject_modal = function () {
    modal.style.display = "none";
    var textElement = document.getElementById("tc_doc");
    var doc_id = textElement.innerHTML;
    var  textPresentedElement = document.getElementById("tc_text"); 
    var  answered_text = textPresentedElement.innerHTML;
 
    console.log("post reject");
    postAnswer(doc_id, "n",answered_text);
    close_modal();
}

showModal = function (text, title, yes, no, style, doc_id) {
    addStyle(style);
    var textElement = document.getElementById("tc_text");
    textElement.innerHTML = text;
    var textElement = document.getElementById("tc_doc");
    textElement.innerHTML = doc_id;

    var titleElement = document.getElementById("tc_title");
    titleElement.innerHTML = title;
    var yesElement = document.getElementById("btn_accept");
    yesElement.innerHTML = yes;
    var noElement = document.getElementById("btn_reject");
    noElement.innerHTML = no;
    console.log("title element set to title" + title + titleElement)
    var modal = document.getElementById("tcModal");
    modal.style.display = "block";

}



// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* Function to add style element */
function addStyle(styles) {

    /* Create style document */
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));

    /* Append style to the tag name */
    document.getElementsByTagName("head")[0].appendChild(css);
}





