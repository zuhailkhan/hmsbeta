$('[name="dashBoardButtons"]').click(function(){
	$('[name="dashBoardButtons"]').removeClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
	$(this).addClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
	$('[name="commonDivName"]').addClass('w3-hide');
	$('[name="commonDivName"]').removeClass('w3-animate-zoom');
	$($(this).attr('href')).removeClass('w3-hide').addClass('w3-animate-zoom');
});

$('#assignButton').addClass('w3-border-light-grey w3-rightbar w3-flat-belize-hole');
$('[name="commonDivName"]').addClass('w3-hide');
$('[name="commonDivName"]').removeClass('w3-animate-zoom');
$('#assignDiv').removeClass('w3-hide').addClass('w3-animate-zoom');

$.ajax({
	type:'get',
	url:'/getAllEquipment',
	success:function(data){
		data=JSON.parse(data);
		//console.log(data);
		$("#historyEquipment").html("")
		$("#historyEquipment").append("<option>Any</option>");
		for(i in data)
			$("#historyEquipment").append("<option>"+data[i].equipment+"</option>")
	}
});


$('#assignButton').click(function(){
	$.ajax({
		type:'get',
		url:'/adminGetAllHandyManInfo',
		success:function(data){
			if(data=="false"){
				return;
			}
			data=JSON.parse(data);
			//console.log(data);
			$('#assignForm').html('');
			for(i in data)
				createAssignForm(data[i]);
			$('#assignForm').append(
				'<div class="w3-center w3-margin-top">'+
					'<input class="w3-button w3-flat-belize-hole w3-hover-blue" type="submit" id="submitAssign" value="Generate">'+
				'</div>'
			);
		}
	});
});

$('#watchButton').click(function(){
	var arr=["Electrician","Carpenter","Others"];
	$.ajax({
		type:'get',
		url:'/adminGetAllHandyManInfo',
		async:false,
		success:function(data){
			if(data=="false"){
				return;
			}
			data=JSON.parse(data);
			for(i in arr){
				$("#watchDiv"+arr[i]).html("")
			}

			for(i in data){
				var handymanType="Others";
				//console.log(data[i]);
				if(data[i].Catagory=="Electrician"){
					handymanType="Electrician"
				}
				else if(data[i].Catagory=="Carpenter"){
					handymanType="Carpenter";
				}
				$.ajax({
					type:'get',
					url:'/getHandyManRating',
					async:false,
					data:{
						"handyman_id":data[i].handyman_id
					},
					success:function(rating){
						if(rating=="false"){
							alert("Error Try Again");
							return;
						}
						data[i].rating=(JSON.parse(rating))[0].rating;
						if(data[i].rating==null){
							data[i].rating="-";
						}
						createWatch(handymanType,data[i]);
					}
				});
			}
		},
		complete:function(){
			for(i in arr){
				if($("#watchDiv"+arr[i]).html()==""){
					$("#watchDiv"+arr[i]).append(
						'<div style="width:100%"><h4 class="w3-center fontAudiowide w3-text-grey">NO HANDYMAN HERE</h4></div>'
					);
				}
			}
		}
	});
});

var assignForm = $('#assignForm');

assignForm.submit(function(){
	$.ajax({
		type:assignForm.attr('method'),
		url: assignForm.attr('action'),
		data: assignForm.serialize(),
		timeout:10000,
		success:function(data){
			if(data=="true"){
				//console.log(typeof data);
				$("#submitAssign").fadeOut("slow",function() {
				  $(this).val("DONE");
				  $(this).prop("disabled",true);
				}).fadeIn("slow",function(){
				});
				setTimeout(function(){$("#submitAssign").fadeOut("slow",function(){
					$(this).val("Generate");
					$(this).prop("disabled",false);
				}).fadeIn("slow",function(){
					$('#assignForm')[0].reset();
				})},5000);
			}
		},
		error: function(jqXHR, textStatus){
	        if(textStatus === 'timeout')
	        {     
	            alert('TimeOut Try Again');         
	        }
	    }
	});
	return false;
});

$('#historyButton').click(function(){
	$.ajax({
		type:'get',
		url:'/adminGetAllHistory',
		data:{
			sInfoRadio:$('[name="sInfo"]:checked').val(),
			sInfoValue:$('#historySInfoValue').val(),
			handyman_id:$('#historyHandymanId').val(),
			subject:$('#historyEquipment').val(),
			catagory:$("#historyAssistance").val(),
			time_slot:$("#historyTimeSlot").val(),
			type:$("#historyType").val(),
			status:$("#historyStatus").val(),
			rating:$("#historyRating").val()
		},
		success:function(data){
			data=JSON.parse(data);
			//console.log(data);
			$("#historyDivChild").html("");
			for(var i=0;i<data.length;++i){
				createHistory(data[i]);
			}
			if($('#historyHandymanCheck').prop('checked')==false){
				$("[name='historyHandymanInfo']").addClass('w3-hide');
			}
			if($('#historyComplaintCheck').prop('checked')== false){
				$("[name='historyComplaintInfo']").addClass('w3-hide');
			}
			if($('#historyStudentCheck').prop('checked')== false){
				$("[name='historyStudentInfo']").addClass('w3-hide');
			}
		}
	})
})

$('#logoutButton').click(function(){
	$.ajax({
		type: 'get',
		url: '/logout',
		success: function(data){
			if(data=="true"){
				window.location.href="./";
			}
		}
	});
});

$(document).ready(function(){
	$('#infoButton').trigger('click');
});


$("#infoButton").click(function(){
 	$.ajax({
		type: 'get',
		url: '/getData',
		data:{
			'email':sessionStorage.email,
			'type':sessionStorage.type
		},
		success: function (data) {
			if(data=="false")
				window.location.href = "./";
			else{
				var value=JSON.parse(data);
				//console.log(value);
				$("#admin_id").val(value[0].admin_id);
				$("#userName").html("&nbsp;&nbsp;&nbsp;&nbsp;"+value[0].name);
				$("#actype").html("&nbsp;&nbsp; Admin");
				$("#email").html("&nbsp;&nbsp; "+value[0].email);
				$("#mobile").html("&nbsp;&nbsp; "+value[0].phone_no);
			}
		},
		complete:function(data){
			$.ajax({
				type:'get',
				url:'/adminComplaintAnalysis',
				success:function(data){
					data=JSON.parse(data);
					//console.log(data);
					if(data!="false"){
						$("#complaintsRegistered").html(data[0].total);
						if(data.length>1){
							$("#complaintsSolved").html(data[1].total);
							$("#complaintsPending").html(data[0].total-data[1].total);
						}
						else{
							$("#complaintsSolved").html(data[0].total);
							$("#complaintsPending").html(0);
						}
					}
				}
			});
		}	
	});
});

$('#changeInfoButton').click(function(){
	var passw=  /[^A-Za-z0-9!@_]/;  
	if($("#old_pass").val().match(passw)||$("#new_pass").val().match(passw))   
	{   
		alert("A-Z a-z 0-9 and !@_ are allowed");
		return false;
	}  
	else if($("#old_pass").val().length>15||$("#old_pass").val().length<7||$("#new_pass").val().length>15||$("#new_pass").val().length<7) 
	{   
		alert("password length must be between 7-15");
		return false;
	}
	else if($("#new_pass").val()!=$("#new_re_pass").val())
	{   
		alert("Re-Enter password wrong");
		return false;
	}
	$.ajax({
		type:'get',
		url:'/changeAdminPass',
		data:{
			"admin_id":$("#admin_id").val(),
			"old_Pass":$("#old_pass").val(),
			"new_Pass":$("#new_pass").val()
		},
		success:function(data){
			if(data=="old"){
				alert("Wrong Old Password");
				return false;
			}
			if(data=="false"){
				alert("Something went wrong, Try Again");
				return false;
			}
			else
			{
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

$("#changePhoneButton").click(function(){
	if($("#new_phone_no").val().length!=10){
		alert("Must be of 10 digit");
		return false;
	}
	$.ajax({
		type:'get',
		url:'/changeAdminPhone',
		data:{
			"admin_id":$("#admin_id").val(),
			"new_phone":$("#new_phone_no").val(),
		},
		success:function(data){
			if(data=="false"){
				alert("Something went wrong, Try Again");
				return false;
			}
			else
			{
				alert("updated Successfully");
				$("#old_pass").val("");
				$("#new_pass").val("");
				$("#new_re_pass").val("");
				$("#new_phone_no").val("");
				$('#infoButton').trigger('click');
				return true;
			}
		}
	});
})

	function createHistory(data){
		var c=data.c;
		var h=data.h;
		var s=data.s;
		if(c.status==0){
			c.status="Lodged";
		}
		if(c.status==1){
			c.status="In progress";
		}
		if(c.status==2){
			c.status="Solved";
		}
		if(c.status==3){
			c.status="Closed";
		}
		$('#historyDivChild').append(
		'<div class=" w3-panel w3-white" id="panel_'+c.complaint_id+'">'+
			'<div name="historyComplaintInfo">'+
				'<div class="w3-row">'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-id-badge w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>C_Id: &nbsp;</b></span><span ><span class="w3-rest"> '+c.complaint_id+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-calendar w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Date: &nbsp;</b></span><span> '+c.date.split("T")[0]+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-clock-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><h6><span><b>Time: &nbsp;</b></span><span >'+c.date.split("T")[1].split(".")[0]+'</span></h6>'+
					'</div>'+
					
				'</div>'+
				'<div class="w3-row">'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-lightbulb-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Equipment: &nbsp;</b></span><span > '+c.subject+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-list-ul w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Type: &nbsp;</b></span><span ><span class="w3-rest"> '+c.type+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-user-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Assistance: &nbsp;</b></span><span ><span class="w3-rest"> '+c.catagory+'</span></h6>'+
					'</div>'+
				'</div>'+
				'<div class="w3-row">'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-clock-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Slot: &nbsp;</b></span><span ><span class="w3-rest"> '+c.time_slot+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-inr w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Cost: &nbsp;</b></span><span ><span class="w3-rest"> '+c.cost+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro w3-dropdown-hover">'+
						'<h5><span class="fa fa-pencil w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Description: &nbsp;</b></span><span ><span class="w3-rest"> '+c.description+'</span></h6>'+
						'<div class="w3-dropdown-content w3-card-4" >'+
					      '<div class="w3-container">'+
					        '<p>'+c.descriptionFull+'</p>'+
					      '</div>'+
					    '</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div name="historyStudentInfo">'+
				'<div class="w3-row">'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-id-badge w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>S_Id: &nbsp;</b></span><span ><span class="w3-rest"> '+s.student_id+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-phone w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Phone no &nbsp;</b></span><span ><span class="w3-rest"> '+s.phone_no+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-envelope-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Email: &nbsp;</b></span><span ><span class="w3-rest"> '+s.email+'</span></h6>'+
					'</div>'+
				'</div>'+
				'<div class="w3-row">'+
				'	<div class="w3-third fontSourceSansPro">'+
				'		<h5><span class="fa fa-user-circle-o w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Name: &nbsp;</b></span><span ><span class="w3-rest"> '+s.name+'</span></h6>'+
				'	</div>'+
				'	<div class="w3-third fontSourceSansPro">'+
				'		<h5><span class="fa fa-home w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Room: &nbsp;</b></span><span ><span class="w3-rest"> '+s.gender+' '+s.room_no+'</span></h6>'+
				'	</div>'+
				'	<div class="w3-third fontSourceSansPro">'+
				'		<h5><span class="fa fa-sort-alpha-asc w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>Roll No: &nbsp;</b></span><span ><span class="w3-rest"> '+s.roll_no+'</span></h6>'+
				'	</div>'+

				'</div>'+
			'</div>'+

			'<div name="historyHandymanInfo">'+
				'<div class="w3-row">'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-id-badge w3-col m1 s3 w3-hide-small w3-hide-medium"></span></h5><h6><span><b>H_Id: &nbsp;</b></span><span ><span class="w3-rest"> '+h.handyman_id+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
					    '<h5><span class="fa fa-envelope-o w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span><b> Email: </b></span><span ><span class="w3-rest"> '+h.email+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
					    '<h5><span class="fa fa-phone w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span><b> Phone no: </b></span><span ><span class="w3-rest"> '+h.phone_no+'</span></h6>'+
					'</div>'+
				'</div>'+
				'<div class="w3-row">'+
					'<div class="w3-third fontSourceSansPro">'+
						'<h5><span class="fa fa-male w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span><b> Name: </b></span><span ><span class="w3-rest"> '+h.name+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
					    '<h5><span class="fa fa-wrench w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span><b> Catagory: </b></span><span ><span class="w3-rest"> '+h.Catagory+'</span></h6>'+
					'</div>'+
					'<div class="w3-third fontSourceSansPro">'+
					    '<h5><span class="fa fa-star w3-col m1 s3 w3-hide-small w3-hide-medium"> </span></h5><h6><span><b> Rating: </b></span><span ><span class="w3-rest"> '+c.rating+'</span></h6>'+
					'</div>'+
				'</div>'+
			'</div>'+


		'</div>');
		if(c.status=="Solved"){
			$('#panel_'+c.complaint_id).addClass('w3-border-blue w3-rightbar');
		}
		if(c.status=="In progress"){
			$('#panel_'+c.complaint_id).addClass('w3-border-yellow w3-rightbar');
		}
		if(c.status=="Lodged"){
			$('#panel_'+c.complaint_id).addClass('w3-border-red w3-rightbar');
		}
		if(c.status=="Closed"){
			$('#panel_'+c.complaint_id).addClass('w3-border-green w3-rightbar');
		}
	}

function createAssignForm(data){
	$("#assignForm").append(
		'<div class="w3-row w3-margin-top" style="margin:0 auto;">'+
			'<div class="w3-col m1 w3-container s2 w3-center">'+
			'	<div class="w3-container w3-flat-belize-hole">'+
			'	  	<h3 class="fontSourceSansPro w3-text-white">'+(data.Catagory).charAt(0)+'</h3>'+
			'	</div>'+
			'</div>'+
			'<div class="w3-col m3 s3">'+
			'	<h5>'+data.name+'</h5>'+
			'</div>'+
			'<div class="w3-col m3 s3">'+
			'	<h5>'+data.phone_no+'</h5>'+
			'</div>'+
			'<div class="w3-col m3 s3">'+
			'	<h5>'+data.email+'</h5>'+
			'</div>'+
			'<div class="w3-col m1 s1 w3-right">'+
				'<input class="w3-check" type="checkbox" name="handyman_'+data.handyman_id+'">'+
			'</div>'+
		'</div>'
	);
}

function createWatch(handymanType,data){
	////console.log(data);
	$("#watchDiv"+handymanType).append(
		'<div class="w3-panel w3-white w3-margin-top ">'+
			'<div class="w3-row fontSourceSansPro" style="margin:0 auto;">'+
				'<div class="w3-col m3 w3-mobile">'+
				'	<h5>'+data.name+'</h5>'+
				'</div>'+
				'<div class="w3-col m3 w3-mobile">'+
				'	<h5>'+data.phone_no+'</h5>'+
				'</div>'+
				'<div class="w3-col m4 w3-mobile">'+
				'	<h5>'+data.email+'</h5>'+
				'</div>'+
				'<div class="w3-col m1 w3-mobile">'+
					'<h5>'+data.rating+'<span class="fa fa-star"></span></h5>'+
				'</div>'+
				'<div class="w3-right">'+
					'<button class="w3-button w3-flat-belize-hole w3-hover-blue" type="button" style="width:100%;" id="watch_'+data.handyman_id+'"><i class="fa fa-caret-down" aria-hidden="true"></i></button>'+
				'</div>'+
			'</div>'+
			'<div class="w3-hide" id="watchAnalysisDiv_'+data.handyman_id+'">'+
				'<div class="w3-section w3-row">'+
					'<div class="w3-center">'+
						'<header class="w3-container w3-center w3-flat-belize-hole">'+
						  '	<h5 class="fontSourceSansPro w3-center w3-text-white" >Today"s Analysis</h5>'+
						'</header>'+
					'</div>'+
					'<div class="w3-third">'+
					'	<header style="text-align: center;" class="fontSourceSansPro">'+
					'		<span class="w3-border-bottom w3-border-blue w3-tag w3-jumbo w3-flat-belize-hole w3-padding-large">'+
					'		<span id="todayComplaintsRegistered_'+data.handyman_id+'">NA</span>'+
					'		<h5 style="padding:0;margin:0;">Registered</h5></span>'+
					'	</header>'+
					'</div>'+
					'<div class="w3-third">'+
					'	<header style="text-align: center;" class="fontSourceSansPro">'+
					'		<span class="w3-border-bottom w3-border-blue w3-tag w3-jumbo w3-flat-belize-hole w3-padding-large">'+
					'		<span id="todayComplaintsSolved_'+data.handyman_id+'">NA</span>'+
					'		<h5 style="padding:0;margin:0;">Completed</h5></span>'+
					'	</header>'+
					'</div>'+
					'<div class="w3-third w3-margin-bottom">'+
					'	<header style="text-align: center;" class="fontSourceSansPro">'+
					'		<span class="w3-border-bottom w3-border-blue w3-tag w3-jumbo w3-flat-belize-hole w3-padding-large">'+
					'		<span id="todayComplaintsPending_'+data.handyman_id+'">NA</span>'+
					'		<h5 style="padding:0;margin:0;">Pending</h5></span>'+
					'	</header>'+
					'</div>'+
				'</div>'+

				'<div class="w3-section">'+
				'	<div class="w3-center">'+
				'		<header class="w3-container w3-center w3-flat-belize-hole">'+
				'		  	<h5 class="fontSourceSansPro w3-center w3-text-white" >Overall Analysis</h5>'+
				'		</header>'+
				'	</div>'+
				'	<div class="w3-third">'+
				'		<header style="text-align: center;" class="fontSourceSansPro">'+
				'			<span class="w3-border-bottom w3-border-blue w3-tag w3-jumbo w3-flat-belize-hole w3-padding-large">'+
				'			<span id="complaintsRegistered_'+data.handyman_id+'">NA</span>'+
				'			<h5 style="padding:0;margin:0;">Registered</h5></span>'+
				'		</header>'+
				'	</div>'+
				'	<div class="w3-third">'+
				'		<header style="text-align: center;" class="fontSourceSansPro">'+
				'			<span class="w3-border-bottom w3-border-blue w3-tag w3-jumbo w3-flat-belize-hole w3-padding-large">'+
				'			<span id="complaintsSolved_'+data.handyman_id+'">NA</span>'+
				'			<h5 style="padding:0;margin:0;">Completed</h5></span>'+
				'		</header>'+
				'	</div>'+
				'	<div class="w3-third w3-margin-bottom">'+
				'		<header style="text-align: center;" class="fontSourceSansPro">'+
				'			<span class="w3-border-bottom w3-border-blue w3-tag w3-jumbo w3-flat-belize-hole w3-padding-large">'+
				'			<span id="complaintsPending_'+data.handyman_id+'">NA</span>'+
				'			<h5 style="padding:0;margin:0;">Unattended</h5></span>'+
				'		</header>'+
				'	</div>'+
				'</div>'+
			'</div>'+
		'</div>'
	);
	$("#watch_"+data.handyman_id).click(function(){
		$("#watchAnalysisDiv_"+data.handyman_id).toggleClass("w3-hide w3-animate-top");
	})
	$("#complaintsRegistered_"+data.handyman_id).html(data.issued);
	$("#complaintsSolved_"+data.handyman_id).html(data.solved);
	$("#complaintsPending_"+data.handyman_id).html(data.issued-data.solved);
	var totalToday=data.slot1+data.slot2+data.slot3;
	$("#todayComplaintsRegistered_"+data.handyman_id).html(totalToday);
	$("#todayComplaintsSolved_"+data.handyman_id).html(data.today);
	$("#todayComplaintsPending_"+data.handyman_id).html(totalToday-data.today);
}

function closeChangeModal(data){
	document.getElementById(data).style.display='none';
	$("#old_pass").val("");
	$("#new_pass").val("");
	$("#new_re_pass").val("");
}