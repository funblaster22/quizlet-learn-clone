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
		padding: 1em;
		max-width: 848px;
		margin: 0 auto;

		/* Perfect centering */
		display: flex;
		justify-content: center;
		height: 100vh;
		box-sizing: border-box;
		align-items: center;
	}
</style>