NOW_SHEET = 'Settings'; // sheet holding current date and time
NOW_CELL = 'B3';

CV_SHEET = 'Current Config Vars'; // sheet holding current Config Vars

NSS_HIGH_SNOOSE_MINS = "NSS_HIGH_SNOOSE_MINS"; // Config Var to hold number of mins to snoose high alarms for following a bolus
NSS_HIGH_SNOOSE_CVs = ["ALARM_HIGH", "ALARM_URGENT_HIGH"]; // the Config Vars to turn off when snoozing high alarms because of a recent bolus
NSS_HIGH_SNOOSE_STATUS = "NSS_HIGH_SNOOSE_STATUS"; // using this Config Var for status info - only used for debugging

// function that needs to be executed every 5 min
function UpdateCVs() { 
  GET_LAST_BOLUS = "https://" + APP_ID + ".herokuapp.com/api/v1/treatments.json?find[eventType]=Bolus&count=1";
  GET_LAST_SGV = "https://" + APP_ID + ".herokuapp.com/api/v1/entries/sgv.json?count=1"

  var ss = SpreadsheetApp.openById(data_ss_id); // data_ss_id: id of spreadsheet that holds the schedule
  
  forceRecalc(ss); // change current date and time in a cell to force recalculation of values
  
  var sheets = ss.getSheets();
  var ConfigVars2Update = {}; // Key-Value pairs to update
  var dt;
  
  // process each sheet
  for (var i=0; i<sheets.length; i++) {
    dt = new DataTable(sheets[i]);
    if (dt.valid()) {
      // console.info("Sheet %d, named %s", i, sheets[i].getName());
      // console.info(dt.data);
      
      // add info to ConfigVars2Update
      dt.addPairs(ConfigVars2Update);
    }
    else 
      console.info("Sheet No. %d (named %s) is skipped b/c it's not formatted as expected.", i, sheets[i].getName());
  }

  var CurrentConfigVars = getConfigVars();

  if (CurrentConfigVars.NSS_HIGH_SNOOSE_MINS) { // NSS_HIGH_SNOOSE_MINS Config Var is defined. CurrentConfigVars instead of ConfigVars2Update so that it works even if NSS_HIGH_SNOOSE_MINS is only set in Heroku and not in the sheet
    // the disadvantage is that a schedules chance in NSS_HIGH_SNOOSE_MINS is really effective at the execution following the update, but this doesn't seem to be a big deal

    // Check if there was bolus, in which case silence high alarms   
    var lastBolus = new Date(getNSdata(GET_LAST_BOLUS, "created_at"));
    var lastSGV = new Date(getNSdata(GET_LAST_SGV, "dateString")); // Could use current time, but that might raise time zone issues, so using this instead (if SGV is stale the appropriate alarm is different anyway)
    if ((lastSGV - lastBolus) <= (CurrentConfigVars.NSS_HIGH_SNOOSE_MINS * 60 * 1000)) { // in milliseconds
      for (var i=0; i<NSS_HIGH_SNOOSE_CVs.length; i++) {
        ConfigVars2Update[NSS_HIGH_SNOOSE_CVs[i]] = "off"; // overriding setting from sheet
      }
      ConfigVars2Update.NSS_HIGH_SNOOSE_STATUS = "Snoozing. bolus @ " + lastBolus; // Info only used for debugging
      console.info("Snoozing high @ " + lastSGV + ". bolus @ " + lastBolus);        
    }
    else {
      ConfigVars2Update.NSS_HIGH_SNOOSE_STATUS = "not snoozing"; // Info only used for debugging
      }
  }
      
  console.info("ConfigVars2Update: %s", ConfigVars2Update);
  
  // Check if update to ConfigVars necessary -- Could just update regardless, but that's not very elegant, might mess up the Heroku app and qucikly fills up the version history of the Heroku app
  var toUpdate = false; // no update needed
  for (var k in ConfigVars2Update) {
    // console.info("k: .%s., Current: .%s., toUpdate: .%s.", k, CurrentConfigVars[k], ConfigVars2Update[k]);
    if (ConfigVars2Update[k] != CurrentConfigVars[k])
      toUpdate = true;
  }
  if (toUpdate) {
    
    saveConfigVars(ss,    // to Sheet
                   updateConfigVars(ConfigVars2Update) // in Heroku
                  ); 
  }
  else console.info("No update needed.");  
  // console.info("CurrentConfigVars: %s", CurrentConfigVars);
}

var DataTable = function(sheet) {
  this.data = sheet.getRange(1, 1, 4, 10).getValues();
  this.valid = function() {
    if (this.data[0][0] != "Currently valid parameters")
      return false;
    if (this.data[2][0] != "temp override")
      return false;
    if (this.data[3][0] != "Config Var KEYs")
      return false;
    if (isNaN(this.data[0][1]))
      return false;
    if (this.data[3][3] != "Relevant line in the schedule")
      return false;
    
    return true;
  } 
  this.addPairs = function(pairs) {
    var noOfPairs = this.data[0][1];
    for (var j=4; j<4+noOfPairs; j++){
      /* loop through the pairs beginning in column E, numbered 4 */
      pairs[this.data[3][j]] = this.data[0][j];
    }
  } 
} 

function saveConfigVars(ss, newConfigVars) { // to Sheet 
  var CVarray = Object.keys(newConfigVars).map(function(key) { // Object to Array conversion from https://stackoverflow.com/questions/38824349/how-to-convert-an-object-to-an-array-of-key-value-pairs-in-javascript
    return [key, newConfigVars[key]];
  });
  ss.getSheetByName(CV_SHEET).getRange(1, 1, CVarray.length, 2).setValues(CVarray);
}

function forceRecalc(ss) {
  ss.getSheetByName(NOW_SHEET).getRange(NOW_CELL).setValue(Utilities.formatDate(new Date(), "CET", "M/d/yyyy HH:mm")); // CET - regulat time; WET - yeshiva time);
  Utilities.sleep(5000); // hopefully this will help make sure newest data is returned
}

function getNSdata(address, data) {
  var response = JSON.parse(UrlFetchApp.fetch(address).getContentText())[0];
  // console.info("response: %s", response);
  return response[data];
}