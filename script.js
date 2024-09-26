class Account {
    constructor(id,email,tiktokAccount, date) {
        this.id = id;
        this.email = email;
        this.tiktokAccount = tiktokAccount;
        this.date = date;
    }
}

class AccountManagement {
    constructor(accounts) {
        this.accounts = accounts;
    }

    addAccount(account) {
        // check existing account
        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].email == account.email || this.accounts[i].tiktokAccount == account.tiktokAccount){
                alert("Account is already existing!");
                return;
            }
        }

        this.accounts.push(account);
        this.displayAccount();
        alert("Add account successfully!!");
    }

    printAccount() {
        console.log(accounts);
    }
    displayAccount() {
        let accountBody = document.querySelector("#account-body");
        let html = '';
        for (let i = 0; i < this.accounts.length; i++) {
            let days = calculateDateDifference(new Date(), new Date(this.accounts[i].date));
            html += `<tr class="account-item">
                        <td class="account-item_info">${this.accounts[i].email}</td>
                        <td class="account-item_info">${this.accounts[i].tiktokAccount}</td>  
                        <td class="account-item_info">${days} days</td>  
                        <td class="account-item_info" >
                            <button id="remove" onclick="removeAccount(${this.accounts[i].id})">remove</button>
                            <button id="reset" onclick="resetAccount(${this.accounts[i].id})">Reset</button>
                        </td>  
                    </tr>`
        }
        accountBody.innerHTML = html;
    }

    saveAccount() {
        this.accounts = JSON.stringify(this.accounts);
        localStorage.setItem("accounts", this.accounts);
    }

    remove(id) {
        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].id == id) {
                this.accounts.splice(i, 1);
                this.displayAccount();
                saveAccounts(this.accounts);
                break;
            }
        }
         
        if (this.accounts.length == 0) {
            localStorage.removeItem("accounts");
        }
    }

    reset(id) {
        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].id == id) {
                this.accounts[i].date = Date.now();
                this.displayAccount();
                saveAccounts(this.accounts);
                break;
            }
        }
    }
}


function calculateDateDifference(date1, date2) {
    // Convert both dates to milliseconds
    const date1Millis = new Date(date1).getTime();
    const date2Millis = new Date(date2).getTime();

    // Find the difference in milliseconds
    const differenceMillis = Math.abs(date2Millis - date1Millis);

    // Convert the difference from milliseconds to days
    const differenceDays = Math.floor(differenceMillis / (1000 * 60 * 60 * 24));

    return differenceDays;
}


function getAccounts() {
    let accounts = localStorage.getItem("accounts");
    if (accounts == null) {
        accounts = [];
    } else {
        accounts = JSON.parse(accounts);
    }
    return accounts;

}

function addAccount() {
 
    let accounts = getAccounts()

    let accountManagement = new AccountManagement(accounts);
        
    let account = getAccountInput();
    accountManagement.addAccount(account);
    
    accountManagement.saveAccount();
}

function getAccountInput() {
    
    let id = Date.now();
    let email = document.querySelector("#email-input").value;
    let tiktok = document.querySelector("#tiktok-input").value;
    let date = new Date("2024-09-24");
    let account = new Account(id,email, tiktok, date);

    return account;
}

function removeAccount(id) {
    let accounts = getAccounts();

    let accountManagement = new AccountManagement(accounts);

    accountManagement.remove(id);
}

function resetAccount(id) {
    let accounts = getAccounts();

    let accountManagement = new AccountManagement(accounts);

    accountManagement.reset(id);
    accountManagement.displayAccount();
    alert("Reset successfully")
}

function saveAccounts(accounts) {
    if (accounts.length != 0) {
        accounts = JSON.stringify(accounts);
        localStorage.setItem("accounts", accounts);
    }
}

function start() {
    let accounts = getAccounts();

    let accountManagement = new AccountManagement(accounts);
    accountManagement.displayAccount();
}

start();

let arr = ['apple', 'banana', 'cherry', 'date'];
arr.splice(1, 1); // Remove 1 item at index 1 (i.e., 'banana')
console.log(arr);