let $$state,
    $$cookieStore;

class SessionService {
	constructor($cookieStore, $state) {
		$$state = $state;
        $$cookieStore = $cookieStore;
	}

	auth(state, user) {
        if (state === 'failure') {
            this.resetSession();
        } else {
            $$cookieStore.put('userId', user._id);
            $$cookieStore.put('loggedIn', true);

            delete user.password;

            this.currentUser = user;
            this.isLoggedIn = true;

            $$state.go('ARTICLES');
        }
    }

    logout() {
        this.resetSession();

        $$state.go('HOME');
    }

    resetSession() {
        this.currentUser = null;
        this.isLoggedIn = false;

        $$cookieStore.put('loggedIn', false);
        $$cookieStore.remove('userId');
    }
}

export default SessionService;