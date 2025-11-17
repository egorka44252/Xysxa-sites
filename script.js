// Простая логика: подгрузить bg видео с GitHub и реализовать плеер
const RAW_BASE = 'https://raw.githubusercontent.com/egorka44252/Xysxa-sites/main';
const COVER_URL = RAW_BASE + '/img/logo.jpg'; // общая обложка для всех треков

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  if (video) {
    video.src = RAW_BASE + '/video/bg.mp4';
    video.load();
    video.play().catch(()=>{});
  }

  // Плеер
  const audio = document.getElementById('audio');
  const playlistEl = document.getElementById('playlist');
  const titleEl = document.getElementById('title');
  const timeEl = document.getElementById('time');
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const progress = document.getElementById('progress');
  const volume = document.getElementById('volume');
  const cover = document.querySelector('.cover');
  const curTime = document.getElementById('curtime');
  const durTime = document.getElementById('durtime');
  const volPercent = document.getElementById('vol-percent');
  const muteBtn = document.getElementById('mute');

  // Список треков (файлы в репозитории)
  const tracks = [
    'пипсики_доритос_xD.mp3',
    'Бэквуд.mp3',
    'Дисклеймер.mp3'
  ].map(name => ({
    title: name,
    src: RAW_BASE + '/music/' + encodeURIComponent(name),
    cover: COVER_URL
  }));

  // заполнить select
  tracks.forEach((t, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = t.title;
    playlistEl.appendChild(opt);
  });

  let idx = 0;
  function load(i) {
    idx = (i + tracks.length) % tracks.length;
    const t = tracks[idx];
    titleEl.textContent = t.title;
    audio.src = t.src;
    audio.load();
    playlistEl.value = idx;
    if (cover) cover.src = t.cover;
  }

  function formatTime(sec){
    if (!sec || isNaN(sec)) return '00:00';
    const s = Math.floor(sec);
    return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
  }

  // play/pause
  function updatePlayIcon(){
    playBtn.textContent = audio.paused ? '▶' : '⏸';
  }
  playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); } else { audio.pause(); }
    updatePlayIcon();
  });
  audio.addEventListener('play', updatePlayIcon);
  audio.addEventListener('pause', updatePlayIcon);

  prevBtn.addEventListener('click', () => { load(idx-1); audio.play(); });
  nextBtn.addEventListener('click', () => { load(idx+1); audio.play(); });
  playlistEl.addEventListener('change', () => { load(+playlistEl.value); audio.play(); });

  audio.addEventListener('loadedmetadata', () => {
    durTime.textContent = formatTime(audio.duration);
    curTime.textContent = formatTime(0);
    // sync progress initial background
    updateProgressBackground();
  });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = Math.floor(audio.currentTime / audio.duration * 100);
      progress.value = pct;
      curTime.textContent = formatTime(audio.currentTime);
      // update visual progress
      updateProgressBackground();
    }
  });

  progress.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = progress.value / 100 * audio.duration;
    updateProgressBackground();
  });

  // custom background for progress (fill)
  function updateProgressBackground(){
    const v = progress.value || 0;
    progress.style.background = `linear-gradient(90deg, var(--accent-a) ${v}%, #e6e6e6 ${v}%)`;
  }

  // volume handling and percent
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    volPercent.textContent = Math.round(audio.volume * 100) + '%';
    // toggle mute icon
    muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
  });
  // initialize volume UI
  audio.volume = Number(volume.value);
  volPercent.textContent = Math.round(audio.volume * 100) + '%';

  // mute toggle
  let lastVol = audio.volume;
  muteBtn.addEventListener('click', () => {
    if (audio.volume > 0) { lastVol = audio.volume; audio.volume = 0; volume.value = 0; } 
    else { audio.volume = lastVol || 1; volume.value = audio.volume; }
    volPercent.textContent = Math.round(audio.volume * 100) + '%';
    muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
  });

  audio.addEventListener('ended', () => { load(idx+1); audio.play(); });

  // старт
  load(0);
  updatePlayIcon();
  updateProgressBackground();
});
