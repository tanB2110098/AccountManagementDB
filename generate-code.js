document.getElementById("generate-code").onclick = function() {
    
    let quantityAccountInput = document.querySelector("#quantity-account-logout");
    let  quantityAccount = quantityAccountInput.value;

    // generate code logout 
    let codeGoogleAccountLogout = "";
    for (let i = 0; i < quantityAccount; i++) {
        codeGoogleAccountLogout += 'adb shell am start -a android.settings.SYNC_SETTINGS\nadb shell input tap 473 486.7\nadb shell input tap 287.7 370.7\nadb shell input tap 691.4 1951.0\nadb shell input tap 803.2 1758.9\nadb shell sleep 10\n';
    }
    
    // // Use the Clipboard API to copy the text
     navigator.clipboard.writeText(codeGoogleAccountLogout)
     .then(() => {
         alert("Account logout code copied to clipboard successfully!");
        quantityAccountInput.value = "";
     })
     .catch(err => {
         alert("Failed to copy text: ", err);
     });
}

// generate code for loging tiktok 
document.querySelector("#generate-tiktok-login-code").onclick = function() {
    let code = 'adb shell input tap 878.2 1908 \nadb shell sleep 6 \nadb shell input tap 930 1926 \nadb shell sleep 5 \nadb shell input tap 484.6 1207.4 \nadb shell sleep 5 \nadb shell input tap 366.7 934.5 \nadb shell sleep 8 \nadb shell input tap 501.5 934.5 \nadb shell sleep 4 \nadb shell input tap 513.5 1249.4 \nadb shell sleep 4 \n';
    let firstAccountCoordinate = 934.5;
    // quantity of account
    let quantityOfTiktokAccountInput = document.querySelector("#quantity-tiktok-account");
    let quantityOfTiktokAccountValue = quantityOfTiktokAccountInput.value;

    for (let i = 0; i < quantityOfTiktokAccountValue - 1; i++) {
        firstAccountCoordinate += 200;
        code += `adb shell input tap 878.2 1908 \nadb shell sleep 6 \nadb shell input tap 930 1926 \nadb shell sleep 2 \nadb shell input tap 513 139.8 \nadb shell sleep 4 \nadb shell input tap 475 1890 \nadb shell sleep 2 \nadb shell input tap 727.2 1915 \nadb shell sleep 1 \nadb shell input tap 444.6 1121.5 \nadb shell sleep 3 \nadb shell input tap 366.7 ${firstAccountCoordinate} \n`;
    }

    // // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(code)
    .then(() => {
        alert("Code Login tiktok copied to clipboard successfully!");
        quantityOfTiktokAccountInput.value = "";
    })
    .catch(err => {
        alert("Failed to copy text: ", err);
    });

}