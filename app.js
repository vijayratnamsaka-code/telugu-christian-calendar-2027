let calendarData = {};
let currentYear = 2027;
let currentMonth = 1; // 2027 generate chesaka deenni 2027 & 1 ki marchandi

const monthNamesTe = [
  "", "జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్",
  "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"
];

async function initCalendar() {
  try {
    const response = await fetch('data.json');
    calendarData = await response.json();
    renderMonth(currentYear, currentMonth);
  } catch (err) {
    console.error("Error loading data.json:", err);
  }
}

function renderMonth(year, month) {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  const monthInfo = calendarData[key];

  document.getElementById('monthTitle').textContent = `${monthNamesTe[month]} ${year}`;
  
  const imgEl = document.getElementById('wallpaperImg');
  if (monthInfo) {
    document.getElementById('subTitle').textContent = monthInfo.subtitle || "ఆధ్యాత్మిక క్రైస్తవ క్యాలెండర్";
    imgEl.style.display = 'block';
    imgEl.src = monthInfo.wallpaper;
  } else {
    document.getElementById('subTitle').textContent = "ఆధ్యాత్మిక క్రైస్తవ క్యాలెండర్";
    imgEl.style.display = 'none';
  }

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'date-cell empty';
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    const dayOfWeek = (firstDay + day - 1) % 7;
    const isSunday = dayOfWeek === 0;

    cell.className = 'date-cell' + (isSunday ? ' sunday' : '');

    if (today.getFullYear() === year && (today.getMonth() + 1) === month && today.getDate() === day) {
      cell.classList.add('today');
    }

    const dayData = monthInfo && monthInfo.days ? monthInfo.days[String(day)] : null;

    cell.innerHTML = `
      <div class="date-num">${day}</div>
      <div class="verse-short">${dayData ? dayData.short : ''}</div>
      <div class="verse-ref">${dayData ? dayData.ref : ''}</div>
    `;

    if (dayData) {
      cell.addEventListener('click', () => openVerseModal(day, month, year, dayData));
    }

    grid.appendChild(cell);
  }
}

function openVerseModal(day, month, year, data) {
  document.getElementById('modalDateBadge').textContent = `${monthNamesTe[month]} ${day}, ${year}`;
  document.getElementById('modalFullVerse').textContent = data.full;
  document.getElementById('modalRef').textContent = data.ref;
  document.getElementById('verseModal').classList.remove('hidden');

  document.getElementById('shareVerseBtn').onclick = () => {
    const shareText = `📅 ${monthNamesTe[month]} ${day}, ${year}\n"${data.full}"\n- ${data.ref}`;
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("వాక్యం కాపీ చేయబడింది!");
    }
  };
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('verseModal').classList.add('hidden');
});

document.getElementById('verseModal').addEventListener('click', (e) => {
  if (e.target.id === 'verseModal') {
    document.getElementById('verseModal').classList.add('hidden');
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 1) { currentMonth = 12; currentYear--; }
  renderMonth(currentYear, currentMonth);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 12) { currentMonth = 1; currentYear++; }
  renderMonth(currentYear, currentMonth);
});

initCalendar();
