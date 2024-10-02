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

class Device {
    constructor(id, deviceName) {
        this.id = id;
        this.deviceName = deviceName;
    }
}


class DeviceManagement {
    constructor(devices = null) {
        this.devices = devices;
    };

    async displayDevices() {
      

        // get the container 
        let body = document.querySelector("#table-device-list");
        let html = '';
        for (let i = 0; i < this.devices.length; i++) {
            let deviceItem = this.devices[i];
            html += `
                <tr class="table-device-item" id ="row-${deviceItem.id}">
                        <td class="table-device-item-name">${deviceItem.deviceName}</td>
                        <td class="table-device-item-controller">
                            <div class="table-device-item-delete" data-id=${deviceItem.id}>
                              <i class="fa-solid fa-trash"></i>
                            </div>
                        </td>
                </tr>
            `;

        }

        body.innerHTML = html;

        let deleteDeviceBtns = document.querySelectorAll(".table-device-item-delete");

        let that = this;
        deleteDeviceBtns.forEach((btn) => {
            btn.onclick = function(e) {
                let id = e.currentTarget.getAttribute("data-id");
                let currentDevice = document.querySelector("#row-" + id);
                that.removeDevice(id);

                // update table devices
                currentDevice.remove();
            }
        })
    }

    async addDevice(device) {
        if (this.existsByDeviceName(device)) {
            alert("Device is already existing!!");
            return;
        } else {
            set(ref(db, 'devices/' + device.id), device)
            .then(async() => {
                alert("create new device successfully");
                
                // display device 
                window.location.reload();
            })
            .catch((e) => {
                alert("create fail! " + e)
            });  
        }
    }

    existsByDeviceName(device) {

        for (let i = 0; i < this.devices.length; i++) {
            let deviceItem = this.devices[i];

            if (deviceItem.deviceName == device.deviceName) return true;
        }

        return false;

    }

    removeDevice(id) {
        remove(ref(db, "devices" + '/' + id))
        .then(() => {
            alert(`Data with ID ${id} successfully deleted!`);
        })
        .catch((error) => {
             alert("Error deleting data: ", error);
        });
    }
}

class Account {
    constructor(id,email,tiktokAccount, date, deviceName) {
        this.id = id;
        this.email = email;
        this.tiktokAccount = tiktokAccount;
        this.date = date;
        this.deviceName = deviceName;
    }
}



class AccountManagement {
    constructor(accounts = null) {
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
    async displayAccount() {

        // reset account number 
        // show acccounts number
        document.querySelector("#number-of-account").textContent = this.accounts.length;
        
        // sort before display
        this.sortByActive();
        console.log(this.accounts);

        let accountBody = document.querySelector("#account-body");
        let html = '';

        let devices = await getAllDevices();
        
        // get device option 
        let deviceOptions = '';

        devices.forEach(device => {
            deviceOptions += `<option value="${device.deviceName}">${device.deviceName}</option>` ;
        }) 

        // refresh account body
        accountBody.innerHTML = "";
        for (let i = 0; i < this.accounts.length; i++) {
            let days = calculateDateDifference(new Date(), new Date(this.accounts[i].date));

            html += `<tr class="account-item">
                        <td class="account-item_info">${this.accounts[i].email}</td>
                        <td class="account-item_info">${this.accounts[i].tiktokAccount}</td>  
                        <td class="account-item_info">${days} days</td> 
                        <td class="account-item_info">
                            <select class="mySelect" id="device-option-${this.accounts[i].id}" data-id="${this.accounts[i].id}">
                                ${deviceOptions}
                            </select>
                        </td> 
                        
                        <td class="account-item_info" >
                            <button class="remove" data-id="${this.accounts[i].id}">remove</button>
                            <button class="reset" data-id="${this.accounts[i].id}")" onclick="reset()">Reset</button>
                        </td>  
                    </tr>`;
            
        }
        accountBody.insertAdjacentHTML('beforeend', html);


        
        // render account's device 
        let accountIndex = 0;
        let  that = this;
        document.querySelectorAll(".mySelect").forEach(deviceOption => {
            deviceOption.value = that.accounts[accountIndex].deviceName;
            accountIndex++;
        });


        // update device account 
        document.querySelectorAll(".mySelect").forEach(deviceOption => {
            deviceOption.onchange = async function(e) {
                let optionDeviceValue = e.currentTarget.value;
                let deviceId = e.currentTarget.getAttribute("data-id");
                
                // get current account's device 
                for (let i = 0; i < that.accounts.length; i++) {
                    let accountItem = that.accounts[i];
                    if (accountItem.id == deviceId) {
                        // check device is device diffent with current account's device
                        if (accountItem.deviceName == optionDeviceValue) {
                            console.log("Không có gì thay đổi");
                        } else {
                            // change account device 
                            accountItem.deviceName = optionDeviceValue;

                            // call update account function 
                            await updateDeviceAccount(accountItem);

                            // Re redender account list 
                            // that.displayAccount();
                        }

                    }
                }

            }
        });

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

    // remove(id) {
    //     for (let i = 0; i < this.accounts.length; i++) {
    //         if (this.accounts[i].id == id) {
    //             this.accounts.splice(i, 1);
    //             this.displayAccount();
    //             saveAccounts(this.accounts);
    //             break;
    //         }
    //     }
         
    //     if (this.accounts.length == 0) {
    //         localStorage.removeItem("accounts");
    //     }
    // }


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

        // reset input 
        document.querySelector("#email-input").value = "";
        document.querySelector("#tiktok-input").value = "";
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

    // get device name
    let deviceName = document.querySelector("#device-select").value;

    console.log(deviceName);
    let account = new Account(id,email, tiktok, date, deviceName);

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

 async function updateDeviceAccount(account) {

    update(ref(db, "accounts" + '/' + account.id), account)
     .then(() => {
       alert(`Data with ID ${account.id} successfully updated!`);
       resetUI();
     })
     .catch((error) => {
       alert("Error updating data: ", error);
       console.log(error.message);
     });
 }


 // device handling 

 async function getAllDevices() {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "devices"));
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


//  async function addDevice(deviceSaving) {

//     if (existsByDeviceName(deviceSaving)) {
//         alert("Device is existing!!");
//         return;
//     }

//     set(ref(db, 'devices/' + accountSaving.id), accountSaving)
//     .then(async() => {
//         alert("create new device successfully");
//         let devices = await getAllDevices("devices");
//         displayDevices(devices);
//     })
//     .catch((e) => {
//         alert("create fail! " + e)
//     });
// }


 document.querySelector("#add-device").onclick = function showAddingDeviceForm() {
    document.querySelector("#device-add-form").style = "visibility: visible;";
}

document.querySelector("#close-add-device-form").onclick = function hideAddNewDeviceForm() {
    document.querySelector("#device-add-form").style = "visibility: hidden;"
 }


// add device 
document.querySelector("#device-add-form-body_button").onclick = async function() {
    let devices = await getAllDevices();

    let deviceName = document.querySelector("#device-add-form-body_name").value;
    if (deviceName == "") {
        alert("Device name can't be empty!!");
        return;
    }
        
    // call api to save device 
    let deviceMg = new DeviceManagement(devices);
    let device = new Device(Date.now(), deviceName);

    deviceMg.addDevice(device);


}

// end device handling
async function start() {
    let accounts = await getAllAccounts("accounts");

    let accountManagement = new AccountManagement(accounts);
    accountManagement.displayAccount();

    displayDeviceOnFormDeviceAdding()
  



}

async function displayDeviceOnFormDeviceAdding() {
    let devices = await getAllDevices();
    let optionDevice = '';
    
    devices.forEach(device => {
        optionDevice += `<option value="${device.deviceName}">${device.deviceName}</option>`;
    })

    document.querySelector('#device-select').innerHTML = optionDevice;
}

document.querySelector("#show-device-btn").onclick = async function showAlllDevices() {
    let devices = await getAllDevices();
    let deviceMg = new DeviceManagement(devices);

    deviceMg.displayDevices(); 

    // show device table
    document.querySelector("#device-management-body").style = "visibility:visible";

}


document.querySelector("#hide-device-btn").onclick = async function showAlllDevices() {
    // show device table
    document.querySelector("#device-management-body").style = "visibility:hidden";

}

// end device handling 


start();

let accounts = [
    {
        "id": 1727324838402,
        "email": "nhivo19722003",
        "tiktokAccount": "nhi.v734",
        "date": 1727324838402,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727348544671,
        "email": "leminhchau19722003",
        "tiktokAccount": "l.minh.chu81",
        "date": 1727348544674,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727365012798,
        "email": "lukha19722003",
        "tiktokAccount": "khalk663",
        "date": 1727365012798,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727365095301,
        "email": "phamlinh19722003",
        "tiktokAccount": "linh.phm4348",
        "date": 1727365095301,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727365243576,
        "email": "duongthao19722003",
        "tiktokAccount": "tho.dng9277",
        "date": 1727365243576,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727349484032,
        "email": "nguyentien19722003",
        "tiktokAccount": "tin.nguyn9760",
        "date": 1727430328997,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727478837323,
        "email": "0328869981",
        "tiktokAccount": "No mail",
        "date": 1727478837325,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727348617977,
        "email": "thuyngocnguyen19742003",
        "tiktokAccount": "thy.ngc.nguyn75",
        "date": 1727627423702,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727627474931,
        "email": "nguyenha19722003",
        "tiktokAccount": "h.nguyn8505",
        "date": 1727627474934,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727627556420,
        "email": "nguyenphuongchau19722003",
        "tiktokAccount": "phng.chu.nguyn0",
        "date": 1727627556420,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727642245534,
        "email": "trantan19722003",
        "tiktokAccount": "tn.trn686",
        "date": 1727642245534,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727643045088,
        "email": "nhivo19742003",
        "tiktokAccount": "nhi.v461",
        "date": 1727643045091,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727685914471,
        "email": "thanhman19722003",
        "tiktokAccount": "Nguyen.thnh.mn41",
        "date": 1727685914474,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727325076826,
        "email": "thachtran19722003",
        "tiktokAccount": "thch.trn362",
        "date": 1727686097991,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727362946204,
        "email": "tranlam19722003",
        "tiktokAccount": "lm.trn214",
        "date": 1727686102184,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727350280364,
        "email": "kienphuc19722003",
        "tiktokAccount": "phc.kin06",
        "date": 1727710013719,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727718914906,
        "email": "phamthanhduy19722003",
        "tiktokAccount": "phm.thnh.duy35",
        "date": 1727718914906,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727324622647,
        "email": "phamtuananh19722003",
        "tiktokAccount": "tun.anh.phm554",
        "date": 1727719062290,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727348737297,
        "email": "phambinhminh19742003",
        "tiktokAccount": "bnh.minh.phm1",
        "date": 1727719067522,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727348659255,
        "email": "dieunhi19722003",
        "tiktokAccount": "diu.nhi.nguyn5",
        "date": 1727782314927,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727324688210,
        "email": "tankim071902@gmail.com",
        "tiktokAccount": "tichcuctichcuc",
        "date": 1727782322579,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727794025274,
        "email": "nangtran19722003",
        "tiktokAccount": "trn.nng611",
        "date": 1727794025289,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727348698577,
        "email": "nguyenoanh19722003",
        "tiktokAccount": "oanh.nguyn9016",
        "date": 1727795026631,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727324666944,
        "email": "nguyenmen19722003",
        "tiktokAccount": "mn.nguyn5105",
        "date": 1727883552792,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727324738158,
        "email": "phamanhminh19722003",
        "tiktokAccount": "anh.minh.phm06",
        "date": 1727883555694,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727348812316,
        "email": "nguyennhat19722003",
        "tiktokAccount": "nhtnguyn6541",
        "date": 1727883581148,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727325244732,
        "email": "ngocduy19722003",
        "tiktokAccount": "duy.ngc328",
        "date": 1727883961006,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727885414498,
        "email": "nguyenvinh19722003",
        "tiktokAccount": "vinh.nguyn4508",
        "date": 1727885414512,
        "deviceName": "Máy 1"
    },
    {
        "id": 1727885445968,
        "email": "khangtran19722003",
        "tiktokAccount": "khang.trn0328",
        "date": 1727885445968,
        "deviceName": "Máy 1"
    }
]

async function addAccount2(account) {
    set(ref(db, 'accounts/' + account.id), account)
    .then(() => {
    })
    .catch((e) => {
        alert("create fail! " + e)
    });
}

accounts.forEach(async (account) => {
   await addAccount2(account);
})