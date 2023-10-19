<div
	class="flex justify-center items-center opacity-80 bg-gray-300 rounded-lg pulse dark:bg-gray-700 {$$restProps.class}"
>
	<slot />
</div>

<style>
	@keyframes pulse {
		50% {
			opacity: 0.3;
		}
	}
	.pulse {
		animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
