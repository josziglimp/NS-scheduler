// function that needs to be executed every 5 min
function UpdateCVs() { 
  var ss = SpreadsheetApp.openById(data_ss_id); // data_ss_id = id of spreadsheet that holds the schedule
  var sheets = ss.getSheets();
  var ConfigVars2Update = {}; // Key-Value pairs to update
  
  // process each sheet
  for (var i=0; i<sheets.length; i++) {
    if (valid(sheets[i])) {
      // add info to ConfigVars2Update
    }
    else 
      Logger.log("Sheet No. %s (named %s) is skipped b/c it's not formatted as expected.", i, sheets[i].getName());
  }
  // Update config vars
}

function valid(sheetToCheck) {
  // check if sheetToCheck if formatted as expected
}
