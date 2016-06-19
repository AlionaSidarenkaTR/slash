let StoreComponent = require('../../src/store.js');
let	dbName = 'newStore';
let	Store = new StoreComponent(dbName);

let StorageSpecComponent = require('./../components/StorageSpecComponent');
StorageSpecComponent = new StorageSpecComponent();

describe('[STORE COMPONENT]', () => {
	let callback;

	beforeAll(() => {
		localStorage.clear();
	});
	beforeEach(() => {
		callback = jasmine.createSpy('callback');
	});
	afterAll(() => localStorage.clear());

	it('should check for store params', function() {
		let localStorageData = {
			todos:[]
		};

		expect(localStorage[dbName]).toBeUndefined();

		Store = new StoreComponent(dbName);
		expect(Store._dbName).toBe(dbName);
		expect(JSON.parse(localStorage[dbName])).toEqual(localStorageData);

		Store = new StoreComponent(dbName, callback);
		expect(callback).toHaveBeenCalledWith(localStorageData);
	});

	describe('[SAVE METHOD]', function() {
		let newToDo = {
			title: 'doSmth',
			completed: false
		};
		it('should check for save a new item', function() {
			Store.save(newToDo, callback);
			let toDos = StorageSpecComponent.getToDos(dbName);
			let myToDo = toDos.find((todo) => todo.title === newToDo.title);

			expect(myToDo).toBeDefined();
			expect(myToDo.id).toEqual(jasmine.any(Number));
			expect(callback).toHaveBeenCalled();
		});

		it('should check for updating an existing item', function() {
			let toDos = StorageSpecComponent.getToDos(dbName);
			let myToDo = toDos.find((todo) => todo.title === newToDo.title);
			let updatedData = {
				title: 'done',
				completed: true
			};
			Store.save(updatedData, callback, myToDo.id);

			toDos = StorageSpecComponent.getToDos(dbName);;
			myToDo = toDos.find((todo) => todo.title === updatedData.title);

			expect(myToDo).toBeDefined();
			expect(myToDo.completed).toBeTruthy();
			expect(toDos.length).toBe(1);
			expect(callback).toHaveBeenCalled();
		});
	});

	it('should check for find functionality', function() {
		let toDos = StorageSpecComponent.getToDos(dbName);
		let myToDo = toDos[0];

		Store.find(myToDo, callback);
		expect(callback).toHaveBeenCalledWith([myToDo]);

		myToDo.title = new Date().getTime();

		Store.find(myToDo, callback);
		expect(callback).toHaveBeenCalledWith([]);
	});

	it('should check for findAll functionality', function() {
		let toDos = StorageSpecComponent.getToDos(dbName);
		Store.findAll(callback);
		expect(callback).toHaveBeenCalledWith(toDos);
	});

	it('should check for remove functionality', function() {
		let toDos = StorageSpecComponent.getToDos(dbName);
		let myToDo = toDos[0];
		expect(toDos.length).toBe(1);

		Store.remove(myToDo.id, callback);
		toDos = StorageSpecComponent.getToDos(dbName);
		expect(toDos.length).toBe(0);
		expect(callback).toHaveBeenCalledWith([]);
	});

	it('should check for drop functionality', function() {
		let newToDo = {
			title: 'doSmth',
			completed: false
		};

		Store.save(newToDo, callback);
		let toDos = StorageSpecComponent.getToDos(dbName);
		expect(toDos.length).toBe(1);

		Store.drop(callback);
		toDos = StorageSpecComponent.getToDos(dbName);
		expect(toDos.length).toBe(0);
		expect(callback).toHaveBeenCalledWith([]);
	});
});