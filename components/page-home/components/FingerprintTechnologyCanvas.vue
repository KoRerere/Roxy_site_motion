<template>
  <canvas id="fingerprint-technology" ref="canvasRef"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const defaultDuch = `,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,
,,,,,hello world,,,,,
,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,`

const props = defineProps({
	// 关键词的字体颜色
	mainColor: {
		type: String,
		default: 'green'
	},
	// 其他字体的颜色
	otherColor: {
		type: String,
		default: 'yellow'
	},
	// 变化时字体的颜色
	changeColor: {
		type: String,
		default: 'red'
	},
	// 文本内容
	duch: {
		type: String,
		default: defaultDuch
	},
	// 变化字符数量
	changeNumber: {
		type: Number,
		default: 10
	},
	// 变化速度
	changeSpeed: {
		type: Number,
		default: 50
	},
	// 字体大小
	fontSize: {
		type: Number,
		default: 16
	},
	// 行高
	lineHeight: {
		type: Number,
		default: 18
	}
})

let timer = null;
let visibilityObserver = null;
let isVisible = false;
const canvasRef = ref(null);
const dpr = window.devicePixelRatio || 1;
let textWidth = 0;
function textMatrix(canvas) {
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	if (textWidth == 0) {
		const text = ctx.measureText('#');
		textWidth = text.width + 2;
	}

	const textMatrix = props.duch.split('\n').map((line) => line.split('').map(char => {
		if (char === ',') {
			return randomLetter(1)
		} else {
			// 保留关键字
			return 'MAIN-' + char;
		}
	}));
	const w = textMatrix.at(0).length;
	const h = textMatrix.length;
	const canvasWidth = textWidth * w * dpr;
	const canvasHeight = (h * props.lineHeight + props.lineHeight / 2) * dpr;
	canvas.width = canvasWidth
	canvas.height = canvasHeight

	canvas.style.width = `${canvasWidth / dpr}px`;
	canvas.style.height = `${canvasHeight / dpr}px`;
	ctx.font = `${props.fontSize * dpr}px 'Chivo Mono'`;
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	timer = setInterval(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const rand = Math.floor(Math.random() * props.changeNumber);
		const changePosition = [];

		for (let i = 0; i < rand; i++) {
			const x = Math.floor(Math.random() * w);
			const y = Math.floor(Math.random() * h);

			const char = textMatrix[y][x];
			if (char.startsWith('MAIN-')) {
				i--;
				continue
			} 
			
			textMatrix[y][x] = randomLetter(1);
			changePosition.push({ x, y });
		}
		
		for (let i = 0; i < textMatrix.length; i++) {
			const line = textMatrix[i];
			for (let j = 0; j < line.length; j++) {
				let char = line[j];
				if (changePosition.some(({ x, y }) => x === j && y === i)) {
					ctx.fillStyle = props.changeColor;
				} else if (char.startsWith('MAIN-')) {
					ctx.fillStyle = props.mainColor;
					char = char.replace('MAIN-', '');
				} else {
					ctx.fillStyle = props.otherColor;
				}
				ctx.fillText(char, j * textWidth * dpr, (i + 1) * props.lineHeight * dpr);
			}
		}

	}, props.changeSpeed);
}
				
function randomLetter(length) {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
	return text;
}

const resize = useDebounceFn(() => {
	clearInterval(timer);
	timer = null;
	if (isVisible) textMatrix(canvasRef.value)
}, 100)

onMounted(() => {
	window.addEventListener('resize', resize)
	visibilityObserver = new IntersectionObserver(([entry]) => {
		isVisible = Boolean(entry?.isIntersecting);
		clearInterval(timer);
		timer = null;

		if (isVisible) textMatrix(canvasRef.value)
	}, { rootMargin: '120px 0px' })
	visibilityObserver.observe(canvasRef.value)
})

onUnmounted(() => {
	window.removeEventListener('resize', resize)
	visibilityObserver?.disconnect();
	clearInterval(timer);
})

</script>

<style>

</style>
