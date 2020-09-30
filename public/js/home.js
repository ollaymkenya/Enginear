let jobBtns = document.getElementsByClassName('job-btn');
let modalBg = document.querySelector(".modal-bg");
const modalClose = document.querySelector(".modal-close");
const modalClose2 = document.querySelector('.modal-close2');
for (let i  = 0; i < jobBtns.length; i++){
    jobBtns[i].addEventListener("click", (e) => {
        let url = e.target.dataset.userid;
        let name = e.target.dataset.username;
        modalBg.querySelector(".modal-title__name").innerHTML = name;
        modalBg.querySelector('form').action = `/job/${url}`
        modalBg.classList.add('bg-active');
    })
}
modalClose.addEventListener('click', () => {
    modalBg.classList.remove('bg-active');
})

modalClose2.addEventListener('click', () => {
    modalBg.classList.remove('bg-active');
})