# 1.0.0-rc.0

- Only build cjs and esm, not es2015
- Loadable is now a discriminating union interface, so checking .loaded will cause CFA to narrow the type correctly. It is no longer a class, so should just be created as a plain object satisfying the interface if needed
- Drop LoadOn functionality for now
- Simplify ldCombineLatest - now only takes array argument
- Update deps
- Move from TSLint -> ESLint

# 0.1.0-rc.3

- Fix paths to esm5 and esm2015 version so they actually get used!

# 0.1.0-rc.0

- Add pipe to LoadableObservable
- Add ldSwitchMap, ldFilter and ldMap operators
- Add ldCombineLatest creation function

# 0.0.2

- Fixed location of types file so that package actually works with TS.
