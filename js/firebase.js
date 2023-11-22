// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlQdThmJw3MIGpx56ZHPnyP1S8mW66EK4",
  authDomain: "cadclin-firebase.firebaseapp.com",
  projectId: "cadclin-firebase",
  storageBucket: "cadclin-firebase.appspot.com",
  messagingSenderId: "953014587421",
  appId: "1:953014587421:web:3d4a4d00c8ee2584a976f4"
};

//Inicializando o Firebase
firebase.initializeApp(firebaseConfig)
//Definindo a URL padrão do site
const urlApp = 'https://dayanefoliveira.github.io/CadClin-firebase'

// Função para fazer login usando o Google
function logaGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      window.location.href = 'inicio.html'
    }).catch((error) => {
      alert(`Erro ao efetuar o login: ${error.message}`)
    })
}

// Função para verificar se o usuário está logado
function verificaLogado() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) { //Contém dados do login?
      //Salvamos o id do usuário localmente
      localStorage.setItem('usuarioId', user.uid)

      //Inserindo a imagem do usuário      
      let imagem = document.getElementById('imagemUsuario')
      user.photoURL
        ? imagem.innerHTML += `<img src="${user.photoURL}" title="${user.displayName}" class="img rounded-circle" width="40" />`
        : imagem.innerHTML += '<img src="images/person-circle.svg" title="Usuário sem foto" class="img rounded-circle" width="32" />'

    } else {
      // Se o usuário não estiver logado, redireciona para a tela de login
      localStorage.removeItem('usuarioId') //Removemos o id salvo
      window.location.href = 'login.html' //direcionamos para o login        
    }
  })
}

// Função para fazer logout
function logoutFirebase() {
  firebase.auth().signOut()
    .then(function () {
      localStorage.removeItem('usuarioId')
      window.location.href = 'login.html'
    })
    .catch(function (error) {
      alert(`Não foi possível efetuar o logout: ${error.message}`)
    })
}

// Função para salvar informações do pet no Firebase
async function salvaPet(pet) {
  // Obtém o modo de edição da URL
  const params = new URLSearchParams(window.location.search)
  const editar = params.get('editar')
  const id_pet = params.get('id')

  // Obtendo o usuário atual
  let usuarioAtual = firebase.auth().currentUser

  try {
    if (editar) {
      // Se estiver em modo de edição, atualiza os dados existentes
      await firebase.database().ref(`CadPets/${id_pet}`).update({
        ...pet,
        usuarioInclusao: {
          uid: usuarioAtual.uid,
          nome: usuarioAtual.displayName,
        },
      })
      alert('✔ Registro atualizado com sucesso!')
    } else {
      // Se não estiver em modo de edição, cria um novo cadastro
      await firebase.database().ref('CadPets').push({
        ...pet,
        usuarioInclusao: {
          uid: usuarioAtual.uid,
          nome: usuarioAtual.displayName,
        },
      })
      alert('✔ Registro incluído com sucesso!')
    }

    //Limpar o formulário 
    document.getElementById('formCadastro').reset()

    //Redireciona para a tela de registro
    window.location.href = `${urlApp}/RegistroPets.html`

  } catch (error) {
    alert(`❌Erro ao salvar: ${error.message}`)
  }
}

// evento submit do formulário
document.getElementById('formCadastro').addEventListener('submit', function (event) {
  event.preventDefault() //evita o recarregamento da página
  const pet = {
    proprietario: document.getElementById('proprietario').value,
    telefone: document.getElementById('telefone').value,
    endereco: document.getElementById('endereco').value,
    nome: document.getElementById('nome').value,
    raca: document.getElementById('raca').value,
    especie: document.getElementById('especie').value,
    data: document.getElementById('data').value,
    sexo: document.querySelector('input[name="radio"]:checked').value,
    status: document.getElementById('checkbox').value,
  }
  salvaPet(pet)
})

// Função para carregar os dados dos pets na tabela
async function carregaCadPets() {
  const tabela = document.getElementById('dadosTabela')
  const usuarioAtual = localStorage.getItem('usuarioId')

  await firebase.database().ref('CadPets').orderByChild('proprietario')
    .on('value', (snapshot) => {
      //Limpamos a tabela
      tabela.innerHTML = ``
      if (!snapshot.exists()) { 
        //Se não houver registros/snapshot, exibe uma mensagem
        tabela.innerHTML = `<tr class='table-danger'><td colspan='4'>Ainda não existe nenhum registro cadastrado.</td></tr>`
      } else { //se existir o snapshot, montamos a tabela
        snapshot.forEach(item => {
          const dados = item.val() //Obtém os dados
          const id = item.key // Obtém o id
          const isUsuarioAtual = (dados.usuarioInclusao.uid === usuarioAtual)
          const botaoRemover = isUsuarioAtual
            ? `<button class='btn btn-sm btn-danger' onclick='removePet("${id}")'
        title='Excluir o registro atual'>🗑 Excluir</button>`
            : `🚫indisponível`

          const botaoEditar = isUsuarioAtual
            ? `<button class='btn btn-sm btn-warning' onclick='editarPet("${id}")' title='Editar o registro atual'>✎ Editar</button>`
            : ``

          tabela.innerHTML += `
        <tr>
          <td>${dados.proprietario}</td>
          <td>${dados.telefone}</td>
          <td>${dados.endereco}</td>
          <td>${dados.nome}</td>
          <td>${dados.raca}</td>
          <td>${dados.especie}</td>
          <td>${dados.data}</td>
          <td>${dados.sexo}</td>
          <td>${dados.status}</td>         
          <td>${botaoEditar} ${botaoRemover}</td>
          </tr>
          `
        })
      }
    })
}

// Função para remover um registro pet
async function removePet(id) {
  if (confirm('Deseja realmente excluir o cadastro?')) {
    const petRef = await firebase.database().ref('CadPets/' + id)

    //Remova o registro do pet do Firebase
    petRef.remove()
      .then(function () {
        alert('Cadastro excluído com sucesso!')
      })
      .catch(function (error) {
        alert(`Erro ao excluir o cadastro: ${error.message}. Tente novamente`)
      })
  }
}

// Função para editar um pet
async function editarPet(id) {
  if (confirm('Deseja realmente editar o cadastro?')) {
    window.location.href = `${urlApp}/CadPets.html?id=${id}&editar=true`
    //Remova o pet do Firebase
    petRef.editarPet()
      .then(function () {
        alert('Cadastro editado com sucesso!')
      })
      .catch(function (error) {
        alert(`Erro ao editar o cadastro: ${error.message}. Tente novamente`)
      })
  }
}

// Carrega dados do pet para edição
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  const editar = params.get('editar')

  if (editar) {
    // Carrega os dados do pet para edição
    const petRef = firebase.database().ref(`CadPets/${id}`)
    petRef.once('value', (snapshot) => {
      const petData = snapshot.val()
      if (petData) {
        document.getElementById('proprietario').value = petData.proprietario
        document.getElementById('telefone').value = petData.telefone
        document.getElementById('endereco').value = petData.endereco
        document.getElementById('nome').value = petData.nome
        document.getElementById('raca').value = petData.raca
        document.getElementById('especie').value = petData.especie
        document.getElementById('data').value = petData.data
        document.querySelector(`input[name="radio"][value="${petData.sexo}"]`).checked = true
        document.getElementById('checkbox').checked = petData.status === 'on'
      }
    })
  }
})

// Evento input para aplicar a máscara no campo de telefone
document.getElementById('telefone').addEventListener('input', function (event) {
  let inputValue = event.target.value

  // Remover caracteres não numéricos
  inputValue = inputValue.replace(/\D/g, '')

  // Aplicar a máscara
  if (inputValue.length <= 10) {
    event.target.value = inputValue.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    event.target.value = inputValue.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
})

// Função para pesquisar pets na tabela
function pesquisarPets() {
  var input, filtro, tabela, linhas, celula, i, txtValue
  input = document.getElementById("pesquisa")
  filtro = input.value.toUpperCase()
  tabela = document.getElementById("dadosTabela")
  linhas = tabela.getElementsByTagName("tr")

  for (i = 0; i < linhas.length; i++) {
    celula = linhas[i].getElementsByTagName("td")[0] 

    if (celula) {
      txtValue = celula.textContent || celula.innerText

      if (txtValue.toUpperCase().indexOf(filtro) > -1) {
        linhas[i].style.display = ""
      } else {
        linhas[i].style.display = "none"
      }
    }
  }
}
