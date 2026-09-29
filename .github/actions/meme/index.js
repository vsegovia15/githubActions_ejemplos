const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

// Comentarios que delimitan el meme dentro del README
const INICIO = '<!-- MEME_START -->';
const FIN = '<!-- MEME_END -->';

// Plantillas de memegen entre las que se elige una al azar
const PLANTILLAS = ['buzz', 'doge', 'fry', 'success', 'fine', 'rollsafe'];

// Adapta el texto al formato de URL de memegen (espacios -> _, ? -> ~q, etc.)
function textoParaMemegen(texto) {
  return encodeURIComponent(
    texto
      .replace(/_/g, '__')
      .replace(/-/g, '--')
      .replace(/ /g, '_')
      .replace(/\?/g, '~q')
      .replace(/%/g, '~p')
      .replace(/#/g, '~h')
      .replace(/\//g, '~s')
      .replace(/"/g, "''")
  );
}

// Busca el README en la raíz sin importar mayúsculas/minúsculas
function buscarReadme() {
  const archivo = fs.readdirSync(process.cwd()).find((f) => f.toLowerCase() === 'readme.md');
  if (!archivo) {
    throw new Error('No se ha encontrado el fichero README.md en la raíz del repositorio');
  }
  return path.join(process.cwd(), archivo);
}

function run() {
  try {
    // Parámetros de entrada
    const frasePositiva = core.getInput('frase_positiva');
    const fraseNegativa = core.getInput('frase_negativa');
    const resultadoTest = core.getInput('resultado_test');

    // Frase según el resultado de los tests y plantilla aleatoria
    const frase = resultadoTest === 'success' ? frasePositiva : fraseNegativa;
    const plantilla = PLANTILLAS[Math.floor(Math.random() * PLANTILLAS.length)];
    const urlMeme = `https://api.memegen.link/images/${plantilla}/${textoParaMemegen(frase)}.png`;

    console.log(`Resultado de los tests: ${resultadoTest}`);
    console.log(`Frase elegida: ${frase}`);
    console.log(`URL del meme: ${urlMeme}`);

    // Leer el README y comprobar que tiene los delimitadores
    const rutaReadme = buscarReadme();
    const readme = fs.readFileSync(rutaReadme, 'utf8');

    if (!readme.includes(INICIO) || !readme.includes(FIN)) {
      throw new Error(`El README debe contener los comentarios ${INICIO} y ${FIN}`);
    }

    // Sustituir lo que haya entre los comentarios por el nuevo meme
    const bloqueMeme = `${INICIO}\n![Meme resultado de los tests](${urlMeme})\n${FIN}`;
    const nuevoReadme = readme.replace(new RegExp(`${INICIO}[\\s\\S]*?${FIN}`), bloqueMeme);

    fs.writeFileSync(rutaReadme, nuevoReadme);

    // Respuesta de la acción
    console.log('Meme añadido al readme');
    core.setOutput('respuesta', 'Meme añadido al readme');
  } catch (error) {
    core.setFailed(`Error al añadir el meme: ${error.message}`);
  }
}

run();
