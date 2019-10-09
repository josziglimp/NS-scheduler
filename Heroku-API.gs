HEROKU_ADDRESS = 'https://api.heroku.com/apps';

function getApps() {
  // Get all apps of Bearer, including their IDs and names. Either ID or name can be used later on.
  var options = {
    'method' : 'get',
    'headers' : {
      'Accept': 'application/vnd.heroku+json; version=3',
      'Authorization': 'Bearer '+ HEROKU_API_KEY
    },
  };
  var response = UrlFetchApp.fetch(HEROKU_ADDRESS, options);  
  Logger.log(response.getContentText());
  return response.getContentText();
}

function getConfigVars() {
  // Get all config-vars of App
  var options = {
    'method' : 'get',
    'headers' : {
      'Accept': 'application/vnd.heroku+json; version=3',
      'Authorization': 'Bearer '+ HEROKU_API_KEY
    },
  };
  var response = UrlFetchApp.fetch(HEROKU_ADDRESS+'/' + APP_ID +'/config-vars', options);  
  // Logger.log(response.getContentText());
  return response.getContentText();
}

function updateConfigVars(newConfigVars) {
  // Set/Update some config-vars of App
  // returns all config-vars
  var options = {
    'method' : 'patch',
    'headers' : {
      'Accept': 'application/vnd.heroku+json; version=3',
      'Authorization': 'Bearer '+ HEROKU_API_KEY,
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(newConfigVars)
  };
  var response = UrlFetchApp.fetch(HEROKU_ADDRESS+'/' + APP_ID +'/config-vars', options);  
  // Logger.log(response.getContentText());
  return response.getContentText();  
}

function delConfigVar(ConfigVarName) {
  // Delete a config-var of App (set to null)
  // returns all remaining config-vars
  var ConfigVar2del = {};
  ConfigVar2del[ConfigVarName] = null;
  var options = {
    'method' : 'patch',
    'headers' : {
      'Accept': 'application/vnd.heroku+json; version=3',
      'Authorization': 'Bearer '+ HEROKU_API_KEY,
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(ConfigVar2del)
  };
  var response = UrlFetchApp.fetch(HEROKU_ADDRESS+'/' + APP_ID +'/config-vars', options);  
  // Logger.log(response.getContentText());
  return response.getContentText();
}

/*
function del() {
  delConfigVar('name2');
}

function updateAPI() {
  var newConfigVars = {
    'BG_TARGET_TOP': 162,
    // 'test': 770
  };
  updateConfigVars(newConfigVars);
}
*/