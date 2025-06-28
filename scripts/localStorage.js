// FUNÇÃO QUE ARMAZENA OS DADOS NO LOCALSTORAGE PARA OUTRA FUNÇÃO RENDERIZAR.

export function salvarDadosLocalStorage(filmes) {
  const buscarDadosLocalStorage = JSON.parse(localStorage.getItem('filmesFavoritos')) || []
  const novoFilme = {
    title: filmes.title,
    poster: filmes.poster_path,
    biografia: filmes.overview,
    classificação: filmes.vote_average,
    year: new Date(filmes.release_date)
  }
  buscarDadosLocalStorage.push(novoFilme)
  localStorage.setItem('filmesFavoritos', JSON.stringify(buscarDadosLocalStorage))
  alert(`${filmes.title} adicionado aos favoritos`)
}

export function apagarDadosLocalStorage(filmes) {
  const buscarDadosLocalStorage = JSON.parse(localStorage.getItem('filmesFavoritos')) || []
  const dadosAtualizados = buscarDadosLocalStorage.filter(filme => filme.title != filmes.title)
  localStorage.setItem('filmesFavoritos', JSON.stringify(dadosAtualizados))
  alert(`${filmes.title} foi removido dos favoritos.`)
}