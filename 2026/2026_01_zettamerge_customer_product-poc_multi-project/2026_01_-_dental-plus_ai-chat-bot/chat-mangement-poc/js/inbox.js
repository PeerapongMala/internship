// Inbox - Admin Employee View
// งานที่ได้รับมอบหมาย (assigned) หรือ หยิบงานมาเอง (pick up)
// ต้องตอบแชทจนกว่าจะ Booking

const InboxState = {
  currentTab: "assigned", // assigned, available, completed
  selectedChat: null,
  pendingPickUpId: null,

  // งานที่ได้รับมอบหมายมา (จาก Dispatch)
  assignedChats: [
    {
      id: 1,
      customerName: "คุณสมชาย",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-red-100",
      avatarColor: "text-red-600",
      category: "ศัลยกรรม",
      categoryColor: "bg-red-100 text-red-700",
      lastMessage: "ปวดฟันคุดมากครับ อยากผ่าออก",
      time: "2 นาทีที่แล้ว",
      unread: 2,
      aiSummary: "ลูกค้าปวดฟันคุด 2 วัน กินยาแก้ปวดไม่หาย ต้องการผ่าฟันคุด",
      messages: [
        { sender: "customer", text: "สวัสดีครับ", time: "10:30" },
        { sender: "ai", text: "สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus ค่ะ มีอะไรให้ช่วยเหลือไหมคะ?", time: "10:30" },
        { sender: "customer", text: "ปวดฟันคุดมากครับ 2 วันแล้ว", time: "10:31" },
        { sender: "ai", text: "เสียใจด้วยนะคะที่ไม่สบาย ทานยาแก้ปวดแล้วยังไม่ดีขึ้นใช่ไหมคะ? แนะนำให้มาพบทันตแพทย์โดยเร็วค่ะ", time: "10:31" },
        { sender: "customer", text: "กินยาแก้ปวดแล้วไม่หายครับ อยากผ่าออก", time: "10:32" },
        { sender: "system", text: "AI ส่งต่อให้ Admin แอน - ทีมศัลยกรรม", time: "10:33" },
        { sender: "customer", text: "ปวดฟันคุดมากครับ อยากผ่าออก", time: "10:35" }
      ]
    },
    {
      id: 2,
      customerName: "คุณลิซ่า",
      channel: "Facebook",
      channelIcon: "f",
      channelColor: "bg-blue-600",
      avatarBg: "bg-blue-100",
      avatarColor: "text-blue-600",
      category: "ทั่วไป",
      categoryColor: "bg-blue-100 text-blue-700",
      lastMessage: "อยากขูดหินปูนค่ะ มีโปรไหม",
      time: "5 นาทีที่แล้ว",
      unread: 1,
      aiSummary: "สนใจขูดหินปูน ถามโปรโมชั่น งบประมาณ 1,000 บาท",
      messages: [
        { sender: "customer", text: "สวัสดีค่ะ", time: "10:25" },
        { sender: "ai", text: "สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus ค่ะ", time: "10:25" },
        { sender: "customer", text: "อยากขูดหินปูนค่ะ มีโปรไหม", time: "10:26" },
        { sender: "system", text: "AI ส่งต่อให้ Admin แอน - ทีมทันตกรรมทั่วไป", time: "10:27" }
      ]
    }
  ],

  // งานที่พร้อมให้หยิบ (ยังไม่มีคนรับ)
  availableChats: [
    {
      id: 101,
      customerName: "คุณวิภา",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-pink-100",
      avatarColor: "text-pink-600",
      category: "เสริมความงาม",
      categoryColor: "bg-pink-100 text-pink-700",
      lastMessage: "ถามราคาฟอกสีฟันค่ะ",
      time: "8 นาทีที่แล้ว",
      unread: 0,
      aiSummary: "สอบถามราคาฟอกสีฟัน ยังไม่ได้ตัดสินใจ",
      messages: [
        { sender: "customer", text: "สวัสดีค่ะ อยากถามราคาฟอกสีฟัน", time: "10:20" },
        { sender: "ai", text: "สวัสดีค่ะ ฟอกสีฟันของเราเริ่มต้นที่ 2,990 บาทค่ะ มีหลายแพ็คเกจให้เลือกค่ะ", time: "10:20" },
        { sender: "customer", text: "ถามราคาฟอกสีฟันค่ะ", time: "10:21" },
        { sender: "system", text: "รอ Admin หยิบงาน", time: "10:22" }
      ]
    }
  ],

  // งานที่ Booked แล้ว (วันนี้)
  completedChats: [
    {
      id: 201,
      customerName: "คุณมานะ",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-green-100",
      avatarColor: "text-green-600",
      category: "ทั่วไป",
      categoryColor: "bg-green-100 text-green-700",
      lastMessage: "ขอบคุณค่ะ เจอกันวันพุธนะคะ",
      time: "30 นาทีที่แล้ว",
      booking: { date: "15 ม.ค. 2567", time: "14:00", service: "ขูดหินปูน", branch: "สาขาสยาม" },
      messages: []
    },
    {
      id: 202,
      customerName: "คุณธิดา",
      channel: "Facebook",
      channelIcon: "f",
      channelColor: "bg-blue-600",
      avatarBg: "bg-purple-100",
      avatarColor: "text-purple-600",
      category: "จัดฟัน",
      categoryColor: "bg-purple-100 text-purple-700",
      lastMessage: "ดีใจมากค่ะ รอพบหมอนะคะ",
      time: "1 ชั่วโมงที่แล้ว",
      booking: { date: "16 ม.ค. 2567", time: "10:00", service: "จัดฟัน - ปรึกษา", branch: "สาขาอโศก" },
      messages: []
    },
    {
      id: 203,
      customerName: "คุณสุดา",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-yellow-100",
      avatarColor: "text-yellow-600",
      category: "ทั่วไป",
      categoryColor: "bg-blue-100 text-blue-700",
      lastMessage: "เข้าใจแล้วค่ะ ขอบคุณนะคะ",
      time: "2 ชั่วโมงที่แล้ว",
      booking: { date: "15 ม.ค. 2567", time: "16:00", service: "อุดฟัน", branch: "สาขาสยาม" },
      messages: []
    },
    {
      id: 204,
      customerName: "คุณพีระ",
      channel: "Facebook",
      channelIcon: "f",
      channelColor: "bg-blue-600",
      avatarBg: "bg-orange-100",
      avatarColor: "text-orange-600",
      category: "ศัลยกรรม",
      categoryColor: "bg-red-100 text-red-700",
      lastMessage: "เตรียมตัวไปผ่าครับ",
      time: "3 ชั่วโมงที่แล้ว",
      booking: { date: "17 ม.ค. 2567", time: "09:00", service: "ผ่าฟันคุด", branch: "สาขาลาดพร้าว" },
      messages: []
    },
    {
      id: 205,
      customerName: "คุณนิดา",
      channel: "LINE",
      channelIcon: "L",
      channelColor: "bg-green-500",
      avatarBg: "bg-cyan-100",
      avatarColor: "text-cyan-600",
      category: "เสริมความงาม",
      categoryColor: "bg-pink-100 text-pink-700",
      lastMessage: "ตื่นเต้นมากค่ะ",
      time: "4 ชั่วโมงที่แล้ว",
      booking: { date: "18 ม.ค. 2567", time: "13:00", service: "ฟอกสีฟัน", branch: "สาขาบางนา" },
      messages: []
    }
  ]
};

// Initialize
document.addEventListener("DOMContentLoaded", function() {
  renderChatList();
  updateCounts();
});

// Render chat list based on current tab
function renderChatList() {
  const container = document.getElementById("chatList");
  let chats = [];

  if (InboxState.currentTab === "assigned") {
    chats = InboxState.assignedChats;
  } else if (InboxState.currentTab === "available") {
    chats = InboxState.availableChats;
  } else {
    chats = InboxState.completedChats;
  }

  if (chats.length === 0) {
    container.innerHTML = `
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-sm">${InboxState.currentTab === "available" ? "ไม่มีงานให้หยิบ" : "ไม่มีรายการ"}</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = chats.map(chat => `
    <div class="chat-item ${InboxState.selectedChat === chat.id ? 'active' : ''} p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
         onclick="${InboxState.currentTab === 'available' ? `showPickUpModal(${chat.id})` : `selectChat(${chat.id})`}">
      <div class="flex items-start gap-3">
        <div class="relative flex-shrink-0">
          <div class="w-12 h-12 ${chat.avatarBg} rounded-full flex items-center justify-center">
            <span class="${chat.avatarColor} font-semibold text-lg">${chat.customerName.charAt(3)}</span>
          </div>
          <span class="absolute -bottom-1 -right-1 w-5 h-5 ${chat.channelColor} rounded text-white text-[9px] flex items-center justify-center font-bold">${chat.channelIcon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <p class="font-semibold text-gray-800">${chat.customerName}</p>
            <span class="text-xs text-gray-400">${chat.time}</span>
          </div>
          <p class="text-sm text-gray-500 truncate mb-2">${chat.lastMessage}</p>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 ${chat.categoryColor} text-xs rounded-full">${chat.category}</span>
            ${chat.unread ? `<span class="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">${chat.unread}</span>` : ''}
            ${chat.booking ? `<span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Booked</span>` : ''}
            ${InboxState.currentTab === 'available' ? `
              <span class="ml-auto text-xs text-dental-600 font-medium flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
                หยิบงาน
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// Select chat
function selectChat(id) {
  InboxState.selectedChat = id;
  renderChatList();
  renderChatArea();
}

// Get current chat
function getCurrentChat() {
  const allChats = [...InboxState.assignedChats, ...InboxState.availableChats, ...InboxState.completedChats];
  return allChats.find(c => c.id === InboxState.selectedChat);
}

// Render chat area
function renderChatArea() {
  const chat = getCurrentChat();
  if (!chat) return;

  // Hide empty state, show chat
  document.getElementById("emptyChatState").classList.add("hidden");
  document.getElementById("activeChatContainer").classList.remove("hidden");

  // Render header
  const header = document.getElementById("chatHeader");
  header.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 ${chat.avatarBg} rounded-full flex items-center justify-center">
            <span class="${chat.avatarColor} font-semibold">${chat.customerName.charAt(3)}</span>
          </div>
          <span class="absolute -bottom-1 -right-1 w-4 h-4 ${chat.channelColor} rounded text-white text-[8px] flex items-center justify-center font-bold">${chat.channelIcon}</span>
        </div>
        <div>
          <p class="font-semibold text-gray-800">${chat.customerName}</p>
          <p class="text-xs text-gray-500">${chat.channel} - ${chat.category}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${chat.booking ? `
          <span class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Booked: ${chat.booking.date} ${chat.booking.time}
          </span>
        ` : `
          <span class="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            กำลังคุย
          </span>
        `}
        <button onclick="toggleCustomerInfo()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  `;

  // Render messages
  const messagesContainer = document.getElementById("chatMessages");
  if (chat.messages && chat.messages.length > 0) {
    messagesContainer.innerHTML = chat.messages.map(msg => {
      if (msg.sender === "system") {
        return `
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
              ${msg.text} - ${msg.time}
            </div>
          </div>
        `;
      }
      const isAdmin = msg.sender === "admin" || msg.sender === "ai";
      return `
        <div class="flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} mb-4">
          <div class="message-bubble ${msg.sender === 'customer' ? 'bg-gray-200 text-gray-800' : 'bg-dental-500 text-white'} px-4 py-3 rounded-2xl ${msg.sender === 'customer' ? 'rounded-tl-none' : 'rounded-tr-none'}">
            <p class="text-sm">${msg.text}</p>
            <p class="text-xs ${msg.sender === 'customer' ? 'text-gray-500' : 'text-dental-200'} mt-1 text-right">${msg.time}</p>
          </div>
        </div>
      `;
    }).join("");

    // Add AI Summary if available
    if (chat.aiSummary) {
      messagesContainer.innerHTML = `
        <div class="flex justify-center mb-4">
          <div class="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-xl text-sm max-w-md">
            <span class="font-medium">AI Summary:</span> ${chat.aiSummary}
          </div>
        </div>
      ` + messagesContainer.innerHTML;
    }
  } else if (chat.booking) {
    messagesContainer.innerHTML = `
      <div class="flex justify-center items-center h-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-gray-800 font-medium mb-2">Booking สำเร็จ</p>
          <p class="text-sm text-gray-500">${chat.booking.service}</p>
          <p class="text-sm text-gray-500">${chat.booking.date} เวลา ${chat.booking.time}</p>
          <p class="text-sm text-gray-500">${chat.booking.branch}</p>
        </div>
      </div>
    `;
  }

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show/hide quick replies and input based on status
  const quickRepliesBar = document.getElementById("quickRepliesBar");
  const inputContainer = document.querySelector("#activeChatContainer > div:last-child");

  if (chat.booking) {
    quickRepliesBar.style.display = "none";
    if (inputContainer) inputContainer.style.display = "none";
  } else {
    quickRepliesBar.style.display = "block";
    if (inputContainer) inputContainer.style.display = "block";
  }

  // Render customer info panel
  renderCustomerInfo(chat);
}

// Render customer info panel
function renderCustomerInfo(chat) {
  const panel = document.getElementById("customerInfoPanel");
  panel.innerHTML = `
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800">ข้อมูลลูกค้า</h3>
        <button onclick="toggleCustomerInfo()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-3 mb-4">
        <div class="w-14 h-14 ${chat.avatarBg} rounded-full flex items-center justify-center">
          <span class="${chat.avatarColor} font-bold text-xl">${chat.customerName.charAt(3)}</span>
        </div>
        <div>
          <p class="font-bold text-gray-800">${chat.customerName}</p>
          <p class="text-sm text-gray-500">${chat.channel}</p>
        </div>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <div>
        <p class="text-xs text-gray-500 mb-1">ประเภท</p>
        <span class="px-2 py-1 ${chat.categoryColor} text-sm rounded-full">${chat.category}</span>
      </div>

      ${chat.aiSummary ? `
        <div>
          <p class="text-xs text-gray-500 mb-1">AI Summary</p>
          <p class="text-sm text-gray-700 bg-purple-50 p-3 rounded-lg">${chat.aiSummary}</p>
        </div>
      ` : ''}

      ${chat.booking ? `
        <div>
          <p class="text-xs text-gray-500 mb-1">การนัดหมาย</p>
          <div class="bg-green-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-green-800">${chat.booking.service}</p>
            <p class="text-sm text-green-700">${chat.booking.date} เวลา ${chat.booking.time}</p>
            <p class="text-sm text-green-700">${chat.booking.branch}</p>
          </div>
        </div>
      ` : ''}

      <div>
        <p class="text-xs text-gray-500 mb-1">ประวัติการติดต่อ</p>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>แชทครั้งนี้เป็นครั้งแรก</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Toggle customer info panel
function toggleCustomerInfo() {
  const panel = document.getElementById("customerInfoPanel");
  if (panel.style.display === "none") {
    panel.style.display = "flex";
  } else {
    panel.style.display = "none";
  }
}

// Switch tab
function switchInboxTab(tab) {
  InboxState.currentTab = tab;
  InboxState.selectedChat = null;

  // Update tab styles
  document.querySelectorAll(".inbox-tab").forEach(btn => {
    btn.classList.remove("bg-dental-500", "text-white");
    btn.classList.add("bg-gray-100", "text-gray-600");
  });
  event.target.classList.remove("bg-gray-100", "text-gray-600");
  event.target.classList.add("bg-dental-500", "text-white");

  // Reset chat area
  document.getElementById("emptyChatState").classList.remove("hidden");
  document.getElementById("activeChatContainer").classList.add("hidden");
  document.getElementById("customerInfoPanel").style.display = "none";

  renderChatList();
}

// Update counts
function updateCounts() {
  document.getElementById("assignedCount").textContent = InboxState.assignedChats.length;
  document.getElementById("availableCount").textContent = InboxState.availableChats.length;
  document.getElementById("completedCount").textContent = InboxState.completedChats.length;
  document.getElementById("myTaskCount").textContent = InboxState.assignedChats.length;
  document.getElementById("bookedTodayCount").textContent = InboxState.completedChats.length;
  document.getElementById("inboxBadge").textContent = InboxState.assignedChats.length + InboxState.availableChats.length;
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const chat = getCurrentChat();
  if (!chat) return;

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  chat.messages.push({
    sender: "admin",
    text: text,
    time: timeStr
  });

  chat.lastMessage = text;
  chat.time = "เมื่อกี้";
  chat.unread = 0;

  input.value = "";
  renderChatArea();
  renderChatList();

  // Simulate customer response after 2 seconds
  setTimeout(() => {
    simulateCustomerResponse(chat);
  }, 2000);
}

// Send quick reply
function sendQuickReply(text) {
  document.getElementById("messageInput").value = text;
  sendMessage();
}

// Handle Enter key
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Simulate customer response
function simulateCustomerResponse(chat) {
  const responses = [
    "ขอบคุณค่ะ",
    "เข้าใจแล้วค่ะ",
    "สนใจค่ะ อยากนัดหมาย",
    "วันไหนว่างบ้างคะ",
    "ราคานี้รวมอะไรบ้างคะ"
  ];

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  chat.messages.push({
    sender: "customer",
    text: responses[Math.floor(Math.random() * responses.length)],
    time: timeStr
  });

  chat.lastMessage = chat.messages[chat.messages.length - 1].text;

  renderChatArea();
  renderChatList();
}

// Pick up modals
function showPickUpModal(id) {
  InboxState.pendingPickUpId = id;
  const chat = InboxState.availableChats.find(c => c.id === id);
  document.getElementById("pickUpCustomerName").textContent = `คุณต้องการรับงานของ "${chat.customerName}" หรือไม่?`;
  document.getElementById("pickUpModal").classList.remove("hidden");
}

function closePickUpModal() {
  document.getElementById("pickUpModal").classList.add("hidden");
  InboxState.pendingPickUpId = null;
}

function confirmPickUp() {
  const id = InboxState.pendingPickUpId;
  const chatIndex = InboxState.availableChats.findIndex(c => c.id === id);

  if (chatIndex !== -1) {
    const chat = InboxState.availableChats.splice(chatIndex, 1)[0];

    // Add system message
    chat.messages.push({
      sender: "system",
      text: "Admin แอน หยิบงานนี้แล้ว",
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    });

    InboxState.assignedChats.push(chat);
    InboxState.currentTab = "assigned";
    InboxState.selectedChat = chat.id;

    // Update tab styles
    document.querySelectorAll(".inbox-tab").forEach(btn => {
      btn.classList.remove("bg-dental-500", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-600");
    });
    document.querySelector(".inbox-tab").classList.remove("bg-gray-100", "text-gray-600");
    document.querySelector(".inbox-tab").classList.add("bg-dental-500", "text-white");

    updateCounts();
    renderChatList();
    renderChatArea();
  }

  closePickUpModal();
  showToast("หยิบงานเรียบร้อยแล้ว!");
}

// Booking modals
function openBookingModal() {
  document.getElementById("bookingModal").classList.remove("hidden");
}

function closeBookingModal() {
  document.getElementById("bookingModal").classList.add("hidden");
}

function confirmBooking() {
  const chat = getCurrentChat();
  if (!chat) return;

  // Move from assigned to completed
  const chatIndex = InboxState.assignedChats.findIndex(c => c.id === chat.id);
  if (chatIndex !== -1) {
    const movedChat = InboxState.assignedChats.splice(chatIndex, 1)[0];

    // Add booking info
    movedChat.booking = {
      date: "15 ม.ค. 2567",
      time: "14:00",
      service: "ขูดหินปูน",
      branch: "สาขาสยาม"
    };
    movedChat.lastMessage = "Booked สำเร็จ!";

    InboxState.completedChats.unshift(movedChat);
    InboxState.selectedChat = null;
  }

  closeBookingModal();
  updateCounts();
  renderChatList();

  // Reset chat area
  document.getElementById("emptyChatState").classList.remove("hidden");
  document.getElementById("activeChatContainer").classList.add("hidden");
  document.getElementById("customerInfoPanel").style.display = "none";

  // Show success
  document.getElementById("bookingSuccessModal").classList.remove("hidden");
}

function closeBookingSuccessModal() {
  document.getElementById("bookingSuccessModal").classList.add("hidden");
}

// Toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "fixed bottom-8 right-8 bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg z-50";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
