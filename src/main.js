document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ICONS INIT ---
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // --- 2. MOBILE MENU ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');

  function toggleMenu() {
      nav.classList.toggle('active');
  }

  if (burger) burger.addEventListener('click', toggleMenu);
  if (navClose) navClose.addEventListener('click', toggleMenu);

  // Закрываем меню при клике на ссылку
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          nav.classList.remove('active');
      });
  });

  // --- 3. HERO ANIMATIONS (GSAP + SplitType) ---
  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
      try {
          const heroTitle = new SplitType('#hero-title', { types: 'lines, words, chars' });
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          // Анимация Hero
          tl.to('.hero__badge', { y: 0, opacity: 1, duration: 0.8, delay: 0.2 })
            .to(heroTitle.chars, { y: 0, opacity: 1, stagger: 0.02, duration: 0.8 }, '-=0.4')
            .to('#hero-desc', { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
            .to('#hero-btns', { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
            .to('.hero__trust', { opacity: 1, duration: 1 }, '-=0.4')
            .from('.hero__visual', { scale: 0.8, opacity: 0, duration: 1.5, ease: 'back.out(1.7)' }, 0);

          // Анимация скролла для остальных секций
          gsap.registerPlugin(ScrollTrigger);
          const sections = document.querySelectorAll('.section');
          sections.forEach(section => {
              // Анимируем только если секция не Hero (у Hero своя анимация)
              if (section.id !== 'hero') {
                  gsap.from(section.children, {
                      scrollTrigger: {
                          trigger: section,
                          start: "top 85%", // Срабатывает чуть раньше
                      },
                      y: 30,
                      opacity: 0,
                      duration: 0.8,
                      stagger: 0.1
                  });
              }
          });
      } catch (e) {
          console.log("GSAP/SplitType animation error (safe to ignore):", e);
      }
  }

  // --- 4. SWIPER SLIDER (BENEFITS) ---
  if (typeof Swiper !== 'undefined') {
      const swiper = new Swiper(".benefitsSwiper", {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          grabCursor: true,
          autoplay: {
              delay: 4000,
              disableOnInteraction: false,
          },
          pagination: {
              el: ".swiper-pagination",
              clickable: true,
          },
          navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
          },
          breakpoints: {
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
          },
      });
  }

  // --- 5. CONTACT FORM & CAPTCHA LOGIC ---
  const form = document.getElementById('contact-form');
  const phoneInput = document.getElementById('phone');
  const mathLabel = document.getElementById('math-problem');
  const captchaInput = document.getElementById('captcha');
  const successMsg = document.getElementById('form-success');

  // Переменная для хранения правильного ответа
  let captchaResult = 0;

  // Функция генерации примера
  function generateCaptcha() {
      if (!mathLabel) return;
      const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
      const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
      captchaResult = num1 + num2;
      mathLabel.textContent = `${num1} + ${num2}`;
      console.log(`Captcha generated: ${num1} + ${num2} = ${captchaResult}`); // Для отладки
  }

  // Генерируем капчу сразу при загрузке
  generateCaptcha();

  // Валидация телефона (только цифры)
  if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
          this.value = this.value.replace(/\D/g, '');
      });
  }

  // Обработка отправки формы
  if (form) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // Сброс ошибок
          document.querySelectorAll('.form__group').forEach(g => g.classList.remove('error'));

          // 1. Имя
          const name = document.getElementById('name');
          if (!name.value.trim()) {
              name.parentElement.classList.add('error');
              isValid = false;
          }

          // 2. Email
          const email = document.getElementById('email');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email.value)) {
              email.parentElement.classList.add('error');
              isValid = false;
          }

          // 3. Телефон
          if (phoneInput.value.length < 8) {
              phoneInput.parentElement.classList.add('error');
              isValid = false;
          }

          // 4. Капча (Сравнение)
          const userCaptchaVal = parseInt(captchaInput.value, 10);
          if (isNaN(userCaptchaVal) || userCaptchaVal !== captchaResult) {
              captchaInput.parentElement.classList.add('error');
              // Генерируем новый пример, если ошиблись (безопасность)
              generateCaptcha();
              captchaInput.value = '';
              isValid = false;
          }

          // 5. Чекбокс
          const policy = document.getElementById('policy');
          if (!policy.checked) {
              isValid = false;
          }

          // Если все ОК -> "Отправляем"
          if (isValid) {
              const btn = form.querySelector('button[type="submit"]');
              const originalText = btn.textContent;

              btn.textContent = 'Отправка...';
              btn.disabled = true;
              btn.style.opacity = '0.7';

              // Имитация AJAX
              setTimeout(() => {
                  form.style.display = 'none';
                  successMsg.style.display = 'flex';
                  // Scroll to success message
                  successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 1500);
          }
      });
  }

  // --- 6. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptBtn = document.getElementById('accept-cookies');

  if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.style.display = 'block';
      }, 2000);
  }

  if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.style.display = 'none';
      });
  }
});