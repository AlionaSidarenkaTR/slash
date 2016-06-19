module.exports = function(source) {
	this.cacheable && this.cacheable();
	var valueToTransform = typeof source === "string" ? JSON.parse(source) : source;
	this.value = [valueToTransform];

	var replacer = function(key, value) {
		if (typeof value === "number") {
			delete valueToTransform[key];
		} else {
			return value;
		}
	};

	return JSON.stringify(valueToTransform, replacer, "\t");
}
