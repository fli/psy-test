"use strict";

var Dropdown = React.createClass({
  handleChange: function() {
    var data = {};
    data[this.props.ref_] = this.refs[this.props.ref_].getDOMNode().value;
    this.props.onUserInput(data);
  },
  
  render: function() {
    var options = [];
    for (var i=this.props.range[0]; i<=this.props.range[1]; i++) {
      options.push(<option value={i}>{i}</option>);
    }
    return (
      <div className="form-group">
      <label className="col-xs-8 control-label">{this.props.label}</label>
      <div className="col-xs-4">
      <select className="form-control" ref={this.props.ref_} value={this.props.value} onChange={this.handleChange}>
      {options}
      </select>
      </div>
      </div>
    );
  }
});

var ScoreForm = React.createClass({
  handleUserInput: function(data) {
    this.props.onUserInput(data);
  },
  
  render: function() {
    return (
      <form className="form-horizontal">
      <h4>Test Age</h4>
      <Dropdown label="Years" ref_="years" range={[8, 12]} value={this.props.data.years} onUserInput={this.handleUserInput}/>
      <Dropdown label="Months" ref_="months" range={[0, 11]} value={this.props.data.months} onUserInput={this.handleUserInput}/>
      <h4>Raw Scores</h4>
      <Dropdown label="Vocabulary" ref_="vocabScore" range={[0, 53]} value={this.props.data.vocabScore} onUserInput={this.handleUserInput}/>
      <Dropdown label="Matrix reasoning" ref_="matrixScore" range={[0, 30]} value={this.props.data.matrixScore} onUserInput={this.handleUserInput}/>
      </form>
    );
  }
});

var ResultList = React.createClass({
  render: function() {
    return (
      <dl className="dl-horizontal">
      <dt>Vocabulary</dt>
      <dd>{this.props.data.vocabTScore}</dd>
      <dt>Matrix reasoning</dt>
      <dd>{this.props.data.matrixTScore}</dd>
      <dt>Sum of T Scores</dt>
      <dd>{this.props.data.sumTScores}</dd>
      <dt>FSIQ-2</dt>
      <dd>{this.props.data.fsiq2Score}</dd>
      <dt>Percentile rank</dt>
      <dd>{this.props.data.percentile}</dd>
      <dt>Confidence interval</dt>
      <dd>{this.props.data.conf95}</dd>
      </dl>
    );
  }
});

var WASIComponent = React.createClass({
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
      <div>
      <ScoreForm data={this.state} onUserInput={this.handleUserInput}/>
      <h4>T Scores and IQ Equivalents</h4>
      <ResultList data={this.state} />
      </div>
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

React.render(<WASIComponent url="/" data={initialState}/>, document.body);
