export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "modules/echo/templates"
	];

	return loadTemplates(templatePaths);
}
