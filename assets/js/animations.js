window.animations = [];

function parseAnimation(an) {
	const pos = document.getElementById(an.container).getBoundingClientRect();
	const animations = [];

	for (let i = 0; i < Math.floor(pos.height); i++) {
		animations[i] = an.style({
			pos: {
				percent: i / pos.height,	// %-scroll position in container
				absolute: i			// px-scoll position in container
			},
			containerDimension: {
				height: pos.height,		// Height (in px) of the container
				width: pos.wid
		});
	}

	return animations
		.map((item, index) => ({
			pos: Math.floor(pos.top + index + window.scrollY),
			animation: item,
			selectors: an.selectors.map(i => document.querySelector(i))
		}));
}

function buildAnimationList() {    
    window.animations = [];
    
	[
		{
			container: 'sec1',
			selectors: ['#sec1 > .titleContent'],
			style: ({pos, containerDimension, windowDimension}) => ({
				transform: `scale(${Math.min(1, (1 - pos))})`,
			})
		},
		{
			container: 'sec2',
			selectors: ['#sec2 > .staticImage'],
			style: pos => ({
				filter: `brightness(${Math.max(0, pos)})`
			})
		},
	]
	.map(parseAnimation)
		.flat()
		.forEach(item => {
			if (!window.animations[item.pos]) {
				window.animations[item.pos] = [];
			}
			window.animations[item.pos].push(item);
		});
}

function getVh() {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function getVw(v) {
	return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

function getVmin(v) {
	return Math.min(vh(), vw());
}

function vmax(v) {
	return Math.max(vh(), vw());
}

function subscribeAnimationFrame() {
	window.requestAnimationFrame(_ => {
		const pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (window.animations[pos]) {
            window.animations[pos]
                .forEach(item => {
                item.selectors.forEach(el => {
                    Object.assign(el.style, item.animation);
                })
            });
        }

		subscribeAnimationFrame();
	})
}

function bootstrapAnimation(){    
    buildAnimationList();
    subscribeAnimationFrame();

    window.addEventListener('resize', _ => {
        buildAnimationList();
    });
}

(() => {
    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', _ => {
            bootstrapAnimation();
        });
    }
    else {
        bootstrapAnimation();
    }   
})();
