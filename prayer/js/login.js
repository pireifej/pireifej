$( document ).ready(function() {
    window.god = window.god || {};
    var user = $.urlParam('user');
    var access = $.urlParam('access');
    if (user) {
	god.notify("New user profile created.", "success");
    }
    if (access) {
	god.notify("Need to login first.", "error");
    }
    
    if (localStorage.getItem("userId")) {
	window.location.href = "profile.html";
    }

    $("#login").submit(function(e) {
	e.preventDefault();
	console.log("login");
	var formValues = $("#login").serializeArray();
	console.log(formValues);
	var username = formValues[0].value;
	var password = formValues[1].value;

	if (!username || !password) {
	    god.notify("Both username and password are required.", "error");
	    return;
	}
	
//	var encrypted = CryptoJS.AES.encrypt('Message', 'Secret Passphrase');
//	var plaintexte = encrypted.toString();
//	var decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase');
//	var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

	params = {
	    command: 'login',
	    jsonpCallback: 'afterLogin',
	    userName: username,
	    password: password
	};
	god.sendQuery(params);
    })

    window.afterLogin = function(response) {
	console.log('afterLogin success');
	console.log(response);
	if (response.result.length == 0) {
	    god.notify("Wrong username or password.", "error");
	} else {
	    var user = response.result[0];
	    localStorage.setItem("userId", user.user_id);
	    window.location.href = "profile.html?login=true";
	}
    }
});
