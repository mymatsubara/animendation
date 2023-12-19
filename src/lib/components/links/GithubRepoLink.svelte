<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import GithubIcon from '../icons/GithubIcon.svelte';
</script>

<a
	class="p-2 hover:bg-primary-800 rounded block"
	href="https://github.com/mymatsubara/animendation"
	title="Github repository"
	target="_blank"
	><GithubIcon class={twMerge('h-5 fill-primary-200', $$restProps.class)} />
</a>
