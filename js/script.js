const burger = document.querySelector('.burger__menu')
const menu = document.querySelector('.header__nav')
burger.addEventListener('click', e => {
	burger.classList.toggle('active')
	menu.classList.toggle('active')
	document.querySelector('body').classList.toggle('open-menu')
})

const acc = document.querySelectorAll('.item-acc')
acc.forEach(item => {
	item.addEventListener('click', e => {
		if (item.classList.contains('active')) {
			item.classList.remove('active')
			const desc = item.querySelector('.item-acc__description')
			if (desc) desc.classList.remove('active')
			return
		}
		acc.forEach(accItem => {
			accItem.classList.remove('active')
			const desc = accItem.querySelector('.item-acc__description')
			if (desc) desc.classList.remove('active')
		})
		item.classList.add('active')
		const currentDesc = item.querySelector('.item-acc__description')
		if (currentDesc) currentDesc.classList.add('active')
	})
})
function createPosts(post) {
	return `
    <div data-set="${post.id}" class="post">
      <img src="${post.image}" alt="">
      <div class="post-body">
        <a class="post-tag" href="#">${post.category}</a>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-text">${post.excerpt}</p>
        <span class="post-date">${post.date}</span>
      </div>
    </div>
  `
}
async function loadPosts() {
	const res = await fetch('js/items.json')
	const posts = await res.json()
	const allPosts = document.querySelector('.posts__link')
	const container = document.querySelector('.posts__row')

	container.innerHTML = ''
	posts.slice(0, 3).forEach(item => {
		container.innerHTML += createPosts(item)
	})

	if (allPosts) {
		// Флаг для отслеживания состояния
		let isShowingAll = false

		allPosts.addEventListener('click', e => {
			e.preventDefault()
			container.innerHTML = ''

			if (isShowingAll) {
				// Показываем только 3 поста
				posts.slice(0, 3).forEach(item => {
					container.innerHTML += createPosts(item)
				})
				allPosts.textContent = 'See All Posts'
			} else {
				// Показываем все посты
				posts.forEach(item => {
					container.innerHTML += createPosts(item)
				})
				allPosts.textContent = 'Скрыть'
			}

			// Меняем состояние
			isShowingAll = !isShowingAll

			// Обновляем обработчики для карточек после изменения DOM
			setTimeout(attachCardHandlers, 0)
		})
	}

	attachCardHandlers()

	function attachCardHandlers() {
		const cards = document.querySelectorAll('.post')
		cards.forEach(item => {
			const postId = item.dataset.set
			const postData = posts.find(p => p.id == postId)
			// Удаляем старый обработчик перед добавлением нового
			item.removeEventListener('click', cardClickHandler)
			item.addEventListener('click', cardClickHandler)

			function cardClickHandler(e) {
				openModal(postData)
			}
		})
	}
}
loadPosts()

function createModal() {
	const html = `<div id="modal" class="modal">
  	<div class="modal-content">
    <span class="modal-close">&times;</span>
    <img id="modal-image" src="" alt="">
    <h2 id="modal-title"></h2>
    <p class="category" id="modal-category"></p>
    <p class="date" id="modal-date"></p>
    <p id="modal-content"></p>
    </div>
	</div>
`
	document.querySelector('body').insertAdjacentHTML('beforeend', html)
}

createModal()

const modal = document.getElementById('modal')
const modalClose = modal.querySelector('.modal-close')

// Обработчики закрытия один раз
modalClose.addEventListener('click', () => {
	modal.style.display = 'none'
})

window.addEventListener('click', e => {
	if (e.target === modal) {
		modal.style.display = 'none'
	}
})

// Функция открытия модалки
function openModal(post) {
	modal.style.display = 'flex'
	modal.querySelector('#modal-image').src = post.image
	modal.querySelector('#modal-title').textContent = post.title
	modal.querySelector('#modal-category').textContent = post.category
	modal.querySelector('#modal-date').textContent = post.date
	modal.querySelector('#modal-content').textContent = post.content
}
