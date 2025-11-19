// === КОНФИГУРАЦИЯ ===
const RAW_BASE = 'https://raw.githubusercontent.com/egorka44252/Xysxa-sites/main';
const COVER_URL = RAW_BASE + '/img/logo.jpg';

// Список треков
const tracks = [
  { title: 'чипсики доритос xD', file: 'пипсики_доритос_xD.mp3' },
  { title: 'Бэквуд', file: 'Бэквуд.mp3' },
  { title: 'Дисклеймер', file: 'Дисклеймер.mp3' }
];

// === ЭЛЕМЕНТЫ DOM ===
let audioPlayer, playBtn, prevBtn, nextBtn, progressBar, volumeSlider, muteBtn;
let playlistTracks, trackName, trackTime, currentTimeEl, totalTimeEl, coverImg;
let volumeValue, playIcon, pauseIcon, volumeIcon, muteIcon, musicPlayer;

// === СОСТОЯНИЕ ===
let currentTrackIndex = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 1;

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('Инициализация плеера...');
  initializeElements();
  initializeBackgroundVideo();
  renderPlaylist();
  loadTrack(0);
  attachEventListeners();
  console.log('Плеер готов к работе');
});

// Инициализация элементов
function initializeElements() {
  audioPlayer = document.getElementById('audio-player');
  playBtn = document.getElementById('play-btn');
  prevBtn = document.getElementById('prev-btn');
  nextBtn = document.getElementById('next-btn');
  progressBar = document.getElementById('progress-bar');
  volumeSlider = document.getElementById('volume-slider');
  muteBtn = document.getElementById('mute-btn');
  playlistTracks = document.getElementById('playlist-tracks');
  trackName = document.getElementById('track-name');
  trackTime = document.getElementById('track-time');
  currentTimeEl = document.getElementById('current-time');
  totalTimeEl = document.getElementById('total-time');
  coverImg = document.getElementById('cover-img');
  volumeValue = document.getElementById('volume-value');
  playIcon = document.getElementById('play-icon');
  pauseIcon = document.getElementById('pause-icon');
  volumeIcon = document.getElementById('volume-icon');
  muteIcon = document.getElementById('mute-icon');
  musicPlayer = document.querySelector('.music-player');
  
  // Проверка наличия всех элементов
  if (!audioPlayer) console.error('Аудио плеер не найден!');
  if (!playBtn) console.error('Кнопка Play не найдена!');
  if (!playlistTracks) console.error('Контейнер плейлиста не найден!');
}

// === ФОНОВОЕ ВИДЕО ===
function initializeBackgroundVideo() {
  const video = document.getElementById('bg-video');
  if (video) {
    video.addEventListener('loadeddata', () => {
      console.log('Видео загружено');
    });
    
    video.addEventListener('error', (e) => {
      console.error('Ошибка загрузки видео:', e);
    });
    
    // Попытка воспроизведения видео
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Видео воспроизводится');
      }).catch(error => {
        console.log('Автовоспроизведение видео заблокировано:', error);
      });
    }
  }
}

// === РЕНДЕР ПЛЕЙЛИСТА ===
function renderPlaylist() {
  if (!playlistTracks) return;
  
  playlistTracks.innerHTML = '';
  
  tracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.dataset.index = index;
    
    if (index === currentTrackIndex) {
      trackItem.classList.add('active');
    }
    
    trackItem.innerHTML = `
      <div class="track-item-left">
        <div class="track-number">${index + 1}</div>
        <div class="track-details">
          <div class="track-title-small">${track.title}</div>
        </div>
      </div>
      <div class="track-play-icon">${index === currentTrackIndex && isPlaying ? '🔊' : '▶️'}</div>
    `;
    
    trackItem.addEventListener('click', () => {
      loadTrack(index);
      setTimeout(() => playTrack(), 100);
    });
    
    playlistTracks.appendChild(trackItem);
  });
  
  console.log(`Плейлист отрендерен: ${tracks.length} треков`);
}

// === ОБНОВЛЕНИЕ АКТИВНОГО ТРЕКА В ПЛЕЙЛИСТЕ ===
function updatePlaylistUI() {
  const allItems = playlistTracks.querySelectorAll('.track-item');
  
  allItems.forEach((item, index) => {
    const playIcon = item.querySelector('.track-play-icon');
    
    if (index === currentTrackIndex) {
      item.classList.add('active');
      if (playIcon) {
        playIcon.textContent = isPlaying ? '🔊' : '▶️';
      }
    } else {
      item.classList.remove('active');
      if (playIcon) {
        playIcon.textContent = '▶️';
      }
    }
  });
}

// === ЗАГРУЗКА ТРЕКА ===
function loadTrack(index) {
  if (index < 0 || index >= tracks.length) {
    console.error('Неверный индекс трека:', index);
    return;
  }
  
  currentTrackIndex = index;
  const track = tracks[index];
  
  console.log(`Загрузка трека: ${track.title}`);
  
  // Обновление информации
  trackName.textContent = track.title;
  const trackUrl = RAW_BASE + '/music/' + encodeURIComponent(track.file);
  audioPlayer.src = trackUrl;
  coverImg.src = COVER_URL;
  
  // Загрузка метаданных
  audioPlayer.load();
  
  // Сброс прогресса
  progressBar.value = 0;
  updateProgressBackground();
  
  // Обновление плейлиста
  updatePlaylistUI();
  
  console.log(`Трек загружен: ${trackUrl}`);
}

// === ВОСПРОИЗВЕДЕНИЕ / ПАУЗА ===
function togglePlay() {
  if (!audioPlayer.src) {
    console.warn('Источник аудио не установлен');
    return;
  }
  
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  const playPromise = audioPlayer.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      updatePlayButton();
      updatePlaylistUI();
      if (musicPlayer) musicPlayer.classList.add('playing');
      console.log('Воспроизведение начато');
    }).catch(error => {
      console.error('Ошибка воспроизведения:', error);
      isPlaying = false;
      updatePlayButton();
      updatePlaylistUI();
    });
  }
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  updatePlayButton();
  updatePlaylistUI();
  if (musicPlayer) musicPlayer.classList.remove('playing');
  console.log('Воспроизведение приостановлено');
}

function updatePlayButton() {
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

// === НАВИГАЦИЯ ПО ТРЕКАМ ===
function previousTrack() {
  const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(newIndex);
  if (isPlaying) {
    setTimeout(() => playTrack(), 100);
  }
}

function nextTrack() {
  const newIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(newIndex);
  if (isPlaying) {
    setTimeout(() => playTrack(), 100);
  }
}

// === ФОРМАТИРОВАНИЕ ВРЕМЕНИ ===
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity || seconds < 0) {
    return '00:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// === ОБНОВЛЕНИЕ ВРЕМЕНИ ===
function updateTime() {
  const current = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  
  if (!isNaN(current) && isFinite(current)) {
    currentTimeEl.textContent = formatTime(current);
  }
  
  if (!isNaN(duration) && isFinite(duration)) {
    totalTimeEl.textContent = formatTime(duration);
    trackTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    
    // Обновление прогресс-бара
    const percentage = (current / duration) * 100;
    progressBar.value = percentage;
    updateProgressBackground();
  }
}

// === ПРОГРЕСС БАР ===
function updateProgressBackground() {
  const value = progressBar.value || 0;
  progressBar.style.background = `linear-gradient(90deg, #ff6ec4 ${value}%, rgba(255,255,255,0.2) ${value}%)`;
}

function seekTrack() {
  const duration = audioPlayer.duration;
  if (!isNaN(duration) && isFinite(duration) && duration > 0) {
    const seekTime = (progressBar.value / 100) * duration;
    audioPlayer.currentTime = seekTime;
    console.log(`Перемотка на: ${formatTime(seekTime)}`);
  }
}

// === ГРОМКОСТЬ ===
function updateVolume() {
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;
  volumeValue.textContent = `${Math.round(volumeSlider.value)}%`;
  
  // Обновление иконки
  updateVolumeIcon(volume);
  
  if (volume === 0) {
    isMuted = true;
  } else {
    isMuted = false;
  }
}

function updateVolumeIcon(volume) {
  if (volume === 0 || isMuted) {
    volumeIcon.style.display = 'none';
    muteIcon.style.display = 'block';
  } else {
    volumeIcon.style.display = 'block';
    muteIcon.style.display = 'none';
  }
}

function toggleMute() {
  if (isMuted || audioPlayer.volume === 0) {
    // Включить звук
    const newVolume = previousVolume > 0 ? previousVolume : 1;
    audioPlayer.volume = newVolume;
    volumeSlider.value = newVolume * 100;
    isMuted = false;
    console.log('Звук включен');
  } else {
    // Выключить звук
    previousVolume = audioPlayer.volume;
    audioPlayer.volume = 0;
    volumeSlider.value = 0;
    isMuted = true;
    console.log('Звук выключен');
  }
  
  volumeValue.textContent = `${Math.round(volumeSlider.value)}%`;
  updateVolumeIcon(audioPlayer.volume);
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function attachEventListeners() {
  // Управление воспроизведением
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', previousTrack);
  nextBtn.addEventListener('click', nextTrack);
  
  // Прогресс бар
  progressBar.addEventListener('input', () => {
    seekTrack();
    updateProgressBackground();
  });
  
  // Громкость
  volumeSlider.addEventListener('input', updateVolume);
  muteBtn.addEventListener('click', toggleMute);
  
  // События аудио
  audioPlayer.addEventListener('loadedmetadata', () => {
    const duration = audioPlayer.duration;
    if (!isNaN(duration) && isFinite(duration)) {
      totalTimeEl.textContent = formatTime(duration);
      currentTimeEl.textContent = '00:00';
      trackTime.textContent = `00:00 / ${formatTime(duration)}`;
      console.log(`Длительность трека: ${formatTime(duration)}`);
    }
  });
  
  audioPlayer.addEventListener('timeupdate', updateTime);
  
  audioPlayer.addEventListener('ended', () => {
    console.log('Трек завершен, переход к следующему');
    nextTrack();
    if (isPlaying) {
      setTimeout(() => playTrack(), 100);
    }
  });
  
  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
    updatePlaylistUI();
    if (musicPlayer) musicPlayer.classList.add('playing');
  });
  
  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
    updatePlaylistUI();
    if (musicPlayer) musicPlayer.classList.remove('playing');
  });
  
  audioPlayer.addEventListener('error', (e) => {
    console.error('Ошибка аудио:', e);
    console.error('Код ошибки:', audioPlayer.error ? audioPlayer.error.code : 'неизвестно');
  });
  
  // Клавиатурные сокращения
  document.addEventListener('keydown', (e) => {
    // Игнорировать, если фокус на input элементах
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      return;
    }
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (audioPlayer.duration) {
          audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (audioPlayer.duration) {
          audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
        updateVolume();
        break;
      case 'ArrowDown':
        e.preventDefault();
        volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
        updateVolume();
        break;
      case 'KeyM':
        e.preventDefault();
        toggleMute();
        break;
    }
  });
  
  console.log('Обработчики событий установлены');
}

// === ИНИЦИАЛИЗАЦИЯ ГРОМКОСТИ ===
if (audioPlayer) {
  audioPlayer.volume = 1;
  volumeSlider.value = 100;
  volumeValue.textContent = '100%';
  updateVolumeIcon(1);
}

// === ДОПОЛНИТЕЛЬНАЯ ОБРАБОТКА ОШИБОК ===
window.addEventListener('error', (e) => {
  console.error('Глобальная ошибка:', e.message);
});

// Предотвращение автоматической прокрутки при нажатии пробела
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
  }
});
