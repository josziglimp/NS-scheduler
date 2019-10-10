// function that needs to be executed every 5 min
function UpdateCVs() { 
  var ss = SpreadsheetApp.openById(data_ss_id); // data_ss_id = id of spreadsheet that holds the schedule
  var sheets = ss.getSheets();
  var ConfigVars2Update = {}; // Key-Value pairs to update
  
  // process each sheet
  for (var i=0; i<sheets.length; i++) {
    if (valid(sheets[i])) {
      // add info to ConfigVars2Update
      
      // Check if there was bolus, in which case silence high alarms for x min (handled only in script or partially in sheet?)
    }
    else 
      Logger.log("Sheet No. %s (named %s) is skipped b/c it's not formatted as expected.", i, sheets[i].getName());
  }
  // Update config vars
}

function valid(sheetToCheck) {
  // check if sheetToCheck if formatted as expected
}



// https://josziglimp.herokuapp.com/api/v1/treatments.json?find[eventType]=Bolus&count=1 

function testGetBolus() {
  var response = UrlFetchApp.fetch("https://josziglimp.herokuapp.com/api/v1/treatments.json?find[eventType]=Bolus&count=1");

  var bolus = JSON.parse(response.getContentText())[0];

  Logger.log(bolus); 
  
  Logger.log(bolus.created_at); 
  Logger.log(bolus.insulin); 
  
  
}