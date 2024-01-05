"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
  const [prediction, setPrediction] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prediction?.status === "succeeded" || prediction?.status === "failed") {
      setGenerating(false);
    }
  }, [prediction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    if (!e.target.prompt.value) {
      setGenerating(false);
      return alert("Prompt is required");
    }

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 200) {
      setError(prediction?.message?.detail);
      return;
    }
    setPrediction(prediction?.data);

    console.log("Hasil pred:", prediction?.data);
    while (prediction?.data?.status !== "succeeded" && prediction?.data?.status !== "failed") {
      await sleep(3000);
      console.log("Predstatus", prediction?.data?.status);
      const responseStatus = await fetch("/api/predictions/" + prediction?.data?.id);
      const predictionStatus = await responseStatus.json();
      if (responseStatus.status !== 200) {
        setError(predictionStatus?.message?.detail);
        return;
      }
      setPrediction(predictionStatus?.data);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-50 min-h-screen pt-24">
        <div className="max-w-2xl mx-auto px-4 mt-24">
          <div className="">
            {error && <div className="w-full bg-red-500 text-white rounded-full p-2 mb-2">{error}</div>}

            <form className="" onSubmit={handleSubmit}>
              <div className="bg-gray-100 p-2 rounded-lg border-2">
                <textarea
                  type="text"
                  name="prompt"
                  rows={4}
                  placeholder="Enter a prompt to generate music"
                  className="block w-full border rounded-lg p-3"
                ></textarea>
              </div>

              <div className="text-center mt-2">
                <div className="p-2 bg-gray-100 border-2 inline-flex rounded-full gap-2 text-sm">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full flex items-center gap-2 text-gray-500 disabled:cursor-not-allowed disabled:contrast-50"
                    disabled={generating}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-primary flex items-center gap-2 text-white shadow-primary/40 hover:shadow-lg transition-all duration-500 hover:shadow-primary/50 hover:bg-purple-700 disabled:cursor-not-allowed disabled:contrast-50"
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin" viewBox="0 0 20 20">
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M11 16a2 2 0 110 4 2 2 0 010-4m-6.259-3a2.5 2.5 0 110 5 2.5 2.5 0 010-5m11.578.5a2 2 0 110 4 2 2 0 010-4M18.5 9.319a1.5 1.5 0 110 3 1.5 1.5 0 010-3M2.5 6a2.5 2.5 0 110 5 2.5 2.5 0 010-5m15.286-.793a1 1 0 110 2 1 1 0 010-2M8 0a3 3 0 110 6 3 3 0 010-6m7.5 3a.5.5 0 110 1 .5.5 0 010-1"
                          ></path>
                        </svg>
                        {prediction?.status}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2 8.6 4.5 10 7zm12 9.8L22 14l-1.4 2.5L22 19l-2.5-1.4L17 19l1.4-2.5L17 14zM22 2l-1.4 2.5L22 7l-2.5-1.4L17 7l1.4-2.5L17 2l2.5 1.4zm-8.66 10.78l2.44-2.44-2.12-2.12-2.44 2.44zm1.03-5.49l2.34 2.34c.39.37.39 1.02 0 1.41L5.04 22.71c-.39.39-1.04.39-1.41 0l-2.34-2.34c-.39-.37-.39-1.02 0-1.41L12.96 7.29c.39-.39 1.04-.39 1.41 0"
                          ></path>
                        </svg>
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {prediction?.output && (
              <div className="mx-auto text-center mt-4">
                <audio controls src="https://replicate.delivery/pbxt/QmDX8dm76K7gHZwgI4jEMK4jteOvpo8JHavnppgpDlYkipEJA/out.wav"></audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
