(function() {
	var timeLeft;
	var stage = 0;
	var score = 0;
	var cardsCount; // quantity of cards in field
	var levelResult; 
	var timer = null; // timer for opening two cards
	var initialScore; // score before the level started
	var popupWrapper;
	var pauseElement;
	var gameContainer;
	var restartButton;
	var timerInterval;
	var catAudioElement;
	var winAudioElement;
	var timeCountElement;
	var popupInnerElement;
	var stageCountElement;
	var scoreCountElement;
	var clickAudioElement;
	var looseAudioElement;
	var imagesInStorage = 60;
	var indexOfOpenedCard = -1;
	var openedCardsIndexes = [];
	var infiniteSoundAudioElement;
	var stages = [{
			x: 2, y: 2, time: 10
		}, {
			x: 4, y: 3, time: 30
		}, {
			x: 4, y: 3, time: 25
		}, {
			x: 6, y: 3, time: 40
		}, {
			x: 6, y: 3, time: 30
		}];
	var popupInner = {
		startHint: {
			mainText: 'Combain the pair of the same images to remove them from the game. \
				Combain these pairs before the time runs out. Good luck.',
			buttonText: 'PLAY'
		},
		win: {
			mainText: 'Congratulations, time bonus is <div data-timebonus=0 class=timebonus></div>',
			buttonText: 'NEXT LEVEL'
		},
		loose: {
			mainText: 'You loose',
			buttonText: 'REPLAY'
		},
		enterName: {
			mainText: 'Congratulations, you won! <div class=for-input><input class=winner-name \
				type=text value=\'\'></div>',
			buttonText: 'enter Name',
			className: 'enter-name'
		}
	};

	function init() {
		drawStartLayoutAndHint();
		drawAside();
	}

	function drawStartLayoutAndHint() {
		var volume;

		document.body.innerHTML+= 
			'<header><div class=logo></div><div class=logo-text></div><i class="fa fa-volume-up fa-lg"></i>\
			<audio id=infinite-sound loop=loop autoplay=autoplay><source src=\'sounds\/background.mp3\'>\</audio>\
			<audio id=click-sound><source src=\'sounds\/click.mp3\'></audio><audio id=cat-sound><source src=\'sounds\/cat.mp3\'></audio>\
			<audio id=win-sound><source src=\'sounds\/win.mp3\'></audio><audio id=loose-sound><source src=\'sounds\/loose.mp3\'></audio>\
			</header><div class=layout></div><div class=\'popup-wrapper display\'><div class=popup>' + 
			createPopupTemplate('startHint') + '</div></div>';

		popupInnerElement = document.querySelector('.popup');
		catAudioElement = document.querySelector('#cat-sound');
		winAudioElement = document.querySelector('#win-sound');
		popupWrapper = document.querySelector('.popup-wrapper');
		clickAudioElement = document.querySelector('#click-sound');
		looseAudioElement = document.querySelector('#loose-sound');
		infiniteSoundAudioElement = document.querySelector('#infinite-sound');
		volume = document.querySelector('[class*=fa-volume]');

		volume.addEventListener('click', function() {
			if (!infiniteSoundAudioElement.paused) {
				infiniteSoundAudioElement.pause();
				volume.className = 'fa fa-volume-off fa-lg';
			} else {
				infiniteSoundAudioElement.play();
				volume.className = 'fa fa-volume-up fa-lg';
			}
		});
		popupWrapper.addEventListener('click', togglePopup);
	}

	function createPopupTemplate(version) {
		var className = popupInner[version].className || '';

		return '<div class=\'popup-text no-smooth-text\'>'
			+ popupInner[version].mainText + '</div><button class=\'button no-smooth-text play '
			+ className + '\'>' + popupInner[version].buttonText + '</button>';
	}

	function togglePopup(e) {
		if (containsClass('popup-wrapper', e) || containsClass('play', e)) {
			popupWrapper.classList.toggle('display');
			drawMainContainer();
		}
	}

	function drawAside() {
		var layoutContainer = document.querySelector('.layout');
		var pauseButton;
		timeLeft = stages[stage].time;

		layoutContainer.innerHTML+= 
			'<aside><button class=\'restart button\'>RESTART</button><button class=\'pause button\'>\
			<i class=\'fa fa-pause \'></i></button><div>SCORE</div><div data-score=' + 
			score + ' class=\'score\'></div><div>STAGE</div><div data-stage=' + (stage + 1) + 
			' class=stage></div><div class=time-label>TIME</div><div data-time=' + timeLeft +
			' class=\'time\'></div></aside><main></main>';
		
		scoreCountElement = document.querySelector('.score');
		timeCountElement = document.querySelector('.time');
		stageCountElement = document.querySelector('.stage');
		pauseButton = document.querySelector('.pause');
		pauseElement = document.querySelector('.fa-pause');
		restartButton = document.getElementsByClassName('restart')[0];

		pauseButton.addEventListener('click', function() {
			if (pauseElement.className.indexOf('pause') === -1) {
				pauseElement.className = 'fa fa-pause';
				startTimer(timeLeft);
				gameContainer.addEventListener('click', cardClickListener);
			} else {
				pauseElement.className = 'fa fa-play';
				clearInterval(timerInterval);
				gameContainer.removeEventListener('click', cardClickListener);
			}
		})
	}

	function drawMainContainer() {
		var cardWidth = 100;
		var cardsField = '';
		cardsCount = stages[stage].x * stages[stage].y;
		var arrayOfImagesIndexes = chooseRandomly(cardsCount, imagesInStorage);

		for (var i = 0; i < arrayOfImagesIndexes.length; i++) {
			cardsField+= '<li data-index=' + arrayOfImagesIndexes[i] + '><div class=\'face front\'></div>\
				<div class=\'face back\' style=\'background-image: url(' + './images/backs/' + 
				arrayOfImagesIndexes[i] + '.png' + ')\'></div></li>';
		}

		main = document.getElementsByTagName('main')[0];
		main.innerHTML = '<ul class=\'game-container\'></ul>';
		gameContainer = document.querySelector('.game-container');
		gameContainer.innerHTML = cardsField;
		gameContainer.style.width = (stages[stage].x * cardWidth) + 5 + 'px';
		gameContainer.addEventListener('click', cardClickListener);
		stageCountElement.dataset.stage = stage + 1;
		scoreCountElement.dataset.score = score;
		initialScore = score;
		startTimer();
		restartButton.addEventListener('click', restartButtonListener);
	}

	function restartButtonListener() {
		clearInterval(timerInterval);
		resetValues();
		score = initialScore;
		pauseElement.className = 'fa fa-pause';
		drawMainContainer();
	}

	function finalResultEventListener(finalInnerPopup) {
		var finalPopup = document.querySelector('.final');
		var finalPopupClassList;

		if (!finalPopup) {
			popupWrapper.innerHTML = '<div class=\'popup final decrease-popup\'>'+ 
				finalInnerPopup + '<button class=\'button ok\'>RESTART</button></div>';
			finalPopup = document.querySelector('.final');
		} else {
			finalPopup.innerHTML = finalInnerPopup + '<button class=\'button ok\'>RESTART</button>';
		}
		finalPopupClassList = finalPopup.classList;
		finalPopupClassList.toggle('decrease-popup');


		finalPopupClassList.toggle('increase');
		this.removeEventListener('webkitTransitionEnd', finalResultEventListener);
		okButton = document.body.querySelector('.ok');
		okButton.addEventListener('click', restartGameListener.bind(null, finalPopupClassList));
	}

	function resetValues() {
		timer = null;
		levelResult = '';
		indexOfOpenedCard = -1;
		openedCardsIndexes = [];
		gameContainer.innerHTML = '';
	}

	function restartGameListener(classList) {
		score = 0;
		stage = 0;
		resetValues();
		popupWrapper.classList.toggle('display');
		drawMainContainer();
		classList.toggle('decrease-popup');
		classList.toggle('increase');
		document.body.querySelectorAll('.popup-wrapper .popup')[0].classList.toggle('decrease-popup');
		okButton.removeEventListener('click', restartGameListener);
		popupWrapper.addEventListener('click', togglePopup);
	}

	function containsClass(className, e) {
		return e.target.className.indexOf(className) !== -1;
	}

	function formFinalTableOfPositions(results, winnerPlace, winnerObject) {
		var inFirstThreePlaces = false;
		var resultString = '';

		//check if the player among the first 3 places
		for (var i = 0; i < results.slice(0, 3).length; i++) {
			resultString+= '<li><span> Place: ' + (i + 1) + '</span><div class=\'name-final-table\'>\
				<span> name: ' + results[i].name + '</span></div><span>Score: </span>' 
				+ results[i].score + '</li>';

			if (!inFirstThreePlaces) {
				inFirstThreePlaces = results[i].name === winnerObject.name;
			}
		}

		//if the place is more than 3 add this line to results
		if (!inFirstThreePlaces) {
			resultString+= '<li><span> Place: ' + (winnerPlace + 1) + '</span><div \
			class=\'name-final-table\'><span> name: ' + winnerObject.name + '</span></div><span>Score: </span>'
			+ winnerObject.score + '</li>';
		}

		return '<ul>' + resultString + '</ul>';
	}

	function formObjForLocalStorage(results, winnerObject) {
		var winnerPlace;
		var exists;

		//check if this player already in results
		for (var i = 0; i < results.length; i++) {
			if (results[i].name === winnerObject.name) {
				if (results[i].score < winnerObject.score) {
					results[i].score = winnerObject.score;
				} 
				exists = true;
				break;
			}
		}

		!exists && results.push(winnerObject);

		//distribute players by places
		results.sort(function(a, b) {return b.score - a.score});

		//find player's place
		for (var i = 0; i < results.length; i++) {
			if (results[i].name === winnerObject.name) {
				winnerPlace = i;
				break;
			}
		}

		return {
			results: results, 
			winnerPlace: winnerPlace || 0
		};
	}

	function setDataToLocalStorage(e) {
		var popup;
		var results;
		var winnerName;
		var winnerPlace;
		var inputElement;
		var winnerObject;
		var finalInnerPopup;
		var retrievedObject;
		var objForLocalStorage;

		if (containsClass('enter-name', e)) {
			inputElement = document.querySelector('.winner-name');
			winnerName = inputElement.value;
			winnerObject = {name: winnerName, score: score};
			retrievedObject = localStorage.getItem('gameResults');

			if (!retrievedObject) {
				results = [winnerObject];
			} else {
				results = JSON.parse(retrievedObject);
				objForLocalStorage = formObjForLocalStorage(results, winnerObject);
				results = objForLocalStorage.results;
				winnerPlace = objForLocalStorage.winnerPlace;
			}

			finalInnerPopup = formFinalTableOfPositions(results, winnerPlace, winnerObject);
			popup = document.body.querySelectorAll('.popup')[0];
			
			//hide popup with name input
			popup.classList.add('decrease-popup');

			//show popup with final table of results
			popup.addEventListener('webkitTransitionEnd', finalResultEventListener.bind(popup, finalInnerPopup))
			localStorage.setItem('gameResults', JSON.stringify(results));
		}
	}

	function showLevelResultPopup(result) {
		var timeBonus;
		var submitButton;
		var timebonusElement;
		
		if (result === 'win') {
			//if sound doesn't switched off
			!infiniteSoundAudioElement.paused && winAudioElement.play();
			timeBonus = timeLeft * 5;
			score+= timeBonus;
		}
		popupInnerElement = document.querySelector('.popup');
		popupInnerElement.className = 'popup';

		//if all the game is won
		if (result === 'win' && (stage + 1) === stages.length) {
			scoreCountElement.dataset.score = score;
			popupInnerElement.innerHTML = createPopupTemplate('enterName');
			popupWrapper.removeEventListener('click', togglePopup);
			submitButton = document.querySelector('.enter-name');
			
			submitButton.addEventListener('click', setDataToLocalStorage);
		} else {
			popupInnerElement.innerHTML = createPopupTemplate(result);
			if (result === 'win') {
				timebonusElement = document.querySelector('.timebonus');
				timebonusElement.dataset.timebonus = timeBonus;
				stage++;
			} else {
				//if loose
				//if sound doesn't switched off
				!infiniteSoundAudioElement.paused && looseAudioElement.play();
			}
		}

		popupWrapper.classList.toggle('display');
		levelResult = '';
	}

	function checkGameResult() {
		clearInterval(timerInterval);
		gameContainer.classList.add('decrease');

		if (openedCardsIndexes.length === cardsCount) {
			levelResult = 'win';
		} else {
			levelResult = 'loose';
			score = initialScore;
		}

		restartButton.removeEventListener('click', restartButtonListener);
		indexOfOpenedCard = -1;
		openedCardsIndexes = [];
		timer = null;

		setTimeout(function() {
			gameContainer.removeEventListener('click', cardClickListener);
			gameContainer.innerHTML = '';
			showLevelResultPopup(levelResult);
			indexOfOpenedCard = -1;
		}, 2000);
	}

	function startTimer(timeToStart) {
		timeToStart = timeToStart || stages[stage].time;
		timeCountElement.dataset.time = timeToStart;
		timeLeft = timeToStart;

		timerInterval = setInterval(function() {
			timeLeft--;
			timeCountElement.dataset.time = timeLeft;
			if (timeLeft === 0 || timeLeft < 0) {
				!levelResult && checkGameResult();
			}
		}, 1000)
	}

	function cardClickListener(event) {
		var equal;
		var openCards;
		var parentClassList;
		var parent = event.target.parentElement;

		function timeOut(equal) {
			if (equal) {
				Array.prototype.forEach.call(openCards, function(item, index) {
					item.classList.remove('rotate');
					item.classList.add('disappear');
					!infiniteSoundAudioElement.paused && catAudioElement.play();
					if (openedCardsIndexes.length === cardsCount) {
						!levelResult && checkGameResult();
					}
				});
			} else {
				Array.prototype.forEach.call(openCards, function(item, index) {
					item.classList.remove('rotate');
				});
			}

			timer = null;
			indexOfOpenedCard = -1;
		}

		if (event.target.tagName === 'DIV' && openedCardsIndexes.indexOf(parent.dataset.index) === -1) {
			//if not sound is switched off
			!infiniteSoundAudioElement.paused && clickAudioElement.play();
			parentClassList = parent.classList;

			//if card is opened - close it
			if (parentClassList.contains('rotate')) {
				indexOfOpenedCard = -1;
				parentClassList.remove('rotate');
			} else if (!timer) {
				//if not 2 cards are already rotating
				parentClassList.add('rotate');

				//if this is first among opened cards
				if (indexOfOpenedCard === -1) {
					indexOfOpenedCard = parent.dataset.index;
				} else {
					//if this is second opened  card
					openCards = document.querySelectorAll('.rotate');
					var equal = indexOfOpenedCard === parent.dataset.index;

					if (equal) {
						score+= 10 * (stage + 1);
						scoreCountElement.dataset.score = score;
						
						Array.prototype.forEach.call(openCards, function(item, index) {
							openedCardsIndexes.push(indexOfOpenedCard);
						});
					}

					//set classes depending on equivalency results
					timer = setTimeout(timeOut.bind(null, equal), 500);
				}
			}
		}
	}

	function chooseRandomly(quantity, imagesInStorage) {
		var index;
		var arrayOfImagesIndexes = [];

		function getIndex() {
			var tempIndex = Math.floor(Math.random() * imagesInStorage);

			//if image is already chosen repeat the procedure
			while(arrayOfImagesIndexes.indexOf(tempIndex) !== -1) {
				tempIndex = Math.floor(Math.random() * imagesInStorage);
			}
			return tempIndex;
		}

		while (arrayOfImagesIndexes.length < quantity) {
			index = getIndex();
			arrayOfImagesIndexes.push(index);
			arrayOfImagesIndexes.push(index);
		}

		//randomize the result
		return arrayOfImagesIndexes.sort(function() {
		  return .5 - Math.random();
		});
	}

	init();
})()