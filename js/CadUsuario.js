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
const urlApp = 'https://dayanefoliveira.github.io/CadClin-firebase/'

// Referência para o formulário de cadastro no HTML
const formCadastro = document.getElementById('formCadastro')

// Adicionando um ouvinte para o envio do formulário
formCadastro.addEventListener('submit', async function (event) {
    event.preventDefault()

    // Obtendo os valores dos campos do formulário
    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value
    const telefone = document.getElementById('telefone').value
    const sexo = document.getElementById('sexo').value

    // Verificando se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem. Por favor, verifique.')
        return
    }

    try {
        // Criando um usuário no Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha)
        const user = userCredential.user

        // Adicionando informações adicionais do usuário ao Realtime Database
        await firebase.database().ref('usuarios/' + user.uid).set({
            nome,
            email,
            telefone,
            sexo
        })

        alert('Usuário cadastrado com sucesso!')

        //Redireciona para a tela de login
        window.location.href = `${urlApp}/login.html`

    } catch (error) {
        // Tratando erros
        const errorCode = error.code
        const errorMessage = error.message
        console.error('Erro ao cadastrar usuário:', errorCode, errorMessage)
        alert(`Erro ao cadastrar usuário: ${errorMessage}`)
    }
})

// Referência para o botão de voltar
const voltar = document.getElementById('voltar')

// Adicionando um ouvinte para o clique no botão de voltar
voltar.addEventListener('click', function () {
    // Redireciona para a tela de login ao clicar no botão "Voltar"
    window.location.href = `${urlApp}/login.html`
})

// Adiciona um ouvinte para o input do campo de telefone
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

// Adiciona um ouvinte para o clique no botão que alterna a visibilidade da senha
document.getElementById('toggleSenha').addEventListener('click', function () {
    const senhaInput = document.getElementById('senha')
    const confirmarSenhaInput = document.getElementById('confirmarSenha')
    const tipoInput = senhaInput.getAttribute('type')
    const tipoConfirmaInput = confirmarSenhaInput.getAttribute('type')

    // Altera o tipo dos campos para alternar entre texto e senha
    senhaInput.setAttribute('type', tipoInput === 'password' ? 'text' : 'password')
    confirmarSenhaInput.setAttribute('type', tipoConfirmaInput === 'password' ? 'text' : 'password')

    // Altera o ícone do botão com base no tipo de input
    const eyeIcon = this.querySelector('i')
    eyeIcon.classList.toggle('bi-eye')
    eyeIcon.classList.toggle('bi-eye-slash')
})
