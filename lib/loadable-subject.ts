import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Loadable } from './loadable';
import { LoadableObservable } from './loadable-observable';

/**
 * Class representing the state over time of a loadable, i.e. a value that can be loaded and
 * reloaded by some asynchronous process (most likely an http call).
 *
 * A LoadableSubject is intended for use by the code that manages the value, for example an
 * Angular data service that fetches data about an entity based on the current entity id for which
 * the application wants to display data. LoadableSubject inherits from LoadableObservable, which
 * exposes the properties that consumers of the value require.
 *
 * Construct this class with a data argument in order for it to initialized loaded, or without one
 * in order for it to be initialized loading.
 *
 * A typical simple data service might look like this:

``` typescript
@Injectable()
export class SimpleDataService {
  private _value = new LoadableSubject<number>();
  public value: LoadableObservable<number> = this._value;

  constructor(private http: HttpClient) {}

  set entityId(value: string) {
    this._value.loadOn(
      this.http.get<number>('url/' + value);
    );
  }
}
```

 * - When a new id is set, the setLoading() method will be called, indicating to consumers that
 * the old value is no longer valid and that we are waiting for a new value to be loaded.
 * - When the http call completes and a new value is returned, the next(data) method will be
 * called, and consumers will receive the new value.
 */
export class LoadableSubject<TData> extends LoadableObservable<TData> {
  private readonly _subject: BehaviorSubject<Loadable<TData>>;

  constructor(initialData?: TData) {
    let subject: BehaviorSubject<Loadable<TData>>;

    if (initialData === undefined) {
      subject = new BehaviorSubject<Loadable<TData>>(Loadable.loading());
    } else {
      subject = new BehaviorSubject<Loadable<TData>>(Loadable.loaded(initialData));
    }

    super(subject);

    this._subject = subject;
  }

  /**
   * Indicate to consumers that the loabable value is now loading.
   */
  public setLoading(): void {
    this._subject.next(Loadable.loading());
  }

  /**
   * Indicate to consumers that the loadable value is now loaded.
   * @param data The new value.
   */
  public next(data: TData): void {
    this._subject.next(Loadable.loaded(data));
  }

  public error(error: any): void {
    this._subject.error(error);
  }

  public complete(): void {
    this._subject.complete();
  }

  /**
   * A simple way to tie the loading state and next value of the LoadableSubject to a passed
   * Observable (not allowing for anything else you do to it in the meantime!).
   *
   * In detail: Sets the LoadableSubject loading until the passed Observable emits, at which time
   * the LoadableSubject will emit the value emitted by the passed Observable. The LoadableSubject
   * will then unsubscribe from the passed observable and any further values will be ignored. If
   * the passed observable errors before it emits, then the error will be emitted from the
   * LoadableSubject.
   *
   * @param observable The Observable to subscribe to.
   */
  public loadOn<T extends TData>(observable: Observable<T>): void {
    this.setLoading();

    observable.pipe(first()).subscribe({
      next: res => this.next(res),
      error: err => this.error(err),
    });
  }
}
