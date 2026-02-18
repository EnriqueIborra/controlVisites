let qr1 = null;
let qr2 = null;

function startScanner() {
  return new Promise((resolve, reject) => {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" }, // 👈 càmera trasera
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      qrCodeMessage => {
        html5QrCode.stop().then(() => {
          resolve(qrCodeMessage);
        });
      },
      errorMessage => {
        // ignorar errors de lectura
      }
    ).catch(err => {
      reject("Error accedint a la càmera: " + err);
    });
  });
}


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

  // 📅 Data i hora actual
  const ara = new Date();
  const dataHoraFormatejada = ara.toLocaleString(); 
  // Exemple: 17/2/2026, 18:42:31

  cell3.textContent = dataHoraFormatejada;

  novaFila.appendChild(cell1);
  novaFila.appendChild(cell2);
  novaFila.appendChild(cell3);

  table.appendChild(novaFila);
}


// Botó 1
document.getElementById("scanBtn1").addEventListener("click", async () => {
  qr1 = await startScanner();
  console.log("QR1:", qr1);
  comprovarICrearFila();
});

// Botó 2
document.getElementById("scanBtn2").addEventListener("click", async () => {
  qr2 = await startScanner();
  console.log("QR2:", qr2);
  comprovarICrearFila();
});

function comprovarICrearFila() {
  if (qr1 && qr2) {
    afegirFilaTaula(qr1, qr2);

    // Reiniciem per a la següent parella
    qr1 = null;
    qr2 = null;
  }
}

