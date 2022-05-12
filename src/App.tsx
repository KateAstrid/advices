import axios from "axios";
import { FormEvent, useEffect, useState, MouseEvent } from "react";
import { ModalWindow } from "./components/ModalWindow";
import "./styles.css";

interface Advice {
  id: number;
  advice: string;
}

const FILLER = "loading...";

export default function App() {
  const [advice, setAdvice] = useState<Advice>();
  const [results, setResults] = useState<Advice[]>([]);
  const [attempts, setAttempts] = useState(5);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios("https://api.adviceslip.com/advice")
      .then((responce) => {
        setAdvice(responce.data.slip);
      })
      .catch((error) => console.error(error));
  }, []);

  function getAdvice(): Promise<Advice> {
    return axios("https://api.adviceslip.com/advice")
      .then((responce) => {
        if (advice?.id === responce.data.slip.id && attempts > 0) {
          setAttempts(attempts - 1);
          return getAdvice();
        } else {
          setAttempts(5);
          return responce.data.slip;
        }
      })
      .catch((error) => console.error(error));
  }

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setAdvice(undefined);

    getAdvice()
      .then((response) => setAdvice(response))
      .catch((error) => console.error(error));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    const search = target.search.value.trim();

    if (search) {
      axios("https://api.adviceslip.com/advice/search/" + search)
        .then((responce) => {
          if (responce.data.message) {
            setMessage(responce.data.message.text);
          } else {
            setMessage("");
            setResults(responce.data.slips);
          }
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <main>
        <h1>Are you looking for advice?</h1>
        <p data-testid="advice">{advice ? advice.advice : FILLER}</p>

        <button data-testid="getNewAdvice" onClick={onClick}>
          Gimme more advice!
        </button>
        <br />

        <form data-testid="searchForm" onSubmit={onSubmit}>
          <p>Search for more advice:</p>
          <input type="text" name="search" data-testid="searchInput" />
          <button>Search</button>
        </form>

        {message ? (
          <p>{message}</p>
        ) : (
          <ul data-testid="list">
            {results.map((result, index) => (
              <li key={index}>{result.advice}</li>
            ))}
          </ul>
        )}
      </main>

      {attempts === 0 && <ModalWindow onClick={() => setAttempts(5)} />}
    </>
  );
}
