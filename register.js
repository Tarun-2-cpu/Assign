$(document).ready(function() {

    $('.register-member').click(function(event) {
      event.preventDefault();
      
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


  // //check user input and call server to create dataset
    apiUrl = "https://cl-backend.kryptocoder.com/api/";

    $('.register-partner').click(function(event) {
        event.preventDefault();
        
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
                    window.location.href = window.location.href;
                    alert("Successfully registered");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: Try again");
                console.error("AJAX request failed:", textStatus, errorThrown);
            }
        };

        $.ajax(settings);
    });
});