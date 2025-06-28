import { renderFilme, $listaFilmes } from './index.js'
import { apiKey, options } from '../environment/apiConfiguration.js'
export async function testeDados() {
  const dadosFilmes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`, options)
  const dadosConvertidos = await dadosFilmes.json()
  $listaFilmes.innerHTML = ''
  dadosConvertidos.results.forEach((filmes) => {renderFilme(filmes)})
}