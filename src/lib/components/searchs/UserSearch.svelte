<script lang="ts">
	import { clickOutside } from '$lib/actions/click-outside';
	import { UsersService, type users_search } from '$lib/clients/jikan/generated';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import { toast } from '$lib/stores/toast';
	import { Spinner } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	export let iconClass: string = '';

	let search: string = '';
	let searchInput: HTMLInputElement;
	let users: users_search | undefined;
	let open = false;

	const debounceTime = 500;
	let timeout: NodeJS.Timeout;
	const validSearch = (search?: string) => search && search.length > 2;
	$: {
		if (validSearch(search)) {
			clearTimeout(timeout);
			timeout = setTimeout(() => searchUser(search), debounceTime);
		}

		users = undefined;
	}

	async function searchUser(search: string) {
		try {
			const rawUsers = await UsersService.getUsersSearch(1, 10, search);
			const sortedUsers =
				rawUsers.data?.map((user) => ({
					...user,
					hasProfilePicture: user.images?.webp?.image_url?.includes('kaomoji') ?? false,
				})) ?? [];
			sortedUsers.sort((u1, u2) => Number(u1.hasProfilePicture) - Number(u2.hasProfilePicture));

			users = {
				...rawUsers,
				data: sortedUsers,
			};
		} catch (e) {
			console.error(e);
			toast.set({ message: 'Too many requests. Try again later', level: 'error' });
		}
	}

	$: {
		if (open) {
			setTimeout(() => searchInput.focus());
		} else {
			search = '';
		}
	}
</script>

<div>
	<button
		title="Search user"
		class={twMerge('hover:text-primary-50 rounded p-2', $$restProps.class)}
		on:click={() => {
			open = !open;
		}}><SearchIcon class={twMerge('text-primary-200 h-5', iconClass)} /></button
	>

	<div
		class="fixed top-0 left-0 bg-gray-500/50 h-full w-full z-20 {open
			? 'custom-modal-open'
			: 'hidden'}"
	>
		<div class="mt-20 mx-auto shadow-lg max-w-md w-10/12" in:fade={{ duration: 150 }}>
			<div class="relative">
				<input
					class="border-0 w-full focus:ring-0 focus:border-0 rounded-t h-10 peer bg-gray-700 text-primary-50 font-medium py-3"
					placeholder="Search user..."
					type="text"
					bind:value={search}
					bind:this={searchInput}
					use:clickOutside={() => (open = false)}
					on:keydown={(event) => {
						if (event.key === 'Escape') {
							open = false;
						}
					}}
				/>
				<button
					class="absolute -translate-y-1/2 top-1/2 right-2 p-1 text-gray-300 hover:text-gray-50"
					on:click={() => (open = false)}
				>
					<CloseIcon class="h-5" />
				</button>
			</div>

			<div class="py-1 rounded-b border-gray-300 bg-white border w-full max-h-96 overflow-y-auto">
				{#if validSearch(search)}
					{#if users}
						{#each users?.data ?? [] as user (user.username)}
							<a href="/profile/{user.username}" on:click={() => (open = false)}>
								<div class="hover:bg-gray-200 p-2 flex gap-2 items-center">
									<img
										class="w-8 aspect-square rounded object-cover object-top border"
										src={user.images?.webp?.image_url}
										alt={user.username}
									/>
									<div
										class="text-sm text-primary-800 font-medium whitespace-nowrap overflow-ellipsis overflow-hidden"
									>
										{user.username}
									</div>
								</div>
							</a>
						{/each}
						{#if !users?.data?.length}
							<div class="text-sm text-gray-400 p-2">No user found.</div>
						{/if}
					{:else}
						<div class="flex justify-center py-3">
							<Spinner />
						</div>
					{/if}
				{:else}
					<div class="text-sm text-gray-400 p-2">No user found.</div>
				{/if}
			</div>
		</div>
	</div>
</div>
