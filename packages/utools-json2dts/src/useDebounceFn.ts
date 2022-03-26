import debounce from 'lodash-es/debounce';
import { useRef, useEffect, useMemo } from 'react';

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

interface IDebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}
type noop = (...args: any) => any;


function useDebounceFn<T extends noop>(fn: T, options?: IDebounceOptions) {
  const fnRef = useLatest(fn);

  const wait = options?.wait ?? 1000;

  const debounced = useMemo(() => {
    return debounce(
      ((...args: Parameters<T>): ReturnType<T> => {
        return fnRef.current(...args);
      }),
      wait,
      options,
    )
  }, [])

  useEffect(
    () => () => {
      debounced.cancel();
    },
    [],
  );
  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}


export default useDebounceFn;