let qr1 = null;
let qr2 = null;

let html5QrCode = null;
let cameras = [];
let currentCameraIndex = 0;

/* ---------- INICIALITZAR CÀMERES ---------- */

async function initCameras() {
  cameras = await Html5Qrcode.getCameras();

  if (!cameras || cameras.length === 0) {
    throw "No hi ha càmeres disponibles";
  }

  // Intentem seleccionar trasera per defecte
  const backIndex = cameras.findIndex(device =>
    device.label.toLowerCase().includes("back") ||
    device.label.toLowerCase().includes("rear") ||
    device.label.toLowerCase().includes("environment")
  );

  if (backIndex !== -1) {
    currentCameraIndex = backIndex;
  } else {
    // En iPhone sovint l’última és la trasera
    currentCameraIndex = cameras.length - 1;
  }
}

/* ---------- START SCANNER ---------- */
function startScanner() {
  return new Promise(async (resolve, reject) => {
    try {
      // Inicialitzar càmeres si cal
      if (!cameras.length) {
        await initCameras();
      }

      // Inicialitzar Html5QrCode si cal
      if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
      }

      // Parar scanner si ja està actiu
      if (html5QrCode.isScanning) {
        await html5QrCode.stop();
      }

      // Seleccionar la càmera actual
      const cameraId = cameras[currentCameraIndex].id;

      // Iniciar scanner
      await html5QrCode.start(
        cameraId,
        {
          fps: 15,
          qrbox: 260
        },
        async (qrCodeMessage) => {
          // Quan detecta QR → parar i resoldre Promise
          await html5QrCode.stop();
          resolve(qrCodeMessage);
        },
        () => {
          // ignorar errors de lectura
        }
      );

    } catch (err) {
      reject(err);
    }
  });
}


/* ---------- CANVIAR CÀMERA ---------- */

async function switchCamera() {
  try {

    if (!cameras.length) {
      await initCameras();
    }

    // Només canviem l’índex
    currentCameraIndex =
      (currentCameraIndex + 1) % cameras.length;

    console.log("Nova càmera seleccionada:",
      cameras[currentCameraIndex].label
    );

  } catch (err) {
    console.error("Error canviant càmera:", err);
  }
}


/* ---------- TAULA ---------- */

function afegirFilaTaula(codi1, codi2) {
  const table = document
    .getElementById("resultTable")
    .querySelector("tbody");

  const novaFila = document.createElement("tr");

  const cell1 = document.createElement("td");
  const cell2 = document.createElement("td");
  const cell3 = document.createElement("td");

  cell1.textContent = codi1;
  cell2.textContent = codi2;

  const ara = new Date();
  cell3.textContent = ara.toLocaleString();

  novaFila.appendChild(cell1);
  novaFila.appendChild(cell2);
  novaFila.appendChild(cell3);

  table.appendChild(novaFila);
    novaFila.scrollIntoView({ behavior: "smooth", block: "end" });
}

/* ---------- BOTONS ---------- */

// Botó 1
/* document.getElementById("scanBtn1").addEventListener("click", async () => {
  try {
    qr1 = await startScanner();
    console.log("QR1:", qr1);
    comprovarICrearFila();
  } catch (e) {
    console.error(e);
  }
});

// Botó 2
document.getElementById("scanBtn2").addEventListener("click", async () => {
  try {
    qr2 = await startScanner();
    console.log("QR2:", qr2);
    comprovarICrearFila();
  } catch (e) {
    console.error(e);
  }
});

 */
// Botó 1
document.getElementById("scanBtn1").addEventListener("click", async () => {
  try {
    qr1 = await startScanner();
    console.log("QR1:", qr1);

    // Canviem color a verd
    document.getElementById("scanBtn1").classList.add("active");

    comprovarICrearFila();
  } catch (e) {
    console.error(e);
  }
});

// Botó 2
document.getElementById("scanBtn2").addEventListener("click", async () => {
  try {
    qr2 = await startScanner();
    console.log("QR2:", qr2);

    // Canviem color a verd
    document.getElementById("scanBtn2").classList.add("active");

    comprovarICrearFila();
  } catch (e) {
    console.error(e);
  }
});


// Botó Canviar Càmera
document.getElementById("switchCameraBtn")
  .addEventListener("click", switchCamera);

/* ---------- CONTROL FILA ---------- */

function comprovarICrearFila() {
  if (qr1 && qr2) {
    afegirFilaTaula(qr1, qr2);
    // Tornem els botons al color original
    document.getElementById("scanBtn1").classList.remove("active");
    document.getElementById("scanBtn2").classList.remove("active");

    // Reiniciem variables
    qr1 = null;
    qr2 = null;
  }
}
