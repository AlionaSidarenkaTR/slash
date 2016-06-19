1) CREATE DB:
use blog;

2) CREATE COLLECTIONS:
	2.1)import data from JSON (open new command line):

	mongoimport --db blog --collection author --type json --file "d:\front_camp_project\es2015\mongodb\authors.json" --jsonArray
	mongoimport --db blog --collection category --type json --file "d:\front_camp_project\es2015\mongodb\categories.json" --jsonArray
	mongoimport --db blog --collection tag --type json --file "d:\front_camp_project\es2015\mongodb\tags.json" --jsonArray
	mongoimport --db blog --collection comment --type json --file "d:\front_camp_project\es2015\mongodb\comments.json" --jsonArray
	mongoimport --db blog --collection article --type json --file "d:\front_camp_project\es2015\mongodb\articles.json" --jsonArray


	2.2) CRUD operations:
		2.2.1) Read operations:
			db.author.find({
				age: {$gt: 20},
				gender: "male"
			}, {
				name: 1,
				_id: 0
			}).limit(3).sort({name: 1}).pretty();

			db.tag.findOne({"name": "games"});
		2.2.2) Write operations:
			a) INSERT:
				db.tag.insertOne({"name": "innovation"});\
				db.category.insertMany([
					{name: "politics"},
					{name: "medicine"}
				]);
				db.author.insert([{
					"name": "Galina Nikolaevich",
					"age": 23,
					"gender": "female",
					"email": "galina_nikolaevich@gmail.com",
					"password": "sdfsfwqfewfqw",
					"created_at": "20/01/2010"
				}, {
					"name": "Mikalai Samakatin",
					"age": 24,
					"gender": "male",
					"email": "mikalai_samakatin@gmail.com",
					"password": "asdasdsadas",
					"created_at": "11/08/2014"
				}]);
			b) UPDATE:
				db.category.updateOne(
					{name: "finance"},
					{$set: {name: "money"}}
				);
				db.article.updateMany(
					{created_at: "21/05/2016"},
					{$set: {status: 1}}
				);
				db.tag.replaceOne(
					{name: "country"},
					{name: "motherland"},
					{upsert: true}
				);
				db.tag.findOneAndReplace(
					{name: "future" },
					{name: "tomorrow"},
					{sort: {"name" : 1 }, project: {"_id" : 0, "name": 1}}
				);
				try {
					db.tag.findOneAndReplace(
						{name: "security" },
						{name: "not_a_wolf"},
						{maxTimeMS: 0},
						{sort: {"name" : 1 }, project: {"_id": 0, "name": 1}}
					)
				} catch(e){
					print(e);
				};
			c) DELETE:
				db.author.deleteOne(
					{gender: "male"}
				);
				db.author.remove(
					{gender: "female"},
					{justOne: true}
				);
				db.article.deleteMany(
					{author_id: "574193003d2cb16bb2d1b19a"}
				);
				db.author.findOneAndDelete(
					{email: "nikita_alejnikau@mail.ru"},
					{sort: {"age": 1}, projection: {"name": 1, "_id": 0}}
				);
				db.tag.bulkWrite([
					{insertOne: {document: {name: "security"}}},
					{updateMany: {
						filter: {name: "security"},
						update: {$set: {"status": "used"}}
					}},
					{deleteMany: {filter: {status: {$exists: false}}}}
				]);

3) CREATE INDECIES:
	db.author.ensureIndex({"age": 1});
	db.tag.ensureIndex({"name": 1});
	db.collection.ensureIndex({"name": 1});

4) mongoimport --db class --collection grades --type json --file "d:\front_camp_project\es2015\mongodb\grades.json" --jsonArray
	db.grades.aggregate([
		{$unwind: "$scores"},
		{$match: {"scores.type": {$ne: "quiz"}}},
		{$group: {_id: "$class_id", AvgScore: {$avg: "$scores.score"}}},
		{$project: {Class: "$id", AvgNonQuizScore: "$AvgScore"}},
		{$sort: {AvgNonQuizScore: -1}}
	])

5)mongod --storageEngine=mmapv1 --port 27017 --dbpath "\data\db" --replSet rs0
mongod --storageEngine=mmapv1 --port 27018 --dbpath "\data\db1" --replSet rs0
mongod --storageEngine=mmapv1 --port 27019 --dbpath "\data\db2" --replSet rs0

rs.initiate() in mongo shell