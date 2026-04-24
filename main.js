const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const commentForm = document.getElementById('comment-form');
const commentNameInput = document.getElementById('comment-name');
const commentTextInput = document.getElementById('comment-text');
const commentsList = document.getElementById('comments-list');
const commentsEmpty = document.getElementById('comments-empty');
const themeStorageKey = 'theme-preference';
const commentsStorageKey = 'lotto-comments';

function applyTheme(theme) {
    const isDarkMode = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeToggleBtn.textContent = isDarkMode ? 'White Mode' : 'Dark Mode';
    themeToggleBtn.setAttribute(
        'aria-label',
        isDarkMode ? 'Switch to white mode' : 'Switch to dark mode'
    );
}

function getPreferredTheme() {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredComments() {
    try {
        const savedComments = JSON.parse(localStorage.getItem(commentsStorageKey) || '[]');
        return Array.isArray(savedComments) ? savedComments : [];
    } catch {
        return [];
    }
}

function formatCommentDate(timestamp) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(timestamp));
}

function renderComments() {
    const comments = getStoredComments();
    commentsList.innerHTML = '';
    commentsEmpty.hidden = comments.length > 0;

    for (const comment of comments) {
        const commentCard = document.createElement('article');
        commentCard.className = 'comment-card';

        const commentMeta = document.createElement('div');
        commentMeta.className = 'comment-meta';

        const commentAuthor = document.createElement('span');
        commentAuthor.className = 'comment-author';
        commentAuthor.textContent = comment.name;

        const commentDate = document.createElement('span');
        commentDate.className = 'comment-date';
        commentDate.textContent = formatCommentDate(comment.createdAt);

        const commentBody = document.createElement('p');
        commentBody.className = 'comment-body';
        commentBody.textContent = comment.message;

        commentMeta.append(commentAuthor, commentDate);
        commentCard.append(commentMeta, commentBody);
        commentsList.appendChild(commentCard);
    }
}

applyTheme(getPreferredTheme());
renderComments();

themeToggleBtn.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(themeStorageKey, nextTheme);
});

commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = commentNameInput.value.trim();
    const message = commentTextInput.value.trim();
    if (!name || !message) {
        return;
    }

    const comments = getStoredComments();
    comments.unshift({
        name,
        message,
        createdAt: Date.now()
    });

    localStorage.setItem(commentsStorageKey, JSON.stringify(comments.slice(0, 20)));
    commentForm.reset();
    renderComments();
    commentNameInput.focus();
});

generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    for (const number of [...numbers].sort((a, b) => a - b)) {
        const lottoNumber = document.createElement('div');
        lottoNumber.classList.add('lotto-number');
        lottoNumber.textContent = number;
        lottoNumbersContainer.appendChild(lottoNumber);
    }
});
