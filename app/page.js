"use client";

import "@vidstack/react/player/styles/base.css";
import { Web5 } from "@web5/api";
import { MediaPlayer, MediaProvider, Controls, TimeSlider, PlayButton, Time } from "@vidstack/react";
import { PauseIcon, PlayIcon } from "@vidstack/react/icons";
import Navbar from "@/components/navbar";
import Link from "next/link";
import protocolDefinition from "../public/muxtopia-protocol.json";

import { DM_Mono } from "next/font/google";
import { useEffect, useState } from "react";
const mono = DM_Mono({ subsets: ["latin"], weight: "500" });

const samples = [
  {
    id: 1,
    audio: "/audio/sample-1.wav",
    prompt: "Electronic music track with a chill and uplifting vibe, suitable for a relaxed evening ambiance",
    color: "bg-zest",
  },
  {
    id: 2,
    audio: "/audio/sample-2.wav",
    prompt: "Jazz-inspired composition, blending smooth saxophone solos with a subtle piano background",
    color: "bg-atlantis",
  },
  {
    id: 3,
    audio: "/audio/sample-3.wav",
    prompt: "Orchestral piece that conveys a sense of adventure and triumph, utilizing strings and brass instruments prominently",
    color: "bg-cerise",
  },
];

export default function Home() {
  const [myDid, setMyDid] = useState();
  const [myWeb5, setMyWeb5] = useState();

  useEffect(() => {
    const initWeb5 = async () => {
      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
        setMyWeb5(web5);
        setMyDid(did);
        if (web5 && did) {
          await configureProtocol(web5, did);
        }
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    };

    initWeb5();
  }, []);

  const configureProtocol = async (web5, did) => {
    const { protocols, status } = await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: protocolDefinition.protocol,
        },
      },
    });

    if (status.code !== 200) {
      console.error("Error querying protocols", status);
      return;
    }

    if (protocols.length > 0) {
      return;
    }

    const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
    console.log("Protocol configured", configureStatus, protocol);

    const { status: configureRemoteStatus } = await protocol.send(did);
    console.log("Protocol configured on remote DWN", configureRemoteStatus);
  }

  return (
    <>
      <Navbar />
      <div className="relative pt-10">
        <div
          className="absolute inset-x-0 top-0 h-screen"
          style={{
            backgroundColor: `#e5e5f7`,
            opacity: `0.1`,
            backgroundImage: `repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 40px ), repeating-linear-gradient( #444cf755, #444cf7 )`,
          }}
        ></div>
        <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-t from-white to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-28 sm:py-36 md:py-40 items-center">
            <div>
              <h1 className="text-6xl leading-tight">Your Gateway to AI-Generated Music Magic!</h1>
            </div>
            <div>
              <p className="text-lg mb-4">
                Muxtopia is not just a website; it&apos;s a revolutionary platform that transforms your creative sparks into captivating melodies. Powered by
                cutting-edge AI technology and embraced by the decentralized web, Muxtopia is where music meets innovation.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary rounded-full text-white shadow shadow-primary/40 hover:shadow-lg transition-all duration-500 hover:shadow-primary/50 hover:bg-purple-700"
              >
                Try for free
              </Link>
            </div>
          </div>

          <div className="w-full relative mb-36">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {samples.map((i) => (
                <div
                  key={i.id}
                  className={`${mono.className} w-full rounded-xl p-4 md:p-6 flex flex-col gap-6 justify-between ${i.color} bg-opacity-40 font-medium shadow hover:shadow-md transition-all hover:-translate-y-1 hover:bg-opacity-50 duration-300`}
                >
                  <h6 className="text-lg -tracking-wide opacity-80">&quot;{i.prompt}&quot;</h6>
                  <div>
                    <MediaPlayer title="Sprite Fight" src={i.audio}>
                      <MediaProvider />
                      <Controls.Root className="media-controls:opacity-100 absolute inset-0 z-10 flex">
                        <Controls.Group className="flex w-full items-center">
                          <PlayButton className="bg-white/60 hover:bg-white rounded-full shrink-0 p-2 transition-all">
                            <PlayIcon className="media-paused:block hidden play-icon w-5 h-5 text-black/50" />
                            <PauseIcon className="media-paused:hidden block pause-icon w-5 h-5 text-black/50" />
                          </PlayButton>

                          <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full rounded-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
                            <TimeSlider.Track className={`relative ring-sky-400 z-0 h-[5px] w-full rounded-full bg-white/50 group-data-[focus]:ring-[3px]`}>
                              <TimeSlider.TrackFill className={`absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width] ${i.color}`} />
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-10">Why Muxtopia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center justify-center text-primary w-16 h-16 bg-primary/20 rounded-xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24">
                  <g fill="none">
                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"></path>
                    <path
                      fill="currentColor"
                      d="M21 5.18V17a4 4 0 11-2-3.465V9.181L9 10.847V18c0 .06-.005.117-.015.174A3.5 3.5 0 117 15.337v-8.49a2 2 0 011.671-1.973l10-1.666A2 2 0 0121 5.18M5.5 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3M17 15a2 2 0 100 4 2 2 0 000-4m2-9.82L9 6.847V8.82l10-1.667z"
                    ></path>
                  </g>
                </svg>
              </div>
              <h6 className="font-bold text-lg mb-2">Create Music, Effortlessly</h6>
              <p className="text-black/70">
                Transform your ideas into music with a simple prompt. Muxtopia&apos;s AI engine does the rest, crafting unique and personalized melodies just
                for you.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center text-primary w-16 h-16 bg-primary/20 rounded-xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 32 32">
                  <path
                    fill="currentColor"
                    d="M16 20a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2M5 20a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2m5 17a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2m12 6a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2m5-5a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2m-5-5a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2M10 9a4 4 0 114-4 4.005 4.005 0 01-4 4m0-6a2 2 0 102 2 2.002 2.002 0 00-2-2"
                  ></path>
                </svg>
              </div>
              <h6 className="font-bold text-lg mb-2">Decentralized and Empowering</h6>
              <p className="text-black/70">
                Say goodbye to centralized control. Muxtopia harnesses the power of the decentralized web, giving you ownership and control over your musical
                creations.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center text-primary w-16 h-16 bg-primary/20 rounded-xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 32 32">
                  <path
                    fill="currentColor"
                    d="M6 21v-1H4v1a7 7 0 007 7h3v-2h-3a5 5 0 01-5-5m18-10v1h2v-1a7 7 0 00-7-7h-3v2h3a5 5 0 015 5m-13 0H5a3 3 0 00-3 3v2h2v-2a1 1 0 011-1h6a1 1 0 011 1v2h2v-2a3 3 0 00-3-3m-3-1a4 4 0 10-4-4 4 4 0 004 4m0-6a2 2 0 11-2 2 2 2 0 012-2m19 21h-6a3 3 0 00-3 3v2h2v-2a1 1 0 011-1h6a1 1 0 011 1v2h2v-2a3 3 0 00-3-3m-7-5a4 4 0 104-4 4 4 0 00-4 4m6 0a2 2 0 11-2-2 2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <h6 className="font-bold text-lg mb-2">Collaborate</h6>
              <p className="text-black/70">
                Connect with a community of music enthusiasts. Collaborate on projects and share prompts.The possibilities are endless when creative minds come
                together.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-primary py-24 mt-24 text-center px-4 text-white">
        <h2 className="text-3xl mb-2">Ready to Make Music Like Never Before?</h2>
        <h4 className="text-2xl font-extrabold">Try Muxtopia Today!</h4>
        <Link href="/generate" className="px-6 py-3 bg-white inline-flex text-primary rounded-full font-bold mt-4">
          Try Now
        </Link>
      </div>
    </>
  );
}
