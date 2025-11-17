// Простая логика: подгрузить bg видео с GitHub и реализовать плеер
const RAW_BASE = 'https://raw.githubusercontent.com/egorka44252/Xysxa-sites/main';

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  const videoUrl = RAW_BASE + '/video/bg.mp4';
  // назначаем src напрямую (GitHub raw)
  video.src = videoUrl;
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

  // Список треков (файлы в вашем репозитории). Если имена с кириллицей — кодируем.
  const tracks = [
    'пипсики_доритос_xD.mp3',
    'Бэквуд.mp3',
    'Дисклеймер.mp3'
  ].map(name => ({
    title: name,
    src: RAW_BASE + '/music/' + encodeURIComponent(name)
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
  }

  function formatTime(sec){
    if (!sec || isNaN(sec)) return '00:00';
    const s = Math.floor(sec);
    return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
    else { audio.pause(); playBtn.textContent = '▶'; }
  });
  prevBtn.addEventListener('click', () => { load(idx-1); audio.play(); playBtn.textContent = '⏸'; });
  nextBtn.addEventListener('click', () => { load(idx+1); audio.play(); playBtn.textContent = '⏸'; });
  playlistEl.addEventListener('change', () => { load(+playlistEl.value); audio.play(); playBtn.textContent = '⏸'; });

  audio.addEventListener('loadedmetadata', () => {
    timeEl.textContent = formatTime(0) + ' / ' + formatTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progress.value = Math.floor(audio.currentTime / audio.duration * 100);
      timeEl.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }
  });
  progress.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = progress.value / 100 * audio.duration;
  });
  volume.addEventListener('input', () => { audio.volume = volume.value; });

  audio.addEventListener('ended', () => { load(idx+1); audio.play(); });

  // старт
  load(0);

  // рекомендую запускать через http(s) (github pages или локальный сервер)
});