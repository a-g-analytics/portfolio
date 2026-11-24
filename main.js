let hamb = document.getElementById('hamburger');
let menu = document.getElementById('mobile_menu');
let isOpen = false;
menu.inert = true;

hamb.addEventListener('click', showHide);

let links = document.querySelectorAll('#mobile_menu .menu_item'); 
links.forEach(link => { 
    link.addEventListener('click', function(){ 
        showHide(); 
    })
})

function showHide(){
    isOpen = !isOpen;
    menu.style.maxHeight = isOpen ? '100vh' : '0px';
    menu.style.opacity = isOpen ? '1' : '0';
    menu.inert = !isOpen;
    hamb.setAttribute('aria-expanded', isOpen);
    hamb.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

const tabButtons = document.querySelectorAll('.tab_button');

function selectTab(selected) {
    tabButtons.forEach(btn => {
        const isSelected = btn === selected;
        btn.setAttribute('aria-selected', isSelected);
        btn.tabIndex = isSelected ? 0 : -1;
        document.getElementById(btn.getAttribute('aria-controls')).hidden = !isSelected;
    });
}

tabButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => selectTab(btn));

    // arrow-key navigation, per the ARIA tabs pattern
    btn.addEventListener('keydown', e => {
        let target;
        if (e.key === 'ArrowRight') target = tabButtons[(i + 1) % tabButtons.length];
        else if (e.key === 'ArrowLeft') target = tabButtons[(i - 1 + tabButtons.length) % tabButtons.length];
        else if (e.key === 'Home') target = tabButtons[0];
        else if (e.key === 'End') target = tabButtons[tabButtons.length - 1];
        if (target) {
            e.preventDefault();
            target.focus();
            selectTab(target);
        }
    });
});

// project cards - flip
document.querySelectorAll('.project_card').forEach(card => {
    const front = card.querySelector('.card_front');
    const back = card.querySelector('.card_back');

    card.classList.add('flip_ready');   // turns on the flip CSS
    back.inert = true;                  // hidden side can't be tabbed to or read out

    card.querySelectorAll('.flip_button').forEach(btn => {
        btn.addEventListener('click', () => {
            const flipped = card.classList.toggle('is_flipped');
            front.inert = flipped;
            back.inert = !flipped;
            // move focus to the side now showing, so keyboard and screen reader users follow the flip
            const target = flipped
                ? back.querySelector('.back_heading')
                : front.querySelector('.flip_button');
            target.focus({ preventScroll: true });
        });
    });
});

// resume

const resumeDialog = document.getElementById('resume_dialog');
let resumeTrigger = null;

// any element with data-resume-open opens the dialog
document.querySelectorAll('[data-resume-open]').forEach(btn => {
    btn.addEventListener('click', () => {
        resumeTrigger = btn;
        resumeDialog.showModal();   // native modal: traps focus, Esc closes, adds the ::backdrop scrim
    });
});

// close resume with animation (all close features use this)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function closeResume() {
    if (!resumeDialog.open || resumeDialog.classList.contains('is_closing')) return;
    if (reduceMotion.matches) {
        resumeDialog.close();
        return;
    }
    resumeDialog.classList.add('is_closing');
    const finish = () => {
        clearTimeout(fallback);
        resumeDialog.removeEventListener('animationend', onEnd);
        resumeDialog.classList.remove('is_closing');
        resumeDialog.close();
    };
    const onEnd = e => {
        if (e.animationName === 'resume_out') finish();
    };
    // safety net for animation
    const fallback = setTimeout(finish, 400);   
    resumeDialog.addEventListener('animationend', onEnd);
}

// close buttons
resumeDialog.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', closeResume);
});

// click outside panel to close
resumeDialog.addEventListener('click', e => {
    if (e.target === resumeDialog) closeResume();
});

// Esc key: play the closing animation instead of vanishing instantly
resumeDialog.addEventListener('cancel', e => {
    e.preventDefault();
    closeResume();
});

// switch focus
resumeDialog.addEventListener('close', () => {
    if (resumeTrigger) resumeTrigger.focus();
});

// hero buttons
document.getElementById('github_link').addEventListener('click', () => {
    window.open('YOUR_GITHUB_URL', '_blank', 'noopener');
});
document.getElementById('email_contact').addEventListener('click', () => {
    window.location.href = 'mailto:anna.g.analytics@outlook.com';
});

// constellation chart: click the star to draw Cassiopeia
const constellation = document.getElementById('constellation');
// only hides the lines once JS is running, so without JS the chart shows complete
constellation.classList.add('armed');   

constellation.addEventListener('click', () => {
    constellation.classList.remove('drawn');
    // lets the drawing replay if the chart is clicked again
    void constellation.offsetWidth;   
    constellation.classList.add('drawn');
    constellation.setAttribute('aria-label', 'Cassiopeia constellation chart');
});