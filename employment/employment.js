
var kDataSetName = 'employment',
    kAppName = "就業構造基本調査";
// The following is the initial structure of the data set that the plugin will
// refer to. It will look for it at startup and create it if not found.
var kDataSetTemplate = {
    name: "{name}",
    title: '就業構造基本調査データ',
    collections: [  // There is just one collection
      {
        name: 'Trials',
        attrs: [
        ],
      }
    ]
  };
  
function set_kDataSetTemplate_attrs() {
	kDataSetTemplate.collections[0].attrs.push({name: "Number of Successes"});
	kDataSetTemplate.collections[0].attrs.push({name: "Number of Successes2"});
	kDataSetTemplate.collections[0].attrs.push({name: "Number of Successes3"});
	kDataSetTemplate.collections[0].attrs.push({name: "Number of Successes4"});
}
  
/**
 * myState is a local copy of interactive state.
 *
 *  It is sent to CODAP on demand and restored from CODAP at initialization time.
 *
 *  @type {Object}
 */
var myState;

function tellUser(message, color) {
  color = color || 'red';
  var messageArea = document.getElementById('message-area');
  messageArea.innerHTML = '<span style="color:' + color + '">' + message + '</span>';
}

function warnNotEmbeddedInCODAP() {
  tellUser( 'This page is meant to run inside of <a href="http://codap.concord.org">CODAP</a>.' +
      ' E.g., like <a target="_blank" href="http://codap.concord.org/releases/latest?di='
      + window.location.href + '">this</a>.');
}

/**
 * Reads the form and returns the number input value.
 * @returns {number} Expects an integer.
 */
function getInput() {
  var tInput = document.getElementById('integerInput').value.trim();
  if(tInput !== '')
    tInput = Number(tInput);
  return tInput;
}

/**
 * Sends a request to CODAP for a named data context (data set)
 * @param name {string}
 * @return {Promise} of a DataContext definition.
 */
function requestDataContext(name) {
  return codapInterface.sendRequest({
    action:'get',
    resource: 'dataContext[' + name + ']'
  });
}

/**
 * Sends a request to CODAP to create a Data set.
 * @param name {String}
 * @param template {Object}
 * @return {Promise} Result indicating success or failure.
 */
function requestCreateDataSet(name, template){
  var dataSetDef = Object.assign({}, template);
  dataSetDef.name = name;
  return codapInterface.sendRequest({
    action: 'create',
    resource: 'dataContext',
    values: dataSetDef
  });
  
  //requestCreateCaseTable();
}

function requestDeleteDataContext(name){
  return codapInterface.sendRequest({
    action: 'delete',
    resource: 'dataContext[' + name + ']'
  })
}

function requestUpdateCollection(name, Cname,template){
  var dataSetDef = Object.assign({}, template);
  return codapInterface.sendRequest({
    action: 'update',
    resource: "dataContext["+name+"].collection["+Cname+"]",
    values: dataSetDef
  })
}

function requestCreateCaseTable() {
    const theMessage = {
      action : "create",
      resource : "component",
      values : {
        type : 'caseTable',
        dataContext : 'Trials',
        name : 'Trials',
        cannotClose : true
      }
    };
    return codapInterface.sendRequest(theMessage);
}

/**
 * Make a case table if there is not one already. We assume there is only one
 * case table in the CODAP document.
 *
 * @return {Promise}
 */
function guaranteeCaseTable() {
  return new Promise(function (resolve, reject) {
    codapInterface.sendRequest({
      action: 'get',
      resource: 'componentList'
    })
    .then (function (iResult) {
      if (iResult.success) {
        // look for a case table in the list of components.
        if (iResult.values && iResult.values.some(function (component) {
              return component.type === 'caseTable'
            })) {
          resolve(iResult);
        } else {
          codapInterface.sendRequest({action: 'create', resource: 'component', values: {
            type: 'caseTable',
            dataContext: kDataSetName
          }}).then(function (result) {
            resolve(result);
          });
        }
      } else {
        reject('api error');
      }
    })
  });
}

/**
 * Sends an array of 'items' to CODAP.
 * @param dataSetName
 * @param items
 * @return {Promise} of status of request.
 */
function sendItems(dataSetName, items) {
  return codapInterface.sendRequest({
    action: 'create',
    resource: 'dataContext[' + dataSetName + '].item',
    values: items
  });
}

/**
 * Generate a set of random numbers and send them to CODAP.
 * This is the function invoked from a button press.
 *
 */
function processInput () {
  // verify we are in CODAP
  if(codapInterface.getConnectionState() !== 'active') {
    // we assume the connection should have been made by the time a button is
    // pressed.
    warnNotEmbeddedInCODAP();
    return;
  }

  // if a sample number has not yet been initialized, do so now.
  if (myState.didProperlyInput === undefined || myState.didProperlyInput === null) {
    myState.didProperlyInput = false;
  }

  myState.didProperlyInput = true;

  var item = { "Number of Successes": 123 };
  sendItems(kDataSetName, [item]);

  requestCreateCaseTable();
}

function make_table() {
	requestDeleteDataContext(kDataSetName);
	set_kDataSetTemplate_attrs();
	requestCreateDataSet(kDataSetName, kDataSetTemplate);
	requestCreateCaseTable();
}

function disableInput() {
  document.getElementById('integerInput').disabled = true;
  document.getElementById('submitButton').disabled = true;
}

//
// Here we set up our relationship with CODAP
//
// Initialize the codapInterface: we tell it our name, dimensions, version...
function init() {
	codapInterface.init({
	  name: kDataSetName,
	  title: kAppName,
	  dimensions: {width: 700, height: 400},
	  version: '1.3'
	}).then(function (iResult) {
	  // get interactive state so we can save the sample set index.
	  myState = codapInterface.getInteractiveState();
	  // Determine if CODAP already has the Data Context we need.
	  return requestDataContext(kDataSetName);
	}).then(function (iResult) {
	  // if we did not find a data set, make one
	  if (iResult && !iResult.success) {
	    // If not not found, create it.
	    set_kDataSetTemplate_attrs();
	    return requestCreateDataSet(kDataSetName, kDataSetTemplate);
	  } else {
	    // else we are fine as we are, so return a resolved promise.
	    return Promise.resolve(iResult);
	  }
	}).catch(function (msg) {
	  // handle errors
	  console.log(msg);
	});
}

init();
