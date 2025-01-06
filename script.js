let date = document.getElementById('date');
let account = document.getElementById("account")
let category = document.getElementById("category")
let description = document.getElementById('description')
let amount = document.getElementById("amount")
let addTransaction = document.getElementById("add-t")
let trDiv = document.getElementById("t-div")
let messageDiv = document.getElementById("message-div")
let messageDiv2 = document.getElementById("message-div2")
let reset = document.getElementById("reset")
let transactions = [];
let editIndex = null;
let addAccount = document.getElementById("add-account");
let addCategory = document.getElementById("add-category");
let addAccName = document.getElementById("add-acc-name");
let addCatName = document.getElementById("add-cat-name");
let menu = document.getElementById("menu");
let stats = document.getElementById("stats");
let searchDiv = document.getElementById("search-div");
let fromDate = document.getElementById("from-date-search");
let toDate = document.getElementById("to-date-search");
let accountSearch = document.getElementById("account-search");
let categorySearch = document.getElementById("category-search");
let search = document.getElementById("search");
let debitContainer = document.getElementById("debit")
let creditContainer = document.getElementById("credit")
let filtered = document.getElementById("filtered")

function getsttypye() {
    let radios = document.getElementsByName("st-type")
    let sttype = null;

    for (let radio of radios) {
        if (radio.checked) {
            sttype = radio.value
            break;
        }
    }

    return sttype;
}

function getTType() {
    let radios = document.getElementsByName("t-type")
    let ttype = null;

    for (let radio of radios) {
        if (radio.checked) {
            ttype = radio.value
            break;
        }
    }

    return ttype;
}

function showAlert(message) {
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function showAlert2(message) {
    messageDiv2.textContent = message;
    messageDiv2.style.display = 'block';
    setTimeout(() => {
        messageDiv2.style.display = 'none';
    }, 3000);
}

function validateform() {
    if (date.value.trim() == "") {
        showAlert("Required field cannot be empty");
        return false
    }
    if (getTType() == null) {
        showAlert("Required field cannot be empty");
        return false
    }
    if (account.value.trim() == "") {
        showAlert("Required field cannot be empty");
        return false
    }
    if (category.value.trim() == "") {
        showAlert("Required field cannot be empty");
        return false
    }
    if (description.value.trim() == "") {
        showAlert("Required field cannot be empty");
        return false
    }
    if (amount.value.trim() == "") {
        showAlert("Required field cannot be empty");
        return false
    }
    return true
}

function getDebit(transactions) {
    let debit = 0;
    transactions.forEach((transaction, index) => {

        if (transaction["t-type"] == "debit") {

            debit += parseFloat(transaction.Amount) || 0;

        }
    });

    return debit;
}

function getCredit(transactions) {
    let credit = 0;
    transactions.forEach((transaction, index) => {

        if (transaction["t-type"] == "credit") {

            credit += parseFloat(transaction.Amount) || 0;

        }
    });


    return credit;
}

function display() {
    stats.innerHTML = ` <li>Total Debit: ${getDebit(transactions)}</li>
                <li>Total Credit: ${getCredit(transactions)}</li>`;

    trDiv.innerHTML = ""; // Clear previous content

    // Sort transactions by date (newest first)
    let sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display the latest 10 transactions
    sortedTransactions.slice(0, 10).forEach((transaction, index) => {
        let transactionEntry = document.createElement("div");
        transactionEntry.innerHTML = `<p> Date: ${transaction.date} </p> 
        <p>Type: ${transaction["t-type"]}</p>  <p>Account: ${transaction.account}</p> <p>Category: ${transaction.category}</p> 
        <p>Description: ${transaction.description}</p> 
        <p> Amount: ${transaction.Amount}</p>
        <button class="delete" data-index="${index}">Delete</button> 
        <button class="edit" data-index="${index}">Edit</button> `;
        transactionEntry.classList.add("transaction")
        trDiv.appendChild(transactionEntry);
    });
}

function edittransaction(index) {
    let transaction = transactions[index];
    date.value = transaction.date;
    account.value = transaction.account;
    category.value = transaction.category;
    description.value = transaction.description;
    amount.value = transaction.Amount;

    let radios = document.getElementsByName("t-type");
    radios.forEach(radio => {
        if (radio.value === transaction["t-type"]) {
            radio.checked = true;
        }
    });

    editIndex = index;
    addTransaction.value = "Update Transaction";
}

function filterTransactions() {
    let from = new Date(fromDate.value);
    let to = new Date(toDate.value);
    let acc = accountSearch.value.trim().toLowerCase();
    let cat = categorySearch.value.trim().toLowerCase();
    let tType = getsttypye();

    if (((!isNaN(from)) && (!isNaN(to))) || (acc != "") || (cat = "") || (tType != null)) {


        let filteredTransactions = transactions.filter(transaction => {
            let transactionDate = new Date(transaction.date);
            let matchAccount = acc ? transaction.account.toLowerCase().includes(acc) : true;
            let matchCategory = cat ? transaction.category.toLowerCase().includes(cat) : true;
            let matchType = tType ? transaction["t-type"] === tType : true;
            let matchDate = (!isNaN(from) ? transactionDate >= from : true) && (!isNaN(to) ? transactionDate <= to : true);

            return matchAccount && matchCategory && matchType && matchDate;
        });

        // searchDiv.innerHTML = "<h3>Filtered Transactions</h3>";

        // let debitContainer = document.createElement("div");
        debitContainer.innerHTML = `<h4>Debits: ${getDebit(filteredTransactions)}</h4>`;

        // let creditContainer = document.createElement("div");
        creditContainer.innerHTML = `<h4>Credits: ${getCredit(filteredTransactions)}</h4>`;

        filteredTransactions.forEach(transaction => {
            let transactionEntry = document.createElement("div");
            transactionEntry.classList.add("transaction")
            transactionEntry.innerHTML = `<p>Date: ${transaction.date}</p>
                <p>Account: ${transaction.account}</p>
                <p>Category: ${transaction.category}</p>
                <p>Description: ${transaction.description}</p>
                <p>Amount: ${transaction.Amount}</p>`;

            if (transaction["t-type"] === "debit") {
                debitContainer.appendChild(transactionEntry);
            } else {
                creditContainer.appendChild(transactionEntry);
            }
        });

        // filtered.appendChild(debitContainer);
        // filtered.appendChild(creditContainer);

    }

    else {
        showAlert2("Select atleast one filter");
        console.log("hello")
    }

}

addTransaction.addEventListener("click", function (event) {
    event.preventDefault();

    if (validateform()) {
        let transactionData = {
            "date": date.value,
            "t-type": getTType(),
            "account": account.value,
            "category": category.value,
            "description": description.value,
            "Amount": amount.value
        };

        if (editIndex !== null) {
            transactions[editIndex] = transactionData;
            editIndex = null;
            addTransaction.textContent = "Add Transaction";
        } else {
            transactions.push(transactionData);
        }

        display();
    }
    reset.click();
});

trDiv.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
        let index = e.target.getAttribute("data-index");
        transactions.splice(index, 1);
        display();
    }

    if (e.target.classList.contains("edit")) {
        let index = e.target.getAttribute("data-index");
        edittransaction(index);
    }
});

addAccount.addEventListener("click", function () {

    addAccount.classList.add("hidden")
    let add = document.createElement("div")
    add.classList.add("add-item");
    add.innerHTML =
        ` <h6>Add Account</h6>
                    <input type="text" class="name" placeholder="Account name" id="add-acc-name">
                    <br>
                    <input type="submit" value="Add Account" class="add-name" id="add-acc">`
    menu.append(add)

});

addCategory.addEventListener("click", function () {

    addCategory.classList.add("hidden")
    let add = document.createElement("div")
    add.classList.add("add-item");
    add.innerHTML =
        ` <h6>Add Category</h6>
                    <input type="text" class="name" placeholder="Category name" id="add-cat-name">
                    <br>
                    <input type="submit" value="Add Category" class="add-name" id="add-cat">`
    menu.append(add)

});

menu.addEventListener("click", function (e) {
    if (e.target && e.target.id === "add-acc") {
        let newAccount = document.getElementById("add-acc-name").value.trim();
        if (newAccount) {
            let option = document.createElement("option");
            option.value = newAccount;
            option.textContent = newAccount;
            let optionS = document.createElement("option");
            optionS.value = newAccount;
            optionS.textContent = newAccount;
            accountSearch.append(option);
            account.append(optionS);

            showAlert("Account added successfully");
            e.target.parentElement.remove();
            addAccount.classList.remove("hidden");


        } else {
            showAlert("Please enter an account name");
        }
    }

    if (e.target && e.target.id === "add-cat") {
        let newCategory = document.getElementById("add-cat-name").value.trim();
        if (newCategory) {
            let option = document.createElement("option");
            option.value = newCategory;
            option.textContent = newCategory;
            let optionS = document.createElement("option");
            optionS.value = newCategory;
            optionS.textContent = newCategory;
            category.appendChild(option);
            categorySearch.appendChild(optionS)
            showAlert("Category added successfully");
            e.target.parentElement.remove();
            addCategory.classList.remove("hidden")
        } else {
            showAlert("Please enter a category name");
        }
    }
});

search.addEventListener("click", filterTransactions);
