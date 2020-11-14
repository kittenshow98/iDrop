document.addEventListener('DOMContentLoaded', function () {
    const form = {
        bookName: document.getElementById("book_name"),
        groupName: document.getElementById("group_name"),
        beginDate: document.getElementById("begin_date"),
        groupSize: document.getElementById("group_size"),
        groupDescription: document.getElementById("group_description"),
        submit: document.getElementById("host_submit"),
        messages: document.getElementById("form-messages")
    };

    form.submit.addEventListener('click', function () {
        let req = JSON.stringify({});
        let param = '?bookName='+form.bookName.value+'&groupName='+form.groupName.value+
        '&beginDate='+form.beginDate.value+'&groupSize='+form.beginDate.value+'&groupDescription='+form.groupDescription.value;
        console.log(param);
        ajax('POST',
            '/hostGroup'+param,
            req,
            // successful callback
            function(res) {
                // var items = JSON.parse(res);
                if(res === "sent"){
                    location.href='success.html';
                }
            },
            // failed callback
            function() {
                showErrorMessage('Cannot submit items.');
            });
    });

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