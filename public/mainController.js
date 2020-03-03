app.filter('wraps', function () {
  return function (value) {
    return "uploads/" + value;
  };
});

app.filter('film', function () {
  return function (value) {
    var dr = value.split("T");
    return dr[0] + " " + dr[1];
  };
});

app.filter('cut', function () {
  return function (value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace !== -1) {
        //Also remove . and , so its gives a cleaner result.
        if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
          lastspace = lastspace - 1;
        }
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail || ' …');
  };
});

app.controller('Contact', function ($scope, $http) {

  $scope.sendFeedback = function () {

    var feedback = {
      firstname: $scope.firstname,
      lastname: $scope.lastname,
      email: $scope.email,
      message: $scope.message,
      phone: $scope.phone
    }
    jQuery.post("sendMail", {
      feedback: feedback
    }, function (result) {
      ////alert(JSON.stringify(result))
      if (result.success = 0) {
        swal(
          'Mail failed',
          'feed not sent ensure all fields are filled',
          'error'
        );
      } else {
        swal(
          'Mail Success',
          'Feedback successfully recieved, we will get back to you as soon as we can',
          'success'
        );



        $scope.firstname = "";
        $scope.lastname = "";
        $scope.email = "";
        $scope.phone = "";
        $scope.message = "";

      }
    });
  }


})
app.controller('acc', function ($scope, $http, $location, Customer) {
  var s = function (j) {

    //alert(JSON.stringify(j));
  }
  //alert(Customer.dateFrom)


  //-- No use time. It is a javaScript effect.

  var url = "getRooms"
  $http.get(url).then(function (response) {
    var data = response.data;


    $scope.rooms = data;
    $scope.db = data;


  });

  $scope.byRange = function (fieldName, minValue, maxValue) {
    if (minValue === undefined) minValue = Number.MIN_VALUE;
    if (maxValue === undefined) maxValue = Number.MAX_VALUE;

    return function predicateFunc(item) {
      return minValue <= item[fieldName] && item[fieldName] <= maxValue;
    };
  };
  $scope.currentRoom = {
    name: "Sample"
  }
  $scope.bookRoom = function (room) {
    $scope.currentRoom = room;
    Customer.currentRoom = room;
    s(room);
    localStorage.setItem("room", JSON.stringify(room));

  }
  $scope.no = 0;
  $scope.tab = function (no) {
    $scope.no = no;
  }
  $scope.filter = function () {
    var beds = document.getElementById('child').value;
    var rating = document.getElementById('rating').value;


    if (beds && rating) {
      var fil = _.filter($scope.db, {
        'rating': parseInt(rating),
        'beds': parseInt(beds)
      }, function (o) {
        return o.price < $scope.range;

      });
      $scope.rooms = fil;
    }



  }

  $scope.search = function () {

    var d = new Date($scope.from);
    var d = new Date($scope.to);
    //alert(d);

  }

});
app.controller('home', function ($scope, $rootScope, $http, $location, Customer, $timeout) {

  $scope.home = {};
  $scope.home.Title1 = "";
  var uploadFolder = "uploads/";
  var socket = io();
  console.log(socket)
  socket.on('error', function (err) {
    console.log(err)
    alert("failed")
  })
  socket.on('connect', function (socket) {
    $timeout(() => {
      document.getElementById('chat').style.bottom = "-100px"
    }, 5000)

  });


  var data = Customer.homeDetails
  if (data) {


    $scope.home.Title1 = data.banner_title1;
    $scope.home.Title2 = data.banner_title2;
    $scope.home.banner_image = data.banner_src;

    $scope.home.welcomeTitle = data.welcome_info.title;
    $scope.home.welcomeDetails = data.welcome_info.details;
    $scope.home.featured_rooms = data.rooms;
    $scope.home.feedback = data.feedback;
    $scope.home.news = data.news;
    $scope.home.hf = data.hf[0];

  }
  $rootScope.$on("home", function (evt, data) {
    if (data) {


      $scope.home.Title1 = data.banner_title1;
      $scope.home.Title2 = data.banner_title2;
      $scope.home.banner_image = data.banner_src;

      $scope.home.welcomeTitle = data.welcome_info.title;
      $scope.home.welcomeDetails = data.welcome_info.details;
      $scope.home.featured_rooms = data.rooms;
      $scope.home.feedback = data.feedback;
      $scope.home.news = data.news;
      $scope.home.hf = data.hf[0];

    }
  });
  $scope.bookRoom = function (room) {
    Customer.currentRoom = room;
  }

  $scope.search = function () {


    Customer.to = new Date($scope.to);
    Customer.from = new Date($scope.from);


  }

  $scope.no = 1;
  $scope.tab = function (no) {
    $scope.no = no;
  }



});
app.controller('myAc', function ($scope, $http, $location) {

  $scope.home = {};
  $scope.home.Title1 = "";
  var uploadFolder = "uploads/";

  var s = function (j) {

    ////alert(JSON.stringify(j));
  }
  var url = "HomeDetails"
  $http.get(url).then(function (response) {
    var data = response.data;
    $scope.home.Title1 = data.banner_title1;
    $scope.home.Title2 = data.banner_title2;
    $scope.home.banner_image = data.banner_src;

    $scope.home.welcomeTitle = data.welcome_info.title;
    $scope.home.welcomeDetails = data.welcome_info.details;
    $scope.home.featured_rooms = data.rooms;



  });

  var url = "getRooms"
  $http.get(url).then(function (response) {
    var data = response.data;

    $scope.rooms = data;
    $scope.db = data;


  });
  $scope.byRange = function (fieldName, minValue, maxValue) {
    if (minValue === undefined) minValue = Number.MIN_VALUE;
    if (maxValue === undefined) maxValue = Number.MAX_VALUE;

    return function predicateFunc(item) {
      return minValue <= item[fieldName] && item[fieldName] <= maxValue;
    };
  };

  $scope.bookRoom = function (room) {

    Customer.currentRoom = room;
  }
  $scope.filter = function () {
    var beds = document.getElementById('child').value;
    var rating = document.getElementById('rating').value;


    if (beds && rating) {
      var fil = _.filter($scope.db, {
        'rating': parseInt(rating),
        'beds': parseInt(beds)
      }, function (o) {
        return o.price < $scope.range;

      });
      $scope.rooms = fil;
    }



  }
  $scope.store = function (data) {
    var data = jQuery.param({
      customer_id: cId,
      vehicle_id: vId

    });
    var config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    }
    $http.post('http://ride.velocity.or.ke/overview/taxiride/mobile_view/activate', data, config)
  }
  $scope.search = function () {
    ////alert("")
    var names = ['datepicker', 'datepicker1'];
    var output = [];
    names.forEach(element => {
      var element = "#" + element;
      output.push({
        name: element,
        value: jQuery(element).val()
      });
    });


    localStorage.setItem("selection", JSON.stringify(output));
    ////alert(JSON.stringify(output))
  }

});
app.controller('Booking', function ($scope, $http, Customer) {

  var room = localStorage.getItem("room");
  var dates = localStorage.getItem("selection");
  if (true) {

    var getDate = function (dateString) {
      var dt = dateString.split('-');
      return new Date(dt[0], dt[1], dt[2])
    }

    function dhm(t) {
      var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor((t - d * cd) / ch),
        m = Math.round((t - d * cd - h * ch) / 60000),
        pad = function (n) {
          return n < 10 ? '0' + n : n;
        };
      if (m === 60) {
        h++;
        m = 0;
      }
      if (h === 24) {
        d++;
        h = 0;
      }
      // return [d, pad(h), pad(m)].join(':');
      return d;
    }
    if (!Customer.currentRoom) {
      if (Customer.rooms) {
        var Rm = Customer.rooms[0];
      } else {

        var Rm = {}
        Rm._id = "598eee92fbbace03d0d68746";
        Rm.name = "Kids Room";
        Rm.price = 14;
        Rm.beds = 1,
          Rm.status = "no";
        Rm.rating = 4;
        Rm.complements = "One of a kind room for those with exeucsite taste and  fashon";
        Rm.img = "room-image-ten.jpg";
        Rm.__v = 0;
      }

    } else {
      var Rm = Customer.currentRoom;
    }

    var dd = JSON.parse(dates);
    if (!Customer.from || !Customer.to) {
      $scope.from = new Date();
      var day = new Date();
      console.log(day);

      var nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      $scope.to = nextDay;

    } else {
      $scope.from = Customer.from;
      $scope.to = Customer.to;
    }

    var time = $scope.to - $scope.from;

    $scope.roomId = Rm._id;
    var diff = dhm(time);
    $scope.nights = diff;
    $scope.isPet = "with Pet";
    $scope.isParking = "Parking"
    $scope.currentRoom = Rm;
    $scope.total = $scope.currentRoom.price * $scope.nights
    document.getElementById('datepicker3').addEventListener("change", function () {
      var time = $scope.to - $scope.from;
      var diff = dhm(time);

      if (diff < 0) {

        toastr.error('Error', 'invalid date', {
          timeOut: 5000
        });
        $scope.from = new Date();
        var day = new Date();
        console.log(day);

        var nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        $scope.to = nextDay;

      } else {
        $scope.nights = diff;
      }
    })
    document.getElementById('datepicker4').addEventListener("change", function () {
      var time = $scope.to - $scope.from;
      var diff = dhm(time);

      if (diff < 0) {

        toastr.error('Error', 'invalid date', {
          timeOut: 5000
        });
        $scope.from = new Date();
        var day = new Date();
        console.log(day);

        var nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        $scope.to = nextDay;

      } else {
        $scope.nights = diff;
      }
    })
    $scope.services = [];
    $scope.ser = function (service, amount) {
      var dbd = null;
      dbd = $scope.services;
      var index = _.findIndex(dbd, {
        service: service
      });

      if (index !== -1) {
        dbd.splice(index, 1);
        //  dbd[index]={service:service,amount:amount};
        $scope.services = dbd;
      } else {

        dbd.push({
          service: service,
          amount: amount * $scope.nights
        })
        dbd = _.reverse(dbd);
        $scope.services = dbd;

      }

      var totalex = _.sumBy($scope.services, function (o) {
        return o.amount;
      });
      $scope.expense = totalex;
      $scope.total = $scope.expense + ($scope.currentRoom.price * $scope.nights);


    }

    ;
    $scope.pay = function () {
      swal({
        position: 'top-end',
        type: 'success',
        title: 'Your payment is being processed',
        showConfirmButton: false,
        timer: 1500
      })
      Stripe.setPublishableKey('pk_test_sV1re0HLbpAJhKlUJIzOn6UK');
      Stripe.card.createToken({
        number: jQuery('#cardnumber_c').val(),
        cvc: jQuery('#cvc_c').val(),
        exp_month: jQuery('#month_c').val(),
        exp_year: jQuery('#year_c').val()
      }, function (status, response) {
        if (response.error) {

          swal(
            'Payment failed',
            response.error.message,
            'error'
          );
        } else {
          var token = response.id;

          var booking = {
            from: $scope.from,
            to: $scope.to,
            roomId: $scope.currentRoom._id,
            userId: $scope.userId,
            amount: $scope.total,
            expenses: $scope.services,
            paid: 0
          }


          toastr.success('Processing', 'submitting', {
            timeOut: 5000
          });
          jQuery.post("token", {
            token: token,
            book: booking,
            mail: $scope.generateMail(),
            email: $scope.email
          }, function (result) {
            if (result == "charged") {

              swal(
                'Success',
                "Payment successfuly made check your email for further details",
                'success'
              );
              document.getElementById('lastone').click();
            } else {
              swal(
                'Payment failed',
                "Please check your detail and try again!",
                'error'
              );
            }
          })
        }



      });


    }
    var str = function (name, item) {
      localStorage.setItem(name, JSON.stringify(item));
    }
    var gt = function (name) {
      return localStorage.getItem(name);

    }
    $scope.generateMail = function () {
      var template = Customer.sendMail()
      var tmt2 = '<span class="header-sm"> Check In Date </span><br />' +

        $scope.from + '<br />  <br />  <span class="header-sm"> Check out Date </span><br />' +
        $scope.to + '<br /> <br /><span class="header-sm">Total Amount</span> <br />' +
        'Ksh' + $scope.total;
      var tmt = '<span class="header-sm">Booking Details</span><br />';
      $scope.services.forEach((element, index) => {
        index = index + 1;
        tmt = tmt + '<b>' + index + '</b> ' + element.service + "  <b> Ksk" + element.amount + '<b/> <br /> <hr/>'
      });
      var tot = $scope.services.length + 1;
      tmt = tmt + '<b>' + tot + '</b> Room charge   <b> Ksh' + ($scope.currentRoom.price * $scope.nights) + '<b/> <br /> <hr/>'
      console.log(tmt);
      template = template.replace("##section1##", tmt2);
      template = template.replace("##section2##", tmt);
      template = template.replace("**rid**", $scope.currentRoom._id);

      return template;


    }

    var upload = function (datx, url, message) {
      var data = jQuery.param(datx);
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      }
      //////alert(JSON.stringify(data))
      $http.post(url, datx).then(function (response) {

        var d = response.data;

        if (d.success == 1) {
          data.id = d.id;
          $scope.userId = d.id;
          localStorage.setItem("user_now", JSON.stringify(data));
          swal(
            'Success',
            "User Registered",
            'success'
          );
          $scope.tab(2);
        } else {
          swal(
            'Error',
            d.message,
            'error'
          );
        }



      })
    }
    $scope.goto = function () {
      $scope.tab(1);

    }
    $scope.next = function () {

      var user = {
        firstname: $scope.firstname,
        lastname: $scope.lastname,
        email: $scope.email,
        number: $scope.number,
        withpet: jQuery('#with_pet_select').val(),
        parking: jQuery('#parking_select').val(),
        request: $scope.specialRequest
      }

      upload(user, "createUser", "users created")
    }

    $scope.currentRoom = Rm;
    $scope.beds = Rm.beds + " BEDS";
    if (Rm.rating) {
      var foo = [];

      for (var i = 1; i <= Rm.rating; i++) {
        foo.push(i);
      }
      $scope.rating = foo;

    }
    $scope.no = 0;
    $scope.tab = function (no) {
      $scope.no = no;
    }


  }
});