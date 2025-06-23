# Kế hoạch chuyển đổi “Happy-Birthday-Website” sang Next.js + Supabase (TypeScript)

> Thư mục mã cũ được lưu tại `old/`. Thư mục root đã scaffold Next.js (App Router, TypeScript, Tailwind). Checklist này chia bước nhỏ để di chuyển dần, bảo toàn tính năng.

## 0. Cấu trúc đích (tham chiếu)
```
src/
  app/
    layout.tsx
    page.tsx               // Countdown mặc định
    (api)/                 // Route API nhẹ nếu cần
  components/              // UI tái sử dụng (Button, Modal…)
  features/
    countdown/
    cake3d/
    album/
    games/
    community/
    theme/
  three/                   // mô hình / helpers three.js
  styles/                  // Tailwind layer, custom CSS
lib/
  supabaseClient.ts
public/
  media/                   // ảnh + video kỷ niệm fallback
  audio/                   // mp3 happy-birthday
old/                       // code cũ (giữ để tham chiếu)
```

## 1. Chuẩn bị môi trường
- [x] `npm i @supabase/supabase-js @react-three/fiber @react-three/drei swiper zustand` – đã có trong package.json  
- [x] Thêm file `lib/supabaseClient.ts` (singleton)  
- [x] Tạo file `.env.local` với `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` – hướng dẫn trong README  
- [x] Cài đặt `supabase CLI` (tuỳ chọn) để sinh types.

## 2. Thiết kế DB & Storage (Supabase)
- [ ] Thực thi schema SQL:
  - [x] `birthdays(id, name, dob, message, created_by)`
  - [x] `messages(id, sender_id, birthday_id, text, created_at)`
  - [x] `media(id, type, path, tags, owner_id)`
  - [x] `audio_messages(id, sender_id, birthday_id, audio_url, created_at)`
  - [x] `video_messages(id, sender_id, birthday_id, video_url, created_at)`
  - [x] `gifts(id, sender_id, birthday_id, emoji, created_at)`
- [x] Buckets: `media`, `audio`, `video`  
- [x] Thiết lập RLS (owner write + mọi người đọc, service_role insert).

## 3. Di chuyển tài sản tĩnh ✅
| Mục cũ | Vị trí mới |
|--------|------------|
| `old/happy-birthday.mp3` | `public/audio/happy-birthday.mp3` | ✅

## 4. Chuyển CSS & theme
1. **Base styles** (`old/css/base.css`, `components.css`) convert sang Tailwind layer (`src/styles/globals.css`). 
2. **Theme mùa – lễ** (`old/css/themes.css`) tạo hook `useSeasonTheme()` + class tương ứng. 
3. **Responsive / mobile.css** Tailwind breakpoint. 
4. Giữ hiệu ứng đặc biệt (lá rơi, tuyết…) dùng React component + CSS module. 

## 5. Module hóa JavaScript React/TS
| Tệp JS cũ | Module mới (TS/React) | Ghi chú |
|-----------|----------------------|---------|
| `old/js/core.js` | `features/countdown`, `features/cake3d` | countdown logic, Three.js cake |

#### Tóm tắt nhanh `old/js/core.js`
* Khai báo danh sách `birthdays[]` với tên, tháng, ngày, lời chúc.
* Hàm `checkIfBirthday(date)` trả về person nếu trùng tháng/ngày.
* Hàm `findNextBirthday(now)` tìm sinh nhật kế tiếp và person liên quan.
* `displayCountdown(target, person)` render HTML đếm ngược (ngày-giờ-phút-giây).
* `updateCountdownTime()` chạy mỗi giây: xác định hôm nay sinh nhật hay không, lưu localStorage, hiển thị countdown hoặc nội dung sinh nhật tương ứng.
* `showBirthdayContent(person)` ẩn countdown, hiển thị tiêu đề, lời chúc, đổi background, bắn confetti, khởi tạo bánh 3D, phát nhạc.
* `init3DCake()` xây 3 tầng bánh & nến bằng Three.js, thêm ánh sáng, animation nổi, điều khiển xoay bằng chuột & resize.
* `playBirthdayMusic()` phát file `happy-birthday.mp3` và fallback nút play nếu autoplay bị chặn.
* Các hàm debug `/ init*()` khác: album ảnh, trò chơi, chia sẻ, theme, ngôn ngữ, custom message.
* Trong `DOMContentLoaded` khởi chạy countdown, setInterval 1s, init các tính năng, debug.

Việc port chia thành 2 feature chính:
1. **features/countdown** – logic thời gian, localStorage, hiển thị & lời chúc.
2. **features/cake3d** – khung Three.js + tương tác.

Cần tách localStorage logic, context global (VD: `BirthdayContext`) và dịch sang React hooks.
| `old/js/features.js` | `features/album`, `features/games/*`, `features/social-share` | tách nhỏ theo trách nhiệm |
| `old/js/community.js` | `features/community` | chat realtime + message recorder |
| `old/js/themes.js` | `features/theme` | i18n + seasonal effects |
| (social share logic in `features.js`) | `features/social-share` | share Facebook/Zalo/URL copy |
| (e-card generator in `features.js`) | `features/e-card` | render canvas → image |
| (invite friends modal) | `features/invite` | generate share link, QR |
| (music player) | `features/audio-player` | play/pause happy-birthday + playlist |
| (bulletin board) | `features/bulletin` | CRUD text posts via Supabase |

Thứ tự di chuyển đề xuất:
1. **Countdown + 3D Cake**  
   - Component `CountdownPage` đọc ngày sinh DB.  
   - Component `Cake3D` dùng `@react-three/fiber`.
2. **Album ảnh**  
   - Grid view + Swiper slideshow, tải ảnh từ Supabase Storage.
3. **Community chat**  
   - Zustand store + Supabase Realtime channels.
4. **Games**  
   - Code split (`next/dynamic`) để giảm bundle.
5. **Theme/i18n**
6. **Social share & e-card**
7. **Invite friends & bulletin board**  
   - Context + `next-intl`.

## 5.x Các tính năng bổ sung

### 5.2 Blow-Candle (Mic)
- [ ] Web Audio API xin quyền microphone, tính trung bình dB.
- [ ] Liên kết progress bar, tắt nến, confetti.

### 5.3 Games
- [x] Port Flappy-Balloon (`features/games/flappy-balloon`)
- [x] Port Memory Card (`features/games/memory-card`)
- [x] Port Scratch Card (`features/games/scratch-card`)
- [ ] Responsive UI & unit tests

### 5.4 E-card generator
- [x] Canvas render lời chúc + avatar
- [x] Export PNG và nút tải / chia sẻ

### 5.5 Bulletin Board
- [x] Tạo bảng `bulletins(id, sender_id, text, created_at)`
- [x] CRUD UI, form thêm/sửa, policy RLS (chủ sở hữu xoá)

### 5.6 Audio-Player & Playlist
- [x] Component `AudioPlayer` (play/pause, seekbar, volume)
- [x] Playlist fetch từ bucket `audio` + DB `media`

### 5.7 Social-Share & Invite
- [x] Component Share (Facebook, Zalo, copy link)
- [ ] API `/api/generate-invite` tạo slug ngắn
- [ ] Modal QR code invite bạn bè

### 5.8 Effects, Theme & i18n
- [x] Component `LeafFall` / `SnowFall` (canvas)
- [x] Hook `useSeasonTheme` áp dụng theme mùa (spring/summer/autumn/winter) + hiệu ứng lá rơi/tuyết
- [x] LeafFall / SnowFall component (canvas) thay thế `autumn-leaves.js`
- [x] Đa ngôn ngữ `next-intl` (vi / en / ja)

## 6. API Routes (nếu cần)
- [ ] `/api/upload` proxy lên Supabase Storage (tránh expose key service role)
- [ ] `/api/generate-invite` tạo link chia sẻ ngắn

## 7. Kiểm thử & CI
- [x] Viết test đầu tiên với `vitest` + `@testing-library/react` cho Countdown. ✅  
- [x] GitHub Actions: `lint`, `test`, `build`.

## 8. Dọn dẹp
- [ ] Sau khi port xong module, cập nhật README; chuyển code gốc vào `archive/` hoặc xoá.

---
### Tiến độ
- [x] Môi trường & SupabaseClient
- [x] Port Countdown & Cake3D
- [x] Port Album
- [x] Port Community Chat
- [x] Port Games
- [x] Theme & i18n
- [ ] Testing + CI/CD
- [ ] Cleanup legacy code
