class Helper {
	static formatDate(date) {
    	let newDate = new Date(date);

    	return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
	};
}

export default Helper;
