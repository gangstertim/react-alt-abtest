const React = require('react');
const ABTestStore = require('./stores/ABTestStore');
const ABTestActions = require('./actions/ABTestActions');

const ABTest = React.createClass({
  getDefaultProps () {
    return {
      path: 'components',
      title: 'Components Panel'
    };
  },

  propTypes: {
    experimentName: React.PropTypes.string,
    variant: React.PropTypes.string,
    isExcluded: React.PropTypes.bool
  },

  componentDidMount() {
    const { experimentName, variant, isExcluded } = this.props;

    if (!isExcluded) {
      const data = ABTestStore.getData(experimentName, variant);
      ABTestActions.recordExperimentDisplay(data);
    }
  },

  handleWin() {
    const { experimentName, variant } = this.props;
    const data = ABTestStore.getData(experimentName, variant);

    ABTestActions.recordExperimentWin(data);
  },

  render() {
    const { children, variant, isExcluded } = this.props;

    const renderedChildren = React.Children.map(children, child => {
      return React.cloneElement(child, {
        variant: variant,
        onWin: isExcluded ? () => {} : this.handleWin
      });
    });

    return <span>{renderedChildren}</span>;
  }
});

module.exports = ABTest;