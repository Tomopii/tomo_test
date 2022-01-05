/**
 * Created by evangelineireland on 9/4/14.
 */

//DG = window.parent.DG;

var PerformanceHarness = {

  codapPhone: null,

  trialNum: 0,
  gameNum: 0,
  startTime: null,


  initialize: function () {

    //Invoke the Javascript interface

    this.codapPhone = new iframePhone.IframePhoneRpcEndpoint(
      function (iCmd, iCallback) { iCallback(); }, "codap-game", window.parent);

    this.codapPhone.call({
      action: 'initGame',
      args: {
        name: "無作為抽出シュミレーション",
        dimensions: { width: 500, height: 250 },
        collections: [
          {
            name: "抽出元",
            attrs: [
              { name: "シミュレーション回数", type: 'numeric', precision: 0 },
              { name: "投票数", type: 'numeric', precision: 0 },
              { name: "賛成数", type: 'numeric', precision: 0 },
              { name: "反対数", type: 'numeric', precision: 0 }
            ],
            childAttrName: "events",
            defaults: {
              xAttr: "シミュレーション回数",
              yAttr: "賛成数"
            }
          },
          {
            name: "サンプリング結果",
            attrs: [
              { name: "実行回数", type: 'numeric', precision: 0, defaultMin: 0, defaultMax: 100 },
              { name: "サンプルサイズ", type: 'numeric', precision: 0 },
              { name: "賛成数", type: 'numeric', precision: 0 },
              { name: "反対数", type: 'numeric', precision: 0 }
            ],
            defaults: {
              xAttr: "賛成数",
              yAttr: ""
            }
          }
        ]
      }
    }, function () {
      this.setupNewTest();
    }.bind(this));
  },

  setupNewTest: function () {
    console.log("In setupNewTest");
  },
 
  deleteAllCases: function () {
	this.codapPhone.call({
	    action: 'deleteCases',
	    args: {
	      collection: "抽出元",
	      caseIDs: [this.openTestID],
	    }
	  }, function () {
        console.log("deleteCases");
      });
  },
 
  runTest: function () {
    var tNumTrials = Number(document.forms.form1.numTrials.value),
      tDelay = 1,
      tProfile = 1,
      touhyou_n = Number(document.forms.form1.touhyou_n.value),
      sansei_n = Number(document.forms.form1.sansei_n.value),
      hantai_n = touhyou_n - sansei_n,
      tSampleSize = Number(document.forms.form1.sampleSize.value),
      tIndex = 0,
      tTime = Date.now(),
      this_ = this,
      result,
      openTestID;

    var updateTests = function () {
      this.codapPhone.call({
        action: 'updateCase',
        args: {
          collection: "抽出元",
          caseID: this.openTestID,
          values: [
            this.gameNum,
            touhyou_n,
            sansei_n,
            hantai_n
          ]
        }
      }, function () {
        console.log("Updating parent case");
      });
    }.bind(this);

    var addNextCase = function () {
      var tNow = Date.now(),
        tRate = 1000 / (tNow - tTime),
        tChoice = (Math.random() < 1 / 3) ? 'red' : 'green',
        tSignal = Math.sin(2 * Math.PI * (tNow - this_.startTime) / 2000 - (this_.gameNum / 10) * 2 * Math.PI);

      tTime = tNow;

      document.forms.form1.run.disabled = true;
      if (tIndex < tNumTrials) {
        // If a delay is specified, set the timer for the next call
        window.setTimeout(addNextCase, tDelay);
        S_sansei_n = 0;
        for(var i = 0; i < tSampleSize; i++) {
            if(Math.random() < sansei_n/(hantai_n + sansei_n)) S_sansei_n++;
        }
        S_hantai_n = tSampleSize - S_sansei_n;
        //console.log(this_.trialNum+"/"+S_sansei_n+"/"+S_hantai_n+"=="+Math.floor(Math.random()*(sansei_n/(hantai_n+ sansei_n)) * 100));
        this.codapPhone.call({
          action: 'createCase',
          args: {
            collection: "サンプリング結果",
            parent: this.openTestID,
            values: [
              ++this_.trialNum,
              tSampleSize,
              S_sansei_n,
              S_hantai_n
            ]
          }
        });
        tIndex++;
      }
      else {
        var tTotalTime = Date.now() - this_.startTime;

        updateTests;

        this.codapPhone.call({
          action: 'closeCase',
          args: {
            collection: "抽出元",
            caseID: this.openTestID,
            values: [
              this_.gameNum,
              touhyou_n,
              sansei_n,
              hantai_n
            ]
          }
        });
        this.trialNum = 0;
        var time = Date.now() - this_.startTime;
        this.openTestID = null;
        //document.getElementById('time').innerHTML = time;
        //document.getElementById('rate').innerHTML = Math.round(10000 * tNumTrials / time) / 10;
        if (tProfile)
          console.profileEnd();
        document.forms.form1.run.disabled = false;
      }
    }.bind(this);

    if (tProfile)
      console.profile("Creating Cases");
    this.startTime = Date.now();


    this.codapPhone.call({
      action: 'openCase',
      args: {
        collection: "抽出元",
        values: [ ++this.gameNum ],
        touhyou_n,
        sansei_n,
        hantai_n
      }
    }, function (result) {
      if (result.success) {
        this.openTestID = result.caseID;

        addNextCase();

      } else {
        console.log("PerformanceHarness: Error calling 'openCase'");
      }
    }.bind(this));


    // If a delay is specified, then we just call addNextCase() once, and the
    // internal timing mechanism will handle the additional calls.
    // If no delay is specified, then we loop here until we have enough cases.

  }
};


PerformanceHarness.initialize();

