import React, { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
const App = () => {
  const [urls, setUrls] = useState([]); //all urls
  const [inputValue, setInputValue] = useState(""); //for input value => longurl
  const [curentUrl, setCurentUrl] = useState({
    shortCode: "",
    originalUrl: "",
  });
  console.log(curentUrl);

  async function fetchUrl() {
    const response = await axios.get("http://localhost:5173/api/url");
    setUrls(response.data.data.urls);
    // console.log(response)
  }
  useEffect(() => {
    fetchUrl();
  }, []);

  async function createUrl() {
    const response = await axios.post("http://localhost:5173/api/url", {
      url: inputValue,
    });
    // console.log(response)
    setCurentUrl({ ...curentUrl,
      shortCode: response.data.data.shortCode,
      originalUrl: response.data.data.originalUrl,
    });

   fetchUrl() ;
  }
34
  async function deleteUrl(id) {
    await axios.delete(`http://localhost:5173/api/url/${id}`);
    fetchUrl();
  }
  return (
    <main className="p-2 flex flex-col gap-4 ">
      <div className="flex w-full max-w-4xl gap-2">
        <input
          className="w-full border rounded-xl p-2"
          type="text"
          placeholder="Enter Long Url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="active:scale-50 bg-blue-500  cursor-pointer rounded p-2 ">
          Copy
        </button>
        <button
          onClick={() => createUrl()}
          className="bg-blue-500 cursor-pointer rounded p-2 active:scale-50"
        >
          Shorten
        </button>
      </div>

      {/* 2nd section */}
      {/* show currentUrl */}

      <div className="flex gap-10 w-full max-w-4xl border mb-2 items-center justify-between ">
        <a
        href={`http://localhost:3000/${curentUrl.shortCode}`}
        target="_blank"
        >
          {curentUrl.shortCode}
        </a>
        <p className="truncate">{curentUrl.originalUrl}</p>

        <div className="flex gap-4">
          <button className="p-2 rounded bg-orange-600 text-white cursor-pointer active:scale-50  ">
            COPY
          </button>
          <button className="p-2 rounded bg-orange-600 text-white cursor-pointer active:scale-50">
            DELETE
          </button>
        </div>
      </div>

      {/* //3rd section  */}

      <div>
        <div>
          {urls.map((url) => {
            return (
              <div className="flex gap-10 w-full max-w-4xl border mb-2 items-center justify-between ">
                <a
                  href={`http://localhost:3000/${url.shortCode}`}
                  target="_blank"
                >
                  {url.shortCode}
                </a>
                <p className="truncate">{url.originalUrl}</p>
                <p>{url.clicks}</p>

                <div className="flex gap-4">
                  <button className="p-2 rounded bg-orange-600 text-white cursor-pointer active:scale-50  ">
                    COPY
                  </button>
                  <button
                    onClick={() => deleteUrl(url._id)}
                    className="p-2 rounded bg-orange-600 text-white cursor-pointer active:scale-50"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default App;
