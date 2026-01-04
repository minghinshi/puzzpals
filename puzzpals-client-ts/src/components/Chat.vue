<template>
  <div class="chat-container">
    <div class="chat-window" ref="chatWindowRef">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat-message"
        :class="{ 'my-message': msg.user === pseudoID, 'other-message': msg.user !== pseudoID }"
      >
        <div class="bubble">
          <div class="chat-header">
            <span class="chat-user">{{ msg.user }}</span>
          </div>
          <div class="chat-text">{{ msg.msgtext }}</div>
          <div class="chat-footer">
            <span class="chat-time">{{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
        </div>
      </div>
    </div>
    <form class="chat-input" @submit.prevent="send">
      <input v-model="input" type="text" placeholder="Type a message..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import type { ChatMessage } from '@/models/ChatState';

const props = defineProps<{ chatState: { messages: ChatMessage[] } }>();
const emit = defineEmits(['newMessage']);
const input = ref('');
const pseudoID = 'user123'; // TODO: Replace with actual user ID later
const chatWindowRef = ref<HTMLElement | null>(null);
const messages = ref<ChatMessage[]>(props.chatState.messages);

defineExpose({ scrollToBottom });

function send() {
  const text = input.value.trim();
  console.log(text)
  if (text) {
    const message = {
      user: pseudoID, // Replace with actual user ID if available
      msgtext: text,
      timestamp: Date.now()
    };
    console.log(message)
    emit('newMessage', message);
    input.value = '';
  }
}

function scrollToBottom() {
  nextTick(() => {
    const cW = chatWindowRef.value;
    if (cW) { cW.scrollTop = cW.scrollHeight; }
  });
}

</script>

<style scoped>
.chat-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 320px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.chat-window {
  flex: 1 1 auto;
  height: 300px;
  overflow-y: auto;
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-message {
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
}

.my-message {
  justify-content: flex-end;
}

.other-message {
  justify-content: flex-start;
}

.bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 16px;
  background: #d1f7e7;
  color: #222;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  word-break: break-word;
}

.other-message .bubble {
  background: #f1f1f1;
  color: #222;
  align-items: flex-start;
}

.my-message .bubble {
  background: #26cda9;
  color: #fff;
  align-items: flex-end;
}

.chat-header {
  font-weight: bold;
  font-size: 12px;
  color: #555;
  margin-bottom: 2px;
}

.my-message .chat-header {
  color: #e0fff6;
}

.other-message .chat-header {
  color: #555;
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

.chat-input {
  display: flex;
  gap: 8px;
  padding: 8px;
}

.chat-input input {
  flex: 1 1 auto;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.chat-input button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background: #26cda9;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
</style>