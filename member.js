$(document).ready(function() {
  var apiUrl = "https://cl-backend.kryptocoder.com/api/";

  if (window.location.pathname.endsWith('.html')) {
      var newURL = window.location.pathname.replace('.html', '');
      window.history.replaceState({}, document.title, newURL);
  }

  function isLoggedIn() {
      return sessionStorage.getItem('memberData') !== null;
  }

  if (!isLoggedIn() && window.location.pathname === '/member-dashboard') {
      window.location.href = '/index.html';
  }

  $('.sign-in-member').click(function(event) {
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
                  // alert(data.error);
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

  $('.log-out').click(function(event) {
      event.preventDefault();
      logout();
  })

  function logout() {
      sessionStorage.removeItem('memberData');
      window.location.href = '/index.html';
  }

  function updatePoints(points) {
      var pointsElement = document.querySelector('.heading h2:nth-child(3)');
      if (pointsElement) {
          pointsElement.innerHTML = points;
      }

      // Update points in the database
      var memberData = JSON.parse(sessionStorage.getItem('memberData'));
      if (memberData) {
          memberData.points = points;
          sessionStorage.setItem('memberData', JSON.stringify(memberData));
          // Send AJAX request to update points in the database
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
              success: function(data) {
                  console.log("Points updated in the database:", data);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.error("Error updating points in the database:", errorThrown);
              }
          });
      }
  }

  var memberData = JSON.parse(sessionStorage.getItem('memberData'));
  if (memberData) {
      let nameElement = document.querySelector('.heading h2:nth-child(1)');
      let accountNumberElement = document.querySelector('.heading h2:nth-child(2)');
      let pointsElement = document.querySelector('.heading h2:nth-child(3)');

      nameElement.innerHTML = memberData.firstName + ' ' + memberData.lastName;
      accountNumberElement.innerHTML = memberData.accountNumber;
      pointsElement.innerHTML = memberData.points;
  }

  let partnerData = memberData.partnersData;
  console.log(partnerData);

  let partnerDropdown = document.querySelector('.earn-partner select');
  console.log(partnerDropdown);

  partnerDropdown.innerHTML = '<option value="" disabled="" selected="">select</option>';
  for (var i = 0; i < partnerData.length; i++) {
      partnerDropdown.innerHTML += '<option partner-id=' + partnerData[i].id + '> ' + partnerData[i].name + '</option>';
  }

  let accountNumber = JSON.parse(localStorage.getItem('accountNumber'));
  console.log(accountNumber);

  let cardId = JSON.parse(localStorage.getItem('cardId'));
  console.log(cardId);

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
          beforeSend: function() {
              document.querySelector('.loader').style.display = "block";
          },
          success: function(data) {
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
                  // location.reload();
                  var pointsElement = document.querySelector('.heading h2:nth-child(3)');
                  var currentPoints = parseInt(pointsElement.innerHTML);
                  var earnedPoints = parseInt(formPoints);
                  var newPoints = currentPoints + earnedPoints;
                  updatePoints(newPoints);
                  $('.earn-partner select').val('');
                  $('.earnPoints input').val('');
                  $('#earnloyalty').html('');
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

  $('.earn-partner select').on('change', function(e) {
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
          success: function(data) {
              console.log(data);
              $('#earnloyalty').html(function() {
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

  $('#earnloyalty').on('change', '#transactionDropdown', function(e) {
      e.preventDefault();
      var formPoints = $(this).val();
      earnPoints(formPoints);
  });

  $('.earn-points-transaction').click(function(e) {
      e.preventDefault();
      var formPoints = $('.earnPoints input').val();
      earnPoints(formPoints);
      // location.reload();
  });
});
