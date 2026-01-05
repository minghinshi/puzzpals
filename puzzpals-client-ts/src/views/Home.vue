<template>
  Upload file: 
  <input ref="fileInput" type="file" name="avatar" accept=".json" /> 
  <button @click="uploadFile">Upload</button>
</template>

<script setup>
import api from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInput = ref(null);

async function uploadFile() {
  if (fileInput.value.files.length === 0) {
    alert('Please select a file to upload.');
    return;
  }

  const file = fileInput.value.files[0];

  // Read JSON file
  const puzzleData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  }).then(JSON.parse)
  .catch(() => {
    alert('Failed to read or parse the file. Please ensure it is a valid JSON file.');
    throw new Error('File read/parse error');
  });

  console.log('Parsed puzzle data:', puzzleData);

  // Send the data to the server
  const res = await api.post('/rooms/create', puzzleData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  router.push(`/room/${res.data.token}`);
}
</script>

