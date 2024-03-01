$(document).ready(function() {

    
    if (window.location.pathname.endsWith('.html')) {
        var newURL = window.location.pathname.replace('.html', '');
        window.history.replaceState({}, document.title, newURL);
    }

  $('.register-member').click(function(event) {
      event.preventDefault(); // Prevent default click behavior
      
      // Retrieve input values
      var formAccountNum = $('.account-number input').val();
      var formCardId = $('.card-id input').val();
      var formFirstName = $('.first-name input').val();
      var formLastName = $('.last-name input').val();
      var formEmail = $('.email input').val();
      var formPhoneNumber = $('.phone-number input').val();

      // Create JSON data
      var inputData = JSON.stringify({
          "firstname": formFirstName,
          "lastname": formLastName,
          "email": formEmail,
          "phonenumber": formPhoneNumber,
          "accountnumber": formAccountNum,
          "cardid": formCardId
      });

      // Define settings object for AJAX request
      var settings = {
          "url": "https://cl-backend.kryptocoder.com/api/registerMember",
          "method": "POST",
          "timeout": 0,
          "headers": {
              "Content-Type": "application/json"
          },
          "data": inputData
      };

      // Send AJAX request
      $.ajax(settings)
          .done(function (response) {
              // Redirect to the original page
              window.location.href = window.location.href ;
              // Show success message
              alert('Successfully registered!');
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
              // Show error message
              alert('Error: ' + errorThrown);
              // Log error to console
              console.error("AJAX request failed:", textStatus, errorThrown);
          });
  });



  // var settings = {
  //   type: 'POST',
  //   url: apiUrl + 'registerMember',
  //   data: inputData,
  //   dataType: 'json',
  //   contentType: 'application/json',
  //   success: function(data) {
  //     // Check data for error
  //     if (data.error) {
  //       let error = data.error;
  //       if ((start = data.error.indexOf("Error")) >= 0) {
  //         let start = data.error.indexOf("Error");
  //         error = data.error.slice(start);
  //       }
  //       // console.log("ERROR hai bhai")
  //       alert(error);
  //       return;
  //     } else {
  //       console.log("Success!");
  //       // Redirect to the same page after successful registration
  //       window.location.href = window.location.href;
  //     }
  //   },
  //   error: function(jqXHR, textStatus, errorThrown) {
  //     // Reload on error
  //     alert("Error: Try again")
  //     alert(errorThrown);
  //     alert(textStatus);
  //     alert(jqXHR);
  //   }
  // });
    // Make AJAX request
    // $.ajax(settings);





  // //check user input and call server to create dataset
    apiUrl = "https://cl-backend.kryptocoder.com/api/";

    // Define click event handler for the register-partner button
    $('.register-partner').click(function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        console.log("button clicked");

        // Get user input data
        var formName = $('.name input').val();
        var formPartnerId = $('.partner-id input').val();
        var formCardId = $('.card-id input').val();

        // Create JSON data
        var inputData = JSON.stringify({
            "name": formName,
            "partnerid": formPartnerId,
            "cardid": formCardId
        });

        console.log(inputData);

        // Make AJAX call to add the dataset
        var settings = {
            type: 'POST',
            url: apiUrl + 'registerPartner',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);

                // Check data for error
                if (data.error) {
                    alert(data.error);
                } else {
                    // Redirect to the same page after successful registration
                    window.location.href = window.location.href;
                    alert("Successfully registered");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Reload on error
                alert("Error: Try again");
                console.error("AJAX request failed:", textStatus, errorThrown);
            }
        };

        // Make AJAX request
        $.ajax(settings);
    });
});

