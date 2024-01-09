"use client";

import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider, Controls, TimeSlider, PlayButton, Time } from "@vidstack/react";
import { PauseIcon, PlayIcon } from "@vidstack/react/icons";
import protocolDefinition from "../../public/muxtopia-protocol.json";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

import { DM_Mono } from "next/font/google";
const mono = DM_Mono({ subsets: ["latin"], weight: "500" });

export default function Explore() {
  const [myDid, setMyDid] = useState();
  const [myWeb5, setMyWeb5] = useState();
  const [musics, setMusics] = useState([]);

  useEffect(() => {
    const initWeb5 = async () => {
      const { Web5 } = await import('@web5/api');

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
    if (!myDid || !myWeb5) return;
    getMusics();
  }, [myDid, myWeb5]);

  const getMusics = async () => {
    const { records } = await myWeb5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.music.schema,
        },
        dateSort: "createdAscending",
      },
    });

    const allMusics = [];
    for (let record of records) {
      const data = await record.data.json();
      allMusics.push({ id: record.id, ...data });
    }
    setMusics(allMusics);
  };

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-50 min-h-screen py-24">
        <div className="container mx-auto px-4 mb-10">
          <h1 className="text-4xl mt-10 text-center mb-10">Explore</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {musics.map((i) => (
              <div
                key={i.id}
                className={`${mono.className} w-full rounded-xl p-4 md:p-6 flex flex-col gap-6 justify-between bg-primary/40 border-2 border-primary bg-opacity-40 font-medium shadow hover:shadow-md transition-all hover:-translate-y-1 hover:bg-opacity-50 duration-300`}
              >
                <h6 className="text-lg -tracking-wide opacity-80">&quot;{i.prompt}&quot;</h6>
                <div>
                  <MediaPlayer title="Sprite Fight" src={i.musicUrl}>
                    <MediaProvider />
                    <Controls.Root className="media-controls:opacity-100 absolute inset-0 z-10 flex">
                      <Controls.Group className="flex w-full items-center">
                        <PlayButton className="bg-white/60 hover:bg-white rounded-full shrink-0 p-2 transition-all">
                          <PlayIcon className="media-paused:block hidden play-icon w-5 h-5 text-black/50" />
                          <PauseIcon className="media-paused:hidden block pause-icon w-5 h-5 text-black/50" />
                        </PlayButton>

                        <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full rounded-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
                          <TimeSlider.Track className={`relative ring-sky-400 z-0 h-[5px] w-full rounded-full bg-white/50 group-data-[focus]:ring-[3px]`}>
                            <TimeSlider.TrackFill className={`absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width] bg-primary/40 border-2 border-primary`} />
                          </TimeSlider.Track>
                          <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity group-data-[active]:opacity-100 group-data-[dragging]:ring-4 will-change-[left]" />
                        </TimeSlider.Root>

                        <div className="ml-1.5 flex items-center text-sm font-medium bg-white/60 px-4 py-2 rounded-full">
                          <Time className="time" type="current" />
                        </div>
                      </Controls.Group>
                    </Controls.Root>
                  </MediaPlayer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
