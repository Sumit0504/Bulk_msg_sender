document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const sendButton = document.getElementById("sendMessage");
    const overlay = document.getElementById("loadingOverlay");
    const progressBar = document.getElementById("progressBar");
    const progressContainer = document.getElementById("progressContainer");
    const clockElement = document.getElementById("digitalClock");

    // ✅ Submit handler for file upload
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById("fileInput");
        if (!fileInput.files.length) {
            alert("Please select a file before sending!");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        overlay.style.display = "grid";
        progressContainer.style.display = "block";
        progressBar.value = 0;

        try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/send_messages", true);

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    progressBar.value = percent;
                }
            };

            xhr.onload = function () {
                overlay.style.display = "none";
                progressContainer.style.display = "none";

                if (xhr.status === 200) {
                    showSuccess(xhr.responseText);
                } else {
                    showError("❌ Server Error: " + xhr.status);
                }
            };

            xhr.onerror = function () {
                overlay.style.display = "none";
                progressContainer.style.display = "none";
                showError("❌ Failed to send messages. Check the console.");
            };

            xhr.send(formData);
        } catch (err) {
            overlay.style.display = "none";
            progressContainer.style.display = "none";
            showError("❌ Failed to send messages. Check the console.");
            console.error(err);
        }
    });

    // ✅ Launch WhatsApp button handler (placed correctly outside)
    const launchBtn = document.getElementById("startWhatsApp");
    if (launchBtn) {
        launchBtn.addEventListener("click", async () => {
            console.log("Launch Messenger clicked!");
            overlay.style.display = "grid";
            try {
                const response = await fetch("/start_whatsapp", {
                    method: "POST"
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const result = await response.text();
                overlay.style.display = "none";
                showSuccess(result);
            } catch (error) {
                overlay.style.display = "none";
                showError("❌ Failed to launch WhatsApp.");
                console.error("Error launching WhatsApp:", error);
            }
        });
    }
    

    // ✅ Digital clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // ✅ Utility notification functions
    function showSuccess(message) {
        alert(message); // Replace with SweetAlert or toast if needed
    }

    function showError(message) {
        alert(message); // Replace with SweetAlert or toast if needed
    }
});
