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


function setBridge() {
    NineteenGaleBridge.setBridge( );
}

// set the receiver for login changed events
async function onLoginChanged() {
    console.log("login changed");
    showUser(await NineteenGaleBridge.getCurrentUser());
    showSerial(await NineteenGaleBridge.getSerial());
    showName(await NineteenGaleBridge.getName());
    showLocation(await NineteenGaleBridge.getLocation());
    onLanguageChanged();
    onSensorData();
    onIntakeData();
}

// set the receive for language changed events
 async function onLanguageChanged() {
    console.log("languaged changed")

    let language = await NineteenGaleBridge.getCurrentLanguage();
    console.log("current href " + location.href);
    console.log("language " + language);

    const languageElement = $("#lang");
    console.log("lanaguage is " + language);
    if ((typeof languageElement !== 'undefined') && (languageElement != null)) {
        if (language.indexOf("es") >= 0) {
            languageElement.text("Espanol");
        } else {
            languageElement.text("English");
        }
    }
    setLanguage(language);
}

function onSessionChanged() {
    console.log("session data changed");
    onLanguageChanged();
    onSensorData();
    onIntakeData();
}

function onCallStart() {
    console.log("call started")
}

function onCallEnd() {
    console.log("call ended")
}

async function onProxyComplete(code) {
    console.log("proxy complete " + code);
    processResult(await NineteenGaleBridge.getProxyResult('proxy-result'));
}

function processResult(result) {
    $("#proxy-result").text(JSON.stringify(result));
}

let language = NineteenGaleBridge.getCurrentLanguage();


// set the reciever for sensor data events
async function onSensorData() {
    showSensor( await NineteenGaleBridge.getSensorData());
}

async function onSensorMeasurementData(data) {
    onSensorData();
}

function showSensor(data) {
    $("#sensor-data").text(data);
}

async function onIntakeData() {
    const data = await NineteenGaleBridge.getIntakeData()
    showIntake(data);
}


function showIntake(data) {
    $("#intake-data").text(JSON.stringify(data));
    if (typeof data.healthHistory !== 'undefined') {
        if (typeof data.healthHistory.allergies !== 'undefined'){
            $("#allergies").val(data.healthHistory.allergies);
        }
        if (typeof data.healthHistory.conditions !== 'undefined'){
            $("#conditions").val(data.healthHistory.conditions);
        }
        if (typeof data.healthHistory.medications !== 'undefined'){
            $("#medications").val(data.healthHistory.medications);
        }
        if (typeof data.healthHistory.medicalHistory !== 'undefined'){
            $("#medical-history").val(data.healthHistory.medicalHistory);
        }
    }
}

function showSerial(data) {
    $("#serial-data").text(data);
}
function showName(data) {
    $("#name-data").text(data);
}

function showLocation(data) {
    $("#location-data").text(JSON.stringify(data));
}



async function showUser(user) {
    console.log("user: " + JSON.stringify(user));
    if (user == null) {
        user = {}
    }
    const userElement = $("#user");
    if ((typeof userElement != 'undefined') && (userElement != null)) {
        if (!jQuery.isEmptyObject(user)) {
            userElement.text("Welcome " + user.firstName + " " + user.lastName);
        } else {
            userElement.text(JSON.stringify(user));
        }
    }
}


function showSensors() {
    NineteenGaleBridge.showSensors();
}

function showWellness() {
    NineteenGaleBridge.showWellness();
}

function showLogin() {
    NineteenGaleBridge.showLogin();
}

function showCallCenter() {
    NineteenGaleBridge.showCallCenter();
}

function showCallCenter() {
    NineteenGaleBridge.showIntake();
}

function showClinic(name) {
    NineteenGaleBridge.showClinic(name);
}

function stopVideo() {

}

function selectClinic() {
    const text = $("#clinic");
    console.log('Select clinic ' + text.val());
    NineteenGaleBridge.showClinic(text.val())

}

function openTab(className, id) {
    $(".tab").hide();
    $(".measurement").hide();
    $(".files").hide();
    if (className === "measurement") {
        $("#measurements").show();
    } else if (className === "files") {
        $("#files").show();

    }
    $("#" + id).show();
}

function addBloodPressureData() {
    const highPressure = $("#sys").val();
    const lowPressure = $("#dia").val();
    const pulse = $("#pulse").val();
    NineteenGaleBridge.addBloodPressureData({highPressure, lowPressure, pulse});
}

function addPulseOxData() {
    const oxygen = $("#oxygen").val();
    const pulse = $("#pulse").val();
    const perfusion = $("#perfusion").val();
    const respirationRate = $("#respirationRate").val();
    NineteenGaleBridge.addPulseOxData({oxygen, pulse, perfusion, respirationRate});
}

function addThermometerData() {
    const temperature = $("#temp").val();
    const unit = $("#thermometer-unit").val();
    NineteenGaleBridge.addThermometerData({temperature, unit});
}

function addGlucometerData() {
    const bloodSugar = $("#glucometer-blood-sugar").val();
    const unit = $("#glucometer-unit").val();
    NineteenGaleBridge.addGlucometerData({bloodSugar, unit});
}

function addWeightScaleData() {
    const weight = $("#weight").val();
    const unit = $("#weight-scale-unit").val();
    const bmi = $("#bmi").val();
    NineteenGaleBridge.addWeightScaleData({weight, unit, bmi});
}

function addSpirometerData() {
    const pef = $("#pef").val();
    const fvc = $("#fvc").val();
    const fef2575 = $("#fef2575").val();
    const fev6 = $("#fev6").val();
    const fev1 = $("#fev1").val();
    const fev1_fvc = $("#fev1-fvc").val();

    const measurements = [{ "label": "PEF", "value": pef, "unit": "L/m" },
    { "label": "FVC", "value": fvc, "unit": "L" },
    { "label": "FEF2575", "value": fef2575, "unit": "L" },
    { "label": "FEV6", "value": fev6, "unit": "L" },
    { "label": "FEV1", "value": fev1, "unit": "L" },
    { "label": "FEV1_FVC", "value": fev1_fvc, "unit": "%" }];

    for (i in measurements) {
        NineteenGaleBridge.addSpirometerData({"label": measurements[i].label, "value": measurements[i].value, "unit": measurements[i].unit});
    }
}

function addMultifunctionData() {
    const bloodSugar = $('#multifunction-blood-sugar').val();
    const keytone = $('#keytone').val();
    const lactate = $('#lactate').val();
    const cholesterol = $('#cholesterol').val();
    const uricAcid = $('#uric-acid').val();

    let bloodSugarUnit = "";
    if ($('#mg-dL').prop('checked')) {
        bloodSugarUnit = "mg/dL";
    } else {
        bloodSugarUnit = "mmol/L";
    }

    const measurements = [{ "label": "BLOOD_SUGAR", "value": bloodSugar, "unit": bloodSugarUnit },
    { "label": "KETONE", "value": keytone, "unit": "mmol/L" },
    { "label": "LACTATE", "value": lactate, "unit": "mmol/L" },
    { "label": "CHOLESTEROL", "value": cholesterol, "unit": "mg/dL" },
    { "label": "URIC_ACID", "value": uricAcid, "unit": "mg/dL" }];

    for (i in measurements) {
        NineteenGaleBridge.addMultifunctionData({"label": measurements[i].label, "value": measurements[i].value, "unit": measurements[i].unit});
    }
}

function displayClinics(obj) {
    let clinics = "";
    for (let i = 0; i < obj.length; i++) {
        clinics = clinics.concat(obj[i].name + "\n");
    }
    $("#clinic-display").val(clinics);
}

async function getClinics() {
    displayClinics(await NineteenGaleBridge.getClinics())
}

async function getSensors() {
    displaySensors(await NineteenGaleBridge.getSensors())
}

function displaySensors(obj) {
    let sensors = "";
    for (let i = 0; i < obj.length; i++) {
        sensors = sensors.concat(obj[i].name + "\n");
    }
    $("#sensor-list-box").val(sensors);
}

function setMeasurement() {
    const name = $("#name").val();
    const value = $("#value").val();
    const units = $("#units").val();
    const device = $("#device").val();
    NineteenGaleBridge.setMeasurement({name, value, units, device});
}

function setNote() {
    const note = $("#note").val();
    NineteenGaleBridge.setNote(note);
}

function setIntake() {
    const firstName = $("#first-name").val();
    const lastName = $("#last-name").val();
    const dateofBirth = $("#date").val();
    const genderIndex = $("#gender").prop('selectedIndex');
    const gender = $("#gender").find(":selected").text();
    const personalInfo = { "firstName": firstName, "lastName": lastName, "dateOfBirth": dateofBirth, "gender": gender, "genderIndex": genderIndex, "cardId": "" };

    const hasInsurance = $("#has-insurance").is(':checked');
    const noInsurance = $("#no-insurance").is(':checked');
    const insurancePlanNotListed = $("#insurance-plan-not-listed").is(':checked');
    const insuranceName = $("#insurance-name").val();
    const insuranceID = $("#insurance-ID").val();
    let insurance = ""
    if (hasInsurance) {
        insurance = { "hasInsurance": hasInsurance, "noInsurance": noInsurance, "insurancePlanNotListed": insurancePlanNotListed, "insuranceName": insuranceName, "insuranceID": insuranceID };
    } else {
        insurance = { "hasInsurance": hasInsurance, "noInsurance": noInsurance, "insurancePlanNotListed": insurancePlanNotListed, "insuranceName": "", "insuranceID": "" };
    }

    const guestVisitNotes = $("#guest-visit-notes").val() + '\n' +  $("#triage-address").val() + '\n' + $("#triage-phone").val();

    let cm = "";
    let inch = "";
    let ft = "";
    let heightUnit = ""
    let weightUnit = "";
    let weight = "";
    if ($("#imperial-height").is(':checked')) {
        heightUnit = "ft";
        inch = $("#inch").val();
        ft = $("#ft").val();
    } else {
        heightUnit = "cm";
        cm = $("#cm").val();
    }

    if ($("#imperial-weight").is(':checked')) {
        weight = $("#lbs").val();
        weightUnit = "lbs";
    } else {
        weight = $("#kg").val();
        weightUnit = "kg";
    }
    const patientPhysiqueInfo = { "height": { "cm": cm, "feet": ft, "inch": inch, "heightUnit": heightUnit }, "weight": { "weight": weight, "weightUnit": weightUnit } };

    const intake = { personalInfo, insurance, guestVisitNotes, patientPhysiqueInfo };
    NineteenGaleBridge.setIntake(intake);
    onIntakeData();
}

function setIntakeHealthHistory() {
    const allergies = $("#allergies").val();
    const medications = $("#medications").val();
    const conditions = $("#conditions").val();
    const medicalHistory = $("#medical-history").val();
    const healthHistory = { "allergies": allergies, "medications": medications, "conditions": conditions, "medicalHistory": medicalHistory };
    NineteenGaleBridge.setIntakeHealthHistory(JSON.stringify(healthHistory));
}

function addExternalDocument() {
    const type = $("#document-type").val();
    const url = $("#document-url").val();
    const source = $("#document-source").val();
    const timestamp = $("#document-timestamp").val();
    NineteenGaleBridge.addExternalDocument({type, url, source, timestamp});
}

async function getPdfData() {
    showPdfData(await NineteenGaleBridge.getPdfData());
}

function showPdfData(data) {
    $("#pdf-data-text").text(JSON.stringify(data));
    let text = "No pdfs";
    if (!jQuery.isEmptyObject(data)) {
        text = data[Object.keys(data)[0]][0].uri
    }
    $("#pdf-uri-text").val(text);
    showPDFReference(text);
    
}

function showPDFReference(uri) {
     $('#prescription-pdf-preview').attr('data',uri)


// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(uri);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');
    
    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason+"  "+uri);
});
}

async function getMeasurementFileData() {
    showMeasurementData(await NineteenGaleBridge.getMeasurementFileData());
}

function showMeasurementData(data) {
    $("#measurement-file-data-text").text(JSON.stringify(data));
    let text = "No measurements";
    if (!jQuery.isEmptyObject(data)) {
        // images are sent as a series of arrays ie {"camera":[],"otoscope":[]}
        let firstArray= data[Object.keys(data)[0]]
        console.log("display images for "+firstArray)
        for (var i = 0; i < firstArray.length; i++){
           console.log ("preview "+firstArray[i].uri)
           $('#previewMeasurement').prepend('<img id="img'+i+'" style="width: 500px;height: fit-content;margin-right:20px" src="'+firstArray[i].uri+'" />')
        }
        text = data[Object.keys(data)[0]][0].uri
    }
}


NineteenGaleBridge.setOnSensorData(onSensorData);
NineteenGaleBridge.setOnIntakeData(onIntakeData);
NineteenGaleBridge.setOnLoginChanged(onLoginChanged);
NineteenGaleBridge.setOnLanguageChanged(onLanguageChanged);
NineteenGaleBridge.setOnSessionChanged(onSessionChanged);
NineteenGaleBridge.setOnCallEnd(onCallEnd);
NineteenGaleBridge.setOnCallStart(onCallStart);
NineteenGaleBridge.setOnSensorMeasurementData(onSensorMeasurementData);



