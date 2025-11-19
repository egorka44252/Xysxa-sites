// === КОНФИГУРАЦИЯ ===
const GITHUB_USER = 'egorka44252';
const GITHUB_REPO = 'Xysxa-sites';
const MUSIC_FOLDER = 'music';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main`;
const COVER_URL = RAW_BASE + '/img/logo.jpg';

// === ЭЛЕМЕНТЫ DOM ===
let audioPlayer, playBtn, prevBtn, nextBtn, progressBar, volumeSlider, muteBtn;
let playlistTracks, trackName, trackTime, currentTimeEl, totalTimeEl, coverImg;
let volumeValue, playIcon, pauseIcon, volumeIcon, muteIcon, musicPlayer;

// === СОСТОЯНИЕ ===
let tracks = [];
let currentTrackIndex = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 1;

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎵 Инициализация плеера...');
  initializeElements();
  initializeBackgroundVideo();
  
  // Показываем индикатор загрузки
  showLoadingState();
  
  // Загружаем треки с GitHub
  await loadTracksFromGitHub();
  
  if (tracks.length > 0) {
    renderPlaylist();
    loadTrack(0);
  } else {
    showErrorState();
  }
  
  attachEventListeners();
  console.log('✅ Плеер готов к работе!');
});

// Показать состояние загрузки
function showLoadingState() {
  if (playlistTracks) {
    playlistTracks.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #fffbe6;">
        <div style="font-size: 2rem; margin-bottom: 15px;">🎵</div>
        <div style="font-size: 1.2rem;">Загрузка треков с GitHub...</div>
        <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7;">Подождите немного</div>
      </div>
    `;
  }
  if (trackName) {
    trackName.textContent = 'Загрузка...';
  }
}

// Показать ошибку
function showErrorState() {
  if (playlistTracks) {
    playlistTracks.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #ff6ec4;">
        <div style="font-size: 2rem; margin-bottom: 15px;">⚠️</div>
        <div style="font-size: 1.1rem;">Не удалось загрузить треки</div>
        <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7;">Проверьте подключение к интернету</div>
      </div>
    `;
  }
  if (trackName) {
    trackName.textContent = 'Треки не найдены';
  }
}

// Загрузка треков с GitHub API
async function loadTracksFromGitHub() {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${MUSIC_FOLDER}`;
    console.log('🔄 Загрузка треков из GitHub API:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const files = await response.json();
    console.log('📦 Получено файлов:', files.length);
    
    // Фильтруем только аудио файлы
    const musicFiles = files.filter(file => 
      file.type === 'file' && 
      (file.name.toLowerCase().endsWith('.mp3') || 
       file.name.toLowerCase().endsWith('.wav') ||
       file.name.toLowerCase().endsWith('.ogg'))
    );
    
    console.log('🎵 Найдено аудио файлов:', musicFiles.length);
    
    // Преобразуем в формат треков
    tracks = musicFiles.map(file => {
      // Убираем расширение из названия
      const title = decodeURIComponent(file.name).replace(/\.(mp3|wav|ogg)$/i, '');
      console.log(`  ✓ ${title}`);
      return {
        title: title,
        file: file.name,
        download_url: file.download_url
      };
    });
    
    console.log(`✅ Успешно загружено треков: ${tracks.length}`);
    
    if (tracks.length === 0) {
      console.warn('⚠️ В папке music не найдено аудиофайлов');
    }
    
  } catch (error) {
    console.error('❌ Ошибка загрузки треков:', error);
    console.error('Детали:', error.message);
    tracks = [];
  }
}

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
  
  // Проверка наличия критических элементов
  if (!audioPlayer) console.error('❌ Аудио плеер не найден!');
  if (!playBtn) console.error('❌ Кнопка Play не найдена!');
  if (!playlistTracks) console.error('❌ Контейнер плейлиста не найден!');
}

// === ФОНОВОЕ ВИДЕО ===
function initializeBackgroundVideo() {
  const video = document.getElementById('bg-video');
  if (video) {
    video.addEventListener('loadeddata', () => {
      console.log('📹 Видео загружено');
    });
    
    video.addEventListener('error', (e) => {
      console.warn('⚠️ Ошибка загрузки видео');
    });
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('▶️ Видео воспроизводится');
      }).catch(error => {
        console.log('🔇 Автовоспроизведение видео заблокировано');
      });
    }
  }
}

// === РЕНДЕР ПЛЕЙЛИСТА ===
function renderPlaylist() {
  if (!playlistTracks || tracks.length === 0) return;
  
  playlistTracks.innerHTML = '';
  
  tracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.dataset.index = index;
    
    if (index === currentTrackIndex) {
      trackItem.classList.add('active');
    }
    
    // Создаем красивую анимацию появления
    trackItem.style.animation = `trackFadeIn 0.5s ease ${index * 0.1}s backwards`;
    
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
      console.log(`🎵 Выбран трек: ${track.title}`);
      loadTrack(index);
      setTimeout(() => playTrack(), 150);
    });
    
    playlistTracks.appendChild(trackItem);
  });
  
  // Добавляем CSS анимацию если её нет
  if (!document.getElementById('track-animations')) {
    const style = document.createElement('style');
    style.id = 'track-animations';
    style.textContent = `
      @keyframes trackFadeIn {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  console.log(`📋 Плейлист отрендерен: ${tracks.length} треков`);
}

// === ОБНОВЛЕНИЕ АКТИВНОГО ТРЕКА В ПЛЕЙЛИСТЕ ===
function updatePlaylistUI() {
  if (!playlistTracks) return;
  
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
    console.error('❌ Неверный индекс трека:', index);
    return;
  }
  
  currentTrackIndex = index;
  const track = tracks[index];
  
  console.log(`📀 Загрузка: ${track.title}`);
  
  // Обновление информации
  trackName.textContent = track.title;
  const trackUrl = RAW_BASE + '/music/' + encodeURIComponent(track.file);
  
  console.log(`🔗 URL: ${trackUrl}`);
  
  audioPlayer.src = trackUrl;
  coverImg.src = COVER_URL;
  
  // Загрузка метаданных
  audioPlayer.load();
  
  // Сброс прогресса
  progressBar.value = 0;
  updateProgressBackground();
  
  // Обновление плейлиста
  updatePlaylistUI();
  
  console.log(`✅ Трек загружен`);
}

// === ВОСПРОИЗВЕДЕНИЕ / ПАУЗА ===
function togglePlay() {
  if (!audioPlayer.src) {
    console.warn('⚠️ Источник аудио не установлен');
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
      console.log('▶️ Воспроизведение начато');
    }).catch(error => {
      console.error('❌ Ошибка воспроизведения:', error);
      console.error('Детали:', error.message);
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
  console.log('⏸️ Пауза');
}

function updatePlayButton() {
  if (!playIcon || !pauseIcon) return;
  
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
  console.log(`⏮️ Предыдущий трек: ${tracks[newIndex].title}`);
  loadTrack(newIndex);
  if (isPlaying) {
    setTimeout(() => playTrack(), 150);
  }
}

function nextTrack() {
  const newIndex = (currentTrackIndex + 1) % tracks.length;
  console.log(`⏭️ Следующий трек: ${tracks[newIndex].title}`);
  loadTrack(newIndex);
  if (isPlaying) {
    setTimeout(() => playTrack(), 150);
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
    console.log(`⏩ Перемотка: ${formatTime(seekTime)}`);
  }
}

// === ГРОМКОСТЬ ===
function updateVolume() {
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;
  volumeValue.textContent = `${Math.round(volumeSlider.value)}%`;
  
  updateVolumeIcon(volume);
  
  if (volume === 0) {
    isMuted = true;
  } else {
    isMuted = false;
  }
}

function updateVolumeIcon(volume) {
  if (!volumeIcon || !muteIcon) return;
  
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
    console.log('🔊 Звук включен');
  } else {
    // Выключить звук
    previousVolume = audioPlayer.volume;
    audioPlayer.volume = 0;
    volumeSlider.value = 0;
    isMuted = true;
    console.log('🔇 Звук выключен');
  }
  
  volumeValue.textContent = `${Math.round(volumeSlider.value)}%`;
  updateVolumeIcon(audioPlayer.volume);
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function attachEventListeners() {
  // Управление воспроизведением
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', previousTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  
  // Прогресс бар
  if (progressBar) {
    progressBar.addEventListener('input', () => {
      seekTrack();
      updateProgressBackground();
    });
  }
  
  // Громкость
  if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);
  
  // События аудио
  if (audioPlayer) {
    audioPlayer.addEventListener('loadedmetadata', () => {
      const duration = audioPlayer.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        totalTimeEl.textContent = formatTime(duration);
        currentTimeEl.textContent = '00:00';
        trackTime.textContent = `00:00 / ${formatTime(duration)}`;
        console.log(`⏱️ Длительность: ${formatTime(duration)}`);
      }
    });
    
    audioPlayer.addEventListener('timeupdate', updateTime);
    
    audioPlayer.addEventListener('ended', () => {
      console.log('✅ Трек завершен');
      nextTrack();
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
      console.error('❌ Ошибка загрузки аудио');
      console.error('Код ошибки:', audioPlayer.error ? audioPlayer.error.code : 'неизвестно');
      if (audioPlayer.error) {
        console.error('Сообщение:', audioPlayer.error.message);
      }
    });
    
    audioPlayer.addEventListener('canplay', () => {
      console.log('✅ Трек готов к воспроизведению');
    });
  }
  
  // Клавиатурные сокращения
  document.addEventListener('keydown', (e) => {
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
      case 'KeyN':
        e.preventDefault();
        nextTrack();
        break;
      case 'KeyP':
        e.preventDefault();
        previousTrack();
        break;
    }
  });
  
  console.log('🎮 Обработчики событий установлены');
}

// === ИНИЦИАЛИЗАЦИЯ ГРОМКОСТИ ===
if (audioPlayer) {
  audioPlayer.volume = 1;
  if (volumeSlider) volumeSlider.value = 100;
  if (volumeValue) volumeValue.textContent = '100%';
  updateVolumeIcon(1);
}

// Предотвращение прокрутки при нажатии пробела
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
  }
});

console.log('🎵 Музыкальный плеер Xysxa загружен');
console.log('⌨️ Горячие клавиши: Пробел - play/pause, ←→ - перемотка, ↑↓ - громкость, M - mute, N/P - next/prev');
