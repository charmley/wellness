var languageElements = { "en":{
    "userlabel":"User",
    "languageLabel":"Language",
    "showCallCenter":"CallCenter",
    "showSummary": "Summary",
    "shareSummary": "Share Summary",
    "showwellness":"Wellness",
    "showintake":"Intake",
    "showSensors":"Sensors",
    "showBP":"BP",
    "showPox":"PulseOx",
    "showThermometer":"Thermometer",
    "showWeight":"Weight",
    "showStethoscope":"Stethoscope",
    "showGlucometer":"Glucometer",
    "showCamera":"Camera",
    "showOtoscope":"Otoscope",
    "showDigitalCamera":"DigitalCamera",
    "showExternalApp":"ExternalApp",
    "showClinic":"Clinic",
    "clinic":"Clinic Name:",
    "selectClinic":"selectClinic",
    "showlogin":"Login",
    "showsignup":"Signup",
    "showNewSession":"New Session",
    "showSaveSession":"Save Session",
    "showRestoreSession":"Restore Session",
    "saveSession":"save test Session",
    "restoreSession":"restore test Session",
    "submitUrl":"Post Url",
    "intake":"Intake Value",
    "sensor":"Sensor Value",
    "proxy":"Proxy Value",
    "btn_reject":"Cancel",
    "btn_accept":"Accept"
},
"es":{
    "userlabel": "Usuario",
    "languageLabel": "Idioma",
    "showCallCenter": "CallCenter",
    "showSummary": "Summary",
    "shareSummary": "Share Summary",
    "showwellness": "Bienestar",
    "showintake": "Ingesta",
    "showSensors": "Sensores",
    "showBP": "BP",
    "showPox": "PulseOx",
    "showThermometer": "Termómetro",
    "showWeight": "Peso",
    "showStethoscope": "Estetoscopio",
    "showGlucometer": "Glucometer",
    "showCamera": "Cámara",
    "showOtoscope": "Otoscopio",
    "showDigitalCamera": "DigitalCamera",
    "showExternalApp": "ExternalApp",
    "showClinic": "Clínica",
    "clinic": "Nombre de la clínica:",
    "selectClinic": "selectClinic",
    "showlogin": "Iniciar sesión",
    "showsignup": "Registrarse",
    "showNewSession": "Nueva sesión",
    "showSaveSession": "Guardar sesión",
    "showRestoreSession": "Restaurar sesión",
    "saveSession": "guardar sesión de prueba",
    "restoreSession": "restaurar sesión de prueba",
    "submitUrl": "Publicar URL",
    "intake": "Valor de admisión",
    "sensor": "Valor del sensor",
    "proxy": "Valor de proxy",
    "btn_reject": "Cancelar",
    "btn_accept": "Aceptar"
}
};

function setLanguage(language){
    language=language.substring(0, 2);
    var languageElementArray = languageElements[language];
    console.log(JSON.stringify(languageElementArray))
    for (var key in languageElementArray) {
        element = document.getElementById(key);
        if (element != null && element !== 'undefined'){
        element.innerHTML=languageElementArray[key];
        }
        console.log("value " + languageElementArray[key] + " key" + key); 
    }
    
}