let activeFletes = {}; // Almacenar fletes y sus estados

function markFleteAsAccepted(fleteId, driverId, userId) {
  activeFletes[fleteId] = { driverId, userId, status: 'aceptado' };
}

function markFleteAsCompleted(fleteId) {
  if (activeFletes[fleteId]) {
    delete activeFletes[fleteId];
  }
}

module.exports = { markFleteAsAccepted, markFleteAsCompleted, activeFletes };
