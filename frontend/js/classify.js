const API_BASE = "http://127.0.0.1:5000";

// Global variables for camera functionality
let stream = null;
let captureCanvas = null;
let captureContext = null;

// Initialize camera functionality when DOM loads
document.addEventListener("DOMContentLoaded", function() {
    initializeCameraFunctionality();
});

function initializeCameraFunctionality() {
    const captureBtn = document.getElementById("captureBtn");
    const fileInput = document.getElementById("wasteImage");
    const uploadZone = document.getElementById("uploadZone");

    // Create video element for camera preview (will be hidden initially)
    const videoElement = document.createElement("video");
    videoElement.id = "cameraPreview";
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.style.display = "none";
    videoElement.style.width = "100%";
    videoElement.style.height = "300px";
    videoElement.style.objectFit = "cover";
    uploadZone.appendChild(videoElement);

    // Create canvas for capturing images
    captureCanvas = document.createElement("canvas");
    captureContext = captureCanvas.getContext("2d");

    // Camera capture button click handler
    captureBtn.addEventListener("click", function() {
        if (stream) {
            // If camera is already active, capture the image
            captureImageFromCamera();
        } else {
            // Start camera
            startCamera();
        }
    });

    // File input change handler (for uploading from gallery)
    fileInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            processImageFile(file);
        }
    });

    // Upload zone click handler for file selection
    uploadZone.addEventListener("click", function(e) {
        if (e.target === captureBtn || stream) return; // Don't trigger if camera is active or capture btn clicked
        fileInput.click();
    });

    // Add drag and drop functionality
    uploadZone.addEventListener("dragover", function(e) {
        e.preventDefault();
        uploadZone.classList.add("drag-over");
    });

    uploadZone.addEventListener("dragleave", function(e) {
        e.preventDefault();
        uploadZone.classList.remove("drag-over");
    });

    uploadZone.addEventListener("drop", function(e) {
        e.preventDefault();
        uploadZone.classList.remove("drag-over");
        const files = e.dataTransfer.files;
        if (files[0]) {
            processImageFile(files[0]);
        }
    });
}

async function startCamera() {
    try {
        const videoElement = document.getElementById("cameraPreview");
        const captureBtn = document.getElementById("captureBtn");
        const uploadZone = document.getElementById("uploadZone");

        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment", // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });

        videoElement.srcObject = stream;

        // Show video and hide upload UI
        videoElement.style.display = "block";
        uploadZone.querySelector("i").style.display = "none";
        uploadZone.querySelector("h3").textContent = "Position item in camera view";
        uploadZone.querySelector("p").textContent = "Tap capture when ready";

        // Update button text
        captureBtn.innerHTML = '<i class="fas fa-circle"></i> Capture';
        captureBtn.classList.add("capture-active");

    } catch (error) {
        console.error("Error accessing camera:", error);
        showToast("Camera access failed. Please use file upload instead.", "error");

        // Fallback to file input
        document.getElementById("wasteImage").click();
    }
}

function captureImageFromCamera() {
    const videoElement = document.getElementById("cameraPreview");

    if (!videoElement || !stream) {
        showToast("Camera not available", "error");
        return;
    }

    // Set canvas size to video dimensions
    captureCanvas.width = videoElement.videoWidth;
    captureCanvas.height = videoElement.videoHeight;

    // Draw current video frame to canvas
    captureContext.drawImage(videoElement, 0, 0);

    // Convert to blob and process
    captureCanvas.toBlob(function(blob) {
        if (blob) {
            processImageFile(blob);
        }
    }, "image/jpeg", 0.8);

    // Stop camera after capture
    stopCamera();
}

function stopCamera() {
    const videoElement = document.getElementById("cameraPreview");
    const captureBtn = document.getElementById("captureBtn");
    const uploadZone = document.getElementById("uploadZone");

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    // Reset UI
    videoElement.style.display = "none";
    uploadZone.querySelector("i").style.display = "block";
    uploadZone.querySelector("h3").textContent = "Scan Your Waste";
    uploadZone.querySelector("p").textContent = "Take a photo or upload an image";

    captureBtn.innerHTML = '<i class="fas fa-camera"></i> Capture Photo';
    captureBtn.classList.remove("capture-active");
}

async function processImageFile(file) {
    showLoading();

    try {
        // Convert file to base64
        const base64Image = await fileToBase64(file);

        // Display preview
        displayImagePreview(base64Image);

        // Classify the image
        await classifyWaste(base64Image);

    } catch (error) {
        console.error("Error processing image:", error);
        showToast("Failed to process image", "error");
    } finally {
        hideLoading();
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function displayImagePreview(base64Image) {
    const uploadZone = document.getElementById("uploadZone");

    // Create or update image preview
    let previewImg = document.getElementById("imagePreview");
    if (!previewImg) {
        previewImg = document.createElement("img");
        previewImg.id = "imagePreview";
        previewImg.style.maxWidth = "100%";
        previewImg.style.maxHeight = "200px";
        previewImg.style.borderRadius = "8px";
        previewImg.style.marginTop = "10px";
        uploadZone.appendChild(previewImg);
    }

    previewImg.src = base64Image;
    previewImg.style.display = "block";
}

async function classifyWaste(imageData) {
    try {
        const response = await fetch(`${API_BASE}/api/classify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: imageData
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        displayClassificationResult(data);

    } catch (error) {
        console.error("Classification error:", error);
        showToast("Classification failed. Please try again.", "error");

        // Show fallback result
        displayClassificationResult({
            category: "Error",
            bin: "Please try again",
            tip: "Make sure image is clear and well-lit",
            confidence: 0,
            points: 0,
            reuse_ideas: "Consider retaking the photo"
        });
    }
}

function displayClassificationResult(data) {
    const resultContainer = document.getElementById("classificationResult");

    resultContainer.innerHTML = `
        <div class="result-content">
            <div class="result-header">
                <i class="fas fa-check-circle result-icon"></i>
                <h3>Classification Result</h3>
            </div>

            <div class="result-details">
                <div class="result-item">
                    <span class="label">Category:</span>
                    <span class="value category-${(data.category || '').toLowerCase()}">${data.category || 'Unknown'}</span>
                </div>

                <div class="result-item">
                    <span class="label">Disposal Bin:</span>
                    <span class="value">${data.bin || 'General Waste'}</span>
                </div>

                <div class="result-item">
                    <span class="label">Confidence:</span>
                    <span class="value">${data.confidence || 0}%</span>
                </div>

                <div class="result-item">
                    <span class="label">Eco Points:</span>
                    <span class="value points">+${data.points || 0}</span>
                </div>
            </div>

            <div class="disposal-tip">
                <h4><i class="fas fa-lightbulb"></i> Disposal Tip</h4>
                <p>${data.tip || 'Follow local waste management guidelines'}</p>
            </div>

            ${data.reuse_ideas ? `
                <div class="reuse-ideas">
                    <h4><i class="fas fa-recycle"></i> Reuse Ideas</h4>
                    <p>${data.reuse_ideas}</p>
                </div>
            ` : ''}

            <button class="btn btn--secondary" onclick="resetClassification()">
                <i class="fas fa-redo"></i> Classify Another
            </button>
        </div>
    `;
}

function resetClassification() {
    const resultContainer = document.getElementById("classificationResult");
    const imagePreview = document.getElementById("imagePreview");

    // Reset result display
    resultContainer.innerHTML = `
        <div class="result-placeholder">
            <i class="fas fa-search"></i>
            <p>Classification results will appear here</p>
        </div>
    `;

    // Remove image preview
    if (imagePreview) {
        imagePreview.remove();
    }

    // Stop camera if active
    stopCamera();
}

// Utility functions
function showLoading() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.classList.remove("hidden");
    }
}

function hideLoading() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.classList.add("hidden");
    }
}

function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}