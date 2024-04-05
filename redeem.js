// $(document).ready(function() {
//     var apiUrl = "https://cl-backend.kryptocoder.com/api/";

//     function isLoggedIn(){
//         return sessionStorage.getItem('memberData') !== null;
//     }
    
//     if(!isLoggedIn() && window.location.pathname === 'reedem.html'){
//         window.location.href = 'index.html';
//     }


//     $('.sign-in-member').click(function(event){
//         event.preventDefault();
//         updateMember();
//     });

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
//                 } else {
//                     localStorage.setItem('accountNumber', JSON.stringify(formAccountNum));
//                     localStorage.setItem('cardId', JSON.stringify(formCardId));
//                     sessionStorage.setItem('memberData', JSON.stringify(data));
//                     updatePoints(data.points);
//                     window.location.href = "member-dashboard.html";
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


//     $('.log-out').click(function(event){
//         event.preventDefault();
//         logout();
//       })
    
//     function logout(){
//         sessionStorage.removeItem('memberData');
//         window.location.href = 'index.html';
//     }



//     // Function to update points in the heading section
//     function updatePoints(points){
//         var pointsElement = document.querySelector('.heading h2:nth-child(3)');
//         if(pointsElement){
//             pointsElement.innerHTML = points;
//         }

//         //update points in database 

//         var memberData = JSON.parse(sessionStorage.getItem('memberData'));
//         if(memberData){
//             memberData.points = points;
//             sessionStorage.setItem('memberData',JSON.stringify(memberData));
//             var inputData = JSON.stringify({
//                 "accountnumber": memberData.accountNumber,
//                 "cardid": memberData.cardId,
//                 "points": points
//             });
//             $.ajax({
//                 type: 'POST',
//                 url: apiUrl + 'updatePoints',
//                 data: inputData,
//                 dataType: 'json',
//                 contentType: 'application/json',
//                 success: function(data){
//                     console.log("Points updated in the database:", data)
//                 },
//                 error: function(jqXHR, textStatus,errorThrown){
//                     console.error('Error updating points in the database:', errorThrown);
//                 }
//             });
//         }
//     }


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
//     }

//     let partnerData = memberData.partnersData;
//     console.log(partnerData);

//     let partnerDropdown = document.querySelector('.use-partner select');
//     console.log(partnerDropdown);

//     partnerDropdown.innerHTML = '<option value="" disabled="" selected="">select</option>';
//     for (var i = 0; i < partnerData.length; i++) {
//         partnerDropdown.innerHTML += '<option partner-id=' + partnerData[i].id + '> ' + partnerData[i].name + '</option>';
//     }

//     let accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
//     console.log(accountNumber);

//     let cardId = JSON.parse(localStorage.getItem('cardId'));
//     console.log(cardId);
// //
//     $('.use-partner select').on('change', function(e) {
//         e.preventDefault();
//         var partnerid = $(this).find(':selected').attr('partner-id');
//         var formCardId = cardId;
//         var inputData = JSON.stringify({
//             partnerId: partnerid,
//             cardId: formCardId
//         });
//         console.log(inputData);

//         $.ajax({
//             type: 'POST',
//             url: apiUrl + 'addRewardTransactions',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             success: function(data) {
//                 console.log(data);

//                 $('.redeemloyalty').html(function() {
//                     var dropdown = '<select class="form-control" id="transactionDropdown">';
//                     var transactionData = data.success;
//                     console.log(transactionData);
//                     for (var i = 0; i < transactionData.length; i++) {
//                         dropdown += '<option value="' + transactionData[i].points + '">' + transactionData[i].item + ' - ' + transactionData[i].points + ' points</option>';
//                     }
//                     dropdown += '</select>';
//                     return dropdown;
//                 });

//             }
//         });
//     });

//         $('.redeemloyalty').on('change', '#transactionDropdown', function(e) {
//             e.preventDefault();
//             var formPoints = $(this).val();
//             usePoints(formPoints);
//         });

//         $('.use-points-transaction').click(function(e) {
//             e.preventDefault();
//             var formPoints = $('.usePoints input').val();
//             usePoints(formPoints);
//         });

//     function usePoints(formPoints) {
//         var accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
//         var cardId = JSON.parse(localStorage.getItem('cardId'));
//         var formPartnerId = $('.use-partner select').find(":selected").attr('partner-id');

//         if (!formPartnerId) {
//             alert("Select partner first");
//             return;
//         }

//         formPoints = parseFloat(formPoints);

//         if(isNaN(formPoints) || formPoints <= 0){
//             alert("Enter a valid number of points");
//             return;
//         }
            

//         var inputData = JSON.stringify({
//             "accountnumber": accountNumber,
//             "cardid": cardId,
//             "points": formPoints,
//             "partnerid": formPartnerId
//         });
//         console.log(inputData);

//         $.ajax({
//             type: 'POST',
//             url: apiUrl + 'usePoints',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             success: function(data) {
//                 document.querySelector('.loader').style.display = "block";

//                 if (data.error) {
//                     let error = data.error;
//                     if ((start = data.error.indexOf("Error")) >= 0) {
//                         let start = data.error.indexOf("Error");
//                         error = data.error.slice(start);
//                     }
//                     return;
//                 } else {
//                     updateMember();
//                     alert('Transaction successful');
//                     var pointsElement = document.querySelector('.heading h2:nth-child(3)');
//                     var currentPoints = parseInt(pointsElement.innerHTML);
//                     var redeemedPoints = parseInt(formPoints);
//                     var newPoints = currentPoints - redeemedPoints;
//                     updatePoints(newPoints);
//                     $('.use-partner select').val('');
//                     $('.usePoints input').val('');
//                     $('.redeemloyalty').html('');
//                     let loader = document.querySelector('.loader');
//                     console.log(loader);
//                     loader.style.display = 'block';
//                 }
//             },
//             error: function(jqXHR, textStatus, errorThrown){
                
//                 alert("Error: Try again")
//                 console.log(errorThrown);
//                 console.log(textStatus);
//                 console.log(jqXHR);
//             }
//         });
//     };
// });


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

    function updatePoints(points){
        var pointsElement = document.querySelector('.heading h2:nth-child(3)');
        if(pointsElement){
            pointsElement.innerHTML = points;
        }

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
    
    partnerDropdown.innerHTML = '<option value="" disabled="" selected="">select</option>';
    for (var i = 0; i < partnerData.length; i++) {
        partnerDropdown.innerHTML += '<option partner-id=' + partnerData[i].id + '> ' + partnerData[i].name + '</option>';
    }

    let accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
    console.log(accountNumber);

    let cardId = JSON.parse(localStorage.getItem('cardId'));
    console.log(cardId);
    
    function generateTransactionID(){
        var characters = 'abcdef0123456789';
        var transactionId = '';
        for (var i = 0; i < 64; i++) {
            transactionId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return transactionId;
    }

    function getTransactionCardsFromLocalStorage() {
        var reedemCards = localStorage.getItem('reedemCards');
        return reedemCards ? JSON.parse(reedemCards) : [];
    }

    function saveTransactionCardsToLocalStorage(cards) {
        localStorage.setItem('reedemCards', JSON.stringify(cards));
    }

    function addTransactionCardsFromLocalStorage() {
        var reedemCards = getTransactionCardsFromLocalStorage();
        reedemCards.forEach(function(cardData) {
            addTransactionCard(cardData);
        });
    }

    addTransactionCardsFromLocalStorage();


    function addTransactionCard(transactionData) {
        var transactionCards = getTransactionCardsFromLocalStorage();
    
        // Check for duplicates
        var isDuplicate = transactionCards.some(function(card) {
            return card.points === transactionData.points && card.timestamp === transactionData.timestamp;
        });
    
        // If it's a duplicate, return
        if (isDuplicate) {
            return;
        }
    
        // Add the new card to the end of the list
        transactionCards.push(transactionData);
    
        // Remove any existing cards from the UI
        $('.reedem-history-card .body').empty();
    
        // Add the last 5 cards to the UI
        var startIndex = Math.max(0, transactionCards.length - 4);
        for (var i = startIndex; i < transactionCards.length; i++) {
            var cardData = transactionCards[i];
            
            var transactionIDShort = cardData.transactionID.substring(0, 10) + "...";

                var timestamp = cardData.timestamp;
                var dateTimeParts = timestamp.split(" "); // Splitting timestamp into date and time parts

                var newCardHTML = `
                    <div class="clearfix w_social3 reedem-card">
                        <div class="">
                            <div class="card twitter-widget">
                                <div class="icon">  
                                </div>
                                <div class="content">
                                    <div class="text"><b>${cardData.points} </b> Points </div><br/>
                                    <div class="text">${transactionIDShort}</div><br/>
                                    <div class="text">
                                        <b>${dateTimeParts[1]}</b> <!-- Time -->
                                        <br>
                                        ${dateTimeParts[0]} <!-- Date -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            var $newCard = $(newCardHTML);
            $newCard.data('transaction-data', cardData);
            $('.reedem-history-card .body').append($newCard);
    
            if (i === transactionCards.length - 1) {
                // Add animation class to the newly added card
                $newCard.addClass('new-card');
    
                // After a delay, remove the animation class
                setTimeout(function() {
                    $newCard.removeClass('new-card');
                }, 2000); 
            }
    
            $newCard.click(function () {
                var transactionData = $(this).data('transaction-data');
                showTransactionDetail(transactionData);
            });
        }
        saveTransactionCardsToLocalStorage(transactionCards);
    }


    


    function showTransactionDetail(transactionData) {
        var transactionDetailHTML =
            `<table>
                <tr><td><b>Time Stamp:</b></td><td>${transactionData.timestamp}</td></tr>
                <tr><td><b>Partner:</b></td><td>${transactionData.partner}</td></tr>
                <tr><td><b>Member:</b></td><td>${transactionData.member}</td></tr>
                <tr><td><b>Points:</b></td><td>${transactionData.points}</td></tr>
                <tr><td><b>Transaction ID:</b></td><td>${transactionData.transactionID}</td></tr>
            </table>
        `;
        $('.card-wrapper').css('display', 'block');
        $('.reedem-history-detail').html(transactionDetailHTML);
    }

    $('.close').click(function () {
        $('.card-wrapper').css('display', 'none');
    });

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

        if(isNaN(formPoints) || formPoints <= 0){
            alert("Enter a valid number of points");
            return;
        }

        function getISTString(date) {
            return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        }

        var timestamp = getISTString(new Date());
        var partner = formPartnerId;
        var member = accountNumber;
        var points = formPoints;
        var transactionID = generateTransactionID();
        
        var transactionData = {
            "timestamp": timestamp,
            "partner": partner,
            "member": member,
            "points": points,
            "transactionID": transactionID
        };

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
                    var pointsElement = document.querySelector('.heading h2:nth-child(3)');
                    var currentPoints = parseInt(pointsElement.innerHTML);
                    var redeemedPoints = parseInt(formPoints);
                    var newPoints = currentPoints - redeemedPoints;
                    updatePoints(newPoints);
                    $('.use-partner select').val('');
                    $('.usePoints input').val('');
                    $('.redeemloyalty').html('');
                    addTransactionCard(transactionData);
                    Swal.fire({
                        icon:'success',
                        title:'Points Redeemed Successfully',
                        showConfirmButton:false,
                        timer:2000
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                
                alert("Error: Try again")
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            }
        });

        function retrieveTransactionCards() {
            return JSON.parse(localStorage.getItem('reedemCards')) || [];
        }
        var transactionCards = retrieveTransactionCards();
        transactionCards.forEach(function (transactionData) {
            addTransactionCard(transactionData);
        });
    };
});
