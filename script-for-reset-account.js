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

let allDevices = [];
let accounts = [];
let resetAccounts = [];
let selectedStatus = '';

window.onload = async function() {
    const deviceSelect = document.getElementById("device-selected");
    const charStart = "Đang chạy";

    const devices = await getAllDevices();
    
    for (let device of devices) {
        if (device.deviceName.startsWith(charStart)) {
            const selectItem =  `<option value="${device.deviceName}">${device.deviceName}</option>`;
            deviceSelect.innerHTML += selectItem;     
            allDevices.push(device);
        }
    }

    // load accounts
    accounts = await getAllAccounts("accounts");

    // set event for select 
    deviceSelect.onchange = function() {
        // reset reset account to empty
        resetAccounts = [];
        selectedStatus = this.value;
        
        // show accounts with current status
        for (let account of accounts) {
            if (account.deviceName === selectedStatus) {
                resetAccounts.push(account);
            }
        }

        showAccountBySelectedDeviceStatus();

    }

    // handle event for the reset button 
    document.getElementById("reset").onclick = function() {
        if (selectedStatus == '') {
            alert("Vui lòng chọn thiết bị!!");
            return;
        }

        if (resetAccounts.length == 0) {
            alert("Không có tài khoản nào đang chạy");
            return;
        }

        // update status from "Dang chay.." -> "May ..." 
        let currentDevice = resetAccounts[0].deviceName.slice(10);
        let deviceChange = '';
        // get device in db from device status
        for (let device of devices) {
            // console.log(device.deviceName.toLowerCase() +" " + deviceSelected.toLowerCase())
            if (currentDevice.toLowerCase() === device.deviceName.toLowerCase()) {
                deviceChange = device.deviceName;
                break;
            }
        }


        // update date
        for(let account of resetAccounts) {
            account.deviceName = deviceChange;
            updateAccount(account, devices);
        }

        alert("Updated successfully!");

        // update ui
        resetAccounts = [];
        showAccountBySelectedDeviceStatus();

        
    }

}

class Device {
    constructor(id, deviceName) {
        this.id = id;
        this.deviceName = deviceName;
    }
}

 async function updateAccount(account) {
    // update date of account
    account.date = Date.now();

    console.log(account);
    update(ref(db, "accounts" + '/' + account.id), account)
     .then(() => {
        // alert("Updated successfully!");
     })
     .catch((error) => {
       alert("Error updating data: ", error);
     });
 }

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




// console.log(getAccountById(1727457077692));
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



 async function getAllDevices() {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "devices"));
      if (snapshot.exists()) {
        let data = snapshot.val();
        const accountsArray = Object.values(data); // Convert object to an array of accounts
        return accountsArray;
      } else {
        // console.log("No data available");
        return [];
      }
    } catch (error) {
    //   console.error("Error fetching data:", error);
      throw error;
    }
}

function showAccountBySelectedDeviceStatus() {
    let accountShowing = document.getElementById("account-body");
    accountShowing.innerHTML = '';

    let index = 1;
    for (let account of resetAccounts) {
        accountShowing.innerHTML += `
            <tr>
                <td>${index}</td>
                <td>${account.tiktokAccount}</td>
            </tr>
        `;
        index++;
    }
}