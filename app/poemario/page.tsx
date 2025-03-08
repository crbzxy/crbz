"use client";
import React, { useState, useEffect } from "react";

interface PoemaVersion {
  version: string;
  lineas: string[];
}

const poemaData: PoemaVersion[] = [
  {
    version: "Trilingüe con Japonés en Ideogramas (Kanji y Kana)",
    lineas: [
      "Dans le code crépusculaire / 月明かりの下 / Siento tu ausencia",
      "Les ombres pixelizadas / 孤独が包む / Mi corazón beats solo",
      "Les rêves en réalité virtuelle / 静寂のVR / Busco tu pohľad",
      "Sous les étoiles binaires / 涙のLED / Anhelo your presencia",
      "Lueur de nostalgie holográfica / 夜風のホログラム / Te čakám en silencio",
      "Silence profond des serveurs / 心が叫ぶ / Mis pensamientos fly",
      "Esprits errants dans le net / 闇のインターネット / Me pierdo en spomienkach",
      "Au bord du monde digital / 闇夜のネタ / Mi soul se desvanece",
    ],
  },
  {
    version: "Trilingüe con Japonés en Romaji",
    lineas: [
      "Siento tu ausencia / Tsukiakari no shita / Dans le code glow",
      "Mi corazón late solo / Kodoku ga tsutsumu / Les ombres digital",
      "Busco tu mirada / Seijaku no VR / Les rêves spomienky",
      "Anhelo tu presencia / Namida no LED / Sous les binárnymi étoiles",
      "Te espero en silence / Yokaze no hologramu / Nostalgia breeze",
      "Mis pensamientos vuelan / Kokoro ga sakebu / Silence profond servers",
      "Me pierdo en internet / Yami no cyberspace / Esprits errants spomienkach",
      "Mi alma disappears / Yami yo no neta / Au bord digital",
    ],
  },
  {
    version: "Completamente Traducida al Español",
    lineas: [
      "En el código crepuscular / Bajo la luz de la luna / Siento tu ausencia",
      "Las sombras pixeladas / La soledad me envuelve / Mi corazón late solo",
      "Los sueños en realidad virtual / Silencio del VR / Busco tu mirada",
      "Bajo las estrellas binarias / Lágrimas de LED / Anhelo tu presencia",
      "Te espero en silencio / El viento frío del holograma / La nostalgia me invade",
      "Mis pensamientos vuelan / Mi corazón grita / Silencio profundo de los servidores",
      "Me pierdo en recuerdos / Oscuridad de la red / Espíritus errantes",
      "Mi alma se desvanece / Noche en la red / Al borde del mundo digital",
    ],
  },
];

export default function PoemaDinamico() {
  const totalLineas = poemaData[0].lineas.length;

  // Estado para manejar la versión actual de cada palabra
  const [wordVersions, setWordVersions] = useState<number[][]>(
    poemaData[0].lineas.map((linea) => linea.split(" ").map(() => 0))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVersions((prev) => {
        const randomLinea = Math.floor(Math.random() * totalLineas);
        const randomWord = Math.floor(
          Math.random() * poemaData[0].lineas[randomLinea].split(" ").length
        );

        return prev.map((row, li) =>
          row.map((ver, wi) => {
            if (li === randomLinea && wi === randomWord) {
              return (ver + 1) % poemaData.length;
            }
            return ver;
          })
        );
      });
    }, 90); // Cambia una palabra cada 300 ms

    return () => clearInterval(interval);
  }, [totalLineas]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white-900 to-white-800 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white-800 rounded-lg shadow-2xl p-8 space-y-6">
    
        <div className="space-y-6">
          {poemaData[0].lineas.map((linea, i) => (
            <div
              key={`line${i}`}
              className=" leading-relaxed text-center"
            >
              {linea.split(" ").map((_, j) => {
                const versionIndex = wordVersions[i]?.[j] ?? 0;
                const palabra = poemaData[versionIndex].lineas[i].split(" ")[j] || "";
                return (
                  <span
                    key={`word${j}`}
                    className="mx-1 transition-colors duration-500 ease-in-out font-serif"
                    style={{
                      color: getColorForVersion(versionIndex),
                    }}
                  >
                    {palabra}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getColorForVersion(versionIndex: number): string {
  switch (versionIndex) {
    case 0:
      return "#d1d1d1"; // Light white for first version
    case 1:
      return "#9e9e9e"; // Medium white for second version
    case 2:
      return "#ffffff"; // White for third version
    default:
      return "#e0e0e0"; // Default fallback white
  }
}
