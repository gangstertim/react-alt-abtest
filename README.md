# A/B Testing
This little bundle of joy is an in-progress framework for writing A/B tests. It's pretty lightweight, and works like this:

1. Decide what you will test. A good A/B test should have a definitive, consistent, and concrete 'view' condition, and a definitive, consistend, and concrete 'win' condition. For example, you may wish to test how many times a button is clicked. The 'view' condition is that the button is rendered; the 'win' condition is that the button is 'clicked'.
2. Decide what variants you will test. For example, you may test the color, copy, or size of the button, or you may wish to try entirely different layouts.
3. Decide on a name for your test.
4. Define your experiment in the ABTestStore.
5. Wrap whatever component you are testing in an `<ABTest>` wrapper

That's it!

## ABTest.jsx
The ABTest wrapper component supplies two props to all of its children: `variant` and `onWin`. If the current user is excluded from the current test (due to an `exclusionCallback` defined in the ABTestStore, they will be passed the first variant and a no-op for the onWin function.

When ABTest is mounted, it calls `ABTestActions.recordExperimentDisplay` to signify that the experiment is viewed. The child components are responsible for calling `onWin` themselves.

## ABTestStore.js
There are a few things that you must include in every test:

- Variants. This is an array of values that represent the different variants that can be passed to the component being tested.
- Weighting. This array should have the same cardinality as the variants array. Each value in this array corresponds directly to a variant, and represents the frequency that that variant will be shown. For example, if the weighting array is [1, 2, 2], the first variant will be shown 1/5 times, the second 2/5 times, and the third 2/5 times.
- ExclusionCallback. This is an optional method that will be called at render. If it returns `true`, the current user will be excluded from the test (and always be shown the first variant, even if they have already seen another value).
- ExtraData. This is an optional object that will be passed to `ABTestActions.recordExperimentDisplay` and `ABTestActions.recordExperimentWin`, along with the commonData data object.


## TODO
Unfortunately, this component isn't yet complete and usable. The following still needs to be implemented:
- A server/backend integration. The data doesn't go anywhere right now, and that's bad.
- More fine-grained reporting logic. Currently an experiment display is recorded every time that the component being tested is mounted—it may be better if there were options to only report once per user, or perhaps once per session.