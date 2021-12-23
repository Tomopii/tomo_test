/**
 * Created by evangelineireland on 9/4/14.
 */

//DG = window.parent.DG;

var touhyou_n;
var sansei_n;
var hantai_n;

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
        name: "Performance Harness",
        dimensions: { width: 400, height: 250 },
        collections: [
          {
            name: "無作為",
            attrs: [
              { name: "シミュレーション回数", type: 'numeric', precision: 0 },
              { name: "投票数", type: 'numeric', precision: 0 },
              { name: "賛成数", type: 'numeric', precision: 0 },
              { name: "反対数", type: 'numeric', precision: 0 },
              { name: "サンプルサイズ", type: 'numeric', precision: 0 }
            ],
            childAttrName: "events",
            defaults: {
              xAttr: "シミュレーション回数",
              yAttr: "avgRate"
            }
          },
          {
            name: "シミュレーション結果",
            attrs: [
              { name: "実行回数", type: 'numeric', precision: 0, defaultMin: 0, defaultMax: 100 },
              { name: "randNum", type: 'numeric', precision: 2 },
              { name: "rate", type: 'numeric', precision: 2, defaultMin: 0, defaultMax: 60 },
              { name: "choice", type: 'nominal',
              colormap: { red: null, green: null }},
              { name: "signal", type: 'numeric', precision: 3, defaultMin: -1, defaultMax: 1 }
            ],
            defaults: {
              xAttr: "trial",
              yAttr: "rate"
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

  runTest: function () {
    var tNumTrials = Number(document.forms.form1.numTrials.value),
      tDelay = Number(document.forms.form1.delay.value),
      tProfile = document.forms.form1.profile.checked,
      ttouhyou_n = document.forms.form1.touhyou_n.value,
      tsansei_n = document.forms.form1.sansei_n.value,
      tSampleSize = document.forms.form1.sampleSize.value,
      tIndex = 0,
      tTime = Date.now(),
      this_ = this,
      result,
      openTestID;

    var updateTests = function () {
      this.codapPhone.call({
        action: 'updateCase',
        args: {
          collection: "Test",
          caseID: this.openTestID,
          values: [
            this.gameNum,
            touhyou_n,
            sansei_n,
            hantai_n,
            tSampleSize
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

        this.codapPhone.call({
          action: 'createCase',
          args: {
            collection: "シミュレーション結果",
            parent: this.openTestID,
            values: [
              ++this_.trialNum,
              Math.random(),
              tRate,
              tChoice,
              tSignal
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
            collection: "無作為",
            caseID: this.openTestID,
            values: [
              this_.gameNum,
              touhyou_n,
              sansei_n,
              hantai_n,
              tSampleSize
            ]
          }
        });
        this.trialNum = 0;
        var time = Date.now() - this_.startTime;
        this.openTestID = null;
        document.getElementById('time').innerHTML = time;
        document.getElementById('rate').innerHTML = Math.round(10000 * tNumTrials / time) / 10;
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
        collection: "無作為",
        values: [ ++this.gameNum ]
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

