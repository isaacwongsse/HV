// ===== Constants =====
const CELL_WIDTH = 30;
const CELL_MINUTES = 5;
const TOTAL_DAYS = 14;
const DAY_GAP = 60; // px between each day
const START_HOUR = 6;
const END_HOUR = 24;
const VISIBLE_HOURS = END_HOUR - START_HOUR; // 18
const CELLS_PER_DAY = (VISIBLE_HOURS * 60) / CELL_MINUTES; // 216
const DAY_WIDTH = CELLS_PER_DAY * CELL_WIDTH;
const TRACK_WIDTH = TOTAL_DAYS * DAY_WIDTH + (TOTAL_DAYS - 1) * DAY_GAP;

function getDayOffset(dayIndex) {
  return dayIndex * (DAY_WIDTH + DAY_GAP);
}

// ===== Hong Kong Public Holidays =====
// Source: https://www.gov.hk/en/about/abouthk/holiday/
const HK_HOLIDAYS = {
  // 2025
  "2025-01-01": { en: "New Year's Day", zh: "元旦" },
  "2025-01-29": { en: "Lunar New Year", zh: "農曆年初一" },
  "2025-01-30": { en: "Lunar New Year", zh: "農曆年初二" },
  "2025-01-31": { en: "Lunar New Year", zh: "農曆年初三" },
  "2025-04-04": { en: "Ching Ming", zh: "清明節" },
  "2025-04-18": { en: "Good Friday", zh: "耶穌受難節" },
  "2025-04-19": { en: "Day after Good Friday", zh: "耶穌受難節翌日" },
  "2025-04-21": { en: "Easter Monday", zh: "復活節星期一" },
  "2025-05-01": { en: "Labour Day", zh: "勞動節" },
  "2025-05-05": { en: "Buddha's Birthday", zh: "佛誕" },
  "2025-05-31": { en: "Tuen Ng Festival", zh: "端午節" },
  "2025-07-01": { en: "HKSAR Day", zh: "香港特別行政區成立紀念日" },
  "2025-10-01": { en: "National Day", zh: "國慶日" },
  "2025-10-07": { en: "Day after Chung Yeung", zh: "重陽節翌日" },
  "2025-10-29": { en: "Chung Yeung Festival", zh: "重陽節" },
  "2025-12-25": { en: "Christmas Day", zh: "聖誕節" },
  "2025-12-26": { en: "Day after Christmas", zh: "聖誕節後第一個周日" },
  // 2026
  "2026-01-01": { en: "New Year's Day", zh: "元旦" },
  "2026-02-17": { en: "Lunar New Year", zh: "農曆年初一" },
  "2026-02-18": { en: "Lunar New Year", zh: "農曆年初二" },
  "2026-02-19": { en: "Lunar New Year", zh: "農曆年初三" },
  "2026-04-03": { en: "Good Friday", zh: "耶穌受難節" },
  "2026-04-04": { en: "Day after Good Friday", zh: "耶穌受難節翌日" },
  "2026-04-06": { en: "Easter Monday", zh: "復活節星期一" },
  "2026-04-07": { en: "Ching Ming", zh: "清明節" },
  "2026-05-01": { en: "Labour Day", zh: "勞動節" },
  "2026-05-25": { en: "Buddha's Birthday", zh: "佛誕" },
  "2026-06-19": { en: "Tuen Ng Festival", zh: "端午節" },
  "2026-07-01": { en: "HKSAR Day", zh: "香港特別行政區成立紀念日" },
  "2026-09-26": { en: "Day after Mid-Autumn", zh: "中秋節翌日" },
  "2026-10-01": { en: "National Day", zh: "國慶日" },
  "2026-10-19": { en: "Chung Yeung Festival", zh: "重陽節" },
  "2026-12-25": { en: "Christmas Day", zh: "聖誕節" },
  "2026-12-26": { en: "Day after Christmas", zh: "聖誕節後第一個周日" }
};

function dateToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function isHKHoliday(date) {
  return dateToStr(date) in HK_HOLIDAYS;
}

function getHolidayName(date) {
  return HK_HOLIDAYS[dateToStr(date)] || null;
}

// ===== Schedule Data =====
// Times with "*" suffix: not available on Saturdays that are HK public holidays
const SCHEDULE_WEEKDAY = {
  hanley: [
    "06:30","06:55","07:10","07:25","07:35","07:50",
    "08:00","08:15","08:30","08:45",
    "09:00","09:15","09:30",
    "10:00","10:20*","10:40",
    "11:20",
    "12:00","12:30",
    "13:00","13:40",
    "14:20",
    "15:00","15:30",
    "16:00","16:30",
    "17:00","17:30","17:45",
    "18:00","18:15","18:30","18:45",
    "19:00","19:15","19:30","19:50",
    "20:15","20:45",
    "21:15","21:45",
    "22:15","22:45"
  ],
  mtr: [
    "06:40",
    "07:05","07:20","07:35","07:45",
    "08:00","08:10","08:25","08:40","08:55",
    "09:10","09:25","09:40",
    "10:10","10:30*","10:50",
    "11:30",
    "12:10","12:40",
    "13:10","13:50",
    "14:30",
    "15:10","15:40",
    "16:10","16:40",
    "17:10","17:40","17:55",
    "18:10","18:25","18:40","18:55",
    "19:10","19:25","19:40",
    "20:00","20:30",
    "21:00","21:30",
    "22:00","22:30",
    "23:00"
  ],
  market: [
    "09:30","09:45",
    "10:15","10:35*","10:55",
    "11:35",
    "12:15","12:45",
    "13:15","13:55",
    "14:35",
    "15:15","15:45",
    "16:15","16:45",
    "17:15","17:45"
  ]
};

const SCHEDULE_SUNDAY = {
  hanley: [
    "08:30",
    "09:00","09:30",
    "10:00","10:30",
    "11:00","11:30",
    "12:05","12:40",
    "13:15","13:50",
    "14:25",
    "15:00","15:35",
    "16:10","16:45",
    "17:20","17:55",
    "18:30","18:55",
    "19:20","19:45",
    "20:10","20:35",
    "21:00"
  ],
  mtr: [
    "08:40",
    "09:10","09:40",
    "10:10","10:40",
    "11:10","11:40",
    "12:15","12:50",
    "13:25",
    "14:00","14:35",
    "15:10","15:45",
    "16:20","16:55",
    "17:30",
    "18:05","18:40",
    "19:05","19:30","19:55",
    "20:20","20:45",
    "21:10"
  ],
  market: [
    "08:45",
    "09:15","09:45",
    "10:15","10:45",
    "11:15","11:45",
    "12:20","12:55",
    "13:30",
    "14:05","14:40",
    "15:15","15:50",
    "16:25",
    "17:00","17:35",
    "18:10"
  ]
};

const WEEKDAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEKDAYS_ZH = ['日','一','二','三','四','五','六'];

// Extra times added only on Saturday (not on Saturday that is a public holiday)
const SATURDAY_EXTRA_TIMES = { hanley: '10:20', mtr: '10:30', market: '10:35' };

function getDaySchedule(date) {
  const dow = date.getDay();
  const holiday = isHKHoliday(date);
  const isSatHoliday = (dow === 6 && holiday);
  const useSunday = (dow === 0) || (holiday && dow !== 6);
  return {
    schedule: useSunday ? SCHEDULE_SUNDAY : SCHEDULE_WEEKDAY,
    skipStarred: isSatHoliday,
    isHoliday: holiday,
    isSunday: dow === 0
  };
}

// ===== Helpers =====
function parseTime(raw) {
  const isStarred = raw.endsWith('*');
  const timeStr = isStarred ? raw.slice(0, -1) : raw;
  return { timeStr, isStarred };
}

// today at midnight
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function getNowX() {
  const now = new Date();
  const msSinceToday = now.getTime() - TODAY.getTime();
  const minSinceToday = msSinceToday / 60000;
  // Each day in track starts at START_HOUR, so subtract the offset
  const dayIndex = Math.floor(minSinceToday / (24 * 60));
  const minInDay = minSinceToday - dayIndex * 24 * 60;
  const minFromDayStart = minInDay - START_HOUR * 60;
  return getDayOffset(dayIndex) + (minFromDayStart / CELL_MINUTES) * CELL_WIDTH;
}

function getDayDate(dayIndex) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + dayIndex);
  return d;
}

// ===== Build Timeline (14 days) =====
function buildTimeline() {
  const track = document.getElementById('timeline-track');
  track.style.width = TRACK_WIDTH + 'px';

  for (let day = 0; day < TOTAL_DAYS; day++) {
    const dayOffset = getDayOffset(day);
    const date = getDayDate(day);
    const dow = date.getDay();
    const holiday = isHKHoliday(date);

    // Day separator at start of gap (after previous day's content)
    if (day > 0) {
      const sep = document.createElement('div');
      sep.className = 'day-separator';
      sep.style.left = (day * DAY_WIDTH + (day - 1) * DAY_GAP) + 'px';
      track.appendChild(sep);
    }

    // Day label with holiday name
    const dayLabel = document.createElement('div');
    dayLabel.className = 'day-label';
    if (holiday || dow === 0) dayLabel.classList.add('holiday');
    const dm = date.getDate();
    const mon = date.toLocaleDateString('en', { month: 'short' });
    let labelText = WEEKDAYS_SHORT[dow] + ' ' + dm + ' ' + mon;
    if (day === 0) labelText = 'Today - ' + labelText;
    if (holiday) {
      const hName = getHolidayName(date);
      labelText += ' - ' + hName.en + ' (' + hName.zh + ')';
    }
    dayLabel.textContent = labelText;
    dayLabel.style.left = (dayOffset + 6) + 'px';
    track.appendChild(dayLabel);

    // Hour ticks and labels (06:00 to 24:00)
    for (let i = 0; i <= CELLS_PER_DAY; i++) {
      const totalMin = START_HOUR * 60 + i * CELL_MINUTES;
      const hour = Math.floor(totalMin / 60);
      const min = totalMin % 60;
      const x = dayOffset + i * CELL_WIDTH;

      if (i < CELLS_PER_DAY) {
        const tick = document.createElement('div');
        tick.className = 'tick';
        if (min === 0) {
          tick.classList.add('tick-hour');
        } else if (min === 30) {
          tick.classList.add('tick-half');
        } else if (min % 15 === 0) {
          tick.classList.add('tick-quarter');
        } else {
          tick.classList.add('tick-five');
        }
        tick.style.left = x + 'px';
        track.appendChild(tick);
      }

      if (min === 0 && hour <= END_HOUR) {
        const label = document.createElement('div');
        label.className = 'hour-label';
        label.textContent = hour.toString().padStart(2, '0') + ':00';
        label.style.left = x + 'px';
        track.appendChild(label);
      }
    }
  }
}

// All departure cell elements for live past-status updates
const allCells = [];

// ===== Render Departures (14 days) =====
function renderDepartures(trackId, stop) {
  const track = document.getElementById(trackId);
  track.style.width = TRACK_WIDTH + 'px';

  for (let day = 0; day < TOTAL_DAYS; day++) {
    const dayOffset = getDayOffset(day);
    const date = getDayDate(day);
    const info = getDaySchedule(date);
    let times = info.schedule[stop].slice();

    // Saturday (not public holiday): add extra time for this stop if defined
    const dow = date.getDay();
    if (dow === 6 && !info.isHoliday && SATURDAY_EXTRA_TIMES[stop]) {
      const extra = SATURDAY_EXTRA_TIMES[stop];
      const alreadyHas = times.some(raw => parseTime(raw).timeStr === extra);
      if (!alreadyHas) times.push(extra);
      times.sort((a, b) => {
        const ta = parseTime(a).timeStr;
        const tb = parseTime(b).timeStr;
        return ta.localeCompare(tb);
      });
    }

    // Day separator in timetable (at start of gap)
    if (day > 0) {
      const sep = document.createElement('div');
      sep.className = 'row-day-separator';
      sep.style.left = (day * DAY_WIDTH + (day - 1) * DAY_GAP) + 'px';
      track.appendChild(sep);
    }

    times.forEach(raw => {
      const { timeStr, isStarred } = parseTime(raw);
      if (isStarred && info.skipStarred) return;

      const [h, m] = timeStr.split(':').map(Number);
      const minFromStart = (h - START_HOUR) * 60 + m;
      if (minFromStart < 0) return; // skip times before START_HOUR
      const x = dayOffset + (minFromStart / CELL_MINUTES) * CELL_WIDTH;

      const cell = document.createElement('div');
      cell.className = 'departure-cell';
      cell.style.left = x + 'px';
      cell.textContent = timeStr;
      cell._xPos = x; // store for live updates
      track.appendChild(cell);
      allCells.push(cell);
    });
  }
}

// ===== Departure cell click: show remaining time from current time (red line) =====
function setupCellTooltip() {
  const tooltip = document.getElementById('cell-tooltip');
  if (!tooltip) return;
  let hideTimer = null;

  function showTooltip(cell, text) {
    tooltip.textContent = text;
    tooltip.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideTooltip, 2500);
    requestAnimationFrame(function () {
      const rect = cell.getBoundingClientRect();
      const ttRect = tooltip.getBoundingClientRect();
      let left = rect.left + (rect.width / 2) - (ttRect.width / 2);
      let top = rect.top - ttRect.height - 8;
      if (top < 8) top = rect.bottom + 8;
      if (left < 8) left = 8;
      if (left + ttRect.width > window.innerWidth - 8) left = window.innerWidth - ttRect.width - 8;
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
  }

  document.querySelectorAll('.row-track').forEach(track => {
    track.addEventListener('click', function (e) {
      const cell = e.target.closest('.departure-cell');
      if (!cell) return;
      const nowX = getNowX();
      const diffPx = cell._xPos - nowX;
      const diffMin = Math.round((diffPx / CELL_WIDTH) * CELL_MINUTES);
      let text;
      if (diffMin < 0) text = Math.abs(diffMin) + ' min ago';
      else if (diffMin === 0) text = 'Now';
      else text = 'In ' + diffMin + ' min';
      showTooltip(cell, text);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.departure-cell')) hideTooltip();
  });
}

// ===== Update Past Status (live) =====
function updatePastStatus() {
  const nowX = getNowX();
  allCells.forEach(cell => {
    if (cell._xPos < nowX) {
      cell.classList.add('past');
    } else {
      cell.classList.remove('past');
    }
  });
}

// ===== Scroll Sync =====
let scrollContainers;

function setupScrollSync() {
  scrollContainers = [
    document.getElementById('timeline-scroll-wrapper'),
    document.querySelector('#row-hanley .row-scroll-wrapper'),
    document.querySelector('#row-mtr .row-scroll-wrapper'),
    document.querySelector('#row-market .row-scroll-wrapper'),
  ];

  // Leader: the container the user last scrolled (we sync from this one every frame)
  let leader = scrollContainers[0];
  let syncing = false;

  scrollContainers.forEach(container => {
    container.addEventListener('scroll', function () {
      if (syncing) return;
      leader = this;
    }, { passive: true });
  });

  // Update left-side date to show the day at current scroll position
  function updateTimelineDate() {
    const el = document.getElementById('timeline-current-date');
    if (!el) return;
    const scrollLeft = scrollContainers[0].scrollLeft;
    const dayIndex = Math.min(TOTAL_DAYS - 1, Math.max(0, Math.floor(scrollLeft / (DAY_WIDTH + DAY_GAP))));
    const date = getDayDate(dayIndex);
    const dow = date.getDay();
    const holiday = isHKHoliday(date);
    const dm = date.getDate();
    const mon = date.toLocaleDateString('en', { month: 'short' });
    let labelText = WEEKDAYS_SHORT[dow] + ' ' + dm + ' ' + mon;
    if (dayIndex === 0) labelText = 'Today - ' + labelText;
    if (holiday) {
      const hName = getHolidayName(date);
      labelText += ' - ' + hName.en + ' (' + hName.zh + ')';
    }
    el.textContent = labelText;
  }

  // Sync every frame so all columns stay in sync without delay (scroll events are throttled on mobile)
  function syncScroll() {
    requestAnimationFrame(syncScroll);
    const targetScroll = leader.scrollLeft;
    syncing = true;
    for (let i = 0; i < scrollContainers.length; i++) {
      scrollContainers[i].scrollLeft = targetScroll;
    }
    requestAnimationFrame(() => { syncing = false; });
    updateTimelineDate();
  }
  requestAnimationFrame(syncScroll);
  updateTimelineDate();
}

// ===== Time Needle + Current time label + Remaining time =====
function createNeedles() {
  const trackIds = ['timeline-track', 'track-hanley', 'track-mtr', 'track-market'];
  const needles = trackIds.map(id => {
    const track = document.getElementById(id);
    const needle = document.createElement('div');
    needle.className = 'time-needle';
    needle.id = 'needle-' + id;
    track.appendChild(needle);
    return { id, needle };
  });

  // Current time label on timeline needle (above red dot)
  const timelineNeedle = needles[0].needle;
  const needleTimeEl = document.createElement('span');
  needleTimeEl.className = 'needle-time';
  timelineNeedle.appendChild(needleTimeEl);

  // Remaining time reminder per row (in 20px top zone, aligned to next departure)
  const rowTrackIds = ['track-hanley', 'track-mtr', 'track-market'];
  const remainingTimeEls = rowTrackIds.map(id => {
    const track = document.getElementById(id);
    const rt = document.createElement('div');
    rt.className = 'remaining-time';
    track.appendChild(rt);
    return rt;
  });

  function update() {
    const x = getNowX();
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    if (x < 0 || x > TRACK_WIDTH) {
      needles.forEach(({ needle }) => { needle.style.display = 'none'; });
      needleTimeEl.style.display = 'none';
      remainingTimeEls.forEach(el => { el.style.display = 'none'; });
      updatePastStatus();
      return;
    }

    needles.forEach(({ needle }) => {
      needle.style.display = 'block';
      needle.style.left = x + 'px';
    });
    needleTimeEl.textContent = timeStr;
    needleTimeEl.style.display = 'block';

    // Remaining time: next departure per row
    rowTrackIds.forEach((trackId, rowIndex) => {
      const track = document.getElementById(trackId);
      const cells = track.querySelectorAll('.departure-cell');
      let nextCell = null;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i]._xPos > x) {
          nextCell = cells[i];
          break;
        }
      }
      const rtEl = remainingTimeEls[rowIndex];
      if (nextCell) {
        const pxToNext = nextCell._xPos - x;
        const minRemaining = Math.round((pxToNext / CELL_WIDTH) * CELL_MINUTES);
        rtEl.textContent = minRemaining + ' min';
        rtEl.style.left = nextCell._xPos + 'px';
        rtEl.style.display = 'flex';
      } else {
        rtEl.style.display = 'none';
      }
    });

    updatePastStatus();
  }

  update();
  setInterval(update, 30000);
}

// ===== Scroll to Now =====
function scrollToNow() {
  const x = getNowX();
  const viewportWidth = scrollContainers[0].offsetWidth;
  const target = Math.max(0, x - viewportWidth * 0.25);
  scrollContainers.forEach(c => { c.scrollLeft = target; });
}

// ===== Map modal (iframe: Google Maps embed) =====
function setupMapModal() {
  const modal = document.getElementById('map-modal');
  const iframe = document.getElementById('map-iframe');
  const closeBtn = document.querySelector('.map-modal-close');
  const backdrop = document.querySelector('.map-modal-backdrop');
  if (!modal || !iframe) return;

  function openMap(url, embedSrc, query) {
    // Prefer direct map link (e.g. maps.app.goo.gl): open in new tab
    if (url && url.trim()) {
      window.open(url.trim(), '_blank', 'noopener');
      return;
    }
    if (embedSrc && embedSrc.trim()) {
      iframe.src = embedSrc.trim();
      modal.classList.add('is-open');
    } else if (query) {
      const searchUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
      window.open(searchUrl, '_blank', 'noopener');
    }
  }

  function closeMap() {
    modal.classList.remove('is-open');
    iframe.src = 'about:blank';
  }

  document.querySelectorAll('.row-label[data-map-url], .row-label[data-map-src], .row-label[data-map-query]').forEach(function (label) {
    label.addEventListener('click', function () {
      const url = (this.getAttribute('data-map-url') || '').trim();
      const src = (this.getAttribute('data-map-src') || '').trim();
      const query = this.getAttribute('data-map-query') || '';
      openMap(url, src, query);
    });
    label.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = (this.getAttribute('data-map-url') || '').trim();
        const src = (this.getAttribute('data-map-src') || '').trim();
        const query = this.getAttribute('data-map-query') || '';
        openMap(url, src, query);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMap);
  if (backdrop) backdrop.addEventListener('click', closeMap);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.style.setProperty('--cell-width', CELL_WIDTH + 'px');

  buildTimeline();
  renderDepartures('track-hanley', 'hanley');
  renderDepartures('track-mtr', 'mtr');
  renderDepartures('track-market', 'market');

  setupScrollSync();
  createNeedles();
  scrollToNow();
  setupCellTooltip();
  setupMapModal();

  // Home button
  document.getElementById('btn-home').addEventListener('click', scrollToNow);
});
