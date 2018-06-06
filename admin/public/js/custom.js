var version="20180523.001"

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function displayModal(path) {
		// parse path to check if the path is a item 
		window.modalPath = path;
		var modal = document.getElementById('myModal');
		// send notification to socket cluster to change path
	    window.scclient.publish(readCookie('channel_name'), { type: 'update router', path: path } );
	    modal.style.display = "block";

	}

function hideModal() {
	var modal = document.getElementById('myModal');
	modal.style.display = "none";
}

$( window ).ready(function() {
	// Get the modal
	var modal = document.getElementById('myModal');
	document.getElementById('myIframe').src = window.location.protocol + '//'+ window.location.hostname +'/mobile';
	    
	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	    if (!event.target.matches('.dropbtn')) {

		    var dropdowns = document.getElementsByClassName("dropdown-content");
		    var i;
		    for (i = 0; i < dropdowns.length; i++) {
		      var openDropdown = dropdowns[i];
		      if (openDropdown.classList.contains('show')) {
		        openDropdown.classList.remove('show');
		      }
		    }
		}
	}
});
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}