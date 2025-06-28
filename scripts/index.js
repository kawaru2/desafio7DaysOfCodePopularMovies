import { options } from '../environment/apiConfiguration.js'
import { testeDados } from './fetch.js'
import { salvarDadosLocalStorage, apagarDadosLocalStorage } from './localStorage.js'

export const $listaFilmes = document.querySelector('#listaFilmes')
const inputBusca = document.querySelector('#search')
const busca = document.querySelector('#search-icon')
const caixaFavoritos = document.querySelector('#cabecalho label')

if (!localStorage.getItem('filmesFavoritos')) {
  localStorage.setItem('filmesFavoritos', JSON.stringify([]))
}

// AGORA A FUNÇÃO PARA RENDERIZAR A LISTA DE FILMES NO HTML.

export function renderFilme(filmes) {
  const cartaoFilme = document.createElement('li')
  cartaoFilme.classList.add('opcoesFilmes')
  const verificacaoFilmes = JSON.parse(localStorage.getItem('filmesFavoritos')) || []
  const favoritados = verificacaoFilmes.some(filmeStorage => filmeStorage.title === filmes.title)
  cartaoFilme.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${filmes.poster_path}" alt="capa do filme" class="capaDoFilme">
        <div class="tituloEAvaliacao">
          <h2 class="tituloDoFilme">${filmes.title} (${new Date(filmes.release_date).getFullYear()})</h2>
          <div>
            <div class="avaliacaoDoFilme">
              <img src="./images/star.svg" alt="Estrela de identificação de avaliação do filme" class="imgAvaliacao">
              <p class="valorAvaliacao">${filmes.vote_average.toFixed(1)}</p>
            </div>
            <div class="favoritarFilme">
              <label class="labelFavorito"><img src="${favoritados ? './images/heartFull.svg' : './images/heart.png'}" class="btnFavoritar"><span>${favoritados ? 'Favorito' : 'Favoritar'}</span></label>
            </div>
          </div>
        </div>
        <p class="biografiaDoFilme">${filmes.overview}</p>
  `
  $listaFilmes.appendChild(cartaoFilme)

  const favorito = cartaoFilme.querySelector('.labelFavorito')
  favorito.addEventListener('click', () => { // item.currentTarget me trás a tag exata do coração
  const fav = favorito.querySelector('span')

  const heart = favorito.querySelector('.btnFavoritar')

  heart.src.includes('heart.png') ? heart.src = './images/heartFull.svg' : heart.src = './images/heart.png' // SUBSTITUIU O IF/ELSE

  heart.src.includes('heartFull.svg') ? fav.textContent = 'Favorito' : fav.textContent = 'Favoritar'

  // CÓDIGO PARA ADICIONAR OS DADOS PARA O LOCALSTORAGE.

  heart.src.includes('heartFull.svg') ? salvarDadosLocalStorage(filmes) : apagarDadosLocalStorage(filmes)
})
}

// FUNÇÃO QUE RENDERIZA OS FILMES PARA A PÁGINA.

window.onload = testeDados

// FUNÇÃO QUE RECEBE O QUE FOI DIGITADO NA BARRA DE PESQUISA E BUSCA ALGUM FILME

async function pesquisa() {
  const clearDados = document.querySelector('#listaFilmes')
  clearDados.innerHTML = ''
  const barraDePesquisa = document.querySelector('#search').value
  if (barraDePesquisa.length === 0 || barraDePesquisa === '') {
    testeDados()
  }
  const resultadoDaBusca = await fetch(`https://api.themoviedb.org/3/search/movie?query=${barraDePesquisa}&include_adult=false&language=pt-BR`, options)
  const resultadoConvertido = await resultadoDaBusca.json() // ESTÁ ME ENTREGRANDO O RESULTADO (PRECISO UTILIZAR O RESULTS)
  resultadoConvertido.results.forEach(filmes => renderFilme(filmes))
}

// EVENTO QUE RENDERIZA O QUE FOI PESQUISADO

busca.addEventListener('click', (evento) => {
  evento.preventDefault()
  pesquisa()
  inputBusca.value = ''
  
})

// EVENTO QUE BUSCA O FILME UTILIZANDO A TECLA ENTER

inputBusca.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    pesquisa()
    inputBusca.value = ''
  }
})

function renderLocalStorage() {
  const listaFilmesLocalStorage = JSON.parse(localStorage.getItem('filmesFavoritos')) || []
  $listaFilmes.innerHTML = ''
  listaFilmesLocalStorage.forEach(filme => {
  const filmeLocalStorage = document.createElement('li')
  filmeLocalStorage.classList.add('opcoesFilmes')
  filmeLocalStorage.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${filme.poster}" alt="capa do filme" class="capaDoFilme">
        <div class="tituloEAvaliacao">
          <h2 class="tituloDoFilme">${filme.title} (${new Date(filme.year).getFullYear()})</h2>
          <div>
            <div class="avaliacaoDoFilme">
              <img src="./images/star.svg" alt="Estrela de identificação de avaliação do filme" class="imgAvaliacao">
              <p class="valorAvaliacao">${filme.classificação}</p>
            </div>
            <div class="favoritarFilme">
              <label class="labelFavorito"><img src="./images/heartFull.svg" class="btnFavoritar"><span>Favorito</span></label>
            </div>
          </div>
        </div>
        <p class="biografiaDoFilme">${filme.biografia}</p>
`
$listaFilmes.appendChild(filmeLocalStorage)

})

// RENDERIZAR AS IMAGENS DA CAIXA DE FAVORITOS MARCADA E DESMARCADA.

const btnRenderFavoritos = document.querySelector('#favoritos')
btnRenderFavoritos.src.includes('checkbox.png') ? btnRenderFavoritos.src = './images/checked.svg' : btnRenderFavoritos.src = './images/checkbox.png'

}

// EVENTO DE CLICAR PARA RENDERIZAR APENAS FILMES FAVORITADOS.

caixaFavoritos.addEventListener('click', () => {
  const renderFilmesFavoritados = document.querySelector('#favoritos')
  renderFilmesFavoritados.src.includes('checkbox.png') ? renderLocalStorage() : newTesteDados()
})

function newTesteDados() {
  const btnRenderFavoritos = document.querySelector('#favoritos')
  btnRenderFavoritos.src.includes('checkbox.png') ? btnRenderFavoritos.src = './images/checked.svg' : btnRenderFavoritos.src = './images/checkbox.png'
  testeDados()
}