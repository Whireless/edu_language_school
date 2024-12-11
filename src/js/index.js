// Смена цвета header при скролле

const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
	if (scrollY > 75) {
		header.classList.add('main-header--scroll');
	} else {
		header.classList.remove('main-header--scroll');
	}
});