$(document).ready(function() {
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";

    function isLoggedIn(){
        return sessionStorage.getItem('memberData') !== null;
    }
    
    if(!isLoggedIn() && window.location.pathname === 'reedem.html'){
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


        $.ajax({
            type: 'POST',
            url: apiUrl + 'memberData',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                if (data.error) {
                } else {
                    localStorage.setItem('accountNumber', JSON.stringify(formAccountNum));
                    localStorage.setItem('cardId', JSON.stringify(formCardId));
                    sessionStorage.setItem('memberData', JSON.stringify(data));
                    updatePoints(data.points);
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



    // Function to update points in the heading section
    function updatePoints(points){
        var pointsElement = document.querySelector('.heading h2:nth-child(3)');
        if(pointsElement){
            pointsElement.innerHTML = points;
        }

        //update points in database 

        var memberData = JSON.parse(sessionStorage.getItem('memberData'));
        if(memberData){
            memberData.points = points;
            sessionStorage.setItem('memberData',JSON.stringify(memberData));
            var inputData = JSON.stringify({
                "accountnumber": memberData.accountNumber,
                "cardid": memberData.cardId,
                "points": points
            });
            $.ajax({
                type: 'POST',
                url: apiUrl + 'updatePoints',
                data: inputData,
                dataType: 'json',
                contentType: 'application/json',
                success: function(data){
                    console.log("Points updated in the database:", data)
                },
                error: function(jqXHR, textStatus,errorThrown){
                    console.error('Error updating points in the database:', errorThrown);
                }
            });
        }
    }


    // Retrieve member data from session storage
    var memberData = JSON.parse(sessionStorage.getItem('memberData'));
    if (memberData) {
        console.log(memberData);
        let nameElement = document.querySelector('.heading h2:nth-child(1)');
        let accountNumberElement = document.querySelector('.heading h2:nth-child(2)');
        let pointsElement = document.querySelector('.heading h2:nth-child(3)');

        nameElement.innerHTML = memberData.firstName + ' ' + memberData.lastName;
        accountNumberElement.innerHTML = memberData.accountNumber;
        pointsElement.innerHTML = memberData.points;
    }

    let partnerData = memberData.partnersData;
    console.log(partnerData);

    let partnerDropdown = document.querySelector('.use-partner select');
    console.log(partnerDropdown);

    partnerDropdown.innerHTML = '<option value="" disabled="" selected="">select</option>';
    for (var i = 0; i < partnerData.length; i++) {
        partnerDropdown.innerHTML += '<option partner-id=' + partnerData[i].id + '> ' + partnerData[i].name + '</option>';
    }

    let accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
    console.log(accountNumber);

    let cardId = JSON.parse(localStorage.getItem('cardId'));
    console.log(cardId);
//
    $('.use-partner select').on('change', function(e) {
        e.preventDefault();
        var partnerid = $(this).find(':selected').attr('partner-id');
        var formCardId = cardId;
        var inputData = JSON.stringify({
            partnerId: partnerid,
            cardId: formCardId
        });
        console.log(inputData);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'addRewardTransactions',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);

                $('.redeemloyalty').html(function() {
                    var dropdown = '<select class="form-control" id="transactionDropdown">';
                    var transactionData = data.success;
                    console.log(transactionData);
                    for (var i = 0; i < transactionData.length; i++) {
                        dropdown += '<option value="' + transactionData[i].points + '">' + transactionData[i].item + ' - ' + transactionData[i].points + ' points</option>';
                    }
                    dropdown += '</select>';
                    return dropdown;
                });

            }
        });
    });

        $('.redeemloyalty').on('change', '#transactionDropdown', function(e) {
            e.preventDefault();
            var formPoints = $(this).val();
            usePoints(formPoints);
        });

        $('.use-points-transaction').click(function(e) {
            e.preventDefault();
            var formPoints = $('.usePoints input').val();
            usePoints(formPoints);
        });

    function usePoints(formPoints) {
        var accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
        var cardId = JSON.parse(localStorage.getItem('cardId'));
        var formPartnerId = $('.use-partner select').find(":selected").attr('partner-id');

        if (!formPartnerId) {
            alert("Select partner first");
            return;
        }

        formPoints = parseFloat(formPoints);

        if(!isNaN(formPoints) || formPoints <= 0){
            alert("Enter a valid number of points");
            return;
        }
            

        var inputData = JSON.stringify({
            "accountnumber": accountNumber,
            "cardid": cardId,
            "points": formPoints,
            "partnerid": formPartnerId
        });
        console.log(inputData);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'usePoints',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                document.querySelector('.loader').style.display = "block";

                if (data.error) {
                    let error = data.error;
                    if ((start = data.error.indexOf("Error")) >= 0) {
                        let start = data.error.indexOf("Error");
                        error = data.error.slice(start);
                    }
                    return;
                } else {
                    updateMember();
                    alert('Transaction successful');
                    var pointsElement = document.querySelector('.heading h2:nth-child(3)');
                    var currentPoints = parseInt(pointsElement.innerHTML);
                    var redeemedPoints = parseInt(formPoints);
                    var newPoints = currentPoints - redeemedPoints;
                    updatePoints(newPoints);
                    $('.use-partner select').val('');
                    $('.usePoints input').val('');
                    $('.redeemloyalty').html('');
                    let loader = document.querySelector('.loader');
                    console.log(loader);
                    loader.style.display = 'block';
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                
                alert("Error: Try again")
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            }
        });
    };
});


// $(document).ready(function() {
//     var apiUrl = "https://cl-backend.kryptocoder.com/api/";

//     function isLoggedIn() {
//         return sessionStorage.getItem('memberData') !== null;
//     }

//     function updateMember() {
//         var formAccountNum = $('.account-number input').val();
//         var formCardId = $('.card-id input').val();

//         var inputData = JSON.stringify({
//             "accountnumber": formAccountNum,
//             "cardid": formCardId
//         });

//         $.ajax({
//             type: 'POST',
//             url: apiUrl + 'memberData',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             success: function(data) {
//                 if (data.error) {
//                     // Handle error
//                 } else {
//                     localStorage.setItem('accountNumber', JSON.stringify(formAccountNum));
//                     localStorage.setItem('cardId', JSON.stringify(formCardId));
//                     sessionStorage.setItem('memberData', JSON.stringify(data));
//                     updatePoints(data.points);
//                     // Redirect to appropriate page based on current location
//                     if (window.location.pathname === '/member-dashboard.html') {
//                         window.location.href = "member-dashboard.html";
//                     } else if (window.location.pathname === '/reedem.html') {
//                         window.location.href = "reedem.html";
//                     } else {
//                         window.location.href = "index.html";
//                     }
//                 }
//             },
//             error: function(jqXHR, textStatus, errorThrown) {
//                 alert("Error: Try again");
//                 console.log(errorThrown);
//                 console.log(textStatus);
//                 console.log(jqXHR);
//             }
//         });
//     }

//     function logout() {
//         sessionStorage.removeItem('memberData');
//         window.location.href = 'index.html';
//     }

//     function updatePoints(points) {
//         var pointsElement = document.querySelector('.heading h2:nth-child(3)');
//         if (pointsElement) {
//             pointsElement.innerHTML = points;
//         }

//         var memberData = JSON.parse(sessionStorage.getItem('memberData'));
//         if (memberData) {
//             memberData.points = points;
//             sessionStorage.setItem('memberData', JSON.stringify(memberData));
//         }
//     }

//     function earnPoints(formPoints, formPartnerId) {
//         var accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
//         var cardId = JSON.parse(localStorage.getItem('cardId'));

//         var inputData = JSON.stringify({
//             "accountnumber": accountNumber,
//             "cardid": cardId,
//             "points": formPoints,
//             "partnerid": formPartnerId
//         });

//         $.ajax({
//             type: 'POST',
//             url: apiUrl + 'earnPoints',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             success: function(data) {
//                 updateMember();
//                 alert('Points earned successfully');
//             },
//             error: function(jqXHR, textStatus, errorThrown) {
//                 alert("Error: Try again");
//                 console.log(errorThrown);
//                 console.log(textStatus);
//                 console.log(jqXHR);
//             }
//         });
//     }

//     function usePoints(formPoints, formPartnerId) {
//         var accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
//         var cardId = JSON.parse(localStorage.getItem('cardId'));

//         var inputData = JSON.stringify({
//             "accountnumber": accountNumber,
//             "cardid": cardId,
//             "points": formPoints,
//             "partnerid": formPartnerId
//         });

//         $.ajax({
//             type: 'POST',
//             url: apiUrl + 'usePoints',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             success: function(data) {
//                 updateMember();
//                 alert('Points redeemed successfully');
//             },
//             error: function(jqXHR, textStatus, errorThrown) {
//                 alert("Error: Try again");
//                 console.log(errorThrown);
//                 console.log(textStatus);
//                 console.log(jqXHR);
//             }
//         });
//     }

//     $('.sign-in-member').click(function(event) {
//         event.preventDefault();
//         updateMember();
//     });

//     $('.log-out').click(function(event) {
//         event.preventDefault();
//         logout();
//     });

//     $('.earn-points-transaction').click(function(e) {
//         e.preventDefault();
//         var formPoints = $('.earnPoints input').val();
//         var formPartnerId = $('.earn-partner select').find(":selected").attr('partner-id');
//         earnPoints(formPoints, formPartnerId);
//     });

//     $('.use-points-transaction').click(function(e) {
//         e.preventDefault();
//         var formPoints = $('.usePoints input').val();
//         var formPartnerId = $('.use-partner select').find(":selected").attr('partner-id');
//         usePoints(formPoints, formPartnerId);
//     });

//     // Retrieve member data from session storage
//     var memberData = JSON.parse(sessionStorage.getItem('memberData'));
//     if (memberData) {
//         console.log(memberData);
//         let nameElement = document.querySelector('.heading h2:nth-child(1)');
//         let accountNumberElement = document.querySelector('.heading h2:nth-child(2)');
//         let pointsElement = document.querySelector('.heading h2:nth-child(3)');

//         nameElement.innerHTML = memberData.firstName + ' ' + memberData.lastName;
//         accountNumberElement.innerHTML = memberData.accountNumber;
//         pointsElement.innerHTML = memberData.points;

//         let partnerData = memberData.partnersData;

//         // Populate partner dropdowns
//         $('.earn-partner select, .use-partner select').html('<option value="" disabled="" selected="">select</option>');
//         for (var i = 0; i < partnerData.length; i++) {
//             $('.earn-partner select').append('<option partner-id="' + partnerData[i].id + '">' + partnerData[i].name + '</option>');
//             $('.use-partner select').append('<option partner-id="' + partnerData[i].id + '">' + partnerData[i].name + '</option>');
//         }
//     }
// });
