<script lang="ts">
	import { goto } from '$app/navigation';
	import LoginLink from '$lib/components/LoginLink.svelte';
	import Logo from '$lib/components/logos/Logo.svelte';
	import LaptopMockup from '$lib/components/mockups/LaptopMockup.svelte';
	import MobileMockup from '$lib/components/mockups/MobileMockup.svelte';
	import UserSearch from '$lib/components/searchs/UserSearch.svelte';
	import { user } from '$lib/stores/user';
	import { Button } from 'flowbite-svelte';

	$: {
		if ($user) {
			const username = $user.username;
			goto(`/profile/${username}`);
		}
	}
</script>

<svelte:head>
	<title>Animendation - Make your own anime and manga recommendation list</title>
</svelte:head>

{#if $user === undefined}
	<div
		class="z-10 fixed flex-col gap-3 w-full bg-primary-900 flex items-center justify-center h-full"
	>
		<Logo class="text-4xl" />
	</div>
{/if}

<div class="min-h-full bg-gradient-to-t from-primary-800 to-primary-900 w-full">
	<div class="md:h-[100vh] flex flex-col container">
		<div class="flex justify-between py-6 items-center">
			<Logo class="text-3xl md:text-5xl" />
			<div class="flex gap-3 items-center">
				<UserSearch iconClass="h-6" />
				<LoginLink
					><Button class="md:text-md font-semibold text-primary-50">Login</Button></LoginLink
				>
			</div>
		</div>
		<div
			class="grow grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[3fr_4fr] text-primary-50 items-center"
		>
			<div class="mb-20 mt-10 md:mb-20 md:mt-5">
				<h2 class="mb-1 md:mb-3 text-3xl lg:text-5xl font-semibold tracking-tight">
					Make your own anime/manga recommendation list
				</h2>
				<p class="mb-4 text-primary-300 md:text-md md:mb-6">
					Link to your Myanimelist account and start recommending
				</p>
				<LoginLink
					><Button class="px-6 py-3 text-xl font-bold text-primary-50">Join now!</Button></LoginLink
				>
			</div>

			<div class="mb-4">
				<div class="hidden md:block">
					<LaptopMockup>
						<img
							class="h-full w-full object-fill"
							src="/imgs/mockup-pc.webp"
							alt="Animendation in a computer screen"
						/>
					</LaptopMockup>
				</div>
				<div class="md:hidden max-w-sm mx-auto">
					<MobileMockup>
						<img
							class="h-full w-full object-fill"
							src="/imgs/mockup-mobile.webp"
							alt="Animendation in a mobile screen"
						/>
					</MobileMockup>
				</div>
			</div>
		</div>
	</div>
</div>
