// === КОНФИГУРАЦИЯ ===
const RAW_BASE = 'https://raw.githubusercontent.com/egorka44252/Xysxa-sites/main';
const COVER_URL = RAW_BASE + '/img/logo.jpg';

// Список треков
const tracks = [
  { title: 'пипсики доритос xD', file: 'пипсики_доритос_xD.mp3' },
  { title: 'Бэквуд', file: 'Бэквуд.mp3' },
  { title: 'Дисклеймер', file: 'Дисклеймер.mp3' }
];

// === ЭЛЕМЕНТЫ DOM ===
let audioPlayer;
let playBtn;
let prevBtn;
let nextBtn;
let progressBar;
let volumeSlider;
let muteBtn;
let playlistSelect;
let trackName;
let trackTime;
let currentTimeEl;
let totalTimeEl;
let coverImg;
let volumeValue;
let playIcon;
let pauseIcon;

// === СОСТОЯНИЕ ===
let currentTrackIndex = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 1;

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  initializeBackgroundVideo();
  loadPlaylist();
  loadTrack(0);
  attachEventListeners();
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
  playlistSelect = document.getElementById('playlist-select');
  trackName = document.getElementById('track-name');
  trackTime = document.getElementById('track-time');
  currentTimeEl = document.getElementById('current-time');
  totalTimeEl = document.getElementById('total-time');
  coverImg = document.getElementById('cover-img');
  volumeValue = document.getElementById('volume-value');
  playIcon = document.getElementById('play-icon');
  pauseIcon = document.getElementById('pause-icon');
}

// === ФОНОВОЕ ВИДЕО ===
function initializeBackgroundVideo() {
  const video = document.getElementById('bg-video');
  if (video) {
    video.src = RAW_BASE + '/video/bg.mp4';
    video.load();
    video.play().catch(() => {
      console.log('Автовоспроизведение видео заблокировано');
    });
  }
}

// === ЗАГРУЗКА ПЛЕЙЛИСТА ===
function loadPlaylist() {
  playlistSelect.innerHTML = '<option value="">Выберите трек...</option>';
  
  tracks.forEach((track, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = track.title;
    playlistSelect.appendChild(option);
  });
}

// === ЗАГРУЗКА ТРЕКА ===
function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  
  // Обновление информации
  trackName.textContent = track.title;
  audioPlayer.src = RAW_BASE + '/music/' + encodeURIComponent(track.file);
  coverImg.src = COVER_URL;
  
  // Обновление выбора в плейлисте
  playlistSelect.value = index;
  
  // Загрузка метаданных
  audioPlayer.load();
  
  // Сброс прогресса
  progressBar.value = 0;
  updateProgressBackground();
}

// === ВОСПРОИЗВЕДЕНИЕ / ПАУЗА ===
function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  audioPlayer.play().then(() => {
    isPlaying = true;
    updatePlayButton();
    document.querySelector('.music-player').classList.add('playing');
  }).catch(error => {
    console.error('Ошибка воспроизведения:', error);
  });
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  updatePlayButton();
  document.querySelector('.music-player').classList.remove('playing');
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
    playTrack();
  }
}

function nextTrack() {
  const newIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(newIndex);
  if (isPlaying) {
    playTrack();
  }
}

// === ФОРМАТИРОВАНИЕ ВРЕМЕНИ ===
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) {
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
  
  currentTimeEl.textContent = formatTime(current);
  totalTimeEl.textContent = formatTime(duration);
  trackTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  
  // Обновление прогресс-бара
  if (duration > 0) {
    const percentage = (current / duration) * 100;
    progressBar.value = percentage;
    updateProgressBackground();
  }
}

// === ПРОГРЕСС БАР ===
function updateProgressBackground() {
  const value = progressBar.value;
  progressBar.style.background = `linear-gradient(90deg, #ff6ec4 ${value}%, rgba(255,255,255,0.2) ${value}%)`;
}

function seekTrack() {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
}

// === ГРОМКОСТЬ ===
function updateVolume() {
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;
  volumeValue.textContent = `${volumeSlider.value}%`;
  
  // Обновление иконки при изменении громкости
  if (volume === 0) {
    isMuted = true;
  } else {
    isMuted = false;
  }
}

function toggleMute() {
  if (isMuted) {
    audioPlayer.volume = previousVolume;
    volumeSlider.value = previousVolume * 100;
    isMuted = false;
  } else {
    previousVolume = audioPlayer.volume;
    audioPlayer.volume = 0;
    volumeSlider.value = 0;
    isMuted = true;
  }
  
  volumeValue.textContent = `${volumeSlider.value}%`;
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function attachEventListeners() {
  // Управление воспроизведением
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', previousTrack);
  nextBtn.addEventListener('click', nextTrack);
  
  // Прогресс бар
  progressBar.addEventListener('input', seekTrack);
  
  // Громкость
  volumeSlider.addEventListener('input', updateVolume);
  muteBtn.addEventListener('click', toggleMute);
  
  // Плейлист
  playlistSelect.addEventListener('change', (e) => {
    const index = parseInt(e.target.value);
    if (!isNaN(index)) {
      loadTrack(index);
      playTrack();
    }
  });
  
  // События аудио
  audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
    trackTime.textContent = `00:00 / ${formatTime(audioPlayer.duration)}`;
  });
  
  audioPlayer.addEventListener('timeupdate', updateTime);
  
  audioPlayer.addEventListener('ended', () => {
    nextTrack();
    if (isPlaying) {
      playTrack();
    }
  });
  
  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
  });
  
  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
  });
  
  // Клавиатурные сокращения
  document.addEventListener('keydown', (e) => {
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
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
    }
  });
}

// === ИНИЦИАЛИЗАЦИЯ ГРОМКОСТИ ===
audioPlayer.volume = 1;
volumeSlider.value = 100;
volumeValue.textContent = '100%';
