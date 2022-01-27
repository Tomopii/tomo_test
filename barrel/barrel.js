var data;
var keychg = { 'batting_id':'打球ID', 'speed':'打球速度', 'angle':'打球角度', 'result':'打席結果'};

var kDataSetName = 'バレル調査テーブル';
// The following is the initial structure of the data set that the plugin will
// refer to. It will look for it at startup and create it if not found.
var kDataSetTemplate = {
    name: "{name}",
    title: 'プロ野球バレル調査データ',
    collections: [  // There is just one collection
      {
        name: 'バレル調査テーブル',
        attrs: [
        ],
      }
    ]
  };

$(function () {
    init();
});

function set_kDataSetTemplate_attrs() {
	kDataSetTemplate.collections[0].attrs = [];
	for( key in keychg ) {
		kDataSetTemplate.collections[0].attrs.push({name:keychg[key]});
	}
}

function data_input() {
	if(Number($("#limit").val()) > 2000) $("#limit").val(2000);
	get_musakui($("#result").val(),Number($("#limit").val()));
	$("#submitButton").prop("disabled", true);
}

function get_musakui(result,limit) {
    var param = { "result":result,"limit": limit};
    $.ajax({
        type: "GET",
        url: "https://stats-steam.net/barrel.php",
        data: param,
        crossDomain: true,
        dataType : "json",
        scriptCharset: 'utf-8'
    }).done(function(json){
        data = json.ret;
        processInput();
	$("#submitButton").prop("disabled", false);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
	$("#submitButton").prop("disabled", false);
        alert(errorThrown);
    });
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
        dataContext : 'バレル調査テーブル',
        name : 'バレル調査テーブル',
	  dimensions: {width: 500, height: 300},
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
	var items = [];
	for(var i = 0; i < data.length; i++) {
		 if(i == 0) {
			var keyList = Object.keys(data[i]);
			keyList.pop();		//最後のidを削除
		}
		var item = {};
		keyList.forEach(function(key) {
		    item[keychg[key]] = data[i][key];
		})
		items.push(item);
	}
	sendItems(kDataSetName,items);
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
	  title: 'プロ野球バレル調査データ',
	  dimensions: {width: 400, height: 200},
	  version: '1.6'
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
