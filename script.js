document.addEventListener("DOMContentLoaded", () => {
  loadDevices();
  loadMeshData();
  loadMessages();
});

// Example: load devices from meshdata.json
async function loadDevices() {
  try {
    const res = await fetch("meshdata.json");
    const data = await res.json();

    const list = document.getElementById("device-list");
    list.innerHTML = "";
    data.devices.forEach(device => {
      const li = document.createElement("li");
      li.textContent = `${device.name} (${device.status})`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading devices:", err);
  }
}

// Example: load mesh network map
function loadMeshData() {
  const canvas = document.createElement("canvas");
  const map = document.getElementById("mesh-map");
  map.innerHTML = "";
  map.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = map.clientWidth;
  canvas.height = map.clientHeight;

  fetch("meshdata.json")
    .then(res => res.json())
    .then(data => {
      data.links.forEach(link => {
        ctx.beginPath();
        ctx.moveTo(link.x1, link.y1);
        ctx.lineTo(link.x2, link.y2);
        ctx.strokeStyle = "#00ffaa";
        ctx.stroke();
      });
    });
}

// Example: static message feed
function loadMessages() {
  const messages = [
    "Mesh node 3 reconnected.",
    "CCTV feed restarted.",
    "System uptime: 12h 34m"
  ];

  const list = document.getElementById("messages-list");
  list.innerHTML = "";
  messages.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = msg;
    list.appendChild(li);
  });
}
