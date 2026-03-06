const axios = require('axios');
const { sendStyledBackupEmbed } = require('./notif');
const { PTERO_API_URL, PTERO_API_KEY, SERVER_ID, forceNotify } = require('./config');

let lastBackupId = null;

async function checkBackupStatus() {
  console.log('Mengambil informasi backup...');

  try {
    const res = await axios.get(`${PTERO_API_URL}/servers/${SERVER_ID}/backups`, {
      headers: { Authorization: PTERO_API_KEY }
    });

    const backups = res.data.data;
    console.log(`>> Jumlah backup ditemukan: ${backups.length}`);

    const sorted = backups
      .sort((a, b) => new Date(b.attributes.created_at) - new Date(a.attributes.created_at));

    const latest = sorted[sorted.length - 1];
    if (!latest) {
      console.log('-> Belum ada backup.');
      return;
    }

    const { uuid, name, completed_at } = latest.attributes;

    console.log(`-> Backup terbaru: ${name}`);
    console.log(`-> UUID: ${uuid}`);
    console.log(`-> Completed at: ${completed_at}`);
    console.log(`-> Last notified UUID: ${lastBackupId}`);

    if (uuid !== lastBackupId && !completed_at) {
      sendStyledBackupEmbed({ nodeName: name, status: 'in_progress' });
    }

    if ((uuid !== lastBackupId || forceNotify) && completed_at) {
      lastBackupId = uuid;
      sendStyledBackupEmbed({ nodeName: name, status: 'completed', completedAt: completed_at });
    } else {
      console.log('📭 Tidak ada backup baru yang selesai.');
    }
  } catch (err) {
    console.error('-> Gagal cek backup:', err.message);
    if (err.response) {
      console.error('-> Status:', err.response.status);
      console.error('-> Data:', err.response.data);
    }
  }
}

module.exports = { checkBackupStatus };
