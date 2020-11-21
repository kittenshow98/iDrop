document.addEventListener('DOMContentLoaded', function () {
  const signin = document.getElementById("signinButton");
  signin.addEventListener('click', function () {
     // const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
     // console.log(googleUser);
     auth2.grantOfflineAccess().then(signInCallback);
  });

  var userId = "userId";

  function signInCallback(authResult) {
      console.log(authResult);

      if (authResult['code']) {

          // Hide the sign-in button now that the user is authorized, for example:
          // signin.attr('style', 'display: none');
          document.querySelector("#signinButton").style.display = 'none';

          let req = JSON.stringify({});
          // Send the code to the server
          ajax('POST', "/storeauthcode?code="+authResult['code'], req,
              function (res) {
                  userId = res;
                  sessionStorage.setItem("userId", userId);
              },
              // failed callback
            function() {
                  showErrorMessage('Something went wrong while login in.');
              });
      } else {
        // There was an error.
      }
  }


  /**
   * AJAX helper
   *
   * @param method -
   *            GET|POST|PUT|DELETE
   * @param url -
   *            API end point
   * @param callback -
   *            This the successful callback
   * @param errorHandler -
   *            This is the failed callback
   */
  function ajax(method, url, data, callback, errorHandler) {
      var xhr = new XMLHttpRequest();

      xhr.open(method, url, true);

      xhr.onload = function() {
          if (xhr.status === 200) {
              callback(xhr.responseText);
          } else {
              errorHandler();
          }
      };

      xhr.onerror = function() {
          console.error("The request couldn't be completed.");
          errorHandler();
      };

      if (data === null) {
          xhr.send();
      } else {
          xhr.setRequestHeader("Content-Type",
              "application/json;charset=utf-8");
          xhr.send(data);
    }
  }
});
module.exports = ajax;