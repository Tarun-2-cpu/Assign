// $(document).ready(function () {
//     var apiUrl = "https://cl-backend.kryptocoder.com/api/";

//     function isLoggedIn() {
//         return sessionStorage.getItem('memberData') !== null;
//     }

//     if (!isLoggedIn() && window.location.pathname === 'member-dashboard.html') {
//         window.location.href = 'index.html';
//     }

//     $('.sign-in-member').click(function (event) {
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
//             success: function (data) {
//                 if (data.error) {
//                     // alert(data.error);
//                 } else {
//                     console.log(data);
//                     localStorage.setItem('accountNumber', JSON.stringify(formAccountNum));
//                     localStorage.setItem('cardId', JSON.stringify(formCardId));
//                     sessionStorage.setItem('memberData', JSON.stringify(data));
//                     updatePoints(data.points);
//                     window.location.href = "member-dashboard.html";
//                     console.log(data);
//                 }
//             },
//             error: function (jqXHR, textStatus, errorThrown) {
//                 alert("Error: Try again");
//                 console.log(errorThrown);
//                 console.log(textStatus);
//                 console.log(jqXHR);
//             }
//         });
//     }

//     $('.log-out').click(function (event) {
//         event.preventDefault();
//         logout();
//     })

//     function logout() {
//         sessionStorage.removeItem('memberData');
//         window.location.href = 'index.html';
//     }

//     function updatePoints(points) {
//         var pointsElement = document.querySelector('.heading h2:nth-child(3)');
//         if (pointsElement) {
//             pointsElement.innerHTML = points;
//         }

//         // Update points in the database
//         var memberData = JSON.parse(sessionStorage.getItem('memberData'));
//         console.log(memberData);
//         if (memberData) {
//             console.log(memberData);
//             memberData.points = points;
//             sessionStorage.setItem('memberData', JSON.stringify(memberData));
//             // Send AJAX request to update points in the database
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
//                 success: function (data) {
//                     console.log("Points updated in the database:", data);
//                 },
//                 error: function (jqXHR, textStatus, errorThrown) {
//                     console.error("Error updating points in the database:", errorThrown);
//                 }
//             });
//         }
//     }

    

//     var memberData = JSON.parse(sessionStorage.getItem('memberData'));
//     console.log(memberData);
//     if (memberData) {
//         let nameElement = document.querySelector('.heading h2:nth-child(1)');
//         let accountNumberElement = document.querySelector('.heading h2:nth-child(2)');
//         let pointsElement = document.querySelector('.heading h2:nth-child(3)');

//         nameElement.innerHTML = memberData.firstName + ' ' + memberData.lastName;
//         accountNumberElement.innerHTML = memberData.accountNumber;
//         pointsElement.innerHTML = memberData.points;
//     }

//     let partnerData = memberData.partnersData;

//     let partnerDropdown = document.querySelector('.earn-partner select');

//     partnerDropdown.innerHTML = '<option value="" disabled="" selected="">select</option>';
//     for (var i = 0; i < partnerData.length; i++) {
//         partnerDropdown.innerHTML += '<option partner-id=' + partnerData[i].id + '> ' + partnerData[i].name + '</option>';
//     }

//     let accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
    
//     let cardId = JSON.parse(localStorage.getItem('cardId'));
    
//     function addTransactionCard(){
//         $('.profile-header').css('display', 'block');
//         var newCardHTML = `
//             <div class="row clearfix w_social3">
//                 <div class="">
//                     <div class="card twitter-widget">
//                         <div class="icon">  
//                             <i class="fa fa-money"></i>
//                         </div>
//                         <div class="content">
//                             <div class="text">New Points</div>
//                             <div class="text">Allocated</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//         $('.transaction-history-card .body').prepend(newCardHTML);
//     }

//     function earnPoints(formPoints){
//         var formAccountNum = accountNumber;
//         var formCardId = cardId;
//         var formPartnerId = $('.earn-partner select').find(":selected").attr('partner-id');

//         if (!formPartnerId) {
//             alert("Select a partner first");
//             return;
//         }

//         formPoints = parseFloat(formPoints);

//         if (isNaN(formPoints) || formPoints <= 0) {
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
//             url: apiUrl + 'earnPoints',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             beforeSend: function () {
//                 document.querySelector('.loader').style.display = "block";
//             },
//             success: function (data) {
//                 console.log(data);
//                 if (data.error) {
//                     var error = data.error;
//                     if (error.includes("Error")) {
//                         error = error.slice(error.indexOf("Error"));
//                     }
//                     alert(error);
//                 } else {
//                     updateMember();
//                     alert('Transaction successful');
//                     // location.reload();
//                     var pointsElement = document.querySelector('.heading h2:nth-child(3)');
//                     var currentPoints = parseInt(pointsElement.innerHTML);
//                     var earnedPoints = parseInt(formPoints);
//                     var newPoints = currentPoints + earnedPoints;
//                     updatePoints(newPoints);
//                     addTransactionCard();
//                     $('.earn-partner select').val('');
//                     $('.earnPoints input').val('');
//                     $('#earnloyalty').html('');
//                 }
//             },
//             error: function (jqXHR, textStatus, errorThrown) {
//                 alert("Error: Try again");
//                 console.log(errorThrown);
//                 console.log(textStatus);
//                 console.log(jqXHR);
//             }
//         });
//     }

//     $('.earn-partner select').on('change', function (e) {
//         e.preventDefault()
//         var partnerid = $(this).find(':selected').attr('partner-id');
//         var formCardId = cardId;
//         var inputData = '{' + '"partnerId" : "' + partnerid + '", ' + '"cardId" : "' + formCardId + '"}';
//         console.log(inputData);

//         $.ajax({
//             type: 'POST',
//             url: apiUrl + 'addOfferTransactions',
//             data: inputData,
//             dataType: 'json',
//             contentType: 'application/json',
//             success: function (data) {
//                 console.log(data);
//                 $('#earnloyalty').html(function () {
//                     var dropdown = '<select class="form-control" id="transactionDropdown">';
//                     var transactionData = data.success;
//                     for (var i = 0; i < transactionData.length; i++) {
//                         dropdown += '<option value="' + transactionData[i].points + '">' + 'Purchase ' + transactionData[i].product + ' for $' + transactionData[i].price + ' and earn ' + transactionData[i].points + ' points</option>';
//                     }
//                     dropdown += '</select>';
//                     return dropdown;
//                 });
//             }
//         });
//     });

//     $('#earnloyalty').on('change', '#transactionDropdown', function (e){
//         e.preventDefault();
//         var formPoints = $(this).val();
//         earnPoints(formPoints);
//     });

//     $('.earn-points-transaction').click(function (e) {
//         e.preventDefault();
//         var formPoints = $('.earnPoints input').val();
//         earnPoints(formPoints);
//     });
// });

$(document).ready(function () {
    var apiUrl = "https://cl-backend.kryptocoder.com/api/";

    function isLoggedIn() {
        return sessionStorage.getItem('memberData') !== null;
    }

    if (!isLoggedIn() && window.location.pathname === 'member-dashboard.html') {
        window.location.href = 'index.html';
    }

    $('.sign-in-member').click(function (event) {
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
            success: function (data) {
                if (data.error) {
                    // alert(data.error);
                } else {
                    console.log(data);
                    localStorage.setItem('accountNumber', JSON.stringify(formAccountNum));
                    localStorage.setItem('cardId', JSON.stringify(formCardId));
                    sessionStorage.setItem('memberData', JSON.stringify(data));
                    updatePoints(data.points);
                    window.location.href = "member-dashboard.html";
                    console.log(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error: Try again");
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            }
        });
    }

    $('.log-out').click(function (event) {
        event.preventDefault();
        logout();
    })

    function logout() {
        sessionStorage.removeItem('memberData');
        window.location.href = 'index.html';
    }

    function updatePoints(points) {
        var pointsElement = document.querySelector('.heading h2:nth-child(3)');
        if (pointsElement) {
            pointsElement.innerHTML = points;
        }

        var memberData = JSON.parse(sessionStorage.getItem('memberData'));
        console.log(memberData);
        if (memberData) {
            console.log(memberData);
            memberData.points = points;
            sessionStorage.setItem('memberData', JSON.stringify(memberData));
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
                success: function (data) {
                    console.log("Points updated in the database:", data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error updating points in  the database:", errorThrown);
                }
            });
        }
    }

    var memberData = JSON.parse(sessionStorage.getItem('memberData'));
    console.log(memberData);
    var memberData = JSON.parse(sessionStorage.getItem('memberData'));
    console.log(memberData);
    if (memberData) {
        let nameElement = document.querySelector('.heading h2:nth-child(1)');
        let accountNumberElement = document.querySelector('.heading h2:nth-child(2)');
        let pointsElement = document.querySelector('.heading h2:nth-child(3)');

        nameElement.innerHTML = memberData.firstName + ' ' + memberData.lastName;
        accountNumberElement.innerHTML = memberData.accountNumber;
        pointsElement.innerHTML = memberData.points;
    }
    let partnerData = memberData.partnersData;

    let partnerDropdown = document.querySelector('.earn-partner select');

    partnerDropdown.innerHTML = '<option value="" disabled="" selected="">select</option>';
    for (var i = 0; i < partnerData.length; i++) {
        partnerDropdown.innerHTML += '<option partner-id=' + partnerData[i].id + '> ' + partnerData[i].name + '</option>';
    }

    let accountNumber = JSON.parse(localStorage.getItem('accountNumber'));

    let cardId = JSON.parse(localStorage.getItem('cardId'));

    function generateTransactionID() {
        var characters = 'abcdef0123456789';
        var transactionId = '';
        for (var i = 0; i < 64; i++) {
            transactionId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return transactionId;
    }

    function getTransactionCardsFromLocalStorage() {
        var transactionCards = localStorage.getItem('transactionCards');
        return transactionCards ? JSON.parse(transactionCards) : [];
    }

    function saveTransactionCardsToLocalStorage(cards) {
        localStorage.setItem('transactionCards', JSON.stringify(cards));
    }

    function addTransactionCardsFromLocalStorage() {
        var transactionCards = getTransactionCardsFromLocalStorage();
        transactionCards.forEach(function(cardData) {
            addTransactionCard(cardData);
        });
    }

    let card = $('.transaction-history-card');
    console.log(card);
    function addTransactionCard(transactionData){
        var transactionCards = JSON.parse(localStorage.getItem('transactionCards')) || [];
        if (transactionCards.length >= 10) {
            transactionCards.shift();
        }
        transactionCards.push(transactionData); 
        localStorage.setItem('transactionCards', JSON.stringify(transactionCards));
        $('.profile-header').css('display', 'block');
        var newCardHTML = `
            <div class="clearfix w_social3 transaction-card new-card">
                <div class="">
                    <div class="card twitter-widget">
                        <div class="icon">  
                            <i class="fa fa-money"></i>
                        </div>
                        <div class="content">
                            <div class="text">New Points</div>
                            <div class="text">Allocated</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        var $newCard = $(newCardHTML);
        $newCard.data('transaction-data', transactionData);
        $('.transaction-history-card .body').prepend($newCard);
        
        $newCard.click(function () {
            var transactionData = $(this).data('transaction-data');
            showTransactionDetail(transactionData);
        });
        setTimeout(function () {
            $('.transaction-card.new-card').removeClass('new-card');
        }, 3000);
    }
    
    addTransactionCardsFromLocalStorage();

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
        $('.transaction-history-detail').html(transactionDetailHTML);
    }

    $('.close').click(function () {
        $('.card-wrapper').css('display', 'none');
    });


    function earnPoints(formPoints) {
        var formAccountNum = accountNumber;
        var formCardId = cardId;
        var formPartnerId = $('.earn-partner select').find(":selected").attr('partner-id');
        if (!formPartnerId) {
            alert("Select a partner first");
            return;
        }

        formPoints = parseFloat(formPoints);

        if (isNaN(formPoints) || formPoints <= 0) {
            alert("Enter a valid number of points");
            return;
        }

        function getISTString(date) {
            return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        }

        var timestamp = getISTString(new Date());
        var partner = formPartnerId;
        var member = formAccountNum;
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
            url: apiUrl + 'earnPoints',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function () {
                // Add loader or any pre-request actions
            },
            success: function (data) {
                console.log(data);
                if (data.error) {
                    var error = data.error;
                    if (error.includes("Error")) {
                        error = error.slice(error.indexOf("Error"));
                    }
                    alert(error);
                } else {
                    updateMember();
                    alert('Transaction successful');
                    var pointsElement = document.querySelector('.heading h2:nth-child(3)');
                    var currentPoints = parseInt(pointsElement.innerHTML);
                    var earnedPoints = parseInt(formPoints);
                    var newPoints = currentPoints + earnedPoints;
                    updatePoints(newPoints);
                    $('.earn-partner select').val('');
                    $('.earnPoints input').val('');
                    $('#earnloyalty').html('');
                    addTransactionCard(transactionData);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error: Try again");
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            }
        });
        function retrieveTransactionCards() {
            return JSON.parse(localStorage.getItem('transactionCards')) || [];
        }
        var transactionCards = retrieveTransactionCards();
        transactionCards.forEach(function (transactionData) {
            addTransactionCard(transactionData);
        });
    }


    $('.earn-partner select').on('change', function (e) {
        e.preventDefault()
        var partnerid = $(this).find(':selected').attr('partner-id');
        var formCardId = cardId;
        var inputData = '{' + '"partnerId" : "' + partnerid + '", ' + '"cardId" : "' + formCardId + '"}';
        console.log(inputData);

        $.ajax({
            type: 'POST',
            url: apiUrl + 'addOfferTransactions',
            data: inputData,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
                $('#earnloyalty').html(function () {
                    var dropdown = '<select class="form-control" id="transactionDropdown">';
                    var transactionData = data.success;
                    for (var i = 0; i < transactionData.length; i++) {
                        dropdown += '<option value="' + transactionData[i].points + '">' + 'Purchase ' + transactionData[i].product + ' for $' + transactionData[i].price + ' and earn ' + transactionData[i].points + ' points</option>';
                    }
                    dropdown += '</select>';
                    return dropdown;
                });
            }
        });
    });

    $('#earnloyalty').on('change', '#transactionDropdown', function (e) {
        e.preventDefault();
        var formPoints = $(this).val();
        earnPoints(formPoints);
    });

    $('.earn-points-transaction').click(function (e) {
        e.preventDefault();
        var formPoints = $('.earnPoints input').val();
        earnPoints(formPoints);
    });
});



