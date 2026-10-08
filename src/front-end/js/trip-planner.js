// Share the same planner behavior across all pages
//JS wasnt needed, inline inside html would have worked as well but wanted to try make it more interactive
const dialog = document.querySelector('.trip-dialog');
const form = document.querySelector('#trip-form');
const content = document.querySelector('.planner-content');
const success = document.querySelector('.planner-success');
let opener;

function closePlanner() {
    dialog.close();
}
document.querySelectorAll('[data-open-trip]').forEach(button => {
    button.addEventListener('click', () => {
        opener = button;
        content.hidden = false;
        success.hidden = true;
        dialog.showModal();
        document.body.classList.add('planner-open');
    });
});
dialog.querySelector('.dialog-close').addEventListener('click', closePlanner);
dialog.querySelector('[data-close-trip]').addEventListener('click', closePlanner);
dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left ||
        event.clientX > bounds.right || event.clientY < bounds.top ||
        event.clientY > bounds.bottom)) closePlanner();
});
dialog.addEventListener('close', () => {
    document.body.classList.remove('planner-open');
    opener?.focus();
});
form.addEventListener('submit', event => {
    event.preventDefault();
    const choices = new FormData(form);
    document.querySelector('#trip-summary').textContent =
        ['destination', 'duration', 'travelers', 'style'].map(name => choices.get(name)).join(' · ');
    content.hidden = true;
    success.hidden = false;
    document.querySelector('#success-title').focus();
});
