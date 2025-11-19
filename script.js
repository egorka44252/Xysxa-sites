// === КОНФИГУРАЦИЯ ===
const GITHUB_USER = 'egorka44252';
const GITHUB_REPO = 'Xysxa-sites';
const MUSIC_FOLDER = 'music';
const VIDEO_FOLDER = 'video';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main`;
const COVER_URL = RAW_BASE + '/img/logo.jpg';

// === ЭЛЕМЕНТЫ DOM ===
let audioPlayer, playBtn, prevBtn, nextBtn, progressBar, volumeSlider, muteBtn;
let playlistTracks, trackName, trackTime, currentTimeEl, totalTimeEl, coverImg;
let volumeValue, playIcon, pauseIcon, volumeIcon, muteIcon, musicPlayer;
let repeatBtn, themeBtn, bgVideo;

// === СОСТОЯНИЕ ===
let tracks = [];
let backgroundVideos = [];
let currentTrackIndex = 0;
let currentVideoIndex = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 1;
let repeatMode = 'all'; // 'all', 'one', 'none'

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎵 Инициализация плеера...');
  initializeElements();
  addControlButtons();
  initializeBackgroundVideo();
  
  // Показываем индикатор загрузки
  showLoadingState();
  
  // Загружаем треки и видео с GitHub
  await Promise.all([
    loadTracksFromGitHub(),
    loadVideosFromGitHub()
  ]);
  
  if (tracks.length > 0) {
    renderPlaylist();
    loadTrack(0);
  } else {
    showErrorState();
  }
  
  attachEventListeners();
  console.log('✅ Плеер готов к работе!');
});

// Добавление кнопок управления
function addControlButtons() {
  // Создаем кнопку повтора
  const controlsDiv = document.querySelector('.player-controls');
  if (controlsDiv && !document.getElementById('repeat-btn')) {
    const repeatButton = document.createElement('button');
    repeatButton.id = 'repeat-btn';
    repeatButton.className = 'control-btn';
    repeatButton.title = 'Повтор: Все треки';
    repeatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
      </svg>
    `;
    controlsDiv.appendChild(repeatButton);
    repeatBtn = repeatButton;
  }
  
  // Создаем кнопку смены темы (видео)
  if (!document.getElementById('theme-btn')) {
    const themeButton = document.createElement('button');
    themeButton.id = 'theme-btn';
    themeButton.className = 'theme-toggle-btn';
    themeButton.title = 'Сменить фон';
    themeButton.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    `;
    document.body.appendChild(themeButton);
    themeBtn = themeButton;
  }
}

// Показать состояние загрузки
function showLoadingState() {
  if (playlistTracks) {
    playlistTracks.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #fffbe6;">
        <div style="font-size: 2rem; margin-bottom: 15px;">
          <div class="loading-spinner">🎵</div>
        </div>
        <div style="font-size: 1.2rem;">Загрузка треков с GitHub...</div>
        <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7;">Подождите немного</div>
      </div>
    `;
    
    // Добавляем анимацию спиннера
    if (!document.getElementById('spinner-style')) {
      const style = document.createElement('style');
      style.id = 'spinner-style';
      style.textContent = `
        .loading-spinner {
          display: inline-block;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
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

// Загрузка видео с GitHub API
async function loadVideosFromGitHub() {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${VIDEO_FOLDER}`;
    console.log('🎬 Загрузка видео из GitHub API:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const files = await response.json();
    console.log('📦 Получено видео файлов:', files.length);
    
    // Фильтруем только видео файлы
    const videoFiles = files.filter(file => 
      file.type === 'file' && 
      (file.name.toLowerCase().endsWith('.mp4') || 
       file.name.toLowerCase().endsWith('.webm'))
    );
    
    backgroundVideos = videoFiles.map(file => ({
      name: file.name,
      url: RAW_BASE + '/video/' + encodeURIComponent(file.name)
    }));
    
    console.log(`✅ Загружено видео: ${backgroundVideos.length}`);
    
  } catch (error) {
    console.error('❌ Ошибка загрузки видео:', error);
    backgroundVideos = [{
      name: 'bg.mp4',
      url: RAW_BASE + '/video/bg.mp4'
    }];
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
  bgVideo = document.getElementById('bg-video');
  
  // Проверка наличия критических элементов
  if (!audioPlayer) console.error('❌ Аудио плеер не найден!');
  if (!playBtn) console.error('❌ Кнопка Play не найдена!');
  if (!playlistTracks) console.error('❌ Контейнер плейлиста не найден!');
}

// === ФОНОВОЕ ВИДЕО ===
function initializeBackgroundVideo() {
  if (bgVideo) {
    // Делаем видео зацикленным
    bgVideo.loop = true;
    
    bgVideo.addEventListener('loadeddata', () => {
      console.log('📹 Видео загружено');
    });
    
    bgVideo.addEventListener('error', (e) => {
      console.warn('⚠️ Ошибка загрузки видео');
    });
    
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('▶️ Видео воспроизводится');
      }).catch(error => {
        console.log('🔇 Автовоспроизведение видео заблокировано');
      });
    }
  }
}

// Смена фонового видео
function changeBackgroundVideo() {
  if (!bgVideo || backgroundVideos.length === 0) return;
  
  currentVideoIndex = (currentVideoIndex + 1) % backgroundVideos.length;
  const newVideo = backgroundVideos[currentVideoIndex];
  
  console.log(`🎬 Смена фона: ${newVideo.name}`);
  
  // Плавная смена видео
  bgVideo.style.opacity = '0';
  
  setTimeout(() => {
    bgVideo.src = newVideo.url;
    bgVideo.load();
    bgVideo.play().then(() => {
      bgVideo.style.opacity = '1';
    });
  }, 300);
}

// Получение иконки для трека
function getTrackIcon(index) {
  const icons = ['🎸', '🎹', '🎤', '🎧', '🎼', '🎺', '🎷', '🥁', '🎻', '🪕'];
  return icons[index % icons.length];
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
    
    const icon = getTrackIcon(index);
    const playingIcon = index === currentTrackIndex && isPlaying ? 
      '<span class="playing-bars">🔊</span>' : 
      `<span class="track-icon">${icon}</span>`;
    
    trackItem.innerHTML = `
      <div class="track-item-left">
        <div class="track-number">${index + 1}</div>
        <div class="track-icon-wrapper">${playingIcon}</div>
        <div class="track-details">
          <div class="track-title-small">${track.title}</div>
        </div>
      </div>
      <div class="track-play-icon">${index === currentTrackIndex && isPlaying ? '⏸️' : '▶️'}</div>
    `;
    
    trackItem.addEventListener('click', () => {
      console.log(`🎵 Выбран трек: ${track.title}`);
      loadTrack(index);
      setTimeout(() => playTrack(), 150);
    });
    
    playlistTracks.appendChild(trackItem);
  });
  
  // Добавляем CSS анимации
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
      
      .track-icon-wrapper {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
      }
      
      .track-icon {
        animation: iconFloat 2s ease-in-out infinite;
      }
      
      @keyframes iconFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-3px) scale(1.1); }
      }
      
      .playing-bars {
        display: inline-block;
        animation: pulse 1s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }
      
      .theme-toggle-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15));
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        animation: themeButtonPulse 3s ease-in-out infinite;
      }
      
      @keyframes themeButtonPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
        50% { transform: scale(1.05); box-shadow: 0 10px 35px rgba(255, 110, 196, 0.5); }
      }
      
      .theme-toggle-btn:hover {
        transform: scale(1.1) rotate(180deg);
        background: linear-gradient(135deg, rgba(255, 110, 196, 0.5), rgba(162, 89, 255, 0.5));
        box-shadow: 0 12px 40px rgba(255, 110, 196, 0.6);
      }
      
      .theme-toggle-btn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);
  }
  
  console.log(`📋 Плейлист отрендерен: ${tracks.length} треков`);
}

// === ОБНОВЛЕНИЕ UI ПЛЕЙЛИСТА ===
function updatePlaylistUI() {
  if (!playlistTracks) return;
  
  const allItems = playlistTracks.querySelectorAll('.track-item');
  
  allItems.forEach((item, index) => {
    const playIcon = item.querySelector('.track-play-icon');
    const iconWrapper = item.querySelector('.track-icon-wrapper');
    
    if (index === currentTrackIndex) {
      item.classList.add('active');
      if (playIcon) {
        playIcon.textContent = isPlaying ? '⏸️' : '▶️';
      }
      if (iconWrapper && isPlaying) {
        iconWrapper.innerHTML = '<span class="playing-bars">🔊</span>';
      } else if (iconWrapper) {
        iconWrapper.innerHTML = `<span class="track-icon">${getTrackIcon(index)}</span>`;
      }
    } else {
      item.classList.remove('active');
      if (playIcon) {
        playIcon.textContent = '▶️';
      }
      if (iconWrapper) {
        iconWrapper.innerHTML = `<span class="track-icon">${getTrackIcon(index)}</span>`;
      }
    }
  });
}

// === УПРАВЛЕНИЕ ПОВТОРОМ ===
function toggleRepeatMode() {
  const modes = ['all', 'one', 'none'];
  const currentIndex = modes.indexOf(repeatMode);
  repeatMode = modes[(currentIndex + 1) % modes.length];
  
  updateRepeatButton();
  console.log(`🔁 Режим повтора: ${repeatMode}`);
}

function updateRepeatButton() {
  if (!repeatBtn) return;
  
  const icons = {
    'all': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>',
    'one': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor">1</text></svg>',
    'none': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>'
  };
  
  const titles = {
    'all': 'Повтор: Все треки',
    'one': 'Повтор: Один трек',
    'none': 'Повтор: Выключен'
  };
  
  repeatBtn.innerHTML = icons[repeatMode];
  repeatBtn.title = titles[repeatMode];
  
  // Подсветка активного режима
  if (repeatMode !== 'none') {
    repeatBtn.style.background = 'linear-gradient(135deg, rgba(255, 110, 196, 0.3), rgba(162, 89, 255, 0.3))';
  } else {
    repeatBtn.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))';
  }
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
    const newVolume = previousVolume > 0 ? previousVolume : 1;
    audioPlayer.volume = newVolume;
    volumeSlider.value = newVolume * 100;
    isMuted = false;
    console.log('🔊 Звук включен');
  } else {
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
  if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeatMode);
  if (themeBtn) themeBtn.addEventListener('click', changeBackgroundVideo);
  
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
      
      if (repeatMode === 'one') {
        // Повтор одного трека
        audioPlayer.currentTime = 0;
        playTrack();
      } else if (repeatMode === 'all') {
        // Следующий трек
        nextTrack();
      } else {
        // Остановка
