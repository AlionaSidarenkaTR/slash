module.exports = class StorageSpecComponent {
	getToDos(dbName) {
		return JSON.parse(localStorage[dbName]).todos;
	}
};
