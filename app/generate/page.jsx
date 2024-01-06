"use client";

import "@vidstack/react/player/styles/base.css";
import { Web5 } from "@web5/api";
import { MediaPlayer, MediaProvider, Controls, TimeSlider, PlayButton, Time } from "@vidstack/react";
import { PauseIcon, PlayIcon } from "@vidstack/react/icons";
import Navbar from "@/components/navbar";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";
import protocolDefinition from "../../public/muxtopia-protocol.json";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const suggestions = ["Spooky music", "Electro-disco instrumental with keyboard in the background", "Tokyo Hip-Hop", "Drum that sound like rain and thunder"];

export default function Page() {
  const [myDid, setMyDid] = useState();
  const [myWeb5, setMyWeb5] = useState();
  const [myMusic, setMyMusic] = useState();
  const [prompt, setPrompt] = useState();
  const [prediction, setPrediction] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb5 = async () => {
      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
        setMyWeb5(web5);
        setMyDid(did);
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    };

    initWeb5();
  }, []);

  useEffect(() => {
    if (prediction?.status === "succeeded" || prediction?.status === "failed") {
      setGenerating(false);
    }

    if (prediction?.status === "succeeded") {
      setMyMusic({
        prompt: prompt,
        output: prediction.output,
      });
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
    let predictionResponse = await response.json();
    if (response.status !== 200) {
      setError(predictionResponse?.message?.detail);
      return;
    }
    setPrediction(predictionResponse?.data);

    let whileStatus;
    while (whileStatus?.status !== "succeeded" && whileStatus?.status !== "failed") {
      await sleep(3000);
      const responseStatus = await fetch("/api/predictions/" + predictionResponse?.data?.id);
      const predictionStatus = await responseStatus.json();
      if (responseStatus.status !== 200) {
        setError(predictionStatus?.message?.detail);
        return;
      }
      setPrediction(predictionStatus?.data);
      whileStatus = predictionStatus?.data;

      if (whileStatus?.status === "succeeded") {
        handleCreateRecord(whileStatus);
      }
    }
  };

  const handleCreateRecord = async (output) => {
    let fileResponse = await fetch(output?.output);
    let data = await fileResponse.blob();
    let metadata = {
      type: "audio/x-wav",
    };
    let file = new File([data], +new Date() + ".wav", metadata);

    const response = await fetch(`/api/music/upload?filename=${+new Date()}.wav`, {
      method: "POST",
      body: file,
    });

    const newBlob = await response.json();

    const musicUrl = newBlob?.url;

    const newMusic = {
      "@type": "music",
      prompt: prompt,
      musicUrl: musicUrl,
      author: myDid,
    };

    try {
      const { record } = await myWeb5.dwn.records.create({
        data: newMusic,
        message: {
          protocol: protocolDefinition.protocol,
          protocolPath: "music",
          schema: protocolDefinition.types.music.schema,
          dataFormat: protocolDefinition.types.music.dataFormats[0],
          published: true,
        },
      });

      console.log(record);
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-50 min-h-screen py-24">
        <div className="container mx-auto px-4 mb-10">
          <h1 className="text-4xl mt-10 text-center">Generate Music</h1>
        </div>
        <div className="max-w-2xl mx-auto px-4">
          <div className="w-full rounded-xl bg-primary mb-12 text-white p-6">
            {prediction?.output ? (
              <>
                <h4 className="font-bold">{myMusic?.prompt}</h4>

                <div className="w-full h-px bg-white/20 mt-4"></div>

                <Player autoplay loop src="/audio/lottie.json" className="w-1/2 md:w-1/3"></Player>

                {myMusic?.output && (
                  <MediaPlayer title="Sprite Fight" crossorigin src={myMusic?.output}>
                    <MediaProvider />
                    <Controls.Root className="media-controls:opacity-100 absolute inset-x-0 bottom-0 z-10 flex">
                      <Controls.Group className="flex w-full items-center">
                        <PlayButton className="bg-white/60 hover:bg-white rounded-full shrink-0 p-2 transition-all">
                          <PlayIcon className="media-paused:block hidden play-icon w-5 h-5 text-black/50" />
                          <PauseIcon className="media-paused:hidden block pause-icon w-5 h-5 text-black/50" />
                        </PlayButton>

                        <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full rounded-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
                          <TimeSlider.Track className={`relative ring-sky-400 z-0 h-[5px] w-full rounded-full bg-white/50 group-data-[focus]:ring-[3px]`}>
                            <TimeSlider.TrackFill className={`absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width] bg-white`} />
                          </TimeSlider.Track>
                          <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity group-data-[active]:opacity-100 group-data-[dragging]:ring-4 will-change-[left]" />
                        </TimeSlider.Root>

                        <div className="ml-1.5 flex items-center text-sm font-medium bg-white/60 px-4 py-2 rounded-full text-black/50">
                          <Time className="time" type="current" />
                        </div>
                      </Controls.Group>
                    </Controls.Root>
                  </MediaPlayer>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24" viewBox="0 0 24 24">
                  <g fill="none">
                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"></path>
                    <path
                      fill="currentColor"
                      d="M21 5.18V17a4 4 0 11-2-3.465V9.181L9 10.847V18c0 .06-.005.117-.015.174A3.5 3.5 0 117 15.337v-8.49a2 2 0 011.671-1.973l10-1.666A2 2 0 0121 5.18M5.5 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3M17 15a2 2 0 100 4 2 2 0 000-4m2-9.82L9 6.847V8.82l10-1.667z"
                    ></path>
                  </g>
                </svg>
                <p>Type your imagination below</p>
              </div>
            )}
          </div>

          <div className="">
            {error && <div className="w-full bg-red-500 text-white rounded-full p-2 mb-2">{error}</div>}

            <form className="" onSubmit={handleSubmit}>
              <div className="bg-gray-100 p-2 rounded-lg border-2">
                <textarea
                  type="text"
                  name="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.prompt)}
                  rows={4}
                  placeholder="Enter a prompt to generate music"
                  className="block w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={generating}
                ></textarea>

                {!generating && (
                  <>
                    <h6 className="font-bold text-sm uppercase mt-2 mb-2">Suggestions</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestions.map((i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setPrompt(i)}
                          className="w-full px-6 py-3 rounded-full bg-zinc-300 text-zinc-800/70 text-sm truncate text-left hover:bg-zinc-400 hover:text-white transition-all"
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-2">
                <div className="p-2 bg-gray-100 border-2 inline-flex rounded-full gap-2 w-full">
                  <button
                    type="submit"
                    className="px-7 py-4 rounded-full bg-zinc-800 flex w-full justify-center items-center gap-2 text-white shadow-zinc-800/40 hover:shadow-lg transition-all duration-500 hover:shadow-primary/50 hover:bg-purple-700 disabled:cursor-not-allowed disabled:contrast-50"
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
          </div>
        </div>
      </div>
    </>
  );
}
