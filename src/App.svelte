<script>
	import Controller from "./Controller.svelte";
	import SaveOffline from "./SaveOffline.svelte";
</script>

<main>
	<Controller />
</main>
<SaveOffline />

<style>
	main {
		text-align: center;
		padding: 0.5em;
		max-width: 848px;
		margin: 0 auto;

		/* Perfect centering */
		display: flex;
		justify-content: center;
		height: 100vh;
		align-items: center;
	}
</style>