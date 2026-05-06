// AI Chatbot Demo - State Management and Interactive Features

const AIChatbotState = {
  conversations: [
    {
      id: 1,
      customerName: "คุณมานะ",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-blue-100",
      avatarColor: "text-blue-600",
      status: "ai-active", // ai-active, pending, admin-mode
      lastMessage: "ราคาขูดหินปูนเท่าไหร่คะ",
      time: "2 นาทีที่แล้ว",
      messages: [
        { sender: "customer", text: "สวัสดีค่ะ", time: "10:30" },
        { sender: "ai", text: "สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus ค่ะ มีอะไรให้ช่วยเหลือไหมคะ?", time: "10:30" },
        { sender: "customer", text: "อยากถามราคาขูดหินปูนค่ะ", time: "10:31" },
        { sender: "ai", text: "ราคาขูดหินปูนของเราเริ่มต้นที่ 500-800 บาทค่ะ ขึ้นอยู่กับปริมาณหินปูน หากมีหินปูนมากอาจต้องใช้เวลาทำเพิ่มเติมค่ะ", time: "10:31" },
        { sender: "customer", text: "มีโปรโมชั่นไหมคะ", time: "10:32" },
        { sender: "ai", text: "ตอนนี้มีโปรโมชั่นขูดหินปูน + ตรวจฟันฟรี ในราคา 599 บาทค่ะ โปรโมชั่นนี้หมดเขตสิ้นเดือนนี้ค่ะ สนใจนัดหมายไหมคะ?", time: "10:32" },
        { sender: "customer", text: "ราคาขูดหินปูนเท่าไหร่คะ", time: "10:33" }
      ],
      quickReplies: ["ดูโปรโมชั่นเพิ่มเติม", "นัดหมายเลย", "ถามราคาอื่นๆ"]
    },
    {
      id: 2,
      customerName: "คุณสมศรี",
      channel: "Facebook",
      channelIcon: "f",
      channelColor: "bg-blue-600",
      avatarBg: "bg-pink-100",
      avatarColor: "text-pink-600",
      status: "ai-active",
      lastMessage: "อยากจัดฟันค่ะ ราคาเท่าไหร่",
      time: "5 นาทีที่แล้ว",
      messages: [
        { sender: "customer", text: "สวัสดีค่ะ สนใจจัดฟันค่ะ", time: "10:25" },
        { sender: "ai", text: "สวัสดีค่ะ ยินดีให้บริการค่ะ ทาง Dental Plus มีบริการจัดฟันหลายแบบเลยค่ะ ไม่ทราบว่าสนใจจัดฟันแบบไหนคะ?", time: "10:25" },
        { sender: "customer", text: "จัดฟันแบบใสค่ะ", time: "10:26" },
        { sender: "ai", text: "จัดฟันแบบใส (Invisalign) เริ่มต้นที่ 80,000 - 150,000 บาทค่ะ ขึ้นอยู่กับความซับซ้อนของเคส แนะนำให้มาปรึกษาทันตแพทย์ก่อนเพื่อวางแผนการรักษาที่เหมาะสมค่ะ", time: "10:26" },
        { sender: "customer", text: "แพงจังค่ะ มีผ่อนไหม", time: "10:27" },
        { sender: "ai", text: "มีบริการผ่อนชำระ 0% นานสูงสุด 10 เดือนค่ะ หรือผ่อนผ่านบัตรเครดิตได้ทุกธนาคารค่ะ สนใจนัดปรึกษาฟรีไหมคะ?", time: "10:27" },
        { sender: "customer", text: "อยากจัดฟันค่ะ ราคาเท่าไหร่", time: "10:28" }
      ],
      quickReplies: ["นัดปรึกษาฟรี", "ดูรายละเอียดเพิ่มเติม", "เปรียบเทียบแบบจัดฟัน"]
    },
    {
      id: 3,
      customerName: "คุณวิชัย",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-yellow-100",
      avatarColor: "text-yellow-600",
      status: "ai-active",
      lastMessage: "หมอคนไหนเก่งเรื่องผ่าฟันคุด",
      time: "8 นาทีที่แล้ว",
      messages: [
        { sender: "customer", text: "ฟันคุดปวดมากครับ", time: "10:20" },
        { sender: "ai", text: "เสียใจด้วยนะคะที่ฟันคุดทำให้ปวด หากปวดมากแนะนำให้มาพบทันตแพทย์โดยเร็วค่ะ ทานยาแก้ปวดไว้ก่อนได้ค่ะ", time: "10:20" },
        { sender: "customer", text: "ต้องผ่าออกไหมครับ", time: "10:21" },
        { sender: "ai", text: "ขึ้นอยู่กับตำแหน่งและสภาพฟันคุดค่ะ ต้องให้ทันตแพทย์ตรวจและเอกซเรย์ก่อน หากฟันคุดขึ้นไม่ได้หรือดันฟันข้างเคียง แนะนำให้ผ่าออกค่ะ", time: "10:21" },
        { sender: "customer", text: "ผ่าฟันคุดราคาเท่าไหร่", time: "10:22" },
        { sender: "ai", text: "ราคาผ่าฟันคุดเริ่มต้นที่ 3,000-8,000 บาท/ซี่ค่ะ ขึ้นอยู่กับความยากของเคส ฟันคุดที่อยู่ลึกหรือเอียงมากจะมีราคาสูงกว่าค่ะ", time: "10:22" },
        { sender: "customer", text: "หมอคนไหนเก่งเรื่องผ่าฟันคุด", time: "10:23" }
      ],
      quickReplies: ["ดูประวัติหมอ", "นัดผ่าฟันคุด", "สอบถามเพิ่มเติม"]
    },
    {
      id: 4,
      customerName: "คุณนภา",
      channel: "Facebook",
      channelIcon: "f",
      channelColor: "bg-blue-600",
      avatarBg: "bg-red-100",
      avatarColor: "text-red-600",
      status: "pending",
      lastMessage: "ไม่พอใจบริการมาก ทำไมนัดแล้วต้องรอนาน",
      time: "12 นาทีที่แล้ว",
      messages: [
        { sender: "customer", text: "มีเรื่องจะร้องเรียนค่ะ", time: "10:15" },
        { sender: "ai", text: "ขออภัยในความไม่สะดวกค่ะ กรุณาแจ้งรายละเอียดเพื่อให้ทางเราช่วยแก้ไขปัญหาให้ค่ะ", time: "10:15" },
        { sender: "customer", text: "เมื่อวานมานัดหมอตอน 10 โมง แต่ต้องรอเกือบ 2 ชั่วโมงกว่าจะได้พบหมอ", time: "10:16" },
        { sender: "ai", text: "ขอโทษอย่างสูงค่ะสำหรับความไม่สะดวกที่เกิดขึ้น ทางเราจะรับเรื่องไว้และประสานงานกับทีมงานค่ะ", time: "10:16" },
        { sender: "customer", text: "ไม่พอใจบริการมาก ทำไมนัดแล้วต้องรอนาน", time: "10:17" },
        { sender: "ai", text: "ขออภัยอีกครั้งค่ะ ทางเราจะส่งเรื่องให้ผู้จัดการสาขาติดต่อกลับภายใน 24 ชั่วโมงค่ะ กรุณารอสักครู่ค่ะ", time: "10:17", isLast: true }
      ],
      quickReplies: [],
      aiNote: "AI ตรวจพบว่าเป็นเคสร้องเรียน แนะนำให้ Admin รับเรื่องต่อ"
    }
  ],
  selectedConversation: null,
  currentFilter: "all"
};

// Initialize
document.addEventListener("DOMContentLoaded", function() {
  renderConversationsList();
  updateActiveChatsCount();
});

// Render conversations list - Card Style
function renderConversationsList() {
  const container = document.getElementById("conversationsList");
  const filteredConversations = AIChatbotState.conversations.filter(conv => {
    if (AIChatbotState.currentFilter === "all") return true;
    if (AIChatbotState.currentFilter === "ai-active") return conv.status === "ai-active";
    if (AIChatbotState.currentFilter === "pending") return conv.status === "pending";
    return true;
  });

  const channelIcons = {
    'LINE': `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>`,
    'Facebook': `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  };

  const statusStyles = {
    'ai-active': { border: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700', badgeText: '🤖 AI กำลังตอบ', pulse: true },
    'pending': { border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700', badgeText: '⏳ รอส่งต่อ', pulse: false },
    'admin-mode': { border: 'border-l-teal-500', badge: 'bg-teal-100 text-teal-700', badgeText: '👤 Admin Mode', pulse: false }
  };

  const channelIconColors = {
    'LINE': 'text-green-500',
    'Facebook': 'text-blue-600'
  };

  if (filteredConversations.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-center text-sm">ไม่มีแชทในหมวดนี้</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredConversations.map(conv => {
    const style = statusStyles[conv.status] || statusStyles['ai-active'];

    return `
      <div class="chat-card bg-white rounded-xl p-4 shadow-sm border-l-4 ${style.border} cursor-pointer transition-all ${AIChatbotState.selectedConversation === conv.id ? 'ring-2 ring-dental-500 bg-dental-50' : ''}"
           onclick="selectConversation(${conv.id})">
        <!-- Row 1: Avatar + Name + Time -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 ${conv.avatarBg} rounded-full flex items-center justify-center">
                <span class="${conv.avatarColor} font-semibold">${conv.customerName.charAt(3)}</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm ${channelIconColors[conv.channel] || 'text-gray-500'}">
                ${channelIcons[conv.channel] || `<span class="text-[8px] font-bold">${conv.channelIcon}</span>`}
              </div>
            </div>
            <div>
              <p class="font-medium text-gray-800">${conv.customerName}</p>
              <p class="text-xs text-gray-500">${conv.channel}</p>
            </div>
          </div>
          <span class="text-xs text-gray-400">${conv.time}</span>
        </div>

        <!-- Row 2: Last Message -->
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${conv.lastMessage}</p>

        <!-- Row 3: Status Badge -->
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 ${style.badge} text-xs rounded-full font-medium">
            ${style.pulse ? '<span class="w-1.5 h-1.5 bg-purple-500 rounded-full ai-pulse"></span>' : ''}
            ${style.badgeText}
          </span>
          ${conv.aiNote ? '<span class="text-xs text-orange-500 font-medium">⚠️</span>' : ''}
        </div>

        <!-- Row 4: Footer Info -->
        <div class="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span class="flex items-center gap-1 ${channelIconColors[conv.channel] || 'text-gray-500'}">
            ${channelIcons[conv.channel] || ''}
            ${conv.channel}
          </span>
          <span>${conv.messages.length} ข้อความ</span>
        </div>
      </div>
    `;
  }).join("");
}

// Select conversation
function selectConversation(id) {
  AIChatbotState.selectedConversation = id;
  renderConversationsList();
  renderChatPreview();
}

// Render chat preview
function renderChatPreview() {
  const conv = AIChatbotState.conversations.find(c => c.id === AIChatbotState.selectedConversation);
  if (!conv) return;

  // Update header
  const header = document.getElementById("chatHeader");
  header.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 ${conv.avatarBg} rounded-full flex items-center justify-center">
            <span class="${conv.avatarColor} font-semibold">${conv.customerName.charAt(3)}</span>
          </div>
          <span class="absolute -bottom-1 -right-1 w-4 h-4 ${conv.channelColor} rounded text-white text-[8px] flex items-center justify-center font-bold">${conv.channelIcon}</span>
        </div>
        <div>
          <p class="font-semibold text-gray-800">${conv.customerName}</p>
          <p class="text-xs text-gray-500">${conv.channel} - ${conv.status === "ai-active" ? "AI กำลังตอบ" : conv.status === "pending" ? "รอส่งต่อ Admin" : "Admin Mode"}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${conv.status === "ai-active" ? `
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
            <span class="w-2 h-2 bg-purple-500 rounded-full ai-pulse"></span>
            AI กำลังตอบ
          </span>
        ` : conv.status === "pending" ? `
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
            <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
            รอส่งต่อ Admin
          </span>
        ` : `
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-dental-100 text-dental-700 text-sm rounded-full">
            <span class="w-2 h-2 bg-dental-500 rounded-full"></span>
            Admin Mode
          </span>
        `}
      </div>
    </div>
  `;

  // Update messages
  const messagesContainer = document.getElementById("chatMessages");
  messagesContainer.innerHTML = conv.messages.map(msg => `
    <div class="flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} mb-4">
      <div class="message-bubble ${msg.sender === 'customer' ? 'bg-gray-200 text-gray-800' : 'bg-purple-500 text-white'} px-4 py-3 rounded-2xl ${msg.sender === 'customer' ? 'rounded-tl-none' : 'rounded-tr-none'}">
        <p class="text-sm">${msg.text}</p>
        <p class="text-xs ${msg.sender === 'customer' ? 'text-gray-500' : 'text-purple-200'} mt-1 text-right">${msg.time}</p>
      </div>
    </div>
  `).join("");

  // Add AI note for pending status
  if (conv.status === "pending" && conv.aiNote) {
    messagesContainer.innerHTML += `
      <div class="flex justify-center mb-4">
        <div class="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm">
          <span class="font-medium">AI Note:</span> ${conv.aiNote}
        </div>
      </div>
    `;
  }

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show actions
  const actionsContainer = document.getElementById("chatActions");
  actionsContainer.style.display = "block";

  // Update quick replies
  const quickRepliesContainer = document.getElementById("quickRepliesContainer");
  if (conv.quickReplies && conv.quickReplies.length > 0 && conv.status !== "admin-mode") {
    quickRepliesContainer.innerHTML = conv.quickReplies.map(reply => `
      <button onclick="sendQuickReply('${reply}')" class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors">
        ${reply}
      </button>
    `).join("");
  } else if (conv.status === "admin-mode") {
    quickRepliesContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <input type="text" id="adminReplyInput" placeholder="พิมพ์ข้อความ..." class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dental-500 w-64" />
        <button onclick="sendAdminReply()" class="px-4 py-2 bg-dental-500 text-white rounded-xl text-sm hover:bg-dental-600">ส่ง</button>
      </div>
    `;
  } else {
    quickRepliesContainer.innerHTML = "";
  }
}

// Send quick reply (AI mock response)
function sendQuickReply(reply) {
  const conv = AIChatbotState.conversations.find(c => c.id === AIChatbotState.selectedConversation);
  if (!conv) return;

  // Add customer message (simulating customer clicking quick reply)
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  conv.messages.push({
    sender: "customer",
    text: reply,
    time: timeStr
  });

  conv.lastMessage = reply;
  conv.time = "เมื่อกี้";

  renderChatPreview();
  renderConversationsList();

  // Simulate AI thinking
  setTimeout(() => {
    showTypingIndicator();
  }, 500);

  // Simulate AI response
  setTimeout(() => {
    hideTypingIndicator();

    let aiResponse = "";
    if (reply.includes("โปรโมชั่น")) {
      aiResponse = "โปรโมชั่นเดือนนี้มีหลายรายการค่ะ: 1) ขูดหินปูน+ตรวจฟัน 599 บาท 2) ฟอกสีฟัน 2,990 บาท 3) จัดฟันใส ลด 10% สนใจรายการไหนคะ?";
    } else if (reply.includes("นัด")) {
      aiResponse = "ยินดีค่ะ! กรุณาเลือกวันและเวลาที่สะดวก:\n- จันทร์-ศุกร์: 10:00-20:00\n- เสาร์-อาทิตย์: 10:00-18:00\nต้องการนัดวันไหนคะ?";
    } else if (reply.includes("หมอ") || reply.includes("ประวัติ")) {
      aiResponse = "ทันตแพทย์ผู้เชี่ยวชาญของเรา:\n- ทพ.สมชาย (ศัลยกรรม) - ประสบการณ์ 15 ปี\n- ทพญ.สุดา (จัดฟัน) - ประสบการณ์ 10 ปี\n- ทพ.วิชัย (ทั่วไป) - ประสบการณ์ 8 ปี\nสนใจนัดพบหมอท่านใดคะ?";
    } else if (reply.includes("เปรียบเทียบ")) {
      aiResponse = "การจัดฟันมี 3 แบบค่ะ:\n1) จัดฟันโลหะ: 35,000-50,000 บาท\n2) จัดฟันเซรามิก: 50,000-70,000 บาท\n3) จัดฟันใส: 80,000-150,000 บาท\nแต่ละแบบมีข้อดีต่างกัน อยากให้อธิบายเพิ่มเติมไหมคะ?";
    } else {
      aiResponse = "ขอบคุณค่ะ มีอะไรให้ช่วยเหลือเพิ่มเติมไหมคะ? หากต้องการนัดหมายสามารถบอกวันเวลาที่สะดวกได้เลยค่ะ";
    }

    conv.messages.push({
      sender: "ai",
      text: aiResponse,
      time: timeStr
    });

    renderChatPreview();
  }, 2000);
}

// Show typing indicator
function showTypingIndicator() {
  const messagesContainer = document.getElementById("chatMessages");
  const typingDiv = document.createElement("div");
  typingDiv.id = "typingIndicator";
  typingDiv.className = "flex justify-end mb-4";
  typingDiv.innerHTML = `
    <div class="message-bubble bg-purple-100 px-4 py-3 rounded-2xl rounded-tr-none">
      <div class="typing-indicator flex gap-1">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

// Filter conversations
function filterConversations(filter) {
  AIChatbotState.currentFilter = filter;

  // Update tab styles
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.classList.remove("bg-dental-500", "text-white");
    tab.classList.add("bg-gray-100", "text-gray-600");
  });
  event.target.classList.remove("bg-gray-100", "text-gray-600");
  event.target.classList.add("bg-dental-500", "text-white");

  renderConversationsList();
}

// Take over chat (Admin mode)
function takeOverChat() {
  const conv = AIChatbotState.conversations.find(c => c.id === AIChatbotState.selectedConversation);
  if (!conv) return;

  conv.status = "admin-mode";

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  conv.messages.push({
    sender: "ai",
    text: "[ระบบ] Admin Ann เข้ามารับช่วงต่อแล้วค่ะ",
    time: timeStr
  });

  renderChatPreview();
  renderConversationsList();
  updateActiveChatsCount();

  // Show success modal
  document.getElementById("adminModeModal").classList.remove("hidden");
}

// Send admin reply
function sendAdminReply() {
  const input = document.getElementById("adminReplyInput");
  const text = input.value.trim();
  if (!text) return;

  const conv = AIChatbotState.conversations.find(c => c.id === AIChatbotState.selectedConversation);
  if (!conv) return;

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  conv.messages.push({
    sender: "ai", // Admin messages also show on right side
    text: text,
    time: timeStr
  });

  conv.lastMessage = text;
  conv.time = "เมื่อกี้";

  input.value = "";
  renderChatPreview();
  renderConversationsList();
}

// Open transfer modal
function openTransferModal() {
  document.getElementById("transferModal").classList.remove("hidden");
}

// Close transfer modal
function closeTransferModal() {
  document.getElementById("transferModal").classList.add("hidden");
}

// Transfer to team
function transferToTeam(team) {
  const conv = AIChatbotState.conversations.find(c => c.id === AIChatbotState.selectedConversation);
  if (!conv) return;

  const teamNames = {
    general: "ทีมทันตกรรมทั่วไป",
    surgery: "ทีมศัลยกรรมช่องปาก",
    ortho: "ทีมจัดฟัน",
    cosmetic: "ทีมเสริมความงาม"
  };

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  conv.messages.push({
    sender: "ai",
    text: `[ระบบ] ส่งต่อไปยัง ${teamNames[team]} แล้วค่ะ`,
    time: timeStr
  });

  conv.status = "admin-mode";
  conv.lastMessage = `ส่งต่อไปยัง ${teamNames[team]}`;
  conv.time = "เมื่อกี้";

  closeTransferModal();
  renderChatPreview();
  renderConversationsList();
  updateActiveChatsCount();

  // Show toast notification
  showToast(`ส่งต่อไปยัง ${teamNames[team]} เรียบร้อยแล้ว`);
}

// Close admin mode modal
function closeAdminModeModal() {
  document.getElementById("adminModeModal").classList.add("hidden");
}

// Update active chats count
function updateActiveChatsCount() {
  const activeCount = AIChatbotState.conversations.filter(c => c.status === "ai-active").length;
  document.getElementById("activeChatsCount").textContent = activeCount;
}

// Simulate new chat
function simulateNewChat() {
  const newId = AIChatbotState.conversations.length + 1;
  const names = ["คุณธนา", "คุณปิยะ", "คุณจันทร์", "คุณดวง", "คุณเอก"];
  const messages = [
    "สวัสดีค่ะ อยากสอบถามราคาทำฟันค่ะ",
    "ฟันผุต้องถอนไหมคะ",
    "มีบริการทำฟันปลอมไหมครับ",
    "อยากฟอกสีฟันค่ะ ราคาเท่าไหร่",
    "นัดตรวจฟันได้วันไหนบ้างครับ"
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const channels = [
    { channel: "LINE", icon: "L", color: "bg-green-500" },
    { channel: "Facebook", icon: "f", color: "bg-blue-600" }
  ];
  const randomChannel = channels[Math.floor(Math.random() * channels.length)];
  const avatarColors = [
    { bg: "bg-green-100", color: "text-green-600" },
    { bg: "bg-purple-100", color: "text-purple-600" },
    { bg: "bg-orange-100", color: "text-orange-600" },
    { bg: "bg-cyan-100", color: "text-cyan-600" }
  ];
  const randomAvatar = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newConv = {
    id: newId,
    customerName: randomName,
    channel: randomChannel.channel,
    channelIcon: randomChannel.icon,
    channelColor: randomChannel.color,
    avatarBg: randomAvatar.bg,
    avatarColor: randomAvatar.color,
    status: "ai-active",
    lastMessage: randomMessage,
    time: "เมื่อกี้",
    messages: [
      { sender: "customer", text: randomMessage, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) },
      { sender: "ai", text: "สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus ค่ะ กำลังตรวจสอบข้อมูลให้ค่ะ กรุณารอสักครู่นะคะ", time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }
    ],
    quickReplies: ["ดูราคา", "นัดหมาย", "สอบถามเพิ่มเติม"]
  };

  AIChatbotState.conversations.unshift(newConv);
  renderConversationsList();
  updateActiveChatsCount();

  // Add animation class to new chat
  const firstItem = document.querySelector(".chat-card");
  if (firstItem) {
    firstItem.classList.add("new-chat-animation");
  }

  showToast("มีแชทใหม่เข้ามา!");
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "fixed bottom-24 right-8 bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-pulse";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
