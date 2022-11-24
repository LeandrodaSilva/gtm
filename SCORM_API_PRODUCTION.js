/*******************************************************************************
 ** Author:Phillipe Vieira (phillipe.vieira@digitalpages.com.br)
 **	Supported variables and validation function
 *******************************************************************************/
var cmi_object = function(inName, inType, inVocabulary, inValue) {
  // holder for the above details
  this.name = inName; // name of the variable been setup
  this.value = ""; // text value of variable
  this.type = inType; // type of variable r,w,rw
  this.vocabulary = ""; // array of vocab values
  if (inVocabulary) this.vocabulary = inVocabulary;
  if (inValue) this.value = inValue;
};

/*******************************************************************************
 **
 ** Object: CMI_CONFIG
 **
 ** Description:
 ** Cookie Scorm 1.2 API
 **
 *******************************************************************************/
// set the SCO variables
var CMI_CONFIG = {
  cmi_variables: new Array(),
  // function to check length is not exceeded
  findVariable: function(inName) {
    var matchingIndex = null;
    //loop through variables
    for (var i = 0; i < CMI_CONFIG.cmi_variables.length; i++) {
      if (CMI_CONFIG.cmi_variables[i].name == inName) {
        return i;
      }
    }
    return null;
  },
  // function to check the value is valid within the vocab
  checkVocabulary: function(inName, inValue) {
    // check if variable exists
    var objectIndex = CMI_CONFIG.findVariable(inName);
    if (objectIndex == null) return false;
    // if no vocab, return true
    var vocab = CMI_CONFIG.cmi_variables[objectIndex].vocabulary;
    if (vocab == "") return true;
    // otherwise check value matches the options
    var validMatch = false;
    for (var i = 0; i < vocab.length; i++) {
      if (vocab[i] == inValue) {
        validMatch = true;
      }
    }
    return validMatch;
  },
  // function to check if the variable is readable and writeable
  isReadable: function(inName, isWritable) {
    // check if variable exists
    var objectIndex = CMI_CONFIG.findVariable(inName);
    if (objectIndex == null) return false;
    // if readable, return true
    var objectType = CMI_CONFIG.cmi_variables[objectIndex].type;
    if (objectType == "") return false;
    // otherwise check value matches the options
    var validMatch = false;
    if (isWritable) var matchValue = "w";
    else var matchValue = "r";

    for (var i = 0; i < objectType.length; i++) {
      if (objectType.substr(i, 1).toLowerCase() == matchValue) {
        validMatch = true;
      }
    }
    return validMatch;
  }
}; // end of CMI_CONFIG

// core variables
CMI_CONFIG.cmi_variables[0] = new cmi_object("cmi.core._children", "r");
CMI_CONFIG.cmi_variables[1] = new cmi_object("cmi.core.student_id", "rw");
CMI_CONFIG.cmi_variables[2] = new cmi_object("cmi.core.student_name", "rw");
CMI_CONFIG.cmi_variables[3] = new cmi_object("cmi.core.credit", "r", [
  "credit",
  "no-credit"
]);
CMI_CONFIG.cmi_variables[4] = new cmi_object("cmi.core.entry", "r", [
  "ab-initio",
  "resume"
]);
CMI_CONFIG.cmi_variables[5] = new cmi_object("cmi.core.total_time", "r");
CMI_CONFIG.cmi_variables[6] = new cmi_object("cmi.core.lesson_mode", "r", [
  "browse",
  "normal",
  "review"
]);
CMI_CONFIG.cmi_variables[7] = new cmi_object("cmi.core.lesson_location", "rw");
CMI_CONFIG.cmi_variables[8] = new cmi_object("cmi.core.lesson_status", "rw", [
  "passed",
  "completed",
  "failed",
  "incomplete",
  "browsed",
  "not attempted",
  "error text 986"
]);
CMI_CONFIG.cmi_variables[9] = new cmi_object("cmi.core.exit", "w", [
  "time-out",
  "suspend",
  "logout",
  ""
]);
CMI_CONFIG.cmi_variables[10] = new cmi_object("cmi.core.session_time", "rw");
// core score variables
CMI_CONFIG.cmi_variables[11] = new cmi_object("cmi.core.score._children", "r");
CMI_CONFIG.cmi_variables[12] = new cmi_object("cmi.core.score.raw", "rw");
CMI_CONFIG.cmi_variables[13] = new cmi_object("cmi.core.score.max", "rw");
CMI_CONFIG.cmi_variables[14] = new cmi_object("cmi.core.score.min", "rw");
// suspend data
CMI_CONFIG.cmi_variables[15] = new cmi_object("cmi.suspend_data", "rw");
// launch data
CMI_CONFIG.cmi_variables[16] = new cmi_object("cmi.launch_data", "r");
// comments
CMI_CONFIG.cmi_variables[17] = new cmi_object("cmi.comments", "rw");
CMI_CONFIG.cmi_variables[18] = new cmi_object("cmi.comments_from_lms", "r");
// student data
CMI_CONFIG.cmi_variables[19] = new cmi_object(
  "cmi.student_data._children",
  "r"
);
CMI_CONFIG.cmi_variables[20] = new cmi_object(
  "cmi.student_data.mastery_score",
  "r"
);
CMI_CONFIG.cmi_variables[21] = new cmi_object(
  "cmi.student_data.max_time_allowed",
  "r"
);
CMI_CONFIG.cmi_variables[22] = new cmi_object(
  "cmi.student_data.time_limit_action",
  "r"
);
// student preference
CMI_CONFIG.cmi_variables[23] = new cmi_object(
  "cmi.student_preference._children",
  "r"
);
CMI_CONFIG.cmi_variables[24] = new cmi_object(
  "cmi.student_preference.audio",
  "rw"
);
CMI_CONFIG.cmi_variables[25] = new cmi_object(
  "cmi.student_preference.language",
  "rw"
);
CMI_CONFIG.cmi_variables[26] = new cmi_object(
  "cmi.student_preference.speed",
  "rw"
);
CMI_CONFIG.cmi_variables[27] = new cmi_object(
  "cmi.student_preference.text",
  "rw",
  [-1, 0, 1]
);

/*******************************************************************************
 **
 ** Object: API
 **
 ** Description:
 ** Cookie Scorm 1.2 API
 **
 *******************************************************************************/
var API = {
  strCurrentModule: "", // PS: This variable added so multiple SCOs can be launched from one page

  LMSCloseOnFinish: true,
  LMSInitialized: false,
  LMSInitialize: function(nullString) {
    // check if already initialized
    if (this.LMSInitialized == false) {
      // set as initialized
      this.LMSInitialized = true;
    }
    window.API = this;
    document.dispatchEvent(new Event("LMSInitialized", this));
    return "true";
  },
  LMSCommit: function(nullString) {
    return "true";
  },
  LMSFinish: function(nullString) {
    // set variable
    this.LMSInitialized = false;
    // close popup
    if (win) {
      if (API.LMSCloseOnFinish == true) {
        win.close();
      }
    }
    // return value
    return "true";
  },
  LMSGetValue: function(inName) {
    // check if value is valid
    var success = CMI_CONFIG.findVariable(inName);
    if (success == null) {
      return "";
    }

    // check if it's readable variable
    var success = CMI_CONFIG.isReadable(inName);
    if (success == false) {
      return "";
    }

    // return the cookie value
    inName = this.strCurrentModule + "___" + inName;
    if (MY_COOKIES.getCookie(inName)) {
      return MY_COOKIES.getCookie(inName);
    } else {
      return "";
    }
  },
  LMSSetValue: function(inName, inValue) {
    // check if variable is valid
    var success = CMI_CONFIG.findVariable(inName);
    if (success == null) {
      return false;
    }

    // check if it's writable variable
    var success = CMI_CONFIG.isReadable(inName, true);
    if (success == false) {
      return false;
    }

    // check if it's vocab is valid
    var success = CMI_CONFIG.checkVocabulary(inName, inValue);
    if (success == false) {
      return false;
    }

    // prepend the module to cmi name
    inName = this.strCurrentModule + "___" + inName;
    // set the cookie
    MY_COOKIES.setCookie(inName, inValue);
    return true;
  },
  LMSGetLastError: function() {
    return 0;
  },
  LMSGetErrorString: function(errorCode) {
    return "";
  },
  LMSGetDiagnostic: function(errorCode) {
    return "";
  }
}; // end of api
/*******************************************************************************
 **
 ** Object: MY_COOKIES
 **
 ** Description:
 ** Browser cookie library
 **
 *******************************************************************************/

var MY_COOKIES = {
  cookieTimeout: 60, // in days
  getCookie: function(name, d) {
    if (!d) var d = null;
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
      var j = i + alen;
      if (document.cookie.substring(i, j) == arg) {
        var endstr = document.cookie.indexOf(";", j);
        if (endstr == -1) endstr = document.cookie.length;
        return unescape(document.cookie.substring(j, endstr));
      }
      i = document.cookie.indexOf(" ", i) + 1;
      if (i == 0) break;
    }
    return d;
  },

  setCookie: function(name, value) {
    expires = this.cookieTimeout;
    if (expires) {
      var exp = new Date();
      exp.setTime(exp.getTime() + expires * 60 * 60 * 1000);
      expires = exp;
    }
    document.cookie =
      name +
      "=" +
      escape(value) +
      (expires == null ? "" : "; expires=" + expires.toGMTString());
  },

  deleteCookie: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1000);
    var cval = this.getCookie(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
  },

  debug: function() {
    alert("COOKE DEBUG:\n\n" + document.cookie);
  },

  deleteAllCookies: function() {
    // get the list of cookie names
    var start_pointer = 0;
    var end_pointer = -1;
    var cookie_names = new Array();
    for (var n = 0; n < document.cookie.length; n++) {
      // look for starter marker
      if (document.cookie.substr(n, 1) == ";") {
        n++;
        start_pointer = n;
      }
      // look for end marker
      if (start_pointer != -1 && document.cookie.substr(n, 1) == "=") {
        end_pointer = n;
      }
      // if both markers are set, add to the cookie array
      if (start_pointer != -1 && end_pointer != -1) {
        cookie_names[cookie_names.length] = document.cookie.substring(
          start_pointer,
          end_pointer
        );
        start_pointer = -1;
        end_pointer = -1;
      }
    }
    for (var n = 0; n < cookie_names.length; n++) {
      //alert( "cookie = " + cookie_names[n] );
      this.deleteCookie(cookie_names[n]);
    }
  },

  find: function(id, frame, d) {
    var img = null;
    if (!d) {
      if (frame && top[frame]) d = top[frame].document;
      else d = document;
      if (!d) return null;
    }
    if (d.layers) {
      img = d.layers[id];
      if (!img) img = d.links[id];
      if (!img) img = d.images[id];
    } else if (d.getElementById) img = d.getElementById(id);
    for (var i = 0; !img && d.layers && i < d.layers.length; i++) {
      img = this.find(id, null, d.layers[i].document);
    }
    return img;
  }
}; // end of MY_COOKIES Object

// HELP - phillipe.vieira@digitalpages.com.br
// Funcionamento web
function receiveMessage(event){
 console.log("DP SCORM - COMUNICAÇÃO ESTABELECIDA");
 if (event.data.indexOf("course_id") != -1) {
  if (event.data.source === undefined) {
    var injected = JSON.parse(event.data);	  
	  clearInterval(intervalSCORM);
	  APISCORM = window.API;
	  APISCORM.strCurrentModule = "";
	  MY_COOKIES.deleteAllCookies();
	  APISCORM.strCurrentModule = "course_"+injected.course_id+"_topic_"+injected.topic_id+"_userId_"+injected.user_id;
	  MY_COOKIES.deleteAllCookies();
	  APISCORM.LMSInitialize();
	  if(!injected.status){	  		  
		  APISCORM.LMSSetValue("cmi.suspend_data",injected.suspend_data)
		  APISCORM.LMSSetValue("cmi.core.student_id",injected.user_id);
		  APISCORM.LMSSetValue("cmi.core.lesson_location",injected.session_location);
		  APISCORM.LMSSetValue("cmi.core.session_time",injected.session_time);
		  APISCORM.LMSCommit();
	  }
	  var intervalSCORM = intervalSCORM = setInterval(function(){
		  var scorm_variables = new Object;
		  scorm_variables.topic_id = injected.topic_id;
		  scorm_variables.student_id = APISCORM.LMSGetValue("cmi.core.student_id");
		  scorm_variables.student_name = APISCORM.LMSGetValue("cmi.core.student_name");
		  scorm_variables.total_time = APISCORM.LMSGetValue("cmi.core.total_time");
		  scorm_variables.lesson_location = APISCORM.LMSGetValue("cmi.core.lesson_location");
		  scorm_variables.lesson_status = APISCORM.LMSGetValue("cmi.core.lesson_status");
		  scorm_variables.session_time = APISCORM.LMSGetValue("cmi.core.session_time");
		  scorm_variables.score_raw = APISCORM.LMSGetValue("cmi.core.score.raw");
		  scorm_variables.score_max = APISCORM.LMSGetValue("cmi.core.score.max");
		  scorm_variables.score_min = APISCORM.LMSGetValue("cmi.core.score.min");
		  scorm_variables.suspend_data = APISCORM.LMSGetValue("cmi.suspend_data");
		  //Send message back
		  event.source.postMessage(JSON.stringify(scorm_variables),event.origin);
	  }, 1000);
  }
 }
}

window.addEventListener("message",this.receiveMessage);