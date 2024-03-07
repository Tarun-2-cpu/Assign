$(document).ready(function() {
    
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";

    
    function isLoggedIn(){
        return sessionStorage.getItem('partnerData') !== null ;
    }

    if(!isLoggedIn() && window.location.pathname === 'Transactions.html'){
        window.location.href = 'partner.html';
    }


    let heading = document.querySelector('.heading');
    console.log(heading);


    $('.sign-in-partner').click(function(event) {
        event.preventDefault();
        updatePartner();
    });

    function updatePartner(){
        var formPartnerId = $('.partner-id input').val();
        var formCardId = $('.card-id input').val();
        var inputData = JSON.stringify({
            "partnerid": formPartnerId,
            "cardid": formCardId
        });
    

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
                    sessionStorage.setItem('partnerData', JSON.stringify(data));
                    window.location.href = "Transactions.html";
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
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
    console.log(partnerData);
    if (partnerData) {
        let nameElement = document.querySelector('.heading h2:nth-child(1)');
        let accountIdElement = document.querySelector('.heading h2:nth-child(2)');
        nameElement.innerHTML = partnerData.name;
        accountIdElement.innerHTML = partnerData.id;
  
        let pointsAllocated = document.querySelector('.points-allocated-transactions');

         let transactionData = partnerData.earnPointsResults;
         
         let transactionHtmlContent = '<table>';
         
         for (let i = 0; i < transactionData.length; i++) {
             transactionHtmlContent += '<tr><td><b>Time Stamp:</b></td><td>' + transactionData[i].timestamp + '</td></tr>';
             transactionHtmlContent += '<tr><td><b>Partner:</b></td><td>' + transactionData[i].partner + '</td></tr>';
             transactionHtmlContent += '<tr><td><b>Member:</b></td><td>' + transactionData[i].member + '</td></tr>';
             transactionHtmlContent += '<tr><td><b>Points:</b></td><td>' + transactionData[i].points + '</td></tr>';
             transactionHtmlContent += '<tr><td><b>Transaction ID:</b></td><td>' + transactionData[i].transactionId + '</td></tr>';
             transactionHtmlContent += '<tr><td colspan="2">&nbsp;</td></tr>';
         }
         
         transactionHtmlContent += '</table>';
         
         pointsAllocated.innerHTML = transactionHtmlContent;
         
        
        
    
         let pointsRedeemed = document.querySelector('.points-redeemed-transactions');

         if (partnerData && partnerData.usePointsResults && partnerData.usePointsResults.length > 0) {
             let redeemData = partnerData.usePointsResults;
             let redeemHtmlContent = '<table>';
         
             for (let i = 0; i < redeemData.length; i++) {
                 redeemHtmlContent += '<tr><td><b>Time stamp:</b></td><td>' + redeemData[i].timestamp + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Partner:</b></td><td>' + redeemData[i].partner + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Member:</b></td><td>' + redeemData[i].member + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Points:</b></td><td>' + redeemData[i].points + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Transaction ID:</b></td><td>' + redeemData[i].transactionId + '</td></tr>';
                 // Add an empty row as space between each set of data
                 redeemHtmlContent += '<tr><td colspan="2">&nbsp;</td></tr>';
             }
         
             redeemHtmlContent += '</table>';
         
             pointsRedeemed.innerHTML = redeemHtmlContent;
         } else {
             pointsRedeemed.innerHTML = '<p>No points redeemed</p>';
         }
         
    }

})