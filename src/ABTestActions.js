const alt = require('dispatchers/alt');

class ABTestActions {
  constructor() {
    this.generateActions(
      'changeVariant',
      'setVariant'
    );
  }

  /**
   * Optimally, these action makes a call out to whatever service or endpoint
   * we use for recording A/B test data. Note that this is yet to be implemented.
   */

  /**
   * Triggered when an experiment is displayed to a user.
   */
  recordExperimentDisplay(data) {
    console.log('Display recorded', data);
  }

  /**
   * Triggered when a user action, definted as a 'win', is executed
   */
  recordExperimentWin(experimentName, data) {
    console.log('Win recorded', data);
  }
}

module.exports = alt.createActions(ABTestActions);
