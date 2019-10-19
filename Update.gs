// function that needs to be executed every 5 min
function UpdateCVs() { 
  var ss = SpreadsheetApp.openById(data_ss_id); // data_ss_id = id of spreadsheet that holds the schedule
  var sheets = ss.getSheets();
  var ConfigVars2Update = {}; // Key-Value pairs to update
  var dt;
  
  // process each sheet
  for (var i=0; i<sheets.length; i++) {
    dt = new DataTable(sheets[i]);
    if (dt.valid()) {
      // Logger.log("Sheet %s, named %s", i, sheets[i].getName());
      // Logger.log(dt.data);
      
      // add info to ConfigVars2Update
      dt.addPairs(ConfigVars2Update);
      // Check if there was bolus, in which case silence high alarms for x min (handled only in script or partially in sheet?)
    }
    else 
      Logger.log("Sheet No. %s (named %s) is skipped b/c it's not formatted as expected.", i, sheets[i].getName());
  }
  Logger.log("ConfigVars2Update: %s", ConfigVars2Update);

  // Check if update to ConfigVars necessary -- Could just update regardless, but that's not very elegant and qucikly fills up the version history of the Heroku app
  var CurrentConfigVars = getConfigVars();
  var toUpdate = false; // no update needed
  for (var k in ConfigVars2Update) {
    // Logger.log("k: .%s., Current: .%s., toUpdate: .%s.", k, CurrentConfigVars[k], ConfigVars2Update[k]);
    if (ConfigVars2Update[k] != CurrentConfigVars[k])
      toUpdate = true;
  }
  if (toUpdate)
    updateConfigVars(ConfigVars2Update)
    else Logger.log("No update needed.");  
  // Logger.log("CurrentConfigVars: %s", CurrentConfigVars);
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


// https://josziglimp.herokuapp.com/api/v1/treatments.json?find[eventType]=Bolus&count=1 

function testGetBolus() {
  var response = UrlFetchApp.fetch("https://josziglimp.herokuapp.com/api/v1/treatments.json?find[eventType]=Bolus&count=1");
  
  var bolus = JSON.parse(response.getContentText())[0];
  
  Logger.log(bolus); 
  
  Logger.log(bolus.created_at); 
  Logger.log(bolus.insulin); 
  
  
}