import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({action}) => {
	action('items.create', (item) => {
		console.log('Create nuevo Item! para ver', {
			item
		});
		// codigo para ejecutar el script
		var args = 'scriptwp.py --url '+item.payload.url+' --correo '+ item.payload.correo; 
		const execSync = require('child_process').execSync; 
		execSync('python3 '+args,{encoding:'utf-8'});
	});
});
