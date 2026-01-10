<template>
    <div class="bubble">
        <div class="chat-header">
        <span class="chat-user">{{ msg.user }}</span>
        </div>
        <div class="chat-text">{{ msg.msgtext }}</div>
        <div class="chat-footer">
        <span class="chat-time">{{ formattedTime }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/models/ChatState';
import { computed } from 'vue';

const props = defineProps<{ msg: ChatMessage }>();


const formattedTime = computed(() => {
    return new Date(props.msg.timestamp).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
    });
});

</script>


<style scoped>
.bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 16px;
  background: #d1f7e7;
  color: #222;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  word-break: break-word;
}

.chat-header {
  font-weight: bold;
  font-size: 12px;
  color: #555;
  margin-bottom: 2px;
}

.chat-text {
  font-size: 15px;
  margin-bottom: 4px;
}

.chat-footer {
  font-size: 11px;
  color: #888;
  align-self: flex-end;
}
</style>


