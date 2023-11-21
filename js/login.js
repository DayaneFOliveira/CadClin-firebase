// Referência para o formulário de login
const formLogin = document.getElementById('formLogin')

// Função para realizar o login
formLogin.addEventListener('submit', async function (event) {
    event.preventDefault()

    // Obtendo os valores dos campos
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    try {
        // Autenticando no Firebase
        await firebase.auth().signInWithEmailAndPassword(email, senha)
        alert('Login bem-sucedido!')
        window.location.href = 'inicio.html'

    } catch (error) {
        // Tratando erros
        const errorCode = error.code
        const errorMessage = error.message
        console.error('Erro ao realizar login:', errorCode, errorMessage)
        alert(`Erro ao realizar login: Verifique o email e a senha`)
    }
})