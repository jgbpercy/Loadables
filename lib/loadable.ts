/**
 * Basic building block of the Loadbles abstraction.
 *
 * ** You should not generally create Loadables themselves directly in user code unless you know
 * exactly what you're doing. Doing so can make the isLoaded check invalid. **
 *
 * Contains a data property of any generic type, along with the loaded metadata that indicates
 * whether current value of data represents valid loaded data, or if the loadable is loading and
 * data is currently undefined.
 */
export class Loadable<TData> {
  public loaded = false;
  public data?: TData;

  public static loading<TData>(): Loadable<TData> {
    return { loaded: false, data: undefined };
  }

  public static loaded<TData>(data: TData): Loadable<TData> {
    return { loaded: true, data: data };
  }
}

interface Loaded<TData> {
  loaded: true;
  data: TData;
}

/**
 * Checks whether a Loable<TData> is loaded. This is a type guard, so in code branches where it has
 * passed, the loadable will have type Loaded<TData>, meaning that loadable.data can be accessed
 * without error with TypeScript strictNullChecks. For example:
 *
 *``` typescript
function fn(loadable: Loadable<string>) {
  const stringOrUndefined = loadable.data; // This has type string | undefined

  const cantDoThis: string = loadable.data; // This is a compiler error with strictNullChecks

  if (isLoaded(loadable)) {
    const aString = loadable.data; // This has type string

    const canDoThis: string = loadable.data; // This is ok
  }
}
```
 * @param loadable The Loadable to check
 */
export function isLoaded<TData>(loadable: Loadable<TData>): loadable is Loaded<TData> {
  if (!loadable.loaded) {
    return false;
  }

  return true;
}
