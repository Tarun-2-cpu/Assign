$(document).ready(function() {
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";

    // Function to check if partner is logged in
    function isLoggedIn() {
        return sessionStorage.getItem('partnerData') !== null;
    }

    // Redirect to login page if not logged in
    if (!isLoggedIn() && window.location.pathname === 'addReward.html'){
        window.location.href = 'partner.html';
    }

    // Sign In button click event
    $('.sign-in-partner').click(function(event){
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

    // Add reward button click event
    $('#add_reward').click(function(event) {
        event.preventDefault();

        var formPartnerId = partnerId;
        var formCardId = cardId;
        var rewarditem = $('#rewarditem').val();
        var rewardpoints = $('#rewardpoints').val();

        var inputdata = JSON.stringify({
            "cardId": formCardId,
            "partnerId": formPartnerId,
            "itemName": rewarditem,
            "points": rewardpoints
        });

        console.log(inputdata);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'addReward',
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
                    console.log("Reward added successfully");
                    $('#rewardlist').prepend('<div class="card col-5 m-5"><div class="body"><h2><b class="producttext">' +
                        rewarditem +
                        '</b></h2> </div><div class="container"><p class="proddetails">Points: <span class="promo">' +
                        rewardpoints +
                        '</span></p></div></div>');
                    $('.rewardModal').css("display", "none");
                    updatePartner();
                    // window.location.href = "addReward.html";
                    $('#rewarditem').val('');
                    $('#rewardpoints').val('');
            
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

        let rewardList = $('#rewardlist');
        let rewardData = partnerData.addRewardResults.reverse();

        for (let i = 0; i < rewardData.length; i++) {
            rewardList.append('<div class="card col-5 m-5"><div class="body"><h2><b class="producttext">' +
                rewardData[i].item +
                '</b></h2> </div><div class="container"><p class="proddetails">Points: <span class="promo">' +
                rewardData[i].points +
                '</span></p></div></div>');
        }
    }

    // Show reward modal when "Add Reward" button is clicked
    $('#addReward').click(function() {
        $('.rewardModal').css("display", "block");
    });

    // Hide reward modal when "Cancel" button is clicked
    $('#cancelReward').click(function() {
        $('.rewardModal').css("display", "none");
    });
});
