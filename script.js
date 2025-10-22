async function loadMeshData() {
  try {
    const res = await fetch('/meshdata.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Mesh data not found');
    const data = await res.json();

    // --- Messages ---
    const msgList = document.getElementById('messages');
    if (msgList && data.messages) {
      msgList.innerHTML = '';
      data.messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.sender}: ${msg.text}`;
        msgList.appendChild(li);
      });
    }

    // --- Devices ---
    const devList = document.getElementById('devices');
    if (devList && data.devices) {
      devList.innerHTML = '';
      data.devices.forEach(dev => {
        const li = document.createElement('li');
        li.textContent = `${dev.name} (${dev.ip}) - ${dev.status}`;
        devList.appendChild(li);
      });
    }

    // --- Map Initialization ---
    if (!window.map) {
      window.map = L.map('map').setView([37.7749, -122.4194], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(window.map);
    }

    // --- Clear previous markers ---
    if (window.markers) {
      window.markers.forEach(m => m.remove());
    }
    window.markers = [];

    // --- Add new markers ---
    if (data.nodes && data.nodes.length > 0) {
      const bounds = [];
      data.nodes.forEach(n => {
        if (n.lat && n.lng) {
          const marker = L.marker([n.lat, n.lng]).addTo(window.map);
          marker.bindPopup(`<b>${n.name}</b><br>${n.status}`);
          window.markers.push(marker);
          bounds.push([n.lat, n.lng]);
        }
      });

      // Auto-center and zoom to fit all markers
      if (bounds.length > 0) {
        window.map.fitBounds(bounds, { padding: [40, 40] });
      }
    }

  } catch (err) {
    console.error('Error loading mesh data:', err);
  }
}

// Refresh mesh data every 5 seconds
setInterval(loadMeshData, 5000);
loadMeshData();

