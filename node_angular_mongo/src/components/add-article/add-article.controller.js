import {jqueryForm} from 'jquery-form';

let $$state;

class AddArticleController {
	constructor($state) {
		$$state = $state;
	}

	addNewArticle(event) {
		event.preventDefault();

		$('[name=newArticleForm]').ajaxSubmit({
            error: function(xhr) {
        		console.log('Error: ' + xhr.status);
            },
            uploadProgress: function(event, position, total, percentCompleted) {
            	console.log(percentCompleted);
            },
            type: 'POST',
            url: 'all/add',
            success: function(response) {
                $$state.go('ARTICLES');
            }
	    });
	}
}

export default AddArticleController;