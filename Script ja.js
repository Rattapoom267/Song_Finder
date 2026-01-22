// ดึงมาฝช้
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');

//  API
const API_URL = 'https://itunes.apple.com/search';

// ฟังก์ชันค้นหาเพลง
async function searchSongs() {
    // รับค่า
    const searchTerm = searchInput.value.trim();
    
    // ตรวจสอบว่าผู้ใช้พิมพ์ไหม
    if (searchTerm === '') {
        showMessage('กรุณาพิมพ์ชื่อเพลงหรือศิลปิน', 'error');
        return;
    }
    
    // แสดงตัวโหลดและซ่อนข้อความ
    loadingDiv.classList.add('show');
    messageDiv.style.display = 'none';
    resultsDiv.innerHTML = '';
    
    try {
        // เรียก AP้I  fetch
        const response = await fetch(`${API_URL}?term=${encodeURIComponent(searchTerm)}&media=music&limit=20`);
        
        // แปลงข้อมูลที่ได้เป็น JSON
        const data = await response.json();
        
        // ซ่อนตัวโหลด
        loadingDiv.classList.remove('show');
        
        // ตรวจสอบว่ามีผลลัพธ์ไหม
        if (data.results && data.results.length > 0) {
            displayResults(data.results);
        } else {
            showMessage('ไม่พบผลลัพธ์ ลองค้นหาด้วยคำอื่น', 'info');
        }
        
    } catch (error) {
        // เวลสพลาด
        loadingDiv.classList.remove('show');
        showMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
        console.error('Error:', error);
    }
}

// ฟังก์ชันแสดงผลลัพธ์
function displayResults(songs) {
    // ลูปผ่านเพลงทั้งหมด
    songs.forEach(song => {
        // สร้างการ์ดเพลง
        const card = document.createElement('div');
        card.className = 'song-card';
        
        // รูปอัลบั้ม
        const artwork = song.artworkUrl100.replace('100x100', '300x300');
        
        // เติมข้อมูลลงในการ์ด
        card.innerHTML = `
            <img src="${artwork}" alt="${song.trackName}">
            <div class="song-info">
                <div class="song-title" title="${song.trackName}">
                    ${song.trackName || 'ไม่มีชื่อเพลง'}
                </div>
                <div class="song-artist" title="${song.artistName}">
                    ${song.artistName || 'ไม่ทราบศิลปิน'}
                </div>
                <div class="song-album" title="${song.collectionName}">
                    📀 ${song.collectionName || 'ไม่มีชื่ออัลบั้ม'}
                </div>
            </div>
        `;
        
        // เพิ่มการ์ดเข้าไปในหน้าเว็บ
        resultsDiv.appendChild(card);
    });
}

// ฟังก์ชันแสดงข้อความ
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

// เมื่อกดปุ่มค้นหา
searchBtn.addEventListener('click', searchSongs);

// เมื่อกด Enter ในช่องค้นหา
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchSongs();
    }
});

// ซ่อนข้อความเมื่อเริ่มพิมพ์ใหม่
searchInput.addEventListener('input', () => {
    messageDiv.style.display = 'none';
});
