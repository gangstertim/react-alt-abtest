const alt = require('dispatchers/alt');
const StaticActions = require('actions/StaticActions');
const ABTestActions = require('../actions/ABTestActions');

const { getCookiedVariants, setVariant, setRandomVariant } = require('utils/ABTestUtils');

/**
 * This store is the record of all currently running experiments. As experiments
 * finish, they should be removed both from their components & this store.
 */
class ABTestStore {
  constructor() {
    this.bindListeners({
      onStaticBootstrap: StaticActions.BOOTSTRAP,
      onChangeVariant: ABTestActions.changeVariant,
      onSetVariant: ABTestActions.setVariant
    });

    this.exportPublicMethods({
      getData: this.getData
    });

    this.experiments = {
      interfaceDemo1: {
        variants: ['Click Me!', 'Make Me Depressed', 'click plzz'],
        weighting: [1, 1, 1],
        exclusionCallback: () => window.innerWidth < 768,
        extraData: {}
      },
      interfaceDemo2: {
        variants: ['#F00', '#0F0', '#00F'],
        weighting: [1, 1, 2],
        exclusionCallback: null,
        extraData: {}
      },
      interfaceDemo3: {
        variants: ['control', 'a', 'b'],
        weighting: [4, 1, 1],
        exclusionCallback: null,
        extraData: {}
      }
    };

    this.currentVariants = getCookiedVariants(this.experiments);
  }

  onStaticBootstrap({
    env,
    currentPlan,
    website = {},
    siteStatus = {},
    authenticatedAccount = {}
  }) {
    this.setState({
      commonData: {
        env,
        currentPlan,
        websiteId: website.id,
        siteStatus: siteStatus.value,
        country: authenticatedAccount.location.country,
      }
    });
  }

  /**
   * A helper method for developers so that they can preview & debug individual
   * variants. This should only be executed in response to the debugger; normal
   * use should never invoke this method
   *
   * @param  {String} experimentName
   * @param  {String} newVariant
   */
  onChangeVariant({ experimentName, newVariant }) {
    const updatedVariants = Object.assign({}, this.currentVariants, {
      [experimentName]: newVariant
    });

    setVariant(experimentName, newVariant);
    this.setState({ currentVariants: updatedVariants });
  }

  /**
   * Triggered in response to ABTestActions.setVariant. Sets a variant for a
   * user who has not yet ever seen this experiment. Saves the variant in the store
   * and also as a cookie on the user's machine
   *
   * @param  {String} experimentName [description]
   */
  onSetVariant(experimentName) {
    const { currentVariants, experiments } = this.getState();

    const updatedVariants = Object.assign({}, currentVariants, {
      [experimentName]: setRandomVariant(experimentName, experiments[experimentName])
    });

    this.setState({ currentVariants: updatedVariants });
  }

  /**
   * Collects all relevant experimental data for a given experiment
   */
  getData(experimentName, variant) {
    const { commonData, experiments } = this.getState();

    if (!experiments[experimentName]) {
      console.error(`Invalid experiment name '${experimentName}' provided to ABTestStore`);
    }

    return Object.assign({
      experimentName,
      variant,
      datetime: Date.now()
    }, commonData, experiments[experimentName]);
  }
}

module.exports = alt.createStore(ABTestStore, 'ABTestStore');
