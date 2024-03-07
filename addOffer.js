$(document).ready(function() {
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";

    // Function to check if partner is logged in
    function isLoggedIn() {
        return sessionStorage.getItem('partnerData') !== null;
    }

    // Redirect to login page if not logged in
    if (!isLoggedIn() && window.location.pathname === 'addOffer.html'){
        window.location.href = 'partner.html';
    }

    // Sign In button click event
    $('.sign-in-partner').click(function(event) {
        event.preventDefault();
        updatePartner();
    });

    // Function to update partner data
    function updatePartner() {
        var formPartnerId = partnerId;
        var formCardId = cardId;
        var inputData = JSON.stringify({
            "partnerid": formPartnerId,
            "cardid": formCardId
        });

        console.log(inputData);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'partnerData',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                if (data.error) {
                    let error = data.error;
                    if ((start = data.error.indexOf("Error")) >= 0) {
                        let start = data.error.indexOf("Error");
                        error = data.error.slice(start);
                    }
                    alert(error);
                } else {
                    sessionStorage.setItem('partnerId', inputData);
                    sessionStorage.setItem('partnerData', JSON.stringify(data));
                    // location.reload();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: Try again");
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            }
        });
    }

    // Log Out button click event
    $('.log-out').click(function(event) {
        event.preventDefault();
        logout();
    });

    // Function to log out
    function logout() {
        sessionStorage.removeItem('partnerData');
        window.location.href = 'partner.html';
    }

    // Retrieve partner ID and card ID from local storage
    let partnerId = JSON.parse(localStorage.getItem('partner-id'));
    let cardId = JSON.parse(localStorage.getItem('card-id'));

    // Add offer button click event
    $('#add_offer').click(function(event) {
        event.preventDefault();

        var formPartnerId = partnerId;
        var formCardId = cardId;
        var offerproduct = $('#offerproduct').val();
        var offerprice = $('#offerprice').val();
        var offerpoints = $('#offerpoints').val();

        var inputdata = JSON.stringify({
            "cardId": formCardId,
            "partnerId": formPartnerId,
            "productName": offerproduct,
            "price": offerprice,
            "points": offerpoints
        });

        console.log(inputdata);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'addOffer',
            data: inputdata,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
                if (data.error) {
                    let error = data.error;
                    if (error.startsWith("Error")) {
                        error = error.substring(error.indexOf("Error"));
                    }
                    alert(error);
                } else {
                    console.log("Offer added successfully");
                    $('#offerlist').prepend('<div class="card col-5 m-5"><div class="body"><h2><b class="producttext">' +
                        offerproduct +
                        '</b></h2> </div><div class="container"><p class="proddetails">Price: <span class="promo">' +
                        offerprice +
                        '</span></p><p class="proddetails">Points: <span class="promo">' +
                        offerpoints +
                        '</span></p></div></div>');
                    $('.offerModal').css("display", "none");
                    updatePartner();
                    // window.location.href = "addOffer.html";
                    $('#offerproduct').val('');
                    $('#offerprice').val('');
                    $('#offerpoints').val('');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
                alert("Error: Try again");
            }
        });
    });

    // Retrieve partner data from session storage
    var partnerData = JSON.parse(sessionStorage.getItem('partnerData'));
    console.log(partnerData);

    // Display partner data if available
    if (partnerData) {
        let nameElement = $('.heading h2:nth-child(1)');
        let accountIdElement = $('.heading h2:nth-child(2)');

        nameElement.text(partnerData.name);
        accountIdElement.text(partnerData.id);

        let offerList = $('#offerlist');
        let offerData = partnerData.addOfferResults.reverse();

        for (let i = 0; i < offerData.length; i++) {
            offerList.append('<div class="card col-5 m-5"><div class="body"><h2><b class="producttext">' +
                offerData[i].product +
                '</b></h2> </div><div class="container"><p class="proddetails">Price: <span class="promo">' +
                offerData[i].price +
                '$</span></p><p class="proddetails">Points: <span class="promo">' +
                offerData[i].points +
                '</span></p></div></div>');
        }
    }

    // Show offer modal when "Add Offer" button is clicked
    $('#addOffer').click(function() {
        $('.offerModal').css("display", "block");
    });

    // Hide offer modal when "Cancel" button is clicked
    $('#cancelOffer').click(function() {
        $('.offerModal').css("display", "none");
    });
});
