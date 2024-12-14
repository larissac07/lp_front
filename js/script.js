var clientes = []
var clienteAlterado = null

function mostrarModal(){
    const modal = document.getElementById('modal');
    modal.style.display = "block"
}



function ocultarModal(){
    const modal = document.getElementById('modal')
    modal.style.display ="none"
    limparFormulario()
    document.getElementById("cpf").readOnly = false
}

function adicionar(){
    clienteAlterado = null
    mostrarModal()    
}

function alterar(cpf){
    for(let i=0; i < clientes.length; i++){
        let cliente = clientes[i]
        if (cliente.cpf == cpf){
             document.getElementById("nome").value = cliente.nome
             document.getElementById("cpf").value = cliente.cpf
             document.getElementById("celular").value = cliente.celular
             document.getElementById("altura").value = cliente.altura
             document.getElementById("cabelo").value = cliente.cabelo
             document.getElementById("nomeGato").value = cliente.nomeGato
             document.getElementById("dataNascimento").value = cliente.dataNascimento
             clienteAlterado = cliente
             mostrarModal()
document.getElementById("cpf").readOnly = true;
        }
    }
    mostrarModal()
}

function excluir(cpf){
    if (clienteAlterado == null){
        fetch('http://localhost:3000/body-builder/' + cpf, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
        }).then(() => {
            alert("Excluido com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }
}
function salvar(){
    let nome = document.getElementById('nome').value
    let cpf = document.getElementById('cpf').value
    let celular = document.getElementById('celular').value
    let altura = document.getElementById('altura').value
    let cabelo = document.getElementById('cabelo').value
    let nomeGato = document.getElementById('nomeGato').value
    let dataNascimento = document.getElementById('dataNascimento').value

    let novoBodyBuilder = {
        nome: nome,
        cpf: cpf,
        celular: celular,
        altura: altura,
        cabelo: cabelo,
        nomeGato: nomeGato,
        dataNascimento: dataNascimento
    }

    //se o clienteAlterado == null, então está adicionando um novo cliente
    if (clienteAlterado == null){
        fetch('http://localhost:3000/body-builder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            alert("Cadastrado com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }else{ //senão, está alterando um cliente
        fetch('http://localhost:3000/body-builder/'+ cpf, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            alert("Alterado com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao alterar")
        })
    }
    ocultarModal()
    carregarClientes()
    limparFormulario()
    return false
}

function limparFormulario(){ 
    document.getElementById('nome').value = ""
    document.getElementById('cpf').value = ""
    document.getElementById('celular').value = ""
    document.getElementById('altura').value = ""
    document.getElementById('cabelo').value = ""
    document.getElementById('nomeGato').value = ""
    document.getElementById('dataNascimento').value = ""
}

function atualizarLista(){
    let tbody = document.getElementsByTagName('tbody')[0]
    tbody.innerHTML = ""
    for(let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i]

        let linhaTabela = document.createElement('tr')
        linhaTabela.innerHTML = `
                <td>${cliente.cpf}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.celular}</td>
                <td>${cliente.altura}</td>
                <td>${cliente.cabelo}</td>
                <td>${cliente.nomeGato}</td>
                <td>${cliente.dataNascimento}</td>
                <td>
                    <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                    <button onclick="excluir('${cliente.cpf}')">Excluir</button>
                </td>`

        tbody.appendChild(linhaTabela)
    }
}

function carregarClientes(){
    fetch('http://localhost:3000/body-builder', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json())
    .then((data) => {
        clientes = data
        console.log(data)
        atualizarLista()
    }).catch((error) => {
        alert("Erro ao listar clientes")
    })
}

function buscarClientes() {
    const busca = document.getElementById('busca').value;

    fetch(`http://localhost:3000/body-builder/search?q=${encodeURIComponent(busca)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        clientes = data; // Atualiza a lista local de clientes
        atualizarLista(); // Atualiza a tabela com os clientes filtrados
    })
    .catch(error => {
        alert("Erro ao buscar clientes");
    });
} 