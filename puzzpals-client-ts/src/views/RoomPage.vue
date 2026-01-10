<template>
  <div v-if="!initialGridState" class="joining-text">
    Joining room {{ token }}...
  </div>
  <div v-else>
    <div class="solving-page">
        <header class="top-bar">
            <h1>Puzzpals</h1>
            <span class="room-id">Room ID: {{ token }}</span>
            <button @click="leave">Leave</button>
        </header>

        <div class="content">
          <div class="puzzle-pane">
            <div class="left-inner">
              <PuzzleArea
                :initial-grid-state="initialGridState"
                @update-cell="onCellUpdated"
                ref="areaComponent"
              ></PuzzleArea>
            </div>
          </div>

          <div class="info-pane">
            <!--
                <div class="player-info">
                    Player info here
                </div>
              -->

                <div class="chat-con">
                  <Chat 
                    :chat-state="chatState" 
                    :userID="userID" 
                    @newMessage="onChatSubmit" 
                    ref="chatComponent" 
                  />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, type Ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/services/api';
import socket from '@/socket';
import PuzzleArea from '@/components/PuzzleArea.vue';

import type CellState from '@/models/CellState';
import type GridState from '@/models/GridState';
import Chat from '@/components/Chat.vue';
import type ChatState from '@/models/ChatState';
import type { ChatMessage } from '@/models/ChatState';

const router = useRouter();

const room: Ref<{ token: string; } | null> = ref(null);
const initialGridState: Ref<GridState | null> = ref(null);
const areaComponent = useTemplateRef("areaComponent");

const chatState: Ref<ChatState> = ref({messages: []});
const chatComponent = useTemplateRef("chatComponent");

const userID = ref<string | null>(null);
const props = defineProps({
  token: { type: String, required: true }
});

function is404(err: unknown) {
  return typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response !== null &&
    'status' in err.response &&
    err.response.status === 404;
}

async function fetchRoom() {
  try {
    const res = await api.get(`/rooms/${props.token}`);
    room.value = res.data.room;
  } catch (err) {
    if (is404(err)) {
      router.push('/404');
    } else {
      console.error(err);
      router.push('/');
    }
  }
}

async function join() {
  const res = await api.post(`/rooms/${props.token}/join`);
  room.value = res.data.room;
  socket.emit('room:join', { token: props.token });
}

async function leave() {
  await api.post(`/rooms/${props.token}/leave`);
  socket.emit('room:leave', { token: props.token });
  router.push('/');
}

function onCellUpdated(idx: number, value: CellState) {
  socket.emit('grid:updateCell', { token: props.token, idx, value });
}

function onChatSubmit(message: ChatMessage) {
  if (userID.value) {
    message.user = userID.value;
  }
  socket.emit('chat:newMessage', { token: props.token, message: message });
}


function initiateSocket() {
  // TODO
  socket.on('user:id', (id: string) => {
    userID.value = id;
  });

  socket.on('grid:state', (data: GridState) => {
    initialGridState.value = data;
  });

  socket.on('grid:cellUpdated', (data: { idx: number, value: CellState; }) => {
    const { idx, value } = data;
    if (areaComponent.value === null) {
      throw new Error("areaComponent is missing");
    };
    areaComponent.value.onCellUpdated(idx, value);
  });

  // socket.on('chat:records', (history) => {
  //   if (chatComponent.value === null) {
  //     throw new Error("Chat Block is missing");
  //   }
  //   chatState.value.messages.splice(0, chatState.value.messages.length, ...history);
  //   chatComponent.value.scrollToBottom();
  // });

  socket.on('chat:messageNew', (msgBlock) => {
    if (chatComponent.value === null) {
      throw new Error("Chat Block is missing");
    }
    chatState.value.messages.push(msgBlock);
    chatComponent.value.scrollToBottom();
  });
}

onBeforeMount(initiateSocket);

onMounted(async () => {
  await fetchRoom();
  console.log(`Joining room ${props.token}`);
  await join();
});

onBeforeUnmount(() => {
  socket.emit('room:leave', { token: props.token });
  socket.off();
});
</script>

<style scoped>
.joining-text {
  font-size: 1.5rem;
  text-align: center;
  margin-top: 2rem;
}

button {
    min-width: 100px;
}

input {
    min-width: 50px;
}

.solving-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.top-bar {
    background: linear-gradient(90deg, #26cda9, #2b8de2);
    color: #fff;
    padding: 12px 16px;
    height: 48px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    justify-content: space-between;
    position: relative;
}

.room-id {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    text-align: center;
    pointer-events: none; 
}

.content {
    flex: 1;
    display: flex;
    gap: 12px;
    padding: 12px;
    box-sizing: border-box;
    background: #f7f8fb;
}

.puzzle-pane {
    flex: 1 1 60%;
    min-width: 0;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 6px;
    padding: 12px;
    box-sizing: border-box;
    overflow: auto;
}

.info-pane {
    flex: 1 1 40%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
}

.player-info {
    height: 100px;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 6px;
    padding: 12px;
    box-sizing: border-box;
    overflow: auto;
}

.chat-con {
    flex: 1 1;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 6px;
    padding: 8px; 
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    overflow: hidden;
}

</style>
