use/create db:
use blog

show collections:
show collections

delete collection:
db.author.drop()

stats:
db.author.find({
	"age": {$lt: 23}
}).explain("ewecutionStats")

indexes:
db.author.ensureIndex({"age": 1})
db.author.getIndexes()
db.author.dropIndex({"age": 1})

aggregate:
db.authors.aggregate({
	$group: "$gender",
	total: {$sum: 1}
})
db.authors.aggregate({
	$group: "$gender",
	avgAge: {$avg: "$age"}
})

show all notes in collection:
db.author.find().pretty()

CRUD operations:
db.author.insert();