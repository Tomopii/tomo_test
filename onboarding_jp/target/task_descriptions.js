(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
hasMouse = false; //!('ontouchstart' in window);

taskDescriptions = {
  descriptions: [
  // hasMouse ?
  //     {
  //       key: 'Drag', label: 'Drag this data file into CODAP', url: './resources/DragCSV.mp4',
  //       operation: 'dataContextCountChanged',
  //       feedback: <div>
  //         <p>You've got data! It appears in a <em>case table</em>.</p>
  //         <p>Each row in the table represents a <em>case</em> and each column
  //           represents an <em>attribute</em>.</p>
  //         <p>This data set contains data about mammals. Each case represents a different
  //           mammal. The attributes provide information about lifespan, height, and so on.</p>
  //       </div>
  //     } :
  //     {
  //       key: 'MakeTable', label: 'Make a table showing Mammals data', url: './resources/MakeTable.mp4',
  //       feedback: <div>
  //         <p>You made a <em>case table</em> showing the pre-loaded data.</p>
  //         <p>Each row in the table represents a <em>case</em> and each column
  //           represents an <em>attribute</em>.</p>
  //         <p>This data set contains data about mammals. Each case represents a different
  //           mammal. The attributes provide information about lifespan, height, and so on.</p>
  //       </div>
  //     },
  {
    key: 'MakeGraph', label: 'グラフを作成する。', url: './resources/MakeGraph.mp4',
    feedback: React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'とても素敵なグラフですね。各ポイントは、あなたのデータセットの中の1つのケースを表しています。'
      ),
      React.createElement(
        'p',
        null,
        'まだ配置を決めていないため、現時点ではランダムに点が散らばっています。'
      )
    ),
    alt_feedback: React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'とても素敵なグラフですね。'
      ),
      React.createElement(
        'p',
        null,
        'まだデータをドラッグしてないので、ポイントがありません。'
      )
    )
  }, {
    key: 'MoveComponent', label: '表やグラフを移動する', url: './resources/MoveGraph.mp4',
    operation: 'move', type: ['DG.GraphView', 'DG.TableView'],
    feedback: React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        ' ',
        React.createElement(
          'em',
          null,
          ''
        ),
        ' そのコンポーネントのタイトルバーをクリック＆ドラッグしてください。'
      ),
      React.createElement(
        'p',
        null,
        '',
        React.createElement(
          'em',
          null,
          ''
        ),
        ' エッジや下部の角をドラッグすることで、大きさを変えることができます。'
      )
    )
  },
  /*
      {
        key: 'selectCases', label: 'Select some cases by …', url: 'movie url',
        operation: 'selectCases', type: '',
        feedback: <div>
          <p>You selected some cases!</p>
        </div>
      },
  */

  {
    key: 'AssignAttribute', label: 'グラフの軸に属性をドラッグする', url: './resources/DragAttribute.mp4',
    feedback: React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'ケーステーブルからグラフ軸に属性をドラッグしました。'
      ),
      React.createElement(
        'p',
        null,
        'これで、ポイントはその属性値に従って軸に沿って配置されたことになります。。'
      ),
      React.createElement(
        'p',
        null,
        'この属性を他の属性に置き換えたり、属性を他のグラフ軸にドラッグして散布図にすることができます。'
      )
    )
  }, {
    key: 'SecondAttribute', label: 'グラフの軸に第2属性をドラッグする', url: './resources/Drag2ndAttribute.mp4',
    feedback: React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'よくできました！グラフに2つ目の属性をドラッグしました。'
      ),
      React.createElement(
        'p',
        null,
        '',
        React.createElement(
          'em',
          null,
          ''
        ),
        ' 1つのグラフに2つの属性を表示することができました。'
      ),
      React.createElement(
        'p',
        null,
        'どちらかの属性を別の属性に置き換えたり、グラフの真ん中に属性をドラッグしてポイントの凡例を作ったりすることができます。'
      )
    )
  }],
  getFeedbackFor: function (iKey, iUseAltFeedback, iAllAccomplished) {
    let tDesc = this.descriptions.find(function (iDesc) {
      return iKey === iDesc.key;
    });
    let tFeedback = iUseAltFeedback ? tDesc.alt_feedback : tDesc.feedback;
    if (iAllAccomplished) {
      tFeedback = React.createElement(
        'div',
        null,
        tFeedback,
        allAccomplishedFeedback
      );
    }
    return tFeedback;
  },
  taskExists: function (iKey) {
    return this.descriptions.find(function (iDesc) {
      return iKey === iDesc.key;
    });
  }
};

allAccomplishedFeedback = React.createElement(
  'div',
  null,
  React.createElement(
    'p',
    null,
    'Congratulations! You\'ve done the following:'
  ),
  React.createElement(
    'ul',
    null,
    React.createElement(
      'li',
      null,
      'Dragged data into CODAP'
    ),
    React.createElement(
      'li',
      null,
      'Made a graph'
    ),
    React.createElement(
      'li',
      null,
      'Moved a component'
    ),
    React.createElement(
      'li',
      null,
      'Plotted an attribute on a graph axis'
    ),
    React.createElement(
      'li',
      null,
      'Made a graph show values for two attributes'
    )
  ),
  React.createElement(
    'p',
    null,
    'You can do a ',
    React.createElement(
      'em',
      null,
      'lot'
    ),
    ' with just those five skills!'
  ),
  React.createElement(
    'p',
    null,
    'For more information about how to work with CODAP, visit the ',
    React.createElement(
      'a',
      { href: 'https://codap.concord.org/help/', target: '_blank' },
      'CODAP Help'
    ),
    ' page. '
  ),
  React.createElement(
    'button',
    { onClick: this.startOver },
    'Start Over'
  )
);

infoFeedback = React.createElement(
  'div',
  null,
  React.createElement(
    'p',
    null,
    'This onboarding plugin for CODAP was created to help new CODAP users get started using CODAP. It lives in CODAP as an iFrame. Certain user actions cause CODAP to notify the plugin. The plugin responds by providing feedback to the user.'
  ),
  React.createElement(
    'p',
    null,
    'The open source code is at',
    React.createElement('br', null),
    React.createElement(
      'a',
      { href: 'https://github.com/concord-consortium/codap-data-interactives/tree/master/onboarding',
        target: '_blank' },
      'CODAP\'s data interactive GitHub repository'
    ),
    '. '
  ),
  React.createElement(
    'p',
    null,
    'This plugin makes use of the CODAP data interactive plugin API whose documentation is at',
    React.createElement('br', null),
    React.createElement(
      'a',
      { href: 'https://github.com/concord-consortium/codap/wiki/CODAP-Data-Interactive-Plugin-API',
        target: '_blank' },
      'CODAP Data Interactive API'
    ),
    '.'
  )
);

},{}]},{},[1]);
