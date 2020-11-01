
	//console.log(sessionStorage.sess);
	$('[name="dashBoardButtons"]').click(function () {
		$('[name="dashBoardButtons"]').removeClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
		$(this).addClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
		$('[name="commonDivName"]').addClass('w3-hide');
		$('[name="commonDivName"]').removeClass('w3-animate-zoom');
		$($(this).attr('href')).removeClass('w3-hide').addClass('w3-animate-zoom');
	});

	$('#infoButton').addClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
	$('[name="commonDivName"]').addClass('w3-hide');
	$('[name="commonDivName"]').removeClass('w3-animate-zoom');
	$('#infoDiv').removeClass('w3-hide').addClass('w3-animate-zoom');


	$('#workButton').click(function () {
		$.ajax({
			type: 'get',
			url: '/handyManGetWork',
			data: {
				'handyman_id': $('#handyman_id').val()
			},
			success: function (data) {
				if (data == "false") {
					return;
				}
				data = JSON.parse(data);
				//console.log(data);
				$('[id="workDivChildSlot"]').html('');
				for (i in data) {
					if (data[i].time_slot == "10 AM - 12 PM")
						createWork("workDivChildSlot1", data[i]);
					else if (data[i].time_slot == "1 PM - 3 PM")
						createWork("workDivChildSlot2", data[i]);
					else if (data[i].time_slot == "4 PM - 6 PM")
						createWork("workDivChildSlot3", data[i]);
				}
			},
			complete: function () {
				$('[id^="solved"]').click(function () {
					$('#otp_id').val($(this).attr("id").split("_")[1]);
					$('#id01').css('display', 'block');
				});
				for (var i = 1; i <= 3; ++i)
					if ($("#workDivChildSlot" + String(i)).html() == "") {
						$("#workDivChildSlot" + String(i)).append(
							'<div style="width:90%"><h4 class="w3-center fontAudiowide w3-text-grey">NO WORK TODAY IN THIS SLOT</h4></div>'
						);
					}
			}
		});
	});

	$(document).ready(function () {
		$('#infoButton').trigger('click');
	});

	$("#infoButton").click(function () {
		$.ajax({
			type: 'get',
			url: '/getData',
			data: {
				'email': sessionStorage.email,
				'type': sessionStorage.type
			},
			success: function (data) {
				//console.log(data);
				if (data == "false")
					window.location.href = "./";
				else {
					var value = JSON.parse(data);
					//console.log(value);
					$("#userName").html("&nbsp;&nbsp;&nbsp;&nbsp;" + value[0].name);

					$("#handyman_id").val(value[0].handyman_id);
					////console.log("aaa "+$("#student_id").val());
					$("#actype").html("&nbsp;&nbsp; HandyMan");
					$("#catagory").html("&nbsp;&nbsp; " + value[0].Catagory);

					$("#email").html("&nbsp;&nbsp; " + value[0].email);
					$("#mobile").html("&nbsp;&nbsp; " + value[0].phone_no);
					$("#complaintsRegistered").html(value[0].issued);
					$("#complaintsSolved").html(value[0].solved);
					$("#complaintsPending").html(value[0].issued - value[0].solved);
					var totalToday = value[0].slot1 + value[0].slot2 + value[0].slot3;
					$("#todayComplaintsRegistered").html(totalToday);
					$("#todayComplaintsSolved").html(value[0].today);
					$("#todayComplaintsPending").html(totalToday - value[0].today);
				}
			}
		});
	});

	$('#otpSolved').click(function () {
		$.ajax({
			url: '/handyManComplaintSolved',
			type: 'get',
			timeout: 5000,
			data: {
				'otp': $('#otp_value').val(),
				'complaint_id': $('#otp_id').val(),
				'handyman_id': $("#handyman_id").val()
			},
			success: function (data) {
				//console.log(data);
				if (data == "false") {
					alert("Try Again");
				}
				else if (data == "Wrong OTP") {
					alert("Wrong OTP");
				}
				else {
					$("#workButton").trigger("click");
					modal.style.display = "none";
					$('#otp_value').val("");
				}
			},
			error: function (jqXHR, textStatus) {
				if (textStatus === 'timeout') {
					alert('TimeOut Try Again');
				}
			}
		});
	});

	$('#changeInfoButton').click(function () {
		var passw = /[^A-Za-z0-9!@_]/;
		if ($("#old_pass").val().match(passw) || $("#new_pass").val().match(passw)) {
			alert("A-Z a-z 0-9 and !@_ are allowed");
			return false;
		}
		else if ($("#old_pass").val().length > 15 || $("#old_pass").val().length < 7 || $("#new_pass").val().length > 15 || $("#new_pass").val().length < 7) {
			alert("password length must be between 7-15");
			return false;
		}
		else if ($("#new_pass").val() != $("#new_re_pass").val()) {
			alert("Re-Enter password wrong");
			return false;
		}
		$.ajax({
			type: 'get',
			url: '/changeHandymanPass',
			data: {
				"handyman_id": $("#handyman_id").val(),
				"old_Pass": $("#old_pass").val(),
				"new_Pass": $("#new_pass").val()
			},
			success: function (data) {
				if (data == "old") {
					alert("Wrong Old Password");
					return false;
				}
				if (data == "false") {
					alert("Something went wrong, Try Again");
					return false;
				}
				else {
					alert("updated Successfully");
					$("#old_pass").val("");
					$("#new_pass").val("");
					$("#new_re_pass").val("");
					$("#new_phone_no").val("");
					return true;
				}

			}
		});
	});

	$("#changePhoneButton").click(function () {
		if ($("#new_phone_no").val().length != 10) {
			alert("Must be of 10 digit");
			return false;
		}
		$.ajax({
			type: 'get',
			url: '/changeHandymanPhone',
			data: {
				"handyman_id": $("#handyman_id").val(),
				"new_phone": $("#new_phone_no").val(),
			},
			success: function (data) {
				if (data == "false") {
					alert("Something went wrong, Try Again");
					return false;
				}
				else {
					alert("updated Successfully");
					$("#old_pass").val("");
					$("#new_pass").val("");
					$("#new_re_pass").val("");
					$("#new_phone_no").val("");
					return true;
				}
			}
		});
	})

	$('#logoutButton').click(function () {
		$.ajax({
			type: 'get',
			url: '/logout',
			success: function (data) {
				if (data == "true") {
					window.location.href = "./";
				}
			}
		});
	});


	var modal = document.getElementById('id01');

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
			$('#otp_value').val("");
		}
	}

	function closeModal(data) {
		document.getElementById(data).style.display = 'none';
		$("#otpSolved").html("Submit");
		$("#otpSolved").attr("disabled", false);
		$("#otp_id").val("");
		$("#otp_value").val("");
	}


	$("#historyButton").click(function () {
		//console.log($('#historySelectType').val());
		$.ajax({
			type: 'get',
			url: '/handyManComplaintHistory',
			data: {
				'handyman_id': $('#handyman_id').val(),
				'type': $('#historySelectType').val()
			},
			success: function (data) {
				data = JSON.parse(data);
				//console.log(data);
				$("#historyDivChild").html("");
				for (var i = 0; i < data.length; ++i) {
					createWork('historyDivChild', data[i], true);
				}
				$("[name='commmonSolvedComplaintDivName']").html("");
			}
		});
	});


	function createWork(slot, data, flag) {
		$("#" + slot).append(
			'<div class=" w3-panel w3-white" id="panel_' + data.complaint_id + '">' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-calendar w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Date: &nbsp;</b></span><span>' + data.date.split("T")[0] + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-clock-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Time: &nbsp;</b></span><span >' + data.date.split("T")[1].split(".")[0] + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-lightbulb-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Euipment: &nbsp;</b></span><span >' + data.subject + '</span></h6>' +
			'</div>' +
			'</div>' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-id-badge w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>C_Id: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.complaint_id + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'	<h5><span class="fa fa-list-ul w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Type: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.type + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'	<h5><span class="fa fa-user-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Assistance: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.catagory + '</span></span></h6>' +
			'</div>' +
			'</div>' +
			'<div class="w3-row">' +
			'	<div class="w3-third fontSourceSansPro">' +
			'		<h5><span class="fa fa-home w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Room: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.gender + ' ' + data.room_no + '</span></h6>' +
			'	</div>' +
			'	<div class="w3-third fontSourceSansPro">' +
			'		<h5><span class="fa fa-inr w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Cost: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.cost + '</span></h6>' +
			'	</div>' +
			'	<div class="w3-third fontSourceSansPro w3-dropdown-hover">' +
			'		<h5><span class="fa fa-pencil w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Description: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.description + '</span></h6>' +
			'		<div class="w3-dropdown-content w3-card-4" >' +
			'  <div class="w3-container">' +
			'    <p>' + data.descriptionFull + '</p>' +
			'  </div>' +
			' </div>' +
			'</div>' +
			'</div>' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-phone w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Phone_no &nbsp;</b></span><span ><span class="w3-rest"> ' + data.phone_no + '</span></h6>' +
			'</div>' +
			'<div class="w3-col m5 s5 fontSourceSansPro">' +
			'<h5><span class="fa fa-envolope-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Email: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.email + '</span></h6>' +
			'</div>' +
			'<div class="w3-right w3-rest" name="commmonSolvedComplaintDivName">' +
			'<input type="button" id="solved_' + data.complaint_id + '" class="w3-button w3-flat-belize-hole w3-hover-blue" style="margin-bottom:10px" value="Solved">' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		if (flag == true) {
			if (data.status == 2)
				$("#panel_" + data.complaint_id).addClass('w3-border-blue w3-rightbar');
			else if (data.status == 3)
				$("#panel_" + data.complaint_id).addClass('w3-border-green w3-rightbar');
			else if (data.status == 1)
				$("#panel_" + data.complaint_id).addClass('w3-border-yellow w3-rightbar');
		}
	}
