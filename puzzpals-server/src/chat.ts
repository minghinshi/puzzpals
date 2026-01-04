type ChatMessage = {
  user: string;
  msgtext: string;
  timestamp: number;
};

const chatRecords = new Map<string, ChatMessage[]>(); // roomToken => [ { user, msgtext, timestamp }, ... ]

function fetchChatRecords(token: string) {
  return chatRecords.get(token) || [];
}

function pushMessage(token: string, message: ChatMessage) {
  if (!chatRecords.has(token)) {
    chatRecords.set(token, []);
  }
  chatRecords.get(token)!.push(message);
}

export { chatRecords, fetchChatRecords, pushMessage };