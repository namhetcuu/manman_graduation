/**
 * GRADUATION INVITATION — MP3 AUDIO & RIPPED PAPER INTERACTIVE ENGINE
 * Host: Trần Mẫn Mẫn — VKU Class of 2026
 */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const welcomeScreen = $("#welcomeScreen");
  const mainWebsite = $("#mainWebsite");
  const guestInput = $("#guestName");
  const openBtn = $("#openBtn");
  const envelope = $("#envelope");
  const errorMsg = $("#errorMsg");

  const displayName = $("#displayName");
  const wishNameInput = $("#wishName");

  const soundBtn = $("#soundBtn");
  const shareBtn = $("#shareBtn");
  const copyAddressBtn = $("#copyAddressBtn");
  const addCalendarBtn = $("#addCalendarBtn");
  const backToTopBtn = $("#backToTopBtn");
  const toast = $("#toast");
  const bgAudio = $("#bgAudio");

  let isAudioPlaying = false;

  // Auto fill guest name if query string exists (?name=...)
  const urlParams = new URLSearchParams(window.location.search);
  const initialName = urlParams.get("name") || "";
  if (initialName) {
    guestInput.value = initialName;
  }

  // MP3 Audio Control System
  function startMp3Audio() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      soundBtn.classList.remove("muted");
      soundBtn.querySelector(".sound-icon").textContent = "🎵";
    }).catch((err) => {
      console.log("Audio play allowed on user action:", err);
    });
  }

  function toggleMp3Audio() {
    if (!bgAudio) return;
    if (isAudioPlaying) {
      bgAudio.pause();
      isAudioPlaying = false;
      soundBtn.classList.add("muted");
      soundBtn.querySelector(".sound-icon").textContent = "🔇";
      showToast("Đã tắt âm thanh");
    } else {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        soundBtn.classList.remove("muted");
        soundBtn.querySelector(".sound-icon").textContent = "🎵";
        showToast("Đã bật nhạc nền MP3 ✨");
      }).catch(() => {});
    }
  }

  soundBtn.addEventListener("click", toggleMp3Audio);

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // --- BACKGROUND CANVAS (FLOATING PETALS) ---
  const canvas = $("#bgCanvas");
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 7 + 4,
    speedY: Math.random() * 1.1 + 0.5,
    speedX: Math.random() * 0.6 - 0.3,
    rotation: Math.random() * 360,
    color: Math.random() > 0.5 ? "rgba(37, 99, 235, 0.15)" : "rgba(15, 41, 66, 0.12)"
  }));

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
    });
    requestAnimationFrame(renderCanvas);
  }
  renderCanvas();

  function formatName(str) {
    if (!str) return "Mọi Người";
    return str.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  // --- OPEN INVITATION PROCESS ---
  function openInvitation() {
    const rawName = guestInput.value.trim();
    const finalName = formatName(rawName);

    errorMsg.textContent = "";
    displayName.textContent = finalName;
    wishNameInput.value = finalName;

    envelope.classList.add("open");
    startMp3Audio(); // Play MP3 sound file automatically!

    setTimeout(() => {
      welcomeScreen.classList.remove("active");
      mainWebsite.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
      initScrollReveal();
    }, 1000);
  }

  openBtn.addEventListener("click", openInvitation);
  guestInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openInvitation();
  });

  // --- SCROLL REVEAL OBSERVER ---
  function initScrollReveal() {
    const reveals = $$(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // --- LIGHTBOX MODAL SYSTEM ---
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  const filmFrames = $$(".film-frame");
  let currentGalleryIndex = 0;
  let galleryItems = [];

  filmFrames.forEach((frame, idx) => {
    galleryItems.push({
      src: frame.getAttribute("data-src"),
      caption: frame.getAttribute("data-caption")
    });
    frame.addEventListener("click", () => openLightbox(idx % 4));
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function updateLightbox() {
    const item = galleryItems[currentGalleryIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + 4) % 4;
    updateLightbox();
  });
  lightboxNext.addEventListener("click", () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % 4;
    updateLightbox();
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev.click();
    if (e.key === "ArrowRight") lightboxNext.click();
  });

  // --- COMMENTS FEED SYSTEM ---
  const wishForm = $("#wishForm");
  const wishesWall = $("#wishesWall");

  const initialWishes = [
    {
      name: "Em Nhạn",
      text: "Chúc mừng chị đẹp tốt nghiệp nhaaa 🎓✨ Vậy là sau bao nhiêu cố gắng, những ngày tháng học hành vất vả cũng đã có một cái kết thật đẹp rồi. Mong chặng đường phía trước của chị sẽ luôn thuận lợi, gặp được nhiều điều tốt đẹp. Chúc chị iu thật thành công với hành trình mới nhớ! 🫶🫶"
    },
    {
      name: "Thanh Hoàng",
      text: "Chúc mừng Mẫn Mẫn nha! 4 năm trôi qua thật nhanh, hẹn gặp lại bạn tại hội trường VKU ngày 30/09!"
    },
    {
      name: "Phương Nam",
      text: "Chúc bạn luôn tự tin, rạng rỡ và đạt được mọi mục tiêu trên con đường sự nghiệp sắp tới!"
    }
  ];

  let storedWishes = JSON.parse(localStorage.getItem("vku_grad_wishes") || "[]");
  if (storedWishes.length === 0) {
    storedWishes = initialWishes;
    localStorage.setItem("vku_grad_wishes", JSON.stringify(storedWishes));
  }

  function renderWishes() {
    wishesWall.innerHTML = "";
    storedWishes.forEach((w) => {
      const item = document.createElement("div");
      item.className = "comment-item";
      item.innerHTML = `
        <span class="comment-author">${escapeHtml(w.name)}</span>
        <div class="comment-text">${escapeHtml(w.text)}</div>
      `;
      wishesWall.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[tag] || tag));
  }

  wishForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#wishName").value.trim();
    const text = $("#wishText").value.trim();
    if (!name || !text) return;

    const newWish = { name, text };
    storedWishes.unshift(newWish);
    localStorage.setItem("vku_grad_wishes", JSON.stringify(storedWishes));
    renderWishes();

    $("#wishText").value = "";
    showToast("Đã gửi lời chúc thành công! Cảm ơn bạn ❤️");
  });

  renderWishes();

  // --- ACTION BUTTONS ---
  copyAddressBtn.addEventListener("click", () => {
    const address = "Trường Đại học Công Nghệ Thông Tin và Truyền Thông Việt Hàn (VKU) - 470 Trần Đại Nghĩa, Phường Hòa Quý, Q. Ngũ Hành Sơn, Đà Nẵng";
    navigator.clipboard.writeText(address).then(() => {
      showToast("Đã sao chép địa chỉ VKU! 📋");
    });
  });

  addCalendarBtn.addEventListener("click", () => {
    const title = encodeURIComponent("Lễ Tốt Nghiệp Trần Mẫn Mẫn — VKU 2026");
    const details = encodeURIComponent("Kính mời bạn đến tham dự Lễ Tốt Nghiệp của Trần Mẫn Mẫn tại VKU. LH: 0905492957");
    const location = encodeURIComponent("Trường Đại học Công Nghệ Thông Tin và Truyền Thông Việt Hàn, 470 Trần Đại Nghĩa, Ngũ Hành Sơn, Đà Nẵng");
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260930T030000Z/20260930T043000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, "_blank");
  });

  shareBtn.addEventListener("click", () => {
    const currentGuest = guestInput.value.trim();
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = currentGuest ? `${baseUrl}?name=${encodeURIComponent(currentGuest)}` : baseUrl;

    if (navigator.share) {
      navigator.share({
        title: "Thiệp Mời Lễ Tốt Nghiệp — Trần Mẫn Mẫn",
        text: `Kính mời ${currentGuest || "bạn"} đến dự Lễ Tốt Nghiệp của Trần Mẫn Mẫn tại VKU!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Đã sao chép đường link thiệp mời! 🔗");
      });
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
