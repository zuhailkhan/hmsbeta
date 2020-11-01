	//console.log(sessionStorage);
	$('[name="dashBoardButtons"]').click(function () {
		$('[name="dashBoardButtons"]').removeClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
		$(this).addClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
		$('[name="commonDivName"]').addClass('w3-hide');
		$('[name="commonDivName"]').removeClass('w3-animate-zoom');
		$($(this).attr('href')).removeClass('w3-hide').addClass('w3-animate-zoom');
	});

	$('#lodgeButton').addClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
	$('[name="commonDivName"]').addClass('w3-hide');
	$('[name="commonDivName"]').removeClass('w3-animate-zoom');
	$('#historyDiv').removeClass('w3-hide').addClass('w3-animate-zoom');

	$("#feedbackSubmit").click(function () {
		$.ajax({
			type: 'get',
			url: '/userFeedback',
			data: {
				"rating": $("#rating").val(),
				"review": $("#review").val(),
				"id": $("#feedbackComplaintId").val()
			},
			success: function (data) {
				if (data == "true") {
					$("#feedbackSubmit").html("Thank You");
					$("#feedbackSubmit").attr("disabled", true);
					$("#historyButton").trigger("click");
				}
			}
		});
	});

	$("[name^='star']").mouseover(function () {
		var i = $(this).attr('name')[4];
		for (var j = 1; j <= i; j++) {
			$("[name='star" + j + "']").removeClass();
			$("[name='star" + j + "']").attr("class", "fa fa-star w3-text-blue");
			//console.log("sss "+j+"xxx "+i);

		}
		////console.log("HERE "+j+" "+i);
		for (var j = 5; j > i; j--) {
			$("[name='star" + j + "']").removeClass();
			$("[name='star" + j + "']").attr("class", "fa fa-star-o w3-text-blue");
		}
		$("#rating").val(i);
		//console.log($("#rating").val());
	});

	$("#historyButton").click(function () {
		//console.log("yes");
		$.ajax({
			type: 'get',
			url: '/userComplaintHistory',
			data: {
				"student_id": $("#student_id").val(),
				"type": $("#historySelectType").val()
			},
			success: function (data) {
				data = JSON.parse(data);
				//console.log(data);
				$("#historyDivChild").html("");
				for (var i = 0; i < data.length; ++i) {
					createHistory(data[i]);
				}
			},
			complete: function () {
				$('[id^="feedback"]').click(function () {
					$('#feedbackComplaintId').val($(this).attr("id").split("_")[1]);
					$('#id01').css('display', 'block');
				});
				if ($("#historyDivChild").html() == "") {
					$("#historyDivChild").append(
						'<div style="width:90%" class="w3-display-middle"><h3 class="w3-center fontAudiowide w3-text-grey">NO HISTORY HERE</h3></div>'
					);
				}
			}
		});
	});

	var lodge = $('#lodgeForm');
	lodge.submit(function () {
		$.ajax({
			type: lodge.attr('method'),
			url: lodge.attr('action'),
			data: lodge.serialize(),
			success: function (data) {
				if (data == "true") {
					// $("#container").fadeOut(function() {
					//   $(this).text("World").fadeIn();
					// });
					$("#submitLodge").fadeOut("slow", function () {
						$(this).val("Registered");
						$(this).prop("disabled", true);
					}).fadeIn("slow", function () {
					});
					setTimeout(function () {
						$("#submitLodge").fadeOut("slow", function () {
							$(this).val("Lodge");
							$(this).prop("disabled", false);
						}).fadeIn("slow", function () {
							var id = $("#student_id").val();
							$('#lodgeForm')[0].reset();
							$("#student_id").val(id);
							$('#equipment option').remove();
							$('#equipment').append('<option value="" disabled selected>Choose Equipment</option>');
						})
					}, 5000);
				}
			}
		});
		return false;
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

					$("#student_id").val(value[0].student_id);
					////console.log("aaa "+$("#student_id").val());
					$("#actype").html("&nbsp;&nbsp; Student");
					$("#hostel").html("&nbsp;&nbsp; " + value[0].gender + " " + value[0].room_no);
					$("#hostelParent").css("display", "block");
					$("#rollno").html("&nbsp;&nbsp; " + value[0].roll_no);
					$("#rollnoParent").css("display", "block");

					$("#email").html("&nbsp;&nbsp; " + value[0].email);
					$("#mobile").html("&nbsp;&nbsp; " + value[0].phone_no);
				}
			},
			complete: function (data) {
				$.ajax({
					type: 'get',
					url: '/userComplaintAnalytics',
					data: {
						'student_id': $('#student_id').val()
					},
					success: function (data) {
						data = JSON.parse(data);
						//console.log(data);
						if (data != "false") {
							$("#complaintsRegistered").html(data[0].total);
							if (data.length > 1) {
								$("#complaintsSolved").html(data[1].total);
								$("#complaintsPending").html(data[0].total - data[1].total);
							}
							else {
								$("#complaintsSolved").html(data[0].total);
								$("#complaintsPending").html(0);
							}
						}
					}
				});
			}
		});
	});

	var values = {};
	$("#type").change(function () {
		$.ajax({
			type: 'get',
			url: '/complaintHandymanType',
			data: {
				"type": $("#type").val()
			},
			success: function (data) {
				data = JSON.parse(data);
				values = {};
				for (var i = 0; i < data.length; ++i) {
					var temp = data[i].equipment;
					values[temp] = data[i].handman;
				}
				$('#equipment option').remove();
				$.each(values, function (i, items) {
					$('#equipment').append($('<option>', {
						text: i
					}));
				});
				$("#assistance").val(values[$("#equipment").val()]);
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
			url: '/changeStudentPass',
			data: {
				"student_id": $("#student_id").val(),
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
			url: '/changeStudentPhone',
			data: {
				"student_id": $("#student_id").val(),
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

	$("#equipment").change(function () {
		$("#assistance").val(values[$(this).val()]);
	});

	function closeModal(data) {
		document.getElementById(data).style.display = 'none';
		$("#feedbackSubmit").html("Submit");
		$("#feedbackSubmit").attr("disabled", false);
		$("[name^='star']").removeClass();
		$("[name^='star']").attr("class", "fa fa-star-o w3-text-blue");
		$("#review").val("");
	}

	function closeChangeModal(data) {
		document.getElementById(data).style.display = 'none';
		$("#old_pass").val("");
		$("#new_pass").val("");
		$("#new_re_pass").val("");
	}

	function createHistory(data) {
		if (data.status == 0) {
			data.status = "Lodged";
		}
		if (data.status == 1) {
			data.status = "In progress";
		}
		if (data.status == 2) {
			data.status = "Solved";
		}
		if (data.status == 3) {
			data.status = "Closed";
		}

		$('#historyDivChild').append(
			'<div class=" w3-panel w3-white" id="panel_' + data.complaint_id + '">' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-calendar w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Date: &nbsp;</b></span><span> ' + data.date.split("T")[0] + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-clock-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><h6><span><b>Time: &nbsp;</b></span><span >' + data.date.split("T")[1].split(".")[0] + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-lightbulb-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Euipment: &nbsp;</b></span><span > ' + data.subject + '</span></h6>' +
			'</div>' +
			'</div>' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-id-badge w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>C_Id: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.complaint_id + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-list-ul w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Type: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.type + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-user-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Assistance: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.catagory + '</span></h6>' +
			'</div>' +
			'</div>' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-clock-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Slot: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.time_slot + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-inr w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Cost: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.cost + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro w3-dropdown-hover">' +
			'<h5><span class="fa fa-pencil w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Description: &nbsp;</b></span><span ><span class="w3-rest"> ' + data.description + '</span></h6>' +
			'<div class="w3-dropdown-content w3-card-4" >' +
			'<div class="w3-container">' +
			'<p>' + data.descriptionFull + '</p>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="w3-row">' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-key w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span> <b>OTP : &nbsp;&nbsp;</b></span><span ><span class="w3-rest"> ' + data.otp + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro">' +
			'<h5><span class="fa fa-spinner w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span> <b>Status : &nbsp;</b></span><span ><span class="w3-rest"> ' + data.status + '</span></h6>' +
			'</div>' +
			'<div class="w3-third fontSourceSansPro w3-dropdown-hover">' +
			'<h5><span class="fa fa-male w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span><b> HandyMan: </b></span><span ><span class="w3-rest"> ' + data.name + '</span></h6>' +
			'<div class="w3-dropdown-content w3-card-4" >' +
			'<div class="w3-container">' +
			'<p>' + data.phone_no + '</p>' +
			'<p>' + data.email + '</p>' +
			'</div>' +
			'</div>' +
			'</div>' +

			'</div>' +
			'<div class="w3-right ">' +
			'<input type="button" id="feedback_' + data.complaint_id + '" class="w3-button w3-flat-belize-hole w3-hover-blue" style="margin-bottom:10px;display:none" value="Feedback">' +
			'</div>' +
			'</div>');
		if (data.status == "Solved") {
			$('#feedback_' + data.complaint_id).css('display', 'block');
			$('#panel_' + data.complaint_id).addClass('w3-border-blue w3-rightbar');
		}
		if (data.status == "In progress") {
			$('#panel_' + data.complaint_id).addClass('w3-border-yellow w3-rightbar');
		}
		if (data.status == "Lodged") {
			$('#panel_' + data.complaint_id).addClass('w3-border-red w3-rightbar');
		}
		if (data.status == "Closed") {
			$('#panel_' + data.complaint_id).addClass('w3-border-green w3-rightbar');
		}
	}
