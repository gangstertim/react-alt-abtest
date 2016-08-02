const React = require('react');
const connectToStores = require('alt/utils/connectToStores');

const ABTestStore = require('./ABTestStore');
const ABTestActions = require('./ABTestActions');
const stylesheet = require('./ABTestDebugger.less');

const RadioGroup = require('components/fields/RadioGroup');

const ABTestDebugger = React.createClass({
  propTypes: {
    experiments: React.PropTypes.object,
    currentVariants: React.PropTypes.object
  },

  onVariantChange(e) {
    ABTestActions.changeVariant({
      experimentName: e.target.name,
      newVariant: e.target.value
    });
  },

  renderExperimentSection(key) {
    const { experiments, currentVariants } = this.props;
    const variants = experiments[key].variants;

    return (
      <div key={key} className={stylesheet.experimentSection}>
        <RadioGroup
          value={currentVariants[key]}
          onChange={this.onVariantChange}
          title={key}
          name={key}
          options={variants.map(variant => {
            return { label: variant, value: variant, key: variant};
          })}
        />
      </div>
    );
  },

  render() {
    const { experiments } = this.props;
    const inner = Object.keys(experiments).map(this.renderExperimentSection);

    return (
      <div className={stylesheet.container}>
        {inner}
      </div>
    );
  }
});

module.exports = connectToStores({
  getStores: () => [ABTestStore],
  getPropsFromStores: () => ABTestStore.getState()
}, ABTestDebugger);
