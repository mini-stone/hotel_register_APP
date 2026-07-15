// ===================== 房间基础数据 =====================
// location: 楼层/位置标签（仅作为卡片上的小标签展示，不用于分组）
// noWindow: 是否无窗
// note: 备注（可选，例如"房间大"）
const ROOMS = [
  { number: "8101", type: "豪华商务标间", price: 168, noWindow: false, location: "81区" },
  { number: "8102", type: "豪华商务三人间", price: 188, noWindow: false, location: "81区" },
  { number: "8103", type: "豪华大床间", price: 168, noWindow: false, location: "81区" },
  { number: "8105", type: "豪华标间", price: 168, noWindow: false, location: "81区" },
  { number: "8106", type: "豪华标间", price: 168, noWindow: true, location: "81区" },
  { number: "8107", type: "豪华家庭间", price: 208, noWindow: false, location: "81区" },
  { number: "8108", type: "大床房", price: 138, noWindow: false, location: "81区" },
  { number: "8109", type: "大床房", price: 138, noWindow: false, location: "81区" },
  { number: "8110", type: "大床房", price: 138, noWindow: false, location: "81区" },
  { number: "8111", type: "商务标准间", price: 188, noWindow: false, location: "81区", note: "房间大" },

  { number: "8201", type: "家庭间", price: 208, noWindow: false, location: "82区" },
  { number: "8202", type: "三人间", price: 168, noWindow: true, location: "82区" },
  { number: "8203", type: "商务标准间", price: 168, noWindow: false, location: "82区" },
  { number: "8205", type: "商务标准间", price: 168, noWindow: false, location: "82区" },
  { number: "8206", type: "大床房", price: 138, noWindow: false, location: "82区" },
  { number: "8207", type: "大床房", price: 138, noWindow: false, location: "82区" },
  { number: "8208", type: "商务标准间", price: 168, noWindow: false, location: "82区" },
  { number: "8209", type: "商务标准间", price: 168, noWindow: false, location: "82区" },
  { number: "8210", type: "商务大床房", price: 168, noWindow: false, location: "82区" },

  { number: "8301", type: "商务标准间", price: 168, noWindow: false, location: "83区" },
  { number: "8302", type: "商务大床房", price: 158, noWindow: false, location: "83区" },
  { number: "8303", type: "商务大床房", price: 158, noWindow: false, location: "83区" },
  { number: "8305", type: "标准间", price: 138, noWindow: true, location: "83区" },
  { number: "8306", type: "标准间", price: 138, noWindow: true, location: "83区" },
  { number: "8307", type: "大床房", price: 138, noWindow: false, location: "83区" },
  { number: "8308", type: "大床房", price: 138, noWindow: false, location: "83区" },
  { number: "8309", type: "单人间", price: 108, noWindow: true, location: "83区" },
  { number: "8310", type: "大床房", price: 138, noWindow: false, location: "83区" },
  { number: "8311", type: "单人间", price: 108, noWindow: true, location: "83区" },
  { number: "8312", type: "大床房", price: 138, noWindow: false, location: "83区" },
  { number: "8313", type: "标准间", price: 138, noWindow: false, location: "83区" },
  { number: "8315", type: "大床房", price: 138, noWindow: false, location: "83区" },
  { number: "8316", type: "大床房", price: 138, noWindow: false, location: "83区" },

  { number: "8881", type: "标准间", price: 118, noWindow: false, location: "租客东" },
];

// ===================== 房型分类 =====================
// 按房型归类展示，与具体楼层/位置无关
// 豪华房型价格与商务房型相近，归入对应的商务分类；普通房型价格较低，单独归类
const CATEGORY_ORDER = ["商务大床房", "大床房", "标准间", "商务标准间", "单人间", "家庭间", "三人间"];

const TYPE_TO_CATEGORY = {
  "豪华商务标间": "商务标准间",
  "豪华标间": "商务标准间",
  "商务标准间": "商务标准间",
  "豪华大床间": "商务大床房",
  "商务大床房": "商务大床房",
  "大床房": "大床房",
  "标准间": "标准间",
  "单人间": "单人间",
  "豪华家庭间": "家庭间",
  "家庭间": "家庭间",
  "豪华商务三人间": "三人间",
  "三人间": "三人间",
};

function categoryOf(type) {
  return TYPE_TO_CATEGORY[type] || "其他房型";
}

// ===================== 状态存取（数据保存在本地服务的 rooms_data.json 文件中） =====================
let roomState = {};
let serverAvailable = true;

function setConnBanner(ok) {
  serverAvailable = ok;
  const banner = document.getElementById("connBanner");
  banner.classList.toggle("show", !ok);
}

async function loadState() {
  try {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error("加载失败");
    roomState = await res.json();
    setConnBanner(true);
  } catch (e) {
    roomState = {};
    setConnBanner(false);
  }
}

async function saveState() {
  try {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomState),
    });
    if (!res.ok) throw new Error("保存失败");
    setConnBanner(true);
  } catch (e) {
    setConnBanner(false);
  }
}

function getRoomInfo(number) {
  return roomState[number] || { status: "空房", checkIn: null, checkOut: null };
}

function setRoomInfo(number, info) {
  roomState[number] = info;
  saveState();
}

// ===================== 工具函数 =====================
function pad(n) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(date) {
  return (
    date.getFullYear() +
    "-" + pad(date.getMonth() + 1) +
    "-" + pad(date.getDate()) +
    "T" + pad(date.getHours()) +
    ":" + pad(date.getMinutes())
  );
}

function formatDisplayTime(iso) {
  if (!iso) return "--";
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isOverdue(checkOutIso) {
  if (!checkOutIso) return false;
  return new Date(checkOutIso).getTime() < Date.now();
}

// ===================== 渲染 =====================
let currentFilter = "all";
let currentSearch = "";

function computeSummary() {
  let total = ROOMS.length;
  let vacant = 0, occupied = 0, cleaning = 0;
  ROOMS.forEach(r => {
    const st = getRoomInfo(r.number).status;
    if (st === "空房") vacant++;
    else if (st === "已入住") occupied++;
    else if (st === "打扫中") cleaning++;
  });
  return { total, vacant, occupied, cleaning };
}

function renderSummary() {
  const s = computeSummary();
  const bar = document.getElementById("summaryBar");
  bar.innerHTML = `
    <div class="summary-card total"><span class="num">${s.total}</span><span class="label">房间总数</span></div>
    <div class="summary-card vacant"><span class="num">${s.vacant}</span><span class="label">空房</span></div>
    <div class="summary-card occupied"><span class="num">${s.occupied}</span><span class="label">已入住</span></div>
    <div class="summary-card cleaning"><span class="num">${s.cleaning}</span><span class="label">打扫中</span></div>
  `;
}

function roomCardHtml(room) {
  const info = getRoomInfo(room.number);
  const status = info.status;
  const overdue = status === "已入住" && isOverdue(info.checkOut);

  let tags = "";
  if (room.noWindow) tags += `<span class="tag no-window">无窗</span>`;
  if (room.note) tags += `<span class="tag">${room.note}</span>`;

  let timeInfo = "";
  if (status === "已入住") {
    timeInfo = `
      <div class="time-info">
        入住：${formatDisplayTime(info.checkIn)}<br>
        应退房：<span class="${overdue ? "overdue-text" : ""}">${formatDisplayTime(info.checkOut)}${overdue ? "（已超时）" : ""}</span>
      </div>`;
  }

  let quickActions = "";
  if (status === "空房") {
    quickActions = `<div class="quick-actions"><button data-quick="checkin" data-room="${room.number}">办理入住</button></div>`;
  } else if (status === "已入住") {
    quickActions = `<div class="quick-actions">
      <button data-quick="checkout" data-room="${room.number}">办理退房</button>
      <button class="secondary" data-quick="edit" data-room="${room.number}">修改时间</button>
    </div>`;
  } else if (status === "打扫中") {
    quickActions = `<div class="quick-actions"><button data-quick="clean-done" data-room="${room.number}">打扫完成</button></div>`;
  }

  return `
    <div class="room-card status-${status} ${overdue ? "overdue" : ""}" data-room="${room.number}">
      <div class="room-head">
        <span class="room-number">${room.number}</span>
        <span class="room-price">${room.price}元</span>
      </div>
      <div class="room-type">${room.type}</div>
      <div class="room-location">${room.location}</div>
      <div class="tag-row">${tags}</div>
      <span class="status-badge ${status}">${status}</span>
      ${timeInfo}
      ${quickActions}
    </div>
  `;
}

function renderRooms() {
  const container = document.getElementById("roomContainer");
  const categories = {};
  ROOMS.forEach(r => {
    const cat = categoryOf(r.type);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(r);
  });

  let html = "";
  CATEGORY_ORDER.concat(Object.keys(categories).filter(c => !CATEGORY_ORDER.includes(c))).forEach(catName => {
    const roomsInCategory = (categories[catName] || []).filter(r => {
      const info = getRoomInfo(r.number);
      const matchesFilter = currentFilter === "all" || info.status === currentFilter;
      const matchesSearch = !currentSearch || r.number.includes(currentSearch);
      return matchesFilter && matchesSearch;
    });
    if (roomsInCategory.length === 0) return;
    html += `<div class="section-block">
      <div class="section-title">${catName}（${roomsInCategory.length}间）</div>
      <div class="room-grid">${roomsInCategory.map(roomCardHtml).join("")}</div>
    </div>`;
  });

  container.innerHTML = html || `<p style="padding:20px;color:#888;">没有符合条件的房间</p>`;
}

function renderAll() {
  renderSummary();
  renderRooms();
}

// ===================== 弹窗逻辑 =====================
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalSub = document.getElementById("modalSub");
const statusChoice = document.getElementById("statusChoice");
const timeFields = document.getElementById("timeFields");
const checkInInput = document.getElementById("checkInInput");
const checkOutInput = document.getElementById("checkOutInput");

let modalRoomNumber = null;
let modalSelectedStatus = null;

function openModal(roomNumber) {
  const room = ROOMS.find(r => r.number === roomNumber);
  const info = getRoomInfo(roomNumber);
  modalRoomNumber = roomNumber;
  modalSelectedStatus = info.status;

  modalTitle.textContent = `房间 ${room.number}`;
  modalSub.textContent = `${room.type} · ${room.price}元${room.noWindow ? " · 无窗" : ""}`;

  updateStatusButtons();

  const now = new Date();
  const nextNoon = new Date(now);
  nextNoon.setDate(nextNoon.getDate() + 1);
  nextNoon.setHours(12, 0, 0, 0);

  checkInInput.value = info.checkIn ? toLocalInputValue(new Date(info.checkIn)) : toLocalInputValue(now);
  checkOutInput.value = info.checkOut ? toLocalInputValue(new Date(info.checkOut)) : toLocalInputValue(nextNoon);

  toggleTimeFields();
  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalRoomNumber = null;
}

function updateStatusButtons() {
  document.querySelectorAll(".status-option").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.status === modalSelectedStatus);
  });
}

function toggleTimeFields() {
  timeFields.classList.toggle("show", modalSelectedStatus === "已入住");
}

statusChoice.addEventListener("click", e => {
  const btn = e.target.closest(".status-option");
  if (!btn) return;
  modalSelectedStatus = btn.dataset.status;
  updateStatusButtons();
  toggleTimeFields();
});

document.getElementById("btnCancel").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

document.getElementById("btnSave").addEventListener("click", () => {
  if (!modalRoomNumber) return;
  const info = { status: modalSelectedStatus, checkIn: null, checkOut: null };
  if (modalSelectedStatus === "已入住") {
    info.checkIn = new Date(checkInInput.value).toISOString();
    info.checkOut = new Date(checkOutInput.value).toISOString();
  }
  setRoomInfo(modalRoomNumber, info);
  closeModal();
  renderAll();
});

// ===================== 房间卡片点击 / 快捷按钮 =====================
document.getElementById("roomContainer").addEventListener("click", e => {
  const quickBtn = e.target.closest("[data-quick]");
  if (quickBtn) {
    e.stopPropagation();
    const roomNumber = quickBtn.dataset.room;
    const action = quickBtn.dataset.quick;
    if (action === "checkin" || action === "edit") {
      openModal(roomNumber);
    } else if (action === "checkout") {
      setRoomInfo(roomNumber, { status: "打扫中", checkIn: null, checkOut: null });
      renderAll();
    } else if (action === "clean-done") {
      setRoomInfo(roomNumber, { status: "空房", checkIn: null, checkOut: null });
      renderAll();
    }
    return;
  }
  const card = e.target.closest(".room-card");
  if (card) {
    openModal(card.dataset.room);
  }
});

// ===================== 筛选 / 搜索 =====================
document.getElementById("filterGroup").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  renderRooms();
});

document.getElementById("searchInput").addEventListener("input", e => {
  currentSearch = e.target.value.trim();
  renderRooms();
});

// ===================== 时钟 & 定时刷新（用于超时提醒） =====================
function updateClock() {
  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  document.getElementById("clock").textContent =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 星期${weekDays[now.getDay()]} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

setInterval(updateClock, 1000);
setInterval(renderRooms, 30000); // 每30秒刷新一次，及时显示"已超时"提醒

async function init() {
  updateClock();
  await loadState();
  renderAll();
}

init();
