document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const fileStatus = document.getElementById("file-status");
    const filePayloadEl = document.getElementById("file-payload");
    const captureStatus = document.getElementById("capture-status");
    const screenShareBtn = document.getElementById("screen-share-btn");
    const screenPreview = document.getElementById("screen-preview");
    const recordedVideo = document.getElementById("recorded-video");
  
    let screenStream = null;
    let recorder = null;
    let recordedChunks = [];
    let recordingMimeType = "";
  
    function stopCurrentStream() {
      if (!screenStream) {
        return;
      }
      screenStream.getTracks().forEach((t) => t.stop());
      screenStream = null;
      screenPreview.srcObject = null;
    }
  
    function getSupportedMimeType() {
      const candidates = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
  
      for (const type of candidates) {
        if (MediaRecorder.isTypeSupported(type)) {
          return type;
        }
      }
  
      return "";
    }
  
    function renderRecording() {
      if (recordedChunks.length === 0) {
        return;
      }
  
      if (recordedVideo.dataset.url) {
        URL.revokeObjectURL(recordedVideo.dataset.url);
      }
  
      const blobType = recordingMimeType || "video/webm";
      const blob = new Blob(recordedChunks, { type: blobType });
      const videoUrl = URL.createObjectURL(blob);
      recordedVideo.src = videoUrl;
      recordedVideo.dataset.url = videoUrl;
      recordedVideo.load();
      captureStatus.textContent = "Recording complete. You can play it below.";
    }
  
    function readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }
  
    fileInput.addEventListener("change", async () => {
      const { files } = fileInput;
      fileStatus.textContent = "";
      filePayloadEl.textContent = "";
  
      if (!files || files.length === 0) {
        return;
      }
  
      const file = files[0];
      fileStatus.textContent = "Reading file…";
  
      try {
        const fileContent = await readFileAsDataUrl(file);
        const payload = {
          file: {
            name: file.name,
            content: fileContent,
          },
        };
        fileStatus.textContent = "";
        filePayloadEl.textContent = JSON.stringify(payload, null, 2);
      } catch (err) {
        console.error(err);
        fileStatus.textContent = "Could not read the file.";
      }
    });
  
    screenShareBtn.addEventListener("click", async () => {
  
      try {
        if (screenStream) {
          stopCurrentStream();
        }
  
        screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        captureStatus.textContent = "";
  
        screenPreview.srcObject = screenStream;
        recordedChunks = [];
        recordingMimeType = getSupportedMimeType();
        recorder =  new MediaRecorder(screenStream, { mimeType: recordingMimeType })
        
  
        recorder.addEventListener("dataavailable", (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        });
  
        recorder.addEventListener("stop", () => {
          renderRecording();
          recorder = null;
        });
  
        recorder.start();
        captureStatus.textContent = "Screen sharing and recording in progress.";
  
        const [videoTrack] = screenStream.getVideoTracks();
        if (videoTrack) {
          videoTrack.addEventListener("ended", () => {
            if (recorder && recorder.state !== "inactive") {
              recorder.stop();
            }
            stopCurrentStream();
          });
        }
      } catch (err) {
        if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
          console.error(err);
        }
        captureStatus.textContent =
          err.message || "Could not start screen sharing.";
      }
    });
  });
  