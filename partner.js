$(document).ready(function() {
    
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";

    function isLoggedIn(){
        return sessionStorage.getItem('partnerData') !== null ;
    }

    if(!isLoggedIn() && window.location.pathname === 'partner-dashboard.html'){
        window.location.href = 'partner.html';
    }


    // Handler for sign-in button click event
    $('.sign-in-partner').click(function(event) {
        event.preventDefault();
        updatePartner();
    });

    // Function to update partner data
    function updatePartner(){
        var formPartnerId = $('.partner-id input').val();
        var formCardId = $('.card-id input').val();
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
                    if ((start = data.error.indexOf("Error")) >= 0){
                        let start = data.error.indexOf("Error");
                        error = data.error.slice(start);
                    }
                    alert(error);
                } else {
                    localStorage.setItem('partner-id', JSON.stringify(formPartnerId));
                    localStorage.setItem('card-id', JSON.stringify(formCardId));
                    sessionStorage.setItem('partnerData', JSON.stringify(data));
                    window.location.href = "partner-dashboard.html";
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

    $('.log-out').click(function(event){
        event.preventDefault();
        logout();
    })

    function logout(){
        sessionStorage.removeItem('partnerData');
        window.location.href = 'partner.html';
    }

    var partnerData = JSON.parse(sessionStorage.getItem('partnerData'));
    
    if(partnerData){
        console.log(partnerData);
        let nameElement = document.querySelector('.heading h2:nth-child(1)');
        let accountIdElement = document.querySelector('.heading h2:nth-child(2)');
        
        nameElement.innerHTML =  partnerData.name;
        accountIdElement.innerHTML =  partnerData.id;

        let dashboard = document.querySelector('.dashboards');
        console.log(dashboard);
        dashboard.innerHTML =  '<h5> Total Allocated Points: ' +'<b>' + partnerData.pointsGiven + '</b>' +'</h5>'
                                + '<h5> Total Redeemed Points: ' + '<b>' + partnerData.pointsCollected +'</b>' +'</h5>'
    }

    

    function generateOfferListHTML(transactionData) {
        var str = '';
        for (var i = 0; i < transactionData.length; i++){
            str += '<div class="coupon"><div class="containers"><h2><b class="producttext">' + transactionData[i].product + '</b></h2> </div><div class="container"><p class="proddetails">Price: <span class="promo">' + transactionData[i].price + '$</span></p><p class="proddetails">Points: <span class="promo">' + transactionData[i].points + '</span></p></div></div>';
        }
        return str;
    }

    function generateRewardListHTML(transactionData) {
        var str = '';
        for (var i = 0; i < transactionData.length; i++) {
            str += '<div class="coupon"><div class="containers"><h2><b class="producttext">' + transactionData[i].item + '</b></h2> </div><p class="proddetails">Points: <span class="promo">' + transactionData[i].points + '</span></p></div></div>';
        }
        return str;
    }

    $('#addOffer').click(function(){
        document.querySelector('.offerModal').style.display = "block";
    });

    $('#cancelOffer').click(function(){
        console.log('cancel offer');
        document.querySelector('.offerModal').style.display = "none";
    });

    $('#add_offer').click(function(event) {
        event.preventDefault();
        var formPartnerId = $('.partner-id input').val();
        var formCardId = $('.card-id input').val();
        var offerproduct = $('#offerproduct').val();
        var offerprice = $('#offerprice').val();
        var offerpoints = $('#offerpoints').val();
        console.log(formPartnerId, offerproduct, offerprice, offerpoints);

        var inputData = JSON.stringify({
            "cardId": formCardId,
            "partnerId": formPartnerId,
            "productName": offerproduct,
            "price": offerprice,
            "points": offerpoints
        });
        console.log(inputData);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'addOffer',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function() {
                $("#offerproduct").val('');
                $("#offerprice").val('');
                $("#offerpoints").val('');
                $('#offerModal').css('display', 'block'); 
            },
            success: function(data) {
                console.log(data);
                updatePartner();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            }
        });
    });

    $('#addReward').click(function(){
        console.log('add reward');
        document.querySelector('.rewardModal').style.display = "block";
    });

    $('#cancelReward').click(function(){
        console.log();
        document.querySelector('.rewardModal').style.display = "none";
    });
});
