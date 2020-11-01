sessionStorage.type;
sessionStorage.email;
var form1 = $('#form1');
form1.submit(function () {
    $.ajax({
        type: form1.attr('method'),
        url: form1.attr('action'),
        data: form1.serialize(),
        success: function (data) {
            console.log(JSON.parse(data));
            var type = $('input[name="type"]:checked').val();
            console.log(type);
            if (data != "false") {
                sessionStorage.type = type;
                sessionStorage.email = $('#LogInName').val();
                if (type == 'S')
                    window.location.href = "student.html";
                else if (type == 'A')
                    window.location.href = "admin.html";
                else if (type == 'H')
                    window.location.href = "handyman.html";
            }
            else {
                document.getElementById("alert-box").innerHTML = "Wrong Email, Password or UserType";
                document.getElementById("alert-box").className = "alert alert-danger";
                document.getElementById("alert-box").style.visibility = "visible";
                $('#alert-box').fadeIn('slow').delay(2000);
                $('#alert-box').fadeOut('slow').delay(2000);
            }
        }
    });
    return false;
});

var form2 = $('#form2');
form2.submit(function () {
    $.ajax({
        type: form2.attr('method'),
        url: form2.attr('action'),
        data: form2.serialize(),
        success: function (data) {
            console.log(data);
            if (data == "true") {
                document.getElementById("alert-box").innerHTML = "Successfully Registered";
                document.getElementById("alert-box").className = "alert alert-success";
                document.getElementById("alert-box").style.visibility = "visible";
                $('#alert-box').fadeIn('slow').delay(2000);
                $('#alert-box').fadeOut('slow').delay(2000);
            }
            else {
                document.getElementById("alert-box").innerHTML = "Check feilds";
                document.getElementById("alert-box").className = "alert alert-danger";
                document.getElementById("alert-box").style.visibility = "visible";
                $('#alert-box').fadeIn('slow').delay(2000);
                $('#alert-box').fadeOut('slow').delay(2000);
            }
        }
    });
    return false;
});

$.ajax({
    type: 'get',
    url: '/adminGetIndexPageData',
    success: function (data) {
        data = JSON.parse(data);
        if (data.email)
            $("#adminEmail").html(data.email);
        if (data.phone)
            $("#adminPhone").html(data.phone);

    }
});

$("#toggleSign").click(function () {
    if ($("#buttonText").html() == "Already Registered") {
        $("#form2").fadeOut(300).promise().done(function () {
            $("#form1").fadeIn(300);
        });
        $("#sign").fadeOut(300).promise().done(function () {
            $("#sign").html("Sign In");
            $("#sign").fadeIn(300);
        });
        $("#buttonText").fadeOut(300).promise().done(function () {
            $("#buttonText").html("Get Registered");
            $("#buttonText").fadeIn(300);
        });
    }
    else {
        $('#form1').fadeOut(300).promise().done(function () {
            $("#form2").fadeIn(300);
        });
        $("#sign").fadeOut(300).promise().done(function () {
            $("#sign").html("Sign Up");
            $("#sign").fadeIn(300);
        });
        $("#buttonText").fadeOut(300).promise().done(function () {
            $("#buttonText").html("Already Registered");
            $("#buttonText").fadeIn(300);
        });
    }
});