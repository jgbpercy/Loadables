import { Observable, of } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { isLoaded, Loadable } from './loadable';

/**
 * Class representing the state over time of a loadable, i.e. a value that can be loaded and
 * reloaded by some asynchronous process (most likely an http call).
 *
 * A LoadableObservable is intended for use by classes that consume the loadable value, for example
 * Angular Components.
 *
 * LoadableObservables can be constructed directly by passing an Observable<Loadable<TData>> but
 * they are more commonly constructed within a Service as a private LoadableSubject. The Service
 * publicly exposes the LoadableSubject as a LoabableObservable.
 *
 * A component that consumes a LoadableObservable might look like this:

``` typescript
@Component({
  template: `
    <app-loading *ngIf="!(loaded | async)"></app-loading>

    <ng-container *ngIf="loaded | async">
      <p>{{ (entity | async)!.name }}
    </ng-container>
  `
})
export class SimpleComponent {
  loaded = this.dataService.entity.loaded;
  entity = this.dataService.entity.data;

  constructor(private dataService: DataService) {}
}
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

  constructor(ofObservable: Observable<Loadable<TData>>) {
    this.fullObservable = ofObservable;

    this.loaded = this.fullObservable.pipe(map(loadable => loadable.loaded));

    this.data = this.fullObservable.pipe(
      filter(isLoaded),
      map(loadable => {
        return loadable.data;
      }),
    );

    this.firstData = this.data.pipe(first());

    this.firstDataExpectLoaded = this.fullObservable.pipe(
      first(),
      map(loadable => {
        if (!isLoaded(loadable)) {
          throw Error('Loadable was not loaded');
        }

        return loadable.data;
      }),
    );
  }

  /**
   * A simple way to create a LoadableObservable for unit testing
   */
  public static ofLoadedObservable<TData>(
    ofObservable: Observable<TData>,
  ): LoadableObservable<TData> {
    return new LoadableObservable(
      ofObservable.pipe(
        map(value => {
          return {
            loaded: true,
            data: value,
          };
        }),
      ),
    );
  }

  /**
   * A simple way to create a LoadableObservable for unit testing
   */
  public static ofLoaded<TData>(
    item1: TData,
    item2?: TData,
    item3?: TData,
    item4?: TData,
    item5?: TData,
    item6?: TData,
    item7?: TData,
    item8?: TData,
    item9?: TData,
  ): LoadableObservable<TData>;

  public static ofLoaded<TData>(...array: TData[]): LoadableObservable<TData> {
    return LoadableObservable.ofLoadedObservable(of(...array));
  }
}
