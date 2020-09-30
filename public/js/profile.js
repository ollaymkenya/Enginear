const slider = document.getElementById("myRange");
const comment = document.getElementById("ratingTitle");
const ratingInput = document.getElementById("ratingInput");
const reviewButtons = document.getElementsByClassName("btn-review");
const feedbackButtons = document.getElementsByClassName("btn-feedback");
const desktopCog = document.querySelector('.desktopcog');
const modalClose = document.querySelector('.modal-close');
const modalClose2 = document.querySelector('.modal-close2');
const modalClose3 = document.querySelector('.modal-close3');
const modalClose4 = document.querySelector('.modal-close4');
const modalClose5 = document.querySelector('.modal-close5');
const modalBg = document.querySelector('.modal-bg');
const modalBg2 = document.querySelector('.modal-bg2');
const modalBg3 = document.querySelector('.modal-bg3');
const commentForm = document.querySelector('.comment-form');
const feedbackForm = document.querySelector('.feedback-form');
const seeFeedback = document.getElementsByClassName('see-feedback');
const seeReview = document.getElementsByClassName('see-review');

function moveLeft() {
    document.getElementById("move-left").classList.toggle("move-left");
}

document.querySelector(".comments-tag").addEventListener("click", () => {
    document.querySelector(".jobs-comments__section").classList.add('moveSideways');
})

document.querySelector(".jobs-tag").addEventListener("click", () => {
    document.querySelector(".jobs-comments__section").classList.remove('moveSideways');
})

slider.oninput = function () {
    comment.innerHTML = this.value == 1 ? "Poor experience" :
        this.value == 2 ? "Not so Good" :
            this.value == 3 ? "Fair Experience" :
                this.value == 4 ? "Very Good" :
                    this.value == 5 ? "Awesome Expereince" :
                        '';
    comment.style.color = this.value == 1 ? "orangered" :
        this.value == 2 ? "orange" :
            this.value == 3 ? "orange" :
                this.value == 4 ? "teal" :
                    this.value == 5 ? "green" :
                        '';
    ratingInput.value = comment.innerHTML;
}

for (let i = 0; i < reviewButtons.length; i++) {
    reviewButtons[i].addEventListener("click", (e) => {
        const url = e.target.dataset.jobid;
        commentForm.action = `/review/${url}`;
        modalBg.classList.add('bg-active');
    })
}
modalClose.addEventListener('click', () => {
    modalBg.classList.remove('bg-active');
})

modalClose2.addEventListener('click', () => {
    modalBg.classList.remove('bg-active');
})

for (let i = 0; i < feedbackButtons.length; i++) {
    feedbackButtons[i].addEventListener("click", (e) => {
        const url = e.target.dataset.jobid;
        feedbackForm.action = `/feedback/${url}`;
        modalBg2.classList.add('bg-active');
    })
}
modalClose3.addEventListener('click', () => {
    modalBg2.classList.remove('bg-active');
})

for(let i = 0; i < seeFeedback.length; i++){
    seeFeedback[i].addEventListener('click', (e) => {
        e.target.parentElement.parentElement.querySelector('.job-container__body').style.transform = 'translateX(-66.33%)';
    })
}

for(let i = 0; i < seeReview.length; i++){
    seeReview[i].addEventListener('click', (e) => {
        e.target.parentElement.parentElement.querySelector('.job-container__body').style.transform = 'translateX(-33.33%)';
    })
}

desktopCog.addEventListener('click', () => {
    modalBg3.classList.add('bg-active');
})

modalClose5.addEventListener('click', () => {
    modalBg3.classList.remove('bg-active');
})