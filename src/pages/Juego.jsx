
import "../Styles/Juego.css";
import { getValidate } from "../Services/Validate.js";
import { useEffect, useState, useRef } from "react";

export default function Juego() {
  const [puntos, setPuntos] = useState(0);
  const [tiempo, setTiempo] = useState(15);
  const [palabra, setPalabra] = useState("");
  const [ultimaLetra, setUltimaLetra] = useState("");
  const [palabrasUsadas, setPalabrasUsadas] = useState([]);
  const [terminado, setTerminado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [validando, setValidando] = useState(false);
  const [diccionarioFallando, setDiccionarioFallando] = useState(false);

  const intervalo = useRef(null);
  const decimas = useRef(0);
  const palabraPendiente = useRef("");

  useEffect(() => {
    if (terminado || validando || diccionarioFallando) {
      return;
    }

    intervalo.current = setInterval(() => {
      decimas.current += 1;

      if (decimas.current >= 10) {
        decimas.current = 0;

        setTiempo((tiempoActual) => Math.max(0, tiempoActual - 1));
      }
    }, 100);

    return () => clearInterval(intervalo.current);
  }, [terminado, validando, diccionarioFallando]);

  useEffect(() => {
    if (tiempo === 0) {
      setTerminado(true);
    }
  }, [tiempo]);

  async function validarPalabra(palabraIngresada) {
    setValidando(true);
    setDiccionarioFallando(false);
    setMensaje("");

    let temporizador;

    try {
      const existe = await Promise.race([
        getValidate(palabraIngresada),
        new Promise((_, reject) => {
          temporizador = setTimeout(() => {
            reject(new Error("TIMEOUT"));
          }, 8000);
        }),
      ]);

      if (!existe) {
        palabraPendiente.current = "";
        setMensaje("¡Esa palabra no existe en el diccionario!");
        return;
      }

      palabraPendiente.current = "";

      setPuntos((puntosActuales) => puntosActuales + palabraIngresada.length);
      setUltimaLetra(palabraIngresada.slice(-1));

      setPalabrasUsadas((palabrasActuales) => [
        ...palabrasActuales,
        palabraIngresada,
      ]);

      decimas.current = 0;
      setTiempo(15);
      setPalabra("");
      setMensaje("¡Palabra válida! Seguí encadenando.");
    } catch (error) {
      console.error("Error al validar la palabra:", error);

      palabraPendiente.current = palabraIngresada;
      setDiccionarioFallando(true);
    } finally {
      clearTimeout(temporizador);
      setValidando(false);
    }
  }

  async function comprobarPalabra(event) {
    event.preventDefault();

    const palabraIngresada = palabra.trim().toLocaleLowerCase("es");

    if (
      palabraIngresada === "" ||
      validando ||
      terminado ||
      diccionarioFallando
    ) {
      return;
    }

    setMensaje("");

    if (palabrasUsadas.includes(palabraIngresada)) {
      setMensaje("¡Ya utilizaste esa palabra!");
      return;
    }

    if (
      ultimaLetra !== "" &&
      !palabraIngresada.startsWith(ultimaLetra)
    ) {
      setMensaje(`¡La palabra debe comenzar con "${ultimaLetra}"!`);
      return;
    }

    palabraPendiente.current = palabraIngresada;
    validarPalabra(palabraIngresada);
  }

  function volverAJugar() {
    setPuntos(0);
    setTiempo(15);
    setPalabra("");
    setUltimaLetra("");
    setPalabrasUsadas([]);
    setTerminado(false);
    setMensaje("");
    setValidando(false);
    setDiccionarioFallando(false);
    palabraPendiente.current = "";
    decimas.current = 0;
  }

  return (
    <div className="juego-container">
      {!terminado ? (
        <>
          <div className="temporizador">
            {tiempo}
          </div>

          <h1 className="juego-titulo">
            Coloca una palabra en español, mientras más larga, más puntos obtendrás
          </h1>

          <div className="juego-puntos">
            Puntos: {puntos}
          </div>

          {ultimaLetra !== "" && (
            <p className="juego-instruccion">
              Tu palabra debe comenzar con:{" "}
              <strong>{ultimaLetra.toUpperCase()}</strong>
            </p>
          )}

          <form className="juego-formulario" onSubmit={comprobarPalabra}>
            <input
              type="text"
              value={palabra}
              onChange={(event) => setPalabra(event.target.value)}
              placeholder="Escribí una palabra..."
              disabled={validando || diccionarioFallando}
            />

            <button
              type="submit"
              disabled={
                validando ||
                diccionarioFallando ||
                palabra.trim() === ""
              }
            >
              {validando ? "Validando..." : "Enviar"}
            </button>
          </form>

          {diccionarioFallando ? (
            <div className="juego-error-diccionario">
              <p>El diccionario virtual está fallando :(</p>

              <button
                type="button"
                onClick={() => validarPalabra(palabraPendiente.current)}
              >
                Volver a probar el diccionario
              </button>
            </div>
          ) : (
            <p className="juego-mensaje">{mensaje}</p>
          )}

          <div className="juego-cadena">
            <h2>Palabras utilizadas</h2>

            {palabrasUsadas.length === 0 ? (
              <p>Todavía no hay palabras.</p>
            ) : (
              <p>{palabrasUsadas.join(" → ")}</p>
            )}
          </div>
        </>
      ) : (
        <div className="juego-final">
          <h1>¡Fin de la partida!</h1>
          <h2>Obtuviste {puntos} puntos</h2>
          <p>Palabras utilizadas: {palabrasUsadas.length}</p>

          <button type="button" onClick={volverAJugar}>
            Volver a jugar
          </button>
        </div>
      )}
    </div>
  );
}
