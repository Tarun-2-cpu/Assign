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
    
        // Validation
        if (formFirstName.trim() === "") {
            alert("First name cannot be empty.");
            return;
        }
        if (formLastName.trim() === "") {
            alert("Last name cannot be empty.");
            return;
        }
        if (formAccountNum.length < 6 || !(/^\d+$/.test(formAccountNum))) {
            alert("Account number must be a minimum of 6 digits and can only contain numbers.");
            return;
        }
        if (formCardId.length < 6 || !(/^\d+$/.test(formCardId))) {
            alert("Card ID must be a minimum of 6 digits and can only contain numbers.");
            return;
        }
        if (formEmail.trim() === "" || !validateEmail(formEmail)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (formPhoneNumber.trim() === "" || !(/^\d+$/.test(formPhoneNumber))) {
            alert("Please enter a valid phone number.");
            return;
        }
    
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
    
    // Email validation function
    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    

    $('.register-partner').click(function(event) {
        event.preventDefault();
        
        // Retrieve input values
        var formName = $('.name input').val();
        var formPartnerId = $('.partner-id input').val();
        var formCardId = $('.card-id input').val();
    
        // Validation
        if (formName.trim() === "" || formPartnerId.trim() === "" || formCardId.trim() === "") {
            alert("All fields are mandatory.");
            return;
        }
        if (formPartnerId.length < 6) {
            alert("Partner ID must be at least 6 digits long.");
            return;
        }
        if (!/^\d+$/.test(formPartnerId)) {
            alert("Partner ID can only contain numbers.");
            return;
        }
        if (formCardId.length < 6) {
            alert("Card ID must be at least 6 digits long.");
            return;
        }
        if (!/^\d+$/.test(formCardId)) {
            alert("Card ID can only contain numbers.");
            return;
        }
        
        
        // Create JSON data
        var inputData = JSON.stringify({
            "name": formName,
            "partnerid": formPartnerId,
            "cardid": formCardId
        });
    
        console.log(inputData);
    
        var settings = {
            "url": "https://cl-backend.kryptocoder.com/api/registerPartner",
            "method": "POST",
            "timeout": 0 ,
            "headers": {
                "Content-Type" : "application/json"
            },
            "data" : inputData
        };    
            $.ajax(settings)
            .done(function(response){
                window.location.href = window.location.href;
                alert("Successfully registered!");
            })
            .fail(function(jqXHR,textStatus,errorThrown){
                alert('Error:'+ errorThrown);
                console.log("AJAX request failed:", textStatus, errorThrown);
            })
    });
          
});