<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let fields = ['address_components', 'geometry', 'name', 'formatted_address'];

	export let types = ['address'];
	export let error = false;
	export let selectedCountry = '';
	export let value = '';
	export let placeholder = '';

	const dispatcher = createEventDispatcher();
	const PUBLIC_GOOGLE_MAPS_API_KEY = 'AIzaSyBf-kthZODj2EulytRBdkmFvDrjUczybds';

	let autocomplete;
	let inputElement;

	$: countries = selectedCountry ? [selectedCountry.toLowerCase()] : ['us'];

	function onPlaceChange() {
		if (!autocomplete) return;

		const place = autocomplete.getPlace();
		const { address_components: components, formatted_address } = place;

		const parsedValue = {
			postalCode: '',
			country: '',
			countryCode: '',
			city: '',
			city_code: '',
			state: '',
			formatted_address
		};

		components?.forEach(({ long_name: longName, short_name: shortName, types }) => {
			if (types.includes('street_number')) {
				parsedValue.address = longName;
			} else if (types.includes('route')) {
				parsedValue.address += ` ${longName}`;
			} else if (types.includes('postal_code')) {
				parsedValue.postalCode = longName;
			} else if (types.includes('country')) {
				parsedValue.countryCode = shortName;
				parsedValue.country = longName;
			} else if (types.includes('administrative_area_level_1')) {
				parsedValue.state = longName;
			} else if (types.includes('locality')) {
				parsedValue.city = longName;
			}
		});

		dispatcher('input', parsedValue);
		dispatcher('change', parsedValue);
		dispatcher('place-changed', parsedValue);
	}

	const loadGoogleMapsSDK = () =>
		new Promise((resolve, reject) => {
			if (window.google && window.google.maps && window.google.maps.places) {
				resolve();
			} else {
				const script = document.createElement('script');
				script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
				script.async = true;
				script.defer = true;
				script.onload = resolve;
				script.onerror = () => reject(new Error('Failed to load Google Maps SDK'));
				document.head.appendChild(script);
			}
		});

	onMount(async () => {
		try {
			await loadGoogleMapsSDK();

			if (inputElement) {
				autocomplete = new google.maps.places.Autocomplete(inputElement, {
					fields,
					types
				});
				autocomplete.setComponentRestrictions({ country: countries });
				autocomplete.addListener('place_changed', onPlaceChange);
			}
		} catch (error) {
			console.error('Error initializing Google Maps Autocomplete:', error);
		}

		return () => {
			if (autocomplete) {
				google.maps.event.clearInstanceListeners(autocomplete);
			}
		};
	});
</script>

<div>
	<input
		{placeholder}
		bind:this={inputElement}
		class={`w-full p-4 bg-neutral-100 text-neutral-500 border rounded-md ${
			error ? 'border-red-500' : 'border-gray-300'
		}`}
		autocomplete="off"
		{value}
		on:blur={(e) => dispatcher('blur', e)}
		on:focus={(e) => dispatcher('focus', e)}
	/>
</div>
