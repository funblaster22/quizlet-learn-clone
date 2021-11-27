import App from './App.svelte';

// This doesn't provide any actual security against MITM attacks, but will prevent confusion with indexedDB
if (location.hostname !== "localhost" && location.protocol === 'http:')
	location.protocol = 'https:';

const app = new App({
	target: document.body
});

export default app;