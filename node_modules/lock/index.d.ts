export = Lock;
type release = (releaseCallback?: () => void) => () => void;
type exec = (release: release) => void;
interface lock {
  (key: string | string[], exec: exec): void;
  isLocked(): boolean;
}
declare function Lock(): lock;