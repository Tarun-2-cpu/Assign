$(document).ready(function() {
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";
    
    function isLoggedIn(){
        return sessionStorage.getItem('memberData') !== null;
    }
    
    if(!isLoggedIn() && window.location.pathname === 'transaction.html'){
        window.location.href = 'index.html';
    }


    $('.sign-in-member').click(function(event){
        event.preventDefault();
        updateMember();
    });
  
    function updateMember() {
        var formAccountNum = $('.account-number input').val();
        var formCardId = $('.card-id input').val();
  
        var inputData = JSON.stringify({
            "accountnumber": formAccountNum,
            "cardid": formCardId
        });
  
        console.log(inputData);
  
        $.ajax({
            type: 'POST',
            url: apiUrl + 'memberData',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
  
                if (data.error) {
                    alert(data.error);
                } else {
                    sessionStorage.setItem('memberData', JSON.stringify(data));
                    window.location.href = "member-dashboard.html";
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
        sessionStorage.removeItem('memberData');
        window.location.href = 'index.html';
    }


    // Retrieve member data from session storage
    var memberData = JSON.parse(sessionStorage.getItem('memberData'));
    if (memberData) {
        console.log(memberData);
        let nameElement = document.querySelector('.heading h2:nth-child(1)');
        let accountNumber = document.querySelector('.heading h2:nth-child(2)');
        let points = document.querySelector('.heading h2:nth-child(3)');
  
        nameElement.innerHTML = memberData.firstName + ' ' + memberData.lastName;
        accountNumber.innerHTML =  memberData.accountNumber;
        points.innerHTML = memberData.points;

        let pointsAllocated = document.querySelector('.points-allocated-transactions');
        console.log(pointsAllocated);

         let transactionData = memberData.earnPointsResult;
         console.log(transactionData);

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
         
         console.log(memberData);
        
         let pointsRedeemed = document.querySelector('.points-redeemed-transactions');
         console.log(pointsRedeemed);

         if (memberData && memberData.usePointsResults && memberData.usePointsResults.length > 0) {
             let redeemData = memberData.usePointsResults;
             console.log(redeemData);
             let redeemHtmlContent = '<table>';
         
             for (let i = 0; i < redeemData.length; i++){
                 redeemHtmlContent += '<tr><td><b>Time stamp:</b></td><td>' + redeemData[i].timestamp + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Partner:</b></td><td>' + redeemData[i].partner + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Member:</b></td><td>' + redeemData[i].member + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Points:</b></td><td>' + redeemData[i].points + '</td></tr>';
                 redeemHtmlContent += '<tr><td><b>Transaction ID:</b></td><td>' + redeemData[i].transactionId + '</td></tr>';
                 redeemHtmlContent += '<tr><td colspan="2">&nbsp;</td></tr>';
             }
         
             redeemHtmlContent += '</table>';
         
             pointsRedeemed.innerHTML = redeemHtmlContent ;
         } else {
             pointsRedeemed.innerHTML = '<p>No points redeemed</p>';
         }
         
        }
    }
)
