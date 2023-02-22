import { useCallback, useState } from "react";
import { LocalCache } from "./LocalCache";

const cache = new LocalCache<string>("uuid");

function Root() {
  const [text, setText] = useState<string>("")
  const [delta, setDelta] = useState<number>(0)

  const fetch = useCallback(() => {
    const time0 = new Date().getTime();

    cache.fetch("/big.txt").then((value) => {
      const time1 = new Date().getTime();
      setDelta(time1 - time0)
      setText(value)
    });
  }, [setText]);

  const clear = useCallback(() => {
    cache.clear().then(() => setText(""));
  }, [setText]);

  return (
    <div>
      <button onClick={fetch}>fetch</button>
      <button onClick={clear}>clear</button>
      <span>time: {delta} ms</span>

      <div>{text}</div>
    </div>
  );
}

export default Root;
