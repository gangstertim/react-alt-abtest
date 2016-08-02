const connectToStores = require('alt/utils/connectToStores');

const ABTestStore = require('./stores/ABTestStore');
const ABTest = require('./ABTest');
const ABTestActions = require('./actions/ABTestActions');

module.exports = connectToStores({
  getStores(){
    return [ABTestStore];
  },

  getPropsFromStores({ experimentName }) {
    const { experiments, currentVariants } = ABTestStore.getState();
    const experiment = experiments[experimentName];

    if (experiment.exclusionCallback && experiment.exclusionCallback()) {
      return {
        isExcluded: true,
        variant: experiments[experimentName].variants[0]
      };
    }

    return {
      variant: currentVariants[experimentName],
      isExcluded: false
    };
  },

  componentWillConnect({ experimentName }) {
    const { currentVariants } = ABTestStore.getState();

    if (!currentVariants[experimentName]) {
      ABTestActions.setVariant(experimentName);
    }
  }
}, ABTest);
