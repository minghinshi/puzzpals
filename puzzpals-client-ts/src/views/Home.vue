<template>
  Upload file:
  <input ref="fileInput" type="file" name="avatar" accept=".json" />
  <button @click="uploadFile">Upload</button>
</template>

<script setup lang="ts">
import api from '@/services/api';
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInput = useTemplateRef('fileInput');

async function uploadFile() {
  if (fileInput.value === null || fileInput.value.files === null || fileInput.value.files[0] === undefined) {
    alert('Please select a file to upload.');
    return;
  }

  const file = fileInput.value.files[0];
  let puzzleData;

  try {
    // Read JSON file 
    puzzleData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject();
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }).then(JSON.parse)
      .catch(() => {
        alert('Failed to read or parse the file. Please ensure it is a valid JSON file.');
        throw new Error('File read/parse error');
      });
  } catch (e) {
    return;
  }

  console.log('Parsed puzzle data:', puzzleData);

  // Send the data to the server
  const res = await api.post('/rooms/create', puzzleData, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((err) => {
    alert(`Upload failed: ${err.response?.data?.error || err.message}`);
  });

  if (res !== undefined && res.data && res.data.token) {
    router.push(`/room/${res.data.token}`);
  }

}
</script>
