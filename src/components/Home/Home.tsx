import { useState, useRef, useEffect } from "react";

import styles from "./Home.module.css";

import Input from "../Input/Input";

const URL: string = "https://swapi.dev/api/";

interface requestsCollection {
  urls: string[],
  setter: React.Dispatch<React.SetStateAction<any>>;
}

const Home = () => {
  const [filmsEndpoints, setFilmsEndpoints] = useState<object[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null);

  const requestHandler = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
  };

  const requestAndSetHandler = async (collection: requestsCollection) => {
    const { urls, setter } = collection;
    setLoading(true)
    const allData : string[] = await Promise.all(
      urls.map((itemUrl: string) => requestHandler(itemUrl))
    );
    setLoading(false)
    setter(allData);
  };

  useEffect(() => {
    if (filmsEndpoints.length > 0) {
      console.log(typeof filmsEndpoints)
      const data: any= filmsEndpoints.filter(
        (item: any) => item.results.length > 0
      );
      console.log(typeof data, data)
      data.length > 0 ? requestAndSetHandler({ urls: data[0].results[0].films, setter: setItems }) : setError("Bad request");
    }
  }, [filmsEndpoints]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value) {
      requestAndSetHandler({
        urls: [
          `${URL}/people/?search=${inputRef.current.value}`,
          `${URL}/planets/?search=${inputRef.current.value}`,
          `${URL}/starships/?search=${inputRef.current.value}`,
        ],
        setter: setFilmsEndpoints,
      });
      setError("");
    } else {
      setError("Write something to search");
      inputRef.current?.focus();
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
        <div className={styles.inputGroup}>
          <Input placeholder="Type to search" ref={inputRef} />
          <button>Search</button>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {items.length > 0 && items.map((item: any) => <div key={item.episode_id}><p className={styles.header}>Title: {item.title} Date: {item.release_date}</p><p>{item.opening_crawl}</p></div>)}
    </div>
  );
};

export default Home;
