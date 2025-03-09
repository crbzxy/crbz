"use client";
import React, { useState, useEffect, useRef } from "react";

interface PoemaVersion {
  version: string;
  lineas: string[];
  color: string;
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
    color: "#6366f1" // Indigo
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
    color: "#3b82f6" // Blue
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
    color: "#8b5cf6" // Purple
  },
];

// Tipo para representar una palabra en diferentes versiones
type WordVersions = string[];

// Tipo para representar una línea procesada del poema
type ProcessedLine = WordVersions[];

export default function PoemaDinamico() {
  const totalLineas = poemaData[0].lineas.length;
  const poemRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(true);

  // Estado para manejar la versión actual de cada palabra
  const [wordVersions, setWordVersions] = useState<number[][]>(() =>
    Array(totalLineas).fill(0).map((_, i) => {
      // Divide cada línea en segmentos (frases separadas por /)
      const segments = poemaData[0].lineas[i].split("/");
      // Crea un array de versiones (0) para cada palabra en cada segmento
      return segments.flatMap(seg => seg.trim().split(" ").map(() => 0));
    })
  );

  // Función para procesar el poema y obtener palabras consistentemente
  const processPoem = (poema: PoemaVersion[], lineIndex: number): ProcessedLine => {
    const segments = poema.map(version => {
      return version.lineas[lineIndex].split("/").map(s => s.trim());
    });

    // Aseguramos que tenemos la misma estructura para todas las versiones
    const result: ProcessedLine = [];
    for (let i = 0; i < segments[0].length; i++) {
      const segmentWords = segments.map(s => s[i]?.split(" ") || []);
      const maxWords = Math.max(...segmentWords.map(w => w.length));

      for (let j = 0; j < maxWords; j++) {
        result.push(segmentWords.map(w => w[j] || ""));
      }

      // Añadir separador "/" excepto al final
      if (i < segments[0].length - 1) {
        result.push(poema.map(() => "/"));
      }
    }
    return result;
  };

  // Algoritmo mejorado para cambiar palabras
  useEffect(() => {
    if (!animating) return;

    const interval = setInterval(() => {
      setWordVersions((prev) => {
        // Selecciona una línea aleatoria
        const randomLinea = Math.floor(Math.random() * totalLineas);

        // Procesa la estructura de palabras para esa línea
        const lineWords = processPoem(poemaData, randomLinea);

        // Selecciona una posición aleatoria (evitando los separadores '/')
        let randomPosition;
        let attempts = 0;
        do {
          randomPosition = Math.floor(Math.random() * lineWords.length);
          attempts++;
        } while (lineWords[randomPosition][0] === "/" && attempts < 10);

        // Actualiza la versión de esa palabra
        return prev.map((line, li) => {
          if (li === randomLinea) {
            return line.map((version, wi) => {
              if (wi === randomPosition) {
                return (version + 1) % poemaData.length;
              }
              return version;
            });
          }
          return line;
        });
      });
    }, 150);

    return () => clearInterval(interval);
  }, [totalLineas, animating]);

  // Efecto para animar la aparición inicial
  useEffect(() => {
    const animation = setTimeout(() => {
      if (poemRef.current) {
        poemRef.current.classList.remove('opacity-0');
        poemRef.current.classList.add('opacity-100');
      }
    }, 300);

    return () => clearTimeout(animation);
  }, []);

  // Obtener el color de una versión específica
  const getVersionColor = (versionIndex: number): string => {
    // Aseguramos que el índice esté dentro del rango
    if (versionIndex >= 0 && versionIndex < poemaData.length) {
      return poemaData[versionIndex].color;
    }
    // Color por defecto en caso de error
    return "#ffffff";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 flex items-center justify-center p-4 sm:p-8 font-roboto-condensed pt-24">
      <div className="max-w-5xl w-full mx-auto">

        {/* Controls */}

        {/* Poem */}
        <div
          ref={poemRef}
          className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 transition-opacity duration-1000 opacity-0 border border-gray-700"
        >
          <div className="space-y-6 md:space-y-8">
            <button
              onClick={() => setAnimating(!animating)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg fixed left-full bottom-0 ml-4 ${animating
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              title={animating ? 'Pausar animación' : 'Reanudar animación'}
              aria-label={animating ? 'Pausar animación' : 'Reanudar animación'}
            >
              {animating ? (
                // Icono de pausa
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                // Icono de play
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            {poemaData[0].lineas.map((_, i) => {
              const processedLine = processPoem(poemaData, i);
              return (
                <div
                  key={`line${i}`}
                  className="leading-relaxed text-center text-lg md:text-xl tracking-wide"
                >
                  {processedLine.map((words, j) => {
                    // Obtenemos la palabra correspondiente a la versión actual
                    const versionIdx = wordVersions[i]?.[j] ?? 0;
                    const palabra = words[versionIdx] || "";

                    if (palabra === "/") {
                      return (
                        <span key={`sep${j}`} className="text-gray-500 mx-2">
                          /
                        </span>
                      );
                    }

                    return (
                      <span
                        key={`word${j}`}
                        className="mx-1 transition-colors duration-500 ease-in-out"
                        style={{
                          color: getVersionColor(versionIdx)
                        }}
                      >
                        {palabra}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
