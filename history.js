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

window.onload = function() {
    let obj = localStorage.getItem("accountsDeleting");
    let accountBody = document.querySelector("#account-body");
    if (obj != null) {

        let accounts = JSON.parse(obj);
        let html ='';
        let i = 1;
        for(let accountItem of accounts) {
            let days = calculateDateDifference(new Date(), new Date(accountItem.date));
            html += `<tr class="account-item">
                        <td class="account-item_info">${i}</td>
                        <td class="account-item_info">${accountItem.email}</td>
                        <td class="account-item_info">${accountItem.tiktokAccount}</td>  
                        <td class="account-item_info">${days} days</td>                         
                        <td class="account-item_info" >
                            <button class="remove" data-id="${accountItem.id}">remove</button>
                            <button class="restore" data-id="${accountItem.id}")">Restore</button>
                        </td>  
                    </tr>`;
            
            i++;
        }
        accountBody.insertAdjacentHTML('beforeend', html);

        let restoreBtns = document.querySelectorAll(".restore");
        
        for(let restoreBtnItem of restoreBtns) {
            restoreBtnItem.onclick = function(e) {
                
                // finding account in localstorage
                let obj = localStorage.getItem("accountsDeleting");
                
                let accounts = JSON.parse(obj);

                for (let account of accounts) {
                    if (account.id == e.currentTarget.getAttribute("data-id")){
                        set(ref(db, 'accounts/' + account.id), account)
                        .then(() => {
                            deleteAccount(account.id);
                            alert("restore successfully!!");
                            window.location.reload();
                        })
                        .catch((e) => {
                            alert("create fail! " + e)
                        });
                    }
                }

            }
        }


        // deleting acount out of local storage 
        let deleteAccountBtns = document.querySelectorAll(".remove");
        for (let deleteAccountBtn of deleteAccountBtns) {
            deleteAccountBtn.onclick = function(e) {
                let currentTarget = e.currentTarget;
                let id = currentTarget.getAttribute("data-id")
                deleteAccount(id);
                alert("remove successfully!!");
                window.location.reload();
            }
        }

        

    }
}

function deleteAccount(id) {
    let obj = localStorage.getItem("accountsDeleting");

    let accounts = JSON.parse(obj);
    console.log(accounts);
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == id) {
            accounts.splice(i, 1);
            break;
        }
    }

    localStorage.setItem("accountsDeleting", JSON.stringify(accounts));
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
