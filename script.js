  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {
    apiKey: "AIzaSyD1qmjKUiJJTrIrzFHBUl1IkVNHoNxpARI",
    authDomain: "accountmanagement-138b7.firebaseapp.com",
    databaseURL: "https://accountmanagement-138b7-default-rtdb.firebaseio.com", // E
    projectId: "accountmanagement-138b7",
    storageBucket: "accountmanagement-138b7.appspot.com",
    messagingSenderId: "340211540580",
    appId: "1:340211540580:web:234fac6df89143c8163571",
    measurementId: "G-DP3RP0P1DG"
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  import {getDatabase, ref, set, update, remove, get, child, onValue}
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
  // method to 

  let db = getDatabase();
//--------------------------------END CONNECT DT-------------------------


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
        // sort before display
        this.sortByActive();
        console.log(this.accounts);

        let accountBody = document.querySelector("#account-body");
        let html = '';
        for (let i = 0; i < this.accounts.length; i++) {
            let days = calculateDateDifference(new Date(), new Date(this.accounts[i].date));
            html += `<tr class="account-item">
                        <td class="account-item_info">${this.accounts[i].email}</td>
                        <td class="account-item_info">${this.accounts[i].tiktokAccount}</td>  
                        <td class="account-item_info">${days} days</td>  
                        <td class="account-item_info" >
                            <button class="remove" data-id="${this.accounts[i].id}">remove</button>
                            <button class="reset" data-id="${this.accounts[i].id}")" onclick="reset()">Reset</button>
                        </td>  
                    </tr>`
        }
        accountBody.innerHTML = html;

         // Attach event listeners for remove buttons
        document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", (event) => {
            let itemId = event.target.getAttribute("data-id");
            console.log(itemId);
            removeAccount(itemId);
        });

        document.querySelectorAll(".reset").forEach(button => {
            button.addEventListener("click", (event) => {
                let itemId = event.target.getAttribute("data-id");
                updateAccount(itemId);
            });
        })
});
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


    sortByActive() {
        let t;
        for (let i = 0; i < this.accounts.length - 1; i++) {
            for(let j = i + 1; j < this.accounts.length; j++) {
                let thisAccountDate = this.accounts[i].date;
                let thatAccountDate = this.accounts[j].date;
                if (thisAccountDate > thatAccountDate) {
                    t = this.accounts[i];
                    this.accounts[i] = this.accounts[j];
                    this.accounts[j] = t;
                }
            }
        }
        return this.accounts;

    }

    existsByTiktokAccountOrEmail(account) {
        for (let i = 0; i < this.accounts.length;i++) {
            let accountInDB = this.accounts[i];
            if (account.tiktokAccount == accountInDB.tiktokAccount 
                || account.email == accountInDB.email) return true;
        }
        return false;
    }
}



// async function addAccount() {
 
//     let accounts = await getAllAccount();

//     let accountManagement = new AccountManagement(accounts);
        
//     let account = getAccountInput();
//     accountManagement.addAccount(account);
    
//     accountManagement.saveAccount();
// }

document.querySelector("#add").onclick = async function addAccount(account) {
    let accounts = await getAllAccounts("accounts");

    let accountManagement = new AccountManagement(accounts);
    let accountSaving = getAccountInput();


    if (accountManagement.existsByTiktokAccountOrEmail(accountSaving)) {
        alert("Account is existing!!");
        return;
    }

    set(ref(db, 'accounts/' + accountSaving.id), accountSaving)
    .then(() => {
        accountManagement.addAccount(accountSaving);
        accountManagement.displayAccount();
    })
    .catch((e) => {
        alert("create fail! " + e)
    });
}


// let account = new Account(1000, "tankim123", "tankim123",123432432424);
// addAccount(account);


// get user by id 
const dbRef = ref(getDatabase());
async function getAccountById(id) {
    try {
        let snapshot = await get(child(dbRef, `accounts/${id}`));
        let data = snapshot.val();
        return data;
    } catch(e) {
        alert("Account does not exist!!");
    }
}


console.log(getAccountById(1727457077692));
// get all user

async function getAllAccounts(path) {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, path));
      if (snapshot.exists()) {
        let data = snapshot.val();
        const accountsArray = Object.values(data); // Convert object to an array of accounts
        return accountsArray;
      } else {
        console.log("No data available");
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
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



function getAccountInput() {
    
    let id = Date.now();
    let email = document.querySelector("#email-input").value;
    let tiktok = document.querySelector("#tiktok-input").value;

    if (email =='' || tiktok =='') {
        alert("Please enter info!!");
        return;
    }
    let date = Date.now();
    let account = new Account(id,email, tiktok, date);

    return account;
}


async function resetUI() {
    let accounts = await getAllAccounts("accounts");
    let accountManagement = new AccountManagement(accounts);
    accountManagement.displayAccount();
}

function removeAccount(itemId) {
    remove(ref(db, "accounts" + '/' + itemId))
     .then(() => {
       alert(`Data with ID ${itemId} successfully deleted!`);
       resetUI();
     })
     .catch((error) => {
       alert("Error deleting data: ", error);
     });
 }

 async function updateAccount(itemId) {

    let account = await getAccountById(itemId);

    account.date = Date.now();

    update(ref(db, "accounts" + '/' + itemId), account)
     .then(() => {
       alert(`Data with ID ${itemId} successfully updated!`);
       resetUI();
     })
     .catch((error) => {
       alert("Error updating data: ", error);
     });
 }



async function start() {
    let accounts = await getAllAccounts("accounts");

    let accountManagement = new AccountManagement(accounts);
    accountManagement.displayAccount();

    // show acccounts number
    document.querySelector("#number-of-account").textContent = accounts.length;
}

start();