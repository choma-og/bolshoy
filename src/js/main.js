import Swiper, { Navigation, Pagination, EffectFade, Autoplay, FreeMode } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '@/styles/style.scss';
import axios from 'axios';
import IMask from 'imask';
import { data } from 'browserslist';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/owl.carousel.min.js';
import 'animate.css';
import { gsap } from "gsap";
// ===== BURGER =====
// const navBtn = document.getElementById("menu-toggle-btn");
// const modalMenu = document.getElementById("js-modal-menu");
// if(navBtn)  {
//   navBtn.addEventListener("click", e => {
//     e.preventDefault();
//     navBtn.classList.toggle("active");
//     modalMenu.classList.toggle("active")
//   })
// }


// DROPDOWM SUBLIST
const dropDownItems = document.querySelectorAll('.subdivision__drop')

dropDownItems.forEach((item) => {
  const dropDownButton = item.querySelector('.subdivision')

  dropDownButton.addEventListener('click', () => {
    toggleItem(item)
  })
})

const toggleItem = (item) => {
  const dropdownContainer = item.querySelector('.subdivision__list')
  if(item.classList.contains('show-dropdown')) {
			dropdownContainer.removeAttribute('style')
			item.classList.remove('show-dropdown')
  } else {
        dropdownContainer.style.height = dropdownContainer.scrollHeight + 'px'
        item.classList.add('show-dropdown')
  }


}


const tl = gsap.timeline({ paused: true });

const animateOpenNav = () => {
  tl.fromTo(
    "#js-modal-menu",
    { autoAlpha: 0 },
    {
      duration: 0.1,
      autoAlpha: 1,
      delay: 0,
    }
  );
  // tl.fromTo(
  //   ".modal-menu__item > a",
  //   {
  //     top: 0,
  //     opacity: 0,
  //   },
  //   {
  //     duration: 0.8,
  //     top: 0,
  //     opacity: 1,
  //     ease: "power2.inOut",
  //     stagger: {
  //       amount: 0.4,
  //     },
  //   },
  //   "-=0.4"
  // );
  // tl.fromTo(
  //   ".menu-footer__link",
  //   { opacity: 0 },
  //   { duration: 0.3, opacity: 1 },
  //   "-=0.5"
  // );
};

const openNav = () => {
  animateOpenNav();
  const navBtn = document.getElementById("menu-toggle-btn");
  const headerMenu = document.getElementById("header__menu");
  const headerTel = document.getElementById("header__tel");
  const header = document.querySelector(".header");
  navBtn.addEventListener("click", function (e) {
    document.body.classList.toggle("_lock"); 
    navBtn.classList.toggle("active");
    headerMenu.classList.toggle("active");
    headerTel.classList.toggle("active");
    header.classList.toggle("active")
    toggleMenuText();
    if (navBtn.classList.contains("active")) {
      tl.play();
    } else {
      tl.reverse();
    }
  });

  function toggleMenuText() {
    var menuText = navBtn.querySelector("span");

    if (menuText.textContent === "Меню") {
      menuText.textContent = "Закрыть";
    } else {
      menuText.textContent = "Меню";
    }
  }
};

openNav();

// range__wrapper

// const rangeElements = document.querySelectorAll('.range__wrapper');

//   rangeElements.forEach(element => {
//     element.addEventListener('mouseover', function() {
//       rangeElements.forEach(otherElement => {
//         if (otherElement !== element) {
//           otherElement.classList.add('range__opacity');
//         }
//       });
//     });

//     element.addEventListener('mouseout', function() {
//       rangeElements.forEach(otherElement => {
//         if (otherElement !== element) {
//           otherElement.classList.remove('range__opacity');
//         }
//       });
//     });
//   });

var swiper = new Swiper(".advantages-swiper", {
  effect: "fade",
  modules: [Navigation, Pagination, EffectFade, Autoplay],
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
	navigation: {
		nextEl: ".swiper-next-button",
		prevEl: ".swiper-prev-button"
	},
	pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  }
});

swiper.on('slideChange', function(sld) {
	document.body.setAttribute('data-sld', sld.realIndex);
  
})

// ===== ADVANTAGES SLIDER =====

// ===== NEWS SLIDER =====
$('.news__carousel').owlCarousel({
    margin:52,
    nav:true,
    merge:true,
    dots: false,
    navText: [$('.slider-next'),$('.slider-prev')],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:2,
        },
        1300: {
          items:2,
          mergeFit:true
        },
    }
})
// ===== NEWS SLIDER =====
$('.technique-carousel').owlCarousel({
    margin:60,
    nav:true,
    merge:true,
    dots: false,
    navText: [$('.slider-next'),$('.slider-prev')],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            // nav:true
        },
        800:{
            items:2,
        },
        1300: {
          items:3,
        },
    }
})

// ===== RESIZABLE SLDIER ===== 
window.addEventListener('DOMContentLoaded', () => {

  const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
    let swiper;

    breakpoint = window.matchMedia(breakpoint);

    const enableSwiper = function(className, settings) {
      swiper = new Swiper(className, settings);

      if (callback) {
        callback(swiper);
      }
    }

    const checker = function() {
      if (breakpoint.matches) {
        return enableSwiper(swiperClass, swiperSettings);
      } else {
        if (swiper !== undefined) swiper.destroy(true, true);
        return;
      }
    };

    breakpoint.addEventListener('change', checker);
    checker();
  }

  const someFunc = (instance) => {
    if (instance) {
      instance.on('slideChange', function (e) {
        console.log('*** mySwiper.activeIndex', instance.activeIndex);
      });
    }
  };

  resizableSwiper(
    '(max-width: 950px)',
    '.range__swiper',
    {
      grabCursor: true,
      slidesPerView: "auto",
      spaceBetween: 20,
      centerSlides:true,
      breakpoints: {
        600: {
          centerSlides:false
        },
      },
    }
  );
});

//  var swiper = new Swiper(".news-swiper", {
//   slidesPerView: 2,
//   freeMode: true,
//   grabCursor: true,
//   modules: [Navigation],
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//       },
//     });

/*=============== NEWS-DETAIL SLIDER ===============*/
 var newsDetailSwiper = new Swiper(".news-detail__gallery", {
  slidesPerView: 1,
  spaceBetween: 20,
  modules: [Navigation],
      navigation: {
        nextEl: ".swiper-next-button",
        prevEl: ".swiper-prev-button",
      },
    });

/*=============== ABOUT-PEOPLE SLIDER ===============*/
 var aboutPeopleSwiper = new Swiper(".about-people__slider", {
  effect: "fade",
  modules: [Navigation, Pagination, EffectFade],
      navigation: {
        nextEl: ".swiper-next-button",
        prevEl: ".swiper-prev-button",
      },
    });

 var detailSwiper = new Swiper(".detail-swiper", {
  effect: "fade",
  modules: [Navigation, Pagination, EffectFade],
      navigation: {
        nextEl: ".detail-slider-next",
        prevEl: ".detail-slider-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        type: "fraction",
      }
    });

/*=============== VACANCY SLIDER ===============*/
 var newsDetailSwiper = new Swiper(".vacancy-slider__swiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  modules: [Navigation],
      navigation: {
        nextEl: ".swiper-next-button",
        prevEl: ".swiper-prev-button",
      },
    });

/*=============== CLIENTS SLIDER ===============*/
 var clientsSwiper = new Swiper(".clients-swiper", {
  slidesPerView: 5,
  spaceBetween: 5,
  loopedSlides: 12,
  loop: true,
  modules: [Autoplay, FreeMode],
  speed: 8000,
  freeMode: {
    enabled: false,
    momentumBounce: true,
    freeModeMomentumRatio: 1222,
  },
  autoplay: {
      delay: 0,
      disableOnInteraction: false,
  },
  // breakpoints: {
  // 640: {
  //   slidesPerView: 2,
  //   spaceBetween: 20,
  // },
  // 768: {
  //   slidesPerView: 4,
  //   spaceBetween: 40,
  // },
  // 1024: {
  //   slidesPerView: 5,
  //   spaceBetween: 50,
  // },
  // },
  });

// ===== VACANCY ACCORDION=====
const accordionItems = document.querySelectorAll('.vacancy-accordion__point')
accordionItems.forEach((item) => {
	const accoordionHeader = item.querySelector('.vacancy-accordion__info')
	accoordionHeader.addEventListener('click', () => {
		const openItem = document.querySelector('.acrd-open')
		toggleVacancy(item)
		if(openItem && openItem !== item) {
			toggleVacancy(openItem)
		}
	})
})
const toggleVacancy = (item) => {
		const accordionContent = item.querySelector('.vacancy-accordion__content')
		if(item.classList.contains('acrd-open')) {
			accordionContent.removeAttribute('style')
			item.classList.remove('acrd-open')
		} else {
			accordionContent.style.height = accordionContent.scrollHeight + 'px'
			item.classList.add('acrd-open')
		}
	}

/*=============== INPUT MASK ===============*/
// Найти все элементы с атрибутом data-mask="phone"
let phones = document.querySelectorAll('[data-mask="phone"]');

// Применить маску к каждому найденному элементу
phones.forEach(function(element) {
  new IMask(element, {
    mask: '+{7}(000)000-00-00'
  });
});
	// ========== MODAL-MAIN ==========
const modalMainBody = document.querySelector('.modal-main__body');
const modalMainButton = document.querySelector('.js-open-modal-main');
const modalMainContent = document.querySelector('.modal-main__content');
const modalMainClose = document.querySelector(".modal-main__close");
const errorBlock = document.querySelectorAll('.js-error');


if(modalMainButton) {
  modalMainButton.addEventListener("click", (e) => {
	document.body.classList.add("_lock");
	modalMainBody.classList.add("_active");
	modalMainContent.classList.add("_active");
})
}
if (modalMainClose) {
  console.log(errorBlock)
    modalMainClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalMainBody.classList.remove("_active");
    modalMainContent.classList.remove("_active");
    errorBlock.forEach((item) => {
      item.classList.remove("_active")
    }
    )
  });
}

	// ========== MODAL-VACANCT ==========
const modalVacancyBody = document.querySelector('.modal-vacancy__body');
const modalVacancyButtons = document.querySelectorAll('.js-open-modal-vacancy');
const modalVacancyContent = document.querySelector('.modal-vacancy__content');
const modalVacancyClose = document.querySelector(".modal-vacancy__close");

if(modalVacancyButtons) {
modalVacancyButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    document.body.classList.add("_lock");
    modalVacancyBody.classList.add("_active");
    modalVacancyContent.classList.add("_active");
  });
});
}

if (modalVacancyClose) {
  modalVacancyClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalVacancyBody.classList.remove("_active");
    modalVacancyContent.classList.remove("_active");
    errorBlock.forEach((item) => {
      item.classList.remove("_active")
    }
    )
  });
}
/*=============== SUCES ===============*/
const sucesBody = document.querySelector('.suces__body');
const sucesContent = document.querySelector('.suces__content');
const sucesClose = document.querySelector('.suces__close');
function sucesOpen() {
  sucesBody.classList.add('_active');
  sucesContent.classList.add('_active');
  document.body.classList.add('_lock');
}

if(sucesClose) {
  sucesClose.addEventListener("click" , (e) => {
    sucesBody.classList.remove("_active");
    sucesContent.classList.remove('_active');
    document.body.classList.remove('_lock');
  })
}


/*=============== AXIOS ===============*/
function validatePhone(phone)  {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length)
  console.log(cleanedPhone.length === 11, "partial")

  if(cleanedPhone.length === 11) {
    return true; 
  } else {
    return false;
  }
}
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateText(text)  {
  const trimmedText = text.trim();

    if (trimmedText.length >= 2) {
    return true;
  } else {
    return false;
  }
}
const validate = (input) => {
  const dataType = input.getAttribute("data-type");
  let res = true;

  switch(dataType) {
      case "phone": 
      res = validatePhone(input.value)
      break;
      case "text": 
      res = validateText(input.value)
      break;
      case "email":
      res = validateEmail(input.value);
      break;
  }
  console.log(input, res, dataType)
  return res;
}

let forms = document.querySelectorAll('.js-form');
console.log(forms)
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");
	console.log(formButton)
	if(formButton) {
		formButton.addEventListener("click", (e) => {
		e.preventDefault();
		formButton.disabled = true;
		const inputs = form.querySelectorAll("input, textarea");
		const method = form.method;
		const action = form.action;
		let isValidated = true;
		let formData = [];

		inputs.forEach(input => {
      formData.push({
        name: input.name,
        value: input.value,
        isValidate: validate(input),
      })  
  })

	formData.forEach(item => {
    const input = form.querySelector(`[name="${item.name}"]`);
    const wrapper = input.parentNode;
    const errorBlock = wrapper.querySelector('.js-error');

    if(!item.isValidate) {
        isValidated = false;
        errorBlock.classList.add("_active")
        wrapper.classList.add("_active")
    } else {
        errorBlock.classList.remove("_active");
        wrapper.classList.remove("_active")
    }
  })

	if(!isValidated) {
    formButton.disabled = false;
    return false;
  }

	axios({
		method,
		url: action,
		data: formData,
}).then((response) => {
  sucesOpen();
		console.log("success");
		formButton.disabled = false;
        modalVacancyBody.classList.remove("_active");
    modalVacancyContent.classList.remove("_active");
      // Очистка полей ввода
    inputs.forEach(input => {
      input.value = "";
    });
}).catch((error) => {
		console.error(error);
    document.body.classList.remove("_lock");
    modalMainBody.classList.remove("_active");
    modalMainContent.classList.remove("_active");
    modalVacancyBody.classList.remove("_active");
    modalVacancyContent.classList.remove("_active");
    sucesOpen();
		formButton.disabled = false;
    inputs.forEach(input => {
      input.value = "";
    });
	});
})
	}
})

// MAPS TABS
const tabs = document.querySelectorAll(".contacts-map__item");
const contents = document.querySelectorAll(".contacts-map__content");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {

    tabs.forEach((tab) => tab.classList.remove("active"))
    tab.classList.add("active");

    contents.forEach(c => c.classList.remove("active"));
    contents[index].classList.add("active");
  });
});

tabs[0].click();

/*=============== MAP ===============*/
document.addEventListener('DOMContentLoaded', function () {
  if (ymaps) {
    ymaps.ready(initializeMaps);
  }
});

let centerOffice = [53.36863907494733,83.76431772883599];
let centerStore = [55.004994486746305, 82.95321743254078];
let centerService = [55.004994486746305, 82.95321743254078];

function initializeMaps() {
	let mapOffice = new ymaps.Map('map-office', {
		center: centerOffice,
		zoom: 16,
	});
	let mapStore = new ymaps.Map('map-store', {
		center: centerStore,
		zoom: 16,
	});
	let mapService = new ymaps.Map('map-service', {
		center: centerService,
		zoom: 16,
	});
	let placemarkOffice = new ymaps.Placemark([53.36863907494733,83.76431772883599], {}, {
		iconLayout: 'default#image',
		iconImageHref: 'map.svg',
		iconImageSize: [37, 37],
		iconImageOffset: [-20, -30]
	});
	let placemarkStore = new ymaps.Placemark([55.004994486746305, 82.95321743254078], {}, {
		iconLayout: 'default#image',
		iconImageHref: 'map.svg',
		iconImageSize: [37, 37],
		iconImageOffset: [-20, -20]
	});
	let placemarkService = new ymaps.Placemark([55.004994486746305, 82.95321743254078], {}, {
		iconLayout: 'default#image',
		iconImageHref: 'map.svg',
		iconImageSize: [37, 37],
		iconImageOffset: [-20, -20]
	});
	mapOffice.controls.remove('geolocationControl');
	mapOffice.controls.remove('searchControl');
	mapOffice.controls.remove('trafficControl');
	mapOffice.controls.remove('typeSelector');
	mapOffice.controls.remove('rulerControl', {
		scaleLine: false,
	});
	mapStore.controls.remove('geolocationControl');
	mapStore.controls.remove('searchControl');
	mapStore.controls.remove('trafficControl');
	mapStore.controls.remove('typeSelector');
	mapStore.controls.remove('rulerControl', {
		scaleLine: false,
	});
	mapService.controls.remove('geolocationControl');
	mapService.controls.remove('searchControl');
	mapService.controls.remove('trafficControl');
	mapService.controls.remove('typeSelector');
	mapService.controls.remove('rulerControl', {
		scaleLine: false,
	});
	mapService.geoObjects.add(placemarkService);
	mapOffice.geoObjects.add(placemarkOffice);
	mapStore.geoObjects.add(placemarkStore);
}



