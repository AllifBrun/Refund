//seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//Captura o evento de input para formatar o valor.
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")

    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

//Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
    event.preventDefault()

    //Cria um objeto com os detalhes da nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    //Chama a função que adiciona o item na lista
    expenseAdd(newExpense)

}


//Adiciona um novo item na lista.
function expenseAdd(newExpense) {

    try {
        //Cria o elemento para adicionar na lista

        //li
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //img
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //div (info da despesa)
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //strong (nome da despesa)
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //span (cria a categoria da despesa)
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name



        //Adiciona nome e categoria na div das informações da despesa.
        expenseInfo.append(expenseName, expenseCategory)

        //Criando o valor da despesa.
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        //Cria o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o item na lista
        expenseList.append(expenseItem)

        //Limpa o formulário para adicionar um novo item
        formClear()

        //Atualiza os totais.
        updateTotals()

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}


//Atualiza os totais.
function updateTotals(){
    try {
        //Recupera todos os itens da lista
       const items = expenseList.children

       //Atualiza a quantidade de itens da lista
       expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`



       // Variável para incrementar o total.
       let total = 0

       // Percorre cada item li da lista ul
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

                let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

                value = parseFloat(value)

                if(isNaN(value)){
                    return alert("Não foi possível calcular o total.")
                }


                total += Number(value)

        }

        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        expensesTotal.innerHTML = ""

        expensesTotal.append(symbolBRL, total)


    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais")
    }
}

//Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function(event){
    //verifica se o elemento clicado é um ícone de remover
   if(event.target.classList.contains("remove-icon")){

    //Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense")
    item.remove()
   }

   updateTotals()
    
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    //Coloca o foco no input de amount
    expense.focus()
}