import { getDataValueMap, getLoadedValueMap, getTestScheduler, LoadableValueMap } from '../testing';
import { LoadableObservable } from './loadable-observable';

test('For a single subscriber, fullObservable should always match the source observable', () => {
  getTestScheduler().run(({ cold, expectObservable }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
      c: { loaded: true, data: 'c' },
      d: { loaded: false },
    };

    const source = cold('--a--b-c-d--|', values);

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.fullObservable).toBe('--a--b-c-d--|', values);
  });
});

// This scenario shows why you need to pass a multicast observable to the LoadableObservable constructor,
// or pass sourceIsMulticast = false
// Each subscription to one of the observable properties of the LoadableObservable will get a different
// execution of the source
// This scenario represents intended *behaviour* of the library, for unintended *use* of the library
test('If the source is not multicast and sourceIsMulticast = true, then bad things will happen (each subscriber gets a different execution)', () => {
  getTestScheduler().run(({ cold, expectObservable, expectSubscriptions }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
    };

    const source = cold('--a--b--|', values);

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.fullObservable, '^--------').toBe('--a--b--|', values);
    expectObservable(loadableObservable.fullObservable, '--^------').toBe('----a--b--|', values);
    expectObservable(loadableObservable.fullObservable, '-----^---').toBe('-------a--b--|', values);
    expectSubscriptions(source.subscriptions).toBe(['^-------!', '--^-------!', '-----^-------!']);
  });
});

// This represents intended usage - the source is multicast and subscribers will ge the same execution
test('If the source is multicast and sourceIsMulticast = true, then subscribers should get the same execution', () => {
  getTestScheduler().run(({ hot, expectObservable, expectSubscriptions }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
    };

    const source = hot('--a-----b--|', values);
    const sub1 = '^----!------';
    const sub2 = '-------^---!';

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.fullObservable, sub1).toBe('--a---------', values);
    expectObservable(loadableObservable.fullObservable, sub2).toBe('--------b---', values);
    expectSubscriptions(source.subscriptions).toBe(['^----!', '-------^---!']);
  });
});

// This represents intended usage - the source gets multicast by the library so that subscribers will
// get the same execution
test('If the source is not multicast and sourceIsMulticast = false, then subscribers should get the same execution', () => {
  getTestScheduler().run(({ cold, expectObservable, expectSubscriptions }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
    };

    const source = cold('--a-----b--|', values);
    const sub1 = '       ^----!------';
    const sub2 = '       -------^----';

    const loadableObservable = new LoadableObservable(source, false);

    expectObservable(loadableObservable.fullObservable, sub1).toBe('--a---------', values);
    expectObservable(loadableObservable.fullObservable, sub2).toBe('--------b--|', values);
    expectSubscriptions(source.subscriptions).toBe('^----------!');
  });
});

// This scenario shows why you need any your source to be multicast and to pass sourceIsMulticast = true if that source
// is infinite
// Otherwise, we will have an infinite subscription to that source
// This scenario represents intended *behaviour* of the library, for unintended *use* of the library
test('If the source is infinite and sourceIsMulticast = false, then bad things will happen (memory leak)', () => {
  getTestScheduler().run(({ hot, expectObservable, expectSubscriptions }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
    };

    const source = hot('--a-----b---', values);

    const loadableObservable = new LoadableObservable(source, false);

    expectObservable(loadableObservable.fullObservable).toBe('--a-----b', values);
    expectSubscriptions(source.subscriptions).toBe('^');
  });
});

test('The loaded property should reflect the loaded state of the LoadableObservable', () => {
  getTestScheduler().run(({ hot, expectObservable }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
      c: { loaded: true, data: 'c' },
      d: { loaded: false },
      e: { loaded: false },
      f: { loaded: true, data: 'f' },
    };

    const source = hot('a-b-c-d-e-f', values);

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.loaded).toBe('a-b-c-d-e-f', getLoadedValueMap(values));
  });
});

test('The data property should reflect the loaded data state of the LoadableObservable', () => {
  getTestScheduler().run(({ hot, expectObservable }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
      c: { loaded: true, data: 'c' },
      d: { loaded: false },
      e: { loaded: false },
      f: { loaded: true, data: 'f' },
    };

    const source = hot('a-b-c-d-e-f', values);

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.data).toBe('--b-c-----f', getDataValueMap(values));
  });
});

test('The firstData property should return the first loaded data from the LoadableObservable', () => {
  getTestScheduler().run(({ hot, expectObservable }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
      c: { loaded: true, data: 'c' },
      d: { loaded: false },
      e: { loaded: false },
      f: { loaded: true, data: 'f' },
    };

    const dataValues = getDataValueMap(values);

    const source = hot('a-b-c-d-e-f', values);

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.firstData, '^').toBe('--(b|)', dataValues);
    expectObservable(loadableObservable.firstData, '--^').toBe('--(b|)', dataValues);
    expectObservable(loadableObservable.firstData, '----^').toBe('----(c|)', dataValues);
    expectObservable(loadableObservable.firstData, '-----^').toBe('----------(f|)', dataValues);
  });
});

test('The firstDataExpectLoaded property should error if the next emission is not loaded, and return the next emission if it is loaded', () => {
  getTestScheduler().run(({ hot, expectObservable }) => {
    const values: LoadableValueMap = {
      a: { loaded: false },
      b: { loaded: true, data: 'b' },
      c: { loaded: true, data: 'c' },
      d: { loaded: false },
      e: { loaded: false },
      f: { loaded: true, data: 'f' },
    };

    const dataValues = getDataValueMap(values);

    const source = hot('a-b-c-d-e-f', values);

    const loadableObservable = new LoadableObservable(source, true);

    expectObservable(loadableObservable.firstDataExpectLoaded, '^').toBe(
      '#',
      dataValues,
      Error('Subscribed to firstDataExpectLoaded, but the LoadableObservable was not loaded'),
    );
    expectObservable(loadableObservable.firstDataExpectLoaded, '--^').toBe('--(b|)', dataValues);
    expectObservable(loadableObservable.firstDataExpectLoaded, '----^').toBe(
      '----(c|)',
      dataValues,
    );
    expectObservable(loadableObservable.firstDataExpectLoaded, '-----^').toBe(
      '------#',
      dataValues,
      Error('Subscribed to firstDataExpectLoaded, but the LoadableObservable was not loaded'),
    );
  });
});

test('Thinger', () => {});
