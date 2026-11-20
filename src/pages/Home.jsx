import { useState } from "react";
import Juego from "./Juego";
import "../Styles/Home.css";

export default function Home() {
  const [jugando, setJugando] = useState(false);

  return (
    <div>
      {jugando ? (
        <Juego />
      ) : (
        <>
          <h1 className="TituloLlamativo">
            EL GRANDIOSO JUEGO
          </h1>

          <h1 className="TituloLlamativo">
            DE LAS PALABRAS
          </h1>
          <h1 className="Instrucciones">
            <br />
            ¿Puedes pensar palabras rapidamente? Aqui lo sabras.
            <br />
      
            Debes colocar una palabra en español para iniciar, luego una palabra que comienze con la ultima de la palabra ingresada y asi hasta que ya no se te ocurran mas
            <br />
            Obtienes puntos por cada letra de una palabra
          </h1>
          <button
            type="button"
            className="ComenzarButton"
            onClick={() => setJugando(true)}
          >
            Presione para comenzar
          </button>
        </>
      )}
    </div>
  );
}