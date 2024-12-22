import Image from "next/image";
import home1 from "../public/images/home/hero-image.png";
export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-roboto text-gray-800 bg-gray-50 max-w-[900]">
      <main className="max-w-4xl flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        <Image
          src={home1} // Cambia por la ruta de tu imagen
          alt="Carlos Armando Boyzo"
          width={300}
          height={680}
          className="rounded-lg "
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            Creator & Artist
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            At the intersection of code and digital canvas, I orchestrate experiences that transcend the traditional dichotomy between functionality and aesthetics, weaving a narrative where each interaction becomes a dialogic performance between user and machine. My practice deconstructs the conventional boundaries of digital design, materializing interfaces that are both manifestations of algorithmic efficiency and expressions of visual contemporaneity.</p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Through a praxis that synthesizes technical rigor with artistic sensibility, I transform digital spaces into fields of exploration where user experience elevates into a form of processual art. My work not only responds to the pragmatic demands of the digital present but acts as a catalyst for the evolution of human-machine interaction, creating digital ecosystems that resonate with the complexity and fluidity of contemporary experience. </p>

          <a
            href="mailto:carlos.boor@gmail.com" // Cambia a tu correo
            className="flex items-center justify-center mt-8 w-10 h-10 text-gray-900 border rounded-full hover:bg-gray-100"
          >
            ✉️
          </a>
        </div>
      </main>

    </div>
  );
}
