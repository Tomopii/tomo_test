var data;
var keychg1 = {'DataSource':'データ名称','Year' :'調査年','Prefecture':'都道府県符号','City':'政令指定市符号','Urban':'市部符号','Gender':'性別符号','Age':'年齢符号','WorkStatus':'就業状態符号','WorkEmploy':'雇用者符号','WorkRegular':'正規就業者符号','WorkIndustry':'産業符号','NoworkWish':'就業希望符号','NoworkApply':'求職符号','NoworkAge':'非就業者年齢符号','NoworkMarriage':'配偶関係符号','T_Prefecture' :'都道府県','T_City' :'政令指定市','T_Urban' :'市部','T_Gender' :'性別','T_Age' :'年齢','T_WorkStatus' :'就業状態','T_WorkEmploy' :'雇用者','T_WorkRegular' :'正規就業者','T_WorkIndustry' :'産業','T_NoworkWish' :'就業希望','T_NoworkApply' :'求職','T_NoworkAge' :'非就業者年齢','T_NoworkMarriage' :'配偶関係','Weight':'集計用乗率'};
var keychg2 = {'T_San123':'産業','T_Syokugyo':'職業（産業）','T_KiKibo':'企業規模（産業）','T_Age_10':'年齢階級','Weight':'集計用乗率','Y_Income':'年間収入','L_Expenditure':'消費支出','Food':'食料','Housing':'住居','LFW':'光熱・水道','Furniture':'家具・家事用品','Clothes':'被服及び履物','Health':'保健医療','Transport':'交通・通信','Education':'教育','Recreation':'教養娯楽','OL_Expenditure':'その他の消費支出'};
var keychg3 = {'3City':'３大都市圏か否か','T_SeJinin':'世帯人員','T_SyuJinin':'就業人員','T_JuSyoyu':'住宅の所有関係','T_Syuhi':'就業・非就業の別','T_Age_5s':'年齢階級２','T_Age_65':'年齢階級１','Weight':'集計用乗率','Y_Income':'年間収入','L_Expenditure':'消費支出','Food':'食料','Housing':'住居','LFW':'光熱・水道','Furniture':'家具・家事用品','Clothes':'被服及び履物','Health':'保健医療','Transport':'交通・通信','Education':'教育','Recreation':'教養娯楽','OL_Expenditure':'その他の消費支出'};
var chg_no2 = {'T_San123':1,'T_Syokugyo':2,'T_KiKibo':3,'T_Age_10':4};
var chg_no3 = {'3City':1,'T_SeJinin':2,'T_SyuJinin':3,'T_JuSyoyu':4,'T_Syuhi':5,'T_Age_5s':6,'T_Age_65':7};
var chg_type = 1;
var chg2 = [];
chg2[1] = ["","第１次産業（勤め先）","第２次産業（勤め先）","第３次産業（勤め先）"];
chg2[2] = ["第１次産業","","職員（第２次、第３次産業）","その他（第２次、第３次産業）"];
chg2[3] = ["第１次産業","１～29人（第２次、第３次産業）","30～499人（第２次、第３次産業）","500人以上、官公（第２次、第３次産業）"];
chg2[4] = ["","30歳未満","30～39歳","40～49歳","50～59歳","60歳以上"];
var chg3 = [];
chg3[1] = ["３大都市圏以外","３大都市圏"];
chg3[2] = ["","","２人","３人以上"];
chg3[3] = ["","１人以下","２人以上"]
chg3[4] = ["","持ち家","借家・借間"];
chg3[5] = ["","就業","非就業"];
chg3[6] = ["就業者以外","（就業者）30歳未満","（就業者）30～34歳","（就業者）35～39歳","（就業者）40～44歳","（就業者）45～49歳","（就業者）50～54歳","（就業者）55～59歳","（就業者）60～64歳","（就業者）65歳以上"];
chg3[7] = ["","65歳未満","65歳以上"];
var keychg = keychg1;
var checkDt = '#check input:checked';
var chousaname = '就業構造基本調査';

var kDataSetName = '調査テーブル';
// The following is the initial structure of the data set that the plugin will
// refer to. It will look for it at startup and create it if not found.
var kDataSetTemplate = {
    name: "{name}",
    title: "{name}",
    collections: [  // There is just one collection
      {
        name: '調査テーブル',
        attrs: [
        ],
      }
    ]
  };

$(function () {
	init();
	$("#select_chousa1").prop("disabled", true);
	$("#select_chousa2").prop("disabled", false);
	$("#select_chousa3").prop("disabled", false);
});

function select_chousa1() {
	chg_type = 1;
	keychg = keychg1;
	chousaname = '就業構造基本調査';
	checkDt = '#check input:checked';
	$("#chousa1").show();
	$("#chousa2").hide();
	$("#chousa3").hide();
	$("#select_chousa1").prop("disabled", true);
	$("#select_chousa2").prop("disabled", false);
	$("#select_chousa3").prop("disabled", false);
}

function select_chousa2() {
	chg_type = 2;
	keychg = keychg2;
	chousaname = '全国消費実態調査（勤労者世帯）';
	checkDt = '#check2 input:checked';
	$("#chousa1").hide();
	$("#chousa2").show();
	$("#chousa3").hide();
	$("#select_chousa1").prop("disabled", false);
	$("#select_chousa2").prop("disabled", true);
	$("#select_chousa3").prop("disabled", false);
}

function select_chousa3() {
	chg_type = 3;
	keychg = keychg3;
	chousaname = '平成21年全国消費実態調査';
	checkDt = '#check3 input:checked';
	$("#chousa1").hide();
	$("#chousa2").hide();
	$("#chousa3").show();
	$("#select_chousa1").prop("disabled", false);
	$("#select_chousa2").prop("disabled", false);
	$("#select_chousa3").prop("disabled", true);
}

function set_kDataSetTemplate_attrs() {
	kDataSetTemplate.collections[0].attrs = [];
	$(checkDt).each(function() {
            var r = $(this).val();
            kDataSetTemplate.collections[0].attrs.push({name:keychg[r]});
        });
}

function data_input() {
	if(Number($("#limit").val()) > 2000) $("#limit").val(2000);
	get_musakui($("#dataset").val(),$("#pref").val(),Number($("#limit").val()));
	$("#submitButton1_2").prop("disabled", true);
}
function data_input2() {
	if(Number($("#limit").val()) > 2000) $("#limit").val(2000);
	get_musakui2(Number($("#limit2").val()));
	$("#submitButton2_2").prop("disabled", true);
}
function data_input3() {
	if(Number($("#limit").val()) > 2000) $("#limit").val(2000);
	get_musakui3(Number($("#limit3").val()));
	$("#submitButton3_2").prop("disabled", true);
}

function get_musakui(dataset,pref,limit) {
    var param = { "dataset":dataset,"pref":pref,"limit": limit};
    $.ajax({
        type: "GET",
        url: "https://stats-steam.net/musakui_db.php",
        data: param,
        crossDomain: true,
        dataType : "json",
        scriptCharset: 'utf-8'
    }).done(function(json){
        data = json.ret;
        processInput();
	$("#submitButton1_2").prop("disabled", false);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
	$("#submitButton1_2").prop("disabled", false);
	alert(errorThrown);
    });
}
function get_musakui2(limit) {
    var param = { "limit": limit};
    $.ajax({
        type: "GET",
        url: "https://stats-steam.net/zensho_k.php",
        data: param,
        crossDomain: true,
        dataType : "json",
        scriptCharset: 'utf-8'
    }).done(function(json){
        data = json.ret;
        processInput();
	$("#submitButton2_2").prop("disabled", false);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
	$("#submitButton2_2").prop("disabled", false);
        alert(errorThrown);
    });
}
function get_musakui3(limit) {
    var param = { "limit": limit};
    $.ajax({
        type: "GET",
        url: "https://stats-steam.net/zensho_z.php",
        data: param,
        crossDomain: true,
        dataType : "json",
        scriptCharset: 'utf-8'
    }).done(function(json){
	$("#submitButton3_2").prop("disabled", false);
        data = json.ret;
        processInput();
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
	$("#submitButton3_2").prop("disabled", false);
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
        dataContext : '調査テーブル',
        name : '調査テーブル',
	  title: '調査テーブル',
	  dimensions: {width: 1300, height: 400},
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
		var item = {};
		$(checkDt).each(function() {
		    var r = $(this).val();
		    item[keychg[r]] = data[i][r];
		    if(chg_type == 2) {
			if(chg_no2[r] > 0) {
				item[keychg[r]] = chg2[chg_no2[r]][Number(data[i][r])];
				//if(i == 1) console.log(r,data[i][r],chg2[chg_no2[r]][Number(data[i][r])]);
			} else if(r == "Y_Income") {
				item[keychg[r]] = Number(data[i][r])*1000;
				//console.log(r,data[i][r],Number(data[i][r])*1000);
			}
		    } else if(chg_type == 3) {
			if(chg_no3[r] > 0) {
				item[keychg[r]] = chg3[chg_no3[r]][Number(data[i][r])];
				//if(i == 1) console.log(r,data[i][r],chg3[chg_no3[r]][Number(data[i][r])]);
			} else if(r == "Y_Income") {
				item[keychg[r]] = Number(data[i][r])*1000;
				//console.log(r,data[i][r],Number(data[i][r])*1000);
			}
		    }
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
	  title: '無作為調査',
	  dimensions: {width: 550, height: 300},
	  version: '1.94'
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