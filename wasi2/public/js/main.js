"use strict";

var Dropdown = React.createClass({displayName: "Dropdown",
  handleChange: function() {
    var data = {};
    data[this.props.ref_] = this.refs[this.props.ref_].getDOMNode().value;
    this.props.onUserInput(data);
  },
  
  render: function() {
    var options = [];
    for (var i=this.props.range[0]; i<=this.props.range[1]; i++) {
      options.push(React.createElement("option", {value: i}, i));
    }
    return (
      React.createElement("div", {className: "form-group"}, 
      React.createElement("label", {className: "col-xs-8 control-label"}, this.props.label), 
      React.createElement("div", {className: "col-xs-4"}, 
      React.createElement("select", {className: "form-control", ref: this.props.ref_, value: this.props.value, onChange: this.handleChange}, 
      options
      )
      )
      )
    );
  }
});

var ScoreForm = React.createClass({displayName: "ScoreForm",
  handleUserInput: function(data) {
    this.props.onUserInput(data);
  },
  
  render: function() {
    return (
      React.createElement("form", {className: "form-horizontal"}, 
      React.createElement("h4", null, "Test Age"), 
      React.createElement(Dropdown, {label: "Years", ref_: "years", range: [8, 12], value: this.props.data.years, onUserInput: this.handleUserInput}), 
      React.createElement(Dropdown, {label: "Months", ref_: "months", range: [0, 11], value: this.props.data.months, onUserInput: this.handleUserInput}), 
      React.createElement("h4", null, "Raw Scores"), 
      React.createElement(Dropdown, {label: "Vocabulary", ref_: "vocabScore", range: [0, 53], value: this.props.data.vocabScore, onUserInput: this.handleUserInput}), 
      React.createElement(Dropdown, {label: "Matrix reasoning", ref_: "matrixScore", range: [0, 30], value: this.props.data.matrixScore, onUserInput: this.handleUserInput})
      )
    );
  }
});

var ResultList = React.createClass({displayName: "ResultList",
  render: function() {
    return (
      React.createElement("dl", {className: "dl-horizontal"}, 
      React.createElement("dt", null, "Vocabulary"), 
      React.createElement("dd", null, this.props.data.vocabTScore), 
      React.createElement("dt", null, "Matrix reasoning"), 
      React.createElement("dd", null, this.props.data.matrixTScore), 
      React.createElement("dt", null, "Sum of T Scores"), 
      React.createElement("dd", null, this.props.data.sumTScores), 
      React.createElement("dt", null, "FSIQ-2"), 
      React.createElement("dd", null, this.props.data.fsiq2Score), 
      React.createElement("dt", null, "Percentile rank"), 
      React.createElement("dd", null, this.props.data.percentile), 
      React.createElement("dt", null, "Confidence interval"), 
      React.createElement("dd", null, this.props.data.conf95)
      )
    );
  }
});

var WASIComponent = React.createClass({displayName: "WASIComponent",
  getInitialState: function () {
    return this.props.data;
  },

  handleUserInput: function(data) {
    var newState = React.addons.update(this.state, {$merge: data});
    this.setState(data);
    this.setState({
      vocabTScore: 'Loading',
      matrixTScore: 'Loading',
      sumTScores: 'Loading',
      fsiq2Score: 'Loading',
      percentile: 'Loading',
      conf95: 'Loading'
    });
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: newState,
      success: function(data) {
	console.log(data);
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    
  },
  render: function() {
    return (
      React.createElement("div", null, 
      React.createElement(ScoreForm, {data: this.state, onUserInput: this.handleUserInput}), 
      React.createElement("h4", null, "T Scores and IQ Equivalents"), 
      React.createElement(ResultList, {data: this.state})
      )
    );
  }
});

var initialState = {
  years: 8,
  months: 0,
  vocabScore: 0,
  matrixScore: 0,
  vocabTScore: '20',
  matrixTScore: '22',
  sumTScores: '42',
  fsiq2Score: '51',
  percentile: '0.1',
  conf95: '47-62'
};

React.render(React.createElement(WASIComponent, {url: "/", data: initialState}), document.body);
