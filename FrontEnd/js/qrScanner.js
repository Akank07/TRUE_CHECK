const sessionCodeInput = document.getElementById("sessionCode");
const scanBtn = document.getElementById("scanBtn");
const status = document.getElementById("status");

let html5QrCode = null;
let scannerRunning = false;

scanBtn.addEventListener("click", startScanner);

function startScanner() {

    if (scannerRunning) {
        return;
    }

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
        .then((devices) => {

            if (devices.length === 0) {

                status.innerText = "No camera found.";
                status.className = "error";
                return;
            }

            scannerRunning = true;

            html5QrCode.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },

                (decodedText) => {

                    sessionCodeInput.value = decodedText;

                    status.innerText = "QR Code Scanned Successfully";
                    status.className = "success";

                    html5QrCode.stop()
                        .then(() => {

                            scannerRunning = false;

                        })
                        .catch((err) => {

                            console.error(err);

                        });

                },

                (errorMessage) => {

                }

            );

        })
        .catch((err) => {

            console.error(err);

            status.innerText = "Unable to access camera.";
            status.className = "error";

        });

}