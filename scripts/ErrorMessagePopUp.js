
$(document).ready(function () {
    ErrorMessagePopUp.ErrorShow();
});

ErrorMessagePopUp = {
    
ErrorShow: function () {
	  $("#dialog-modal").dialog({
              height: 140,
              width: 350,
              modal: true,
              resizable: false,
              buttons: {
                  Ok: function () {
                      $(this).dialog("close");
                  }
              }
      });       
   }
  };