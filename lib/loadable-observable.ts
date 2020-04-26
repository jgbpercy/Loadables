import { ConnectableObservable, defer, Observable, OperatorFunction } from 'rxjs';
import { filter, first, map, publish, share } from 'rxjs/operators';
import { isLoaded, Loadable } from './loadable';

/**
 * Represents the state over time of a loadable, i.e. a value that can be loaded and reloaded by
 * some asynchronous process (most likely an http call).
 *
 * A LoadableObservable is intended for use by classes that consume the loadable value, for example
 * Angular Components.
 *
 * LoadableObservables can be constructed directly by passing an `Observable<Loadable<TData>>` but
 * they are more commonly constructed within a Service as a private LoadableSubject. The Service
 * publicly exposes the `LoadableSubject` as a `LoabableObservable`.
 *
 * A component that consumes a `LoadableObservable` might look like this:
 *
 * ``` typescript
 * @Component({
 *   template: `
 *     <app-loading *ngIf="!(loaded | async)"></app-loading>
 *
 *     <ng-container *ngIf="loaded | async">
 *       <p>{{ (entity | async)!.name }}
 *     </ng-container>
 *   `
 * })
 * export class SimpleComponent {
 *   readonly loaded = this.dataService.entity.loaded;
 *   readonly entity = this.dataService.entity.data;
 *
 *   constructor(private readonly dataService: DataService) {}
 * }
```
 */
export class LoadableObservable<TData> {
  /**
   * The underlying Observable<Loadable<TData>>. For most scenarios, `loaded`, `data` or `first`
   * should be used instead of accessing fullObservable.
   */
  public readonly fullObservable: Observable<Loadable<TData>>;

  /**
   * An Observable of changes to the loading state of the loadable. Use with `| async` within
   * components templates to toggle the display of loading indicators and hide content that relies
   * on the loaded value.
   */
  public readonly loaded: Observable<boolean>;

  /**
   * An Observable of changes to the data value of the loadable. Use with `| async` to display the
   * loadable value within components (e.g. `(data | async)!.property`).
   */
  public readonly data: Observable<TData>;

  /**
   * An Observable that gets the next loaded data value of the loadable. Use when you need to get
   * the current (or next loaded) value of the loadable and you want a stream that will complete
   * (assuming a value ever loads). Use in typescript rather than a Component template.
   */
  public readonly firstData: Observable<TData>;

  /**
   * An Observable that gets the current value of the loadable, expecting it to be loaded and
   * throwing if it is not. Use when you need to get the current value of the loadable, you want a
   * stream that will complete, and you know that the loadable should be loaded at call time. Use
   * in typescript rather than a Component template.
   */
  public readonly firstDataExpectLoaded: Observable<TData>;

  /**
   * Create a new `LodableObservable<TData>` by passing an `Observable<Loadable<TData>>`.
   *
   * IMPORTANT: You need to know which type of Observable you are passing. You can pass either:
   * - A multicast, potentially infinite Observable - E.g., a `Subject`, or an Observable
   * where you have used a multicasting operator like `share`. In this case, pass `true` to
   * `sourceIsMulticast`.
   * - A non-multicast Observable which must complete - I.e. pretty much anything that isn't
   * a Subject and hasn't had a multicasting operator like `shared` used on it. In this case,
   * pass `false` to `sourceIsMulticast`.
   *
   * If you're not sure, then avoid creating `LoadableObservable`s directly. It's easier to use
   * `LoadableSubject`s.
   *
   * If `sourceIsMulticast` is `true`, then subscribing to each LoadableObservable property will
   * create a new subscription to the source, so if the source is not actually multicast, then
   * the results from different properties will not be in sync.
   *
   * If `sourceIsMulticast` is `false`, then the LoadableObservable constructor will set up a
   * single subscription to the source and multicast this. This means that if the source does
   * not complete, then this subscription will leak memory.
   */
  constructor(source: Observable<Loadable<TData>>, sourceIsMulticast: boolean) {
    if (sourceIsMulticast) {
      this.fullObservable = source;
    } else {
      let multicastObservable: ConnectableObservable<Loadable<TData>> | undefined;

      this.fullObservable = defer(() => {
        if (!multicastObservable) {
          multicastObservable = source.pipe(publish()) as ConnectableObservable<Loadable<TData>>;
          multicastObservable.connect();
        }

        return multicastObservable;
      });
    }

    this.loaded = this.fullObservable.pipe(
      map((loadable) => loadable.loaded),
      share(),
    );

    this.data = this.fullObservable.pipe(
      filter(isLoaded),
      map((loadable) => loadable.data),
      share(),
    );

    this.firstData = this.data.pipe(first());

    this.firstDataExpectLoaded = this.fullObservable.pipe(
      first(),
      map((loadable) => {
        if (!loadable.loaded) {
          throw Error(
            'Subscribed to firstDataExpectLoaded, but the LoadableObservable was not loaded',
          );
        }

        return loadable.data;
      }),
    );
  }

  public pipe(): LoadableObservable<TData>;
  public pipe<A>(op1: OperatorFunction<Loadable<TData>, Loadable<A>>): LoadableObservable<A>;
  public pipe<A, B>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
  ): LoadableObservable<B>;
  public pipe<A, B, C>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
  ): LoadableObservable<C>;
  public pipe<A, B, C, D>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
  ): LoadableObservable<D>;
  public pipe<A, B, C, D, E>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
    op5?: OperatorFunction<Loadable<D>, Loadable<E>>,
  ): LoadableObservable<E>;
  public pipe<A, B, C, D, E, F>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
    op5?: OperatorFunction<Loadable<D>, Loadable<E>>,
    op6?: OperatorFunction<Loadable<E>, Loadable<F>>,
  ): LoadableObservable<F>;
  public pipe<A, B, C, D, E, F, G>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
    op5?: OperatorFunction<Loadable<D>, Loadable<E>>,
    op6?: OperatorFunction<Loadable<E>, Loadable<F>>,
    op7?: OperatorFunction<Loadable<F>, Loadable<G>>,
  ): LoadableObservable<G>;
  public pipe<A, B, C, D, E, F, G, H>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
    op5?: OperatorFunction<Loadable<D>, Loadable<E>>,
    op6?: OperatorFunction<Loadable<E>, Loadable<F>>,
    op7?: OperatorFunction<Loadable<F>, Loadable<G>>,
    op8?: OperatorFunction<Loadable<G>, Loadable<H>>,
  ): LoadableObservable<H>;
  public pipe<A, B, C, D, E, F, G, H, I>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
    op5?: OperatorFunction<Loadable<D>, Loadable<E>>,
    op6?: OperatorFunction<Loadable<E>, Loadable<F>>,
    op7?: OperatorFunction<Loadable<F>, Loadable<G>>,
    op8?: OperatorFunction<Loadable<G>, Loadable<H>>,
    op9?: OperatorFunction<Loadable<H>, Loadable<I>>,
  ): LoadableObservable<I>;
  public pipe<A, B, C, D, E, F, G, H, I>(
    op1?: OperatorFunction<Loadable<TData>, Loadable<A>>,
    op2?: OperatorFunction<Loadable<A>, Loadable<B>>,
    op3?: OperatorFunction<Loadable<B>, Loadable<C>>,
    op4?: OperatorFunction<Loadable<C>, Loadable<D>>,
    op5?: OperatorFunction<Loadable<D>, Loadable<E>>,
    op6?: OperatorFunction<Loadable<E>, Loadable<F>>,
    op7?: OperatorFunction<Loadable<F>, Loadable<G>>,
    op8?: OperatorFunction<Loadable<G>, Loadable<H>>,
    op9?: OperatorFunction<Loadable<H>, Loadable<I>>,
    ...operations: OperatorFunction<Loadable<any>, Loadable<any>>[]
  ): LoadableObservable<{}>;

  public pipe(
    ...operations: OperatorFunction<Loadable<any>, Loadable<any>>[]
  ): LoadableObservable<any> {
    return new LoadableObservable((this.fullObservable as any).pipe(...operations), true);
  }
}
