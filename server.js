const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const engine = require('ejs-locals');
const cors = require('cors');
var atob = require('atob');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session')
var multer = require('multer');

//set up multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({
        storage: storage
    })
    //bring in models
var Room = require("./Models/room");
var User = require("./Models/user");
var Employee = require("./Models/Employee");
var Iheader = require("./Models/Iheader");
var I2 = require("./Models/I2");
var Feedback = require("./Models/feedback");
var Itab = require("./Models/Itab");
var Booking = require("./Models/booking");
var section = require("./Models/section");
var News = require("./Models/news");
var morgan = require('morgan')

//set up database
mongoose.connect("mongodb://saf:ademba4@ds119258.mlab.com:19258/royal", function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("database connected");
    }

});

//initialize app
var app = express();
app.use(cors());
app.options('*', cors());

app.use(express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/public/uploads'));
app.set('views', __dirname + '/views');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan(function(tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))

app.use('/admin', express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/public/uploads'));

console.log("wawawa")
app.get("/", (req, res) => {
    res.sendFile(__dirname + "public/index.html")
})

app.get("/control", (req, res) => {
    res.sendFile(__dirname + "public/admin.html")
})
app.get("/x", (req, res) => {


    Iheader.find((err, header) => {
        if (err) return console.error(err);
        var nth = header.length - 1;
        var item = header[nth];


        var I2Item = {};
        I2.find((err, items) => {
            if (err) return console.error(err);
            var nth = items.length - 1;
            I2Item = items[nth];

            res.render('index.ejs', {
                line1: item.line1,
                line2: item.line2,
                src: item.src,
                H2: I2Item
            });

        })

    })
});


var sendEmail = function(rec, body, subject) {
        'use strict';
        const nodemailer = require('nodemailer');

        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'salientke@gmail.com', // generated ethereal user
                    pass: 'philip@ademba4' // generated ethereal password
                }
            });

            let mailOptions = {
                from: 'salientke@gmail.com', // sender address
                to: rec, // list of receivers
                subject: subject, // Subject line
                text: 'Salient Guest house no reply', // plain text body
                html: body // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.send("sent")
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });

    }
    //routes
app.post("/sendMail", (req, res) => {
    console.log(req.body)
    new Feedback(req.body.feedback).save(function(err) {
        if (err) {
            console.log(err)
            res.send({
                success: 0
            })
        } else {
            res.send({
                success: 1
            })
        }
    })
});

app.get("/at", function(req, res) {
    res.send(atob('SGVsbG8sIFdvcmxkIQ=='));
});

//imap

app.get("/HomeDetails", (req, res) => {
    //this get the detail for the home page

    Iheader.find((err, header) => {
        if (err) return console.error(err);
        var nth = header.length - 1;
        var item = header[nth];
        if (!item) {
            item = {}
        }

        var I2Item = {};
        I2.find((err, items) => {
            if (err) return console.error(err);
            var nth = items.length - 1;
            I2Item = items[nth];
            Room.
            find({
                rating: {
                    $gt: 3,
                    $lt: 6
                }
            }).
            limit(4).
            sort({
                rating: -1
            }).
            exec(function(err, rooms) {
                Feedback.find(function(err, feedback) {
                    Itab.find({}, function(err, hf) {

                        News.
                        find({}).
                        limit(3).
                        sort({
                            date: -1
                        }).
                        exec(function(err, news) {
                            if (err) {
                                console.log(errr);
                            }
                            res.send({
                                news: news,
                                hf: hf,
                                feedback: feedback,
                                banner_title1: item.line1,
                                banner_title2: item.line2,
                                banner_src: item.src,
                                welcome_info: I2Item,
                                rooms: rooms
                            });
                        })
                    })
                })
            });
        })
    })


});

app.post('/philip', function(req, res) {
    console.log("trial for access")
    var name = req.body.points;
    var price = req.body.rId;
    console.log(name);
    console.log(price);
    res.send("heloow");

});

app.get('/login', function(req, res) {
    res.render("login.ejs")
});

app.get('/getRooms', function(req, res) {
    Room.find((err, rms) => {
        console.log("getting rooms");
        res.send(rms);

    });

});

app.post("/loginx", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;


    Employee.findOne({
        email: email
    }, function(err, em) {
        if (err) {
            console.log(err.message)
            res.send({
                success: 0,
                user: err.message
            });
        } else {
            console.log(em);
            // bcrypt.compareSync(password, hash); 
            if (em != null) {

                // Load hash from your password DB.
                bcrypt.compare(password, em.password, function(err, correct) {
                    // res == true
                    if (correct == false) {
                        em.password = null;;
                        console.log({
                            success: 1,
                            user: em
                        });

                        res.send({
                            success: 1,
                            user: em
                        });
                    } else {
                        res.send({
                            success: 0,
                            user: "wrong username or email"
                        });
                    }

                });
            } else {
                res.send("");
            }

        }
    })
});


app.post('/loginPost', function(req, res) {
    console.log(req.body);
    var username = req.body.loginname;
    var password = req.body.password;
    if (username == "admin" && password == "admin123") {
        Room.find((err, rms) => {

            console.log("romm are there")
            res.render('admin.ejs', {
                rooms: rms
            })

        });
    } else {
        res.render('login.ejs')
    }
})

app.post('/upload', upload.single('img'), function(req, res, next) {
    // req.file is the `avatar` file
    console.log(req.body)
    var name = req.body.name;
    var price = req.body.price;
    var beds = req.body.beds;
    var status = req.body.status;
    var src = req.file.originalname;
    var rating = req.body.rating;
    var complements = req.body.complements;
    var room = new Room({
        name: name,
        price: price,
        beds: beds,
        status: status,
        rating: rating,
        complements: complements,
        img: src
    });
    room.save(function(err) {
        Room.find((err, rooms) => {
            if (err) return console.error(err);

            res.render('admin.ejs', {
                rooms: rooms
            })


        });

    });

});
var savefile = function(data) {
    var fs = require('fs');



    fs.writeFile('mynewfile3.jpg', data, function(err) {
        if (err) throw err;
        console.log('Replaced!');
    })
}
var ID = function() {

    return '_' + Math.random().toString(36).substr(2, 9);
};
app.post('/saveRoom', upload.single('img'), function(req, res, next) {

    if (req.body.id) {
        var id = req.body.id;
        delete req.body["id"];
        if (req.file) {
            req.body.img = req.file.originalname;
            console.log("file available")

        }

        Room.update({
            _id: id
        }, {
            $set: req.body
        }, function(err, update) {
            if (err) {
                console.log(err.message)
            } else {
                console.log(req.body);
            }
            console.log(res.Url)
                //res.send("good")

        });
    } else {
        console.log(req.body)
        new Room(req.body).save(function(err) {
            if (err) {
                console.log(err.message);
            }

        });
    }
})

app.post('/saveRoom1', upload.single('img'), async function(req, res, next) {
    // req.file is the `avatar` file

    try {
        console.log(req.body.id);
        var name = req.body.name;
        var price = req.body.price;
        var beds = req.body.beds;

        if (!req.body.id) {

            var status = req.body.status;
            if (req.body.status.includes("yes")) {
                status = "Yes"
            } else {
                status = "No";
            }
            if (!req.file) {
                res.status(500).send("Image not set");
                return;
            }


            var src = req.file.originalname;
            var rating = req.body.rating.replace("number:", "");
            var complements = req.body.complements;
            var detail = {
                name: name,
                price: price,
                beds: beds,
                status: status,
                rating: rating,
                complements: complements,
                img: src
            }
            var room = new Room(detail);

            room.save(function(err) {
                if (err) {
                    res.status(500).send(err.responseJSON.message);
                    return;
                }

                Room.find((err, rooms) => {
                    if (err) {
                        res.status(500).send(err.responseJSON.message);
                        return;
                    }

                    res.status(200).send({
                        rooms: rooms
                    });

                });

            });
        } else {

            var status = req.body.status;
            if (req.body.status.includes("yes")) {
                status = "Yes"
            } else {
                status = "No";
            }

            var rating = req.body.rating.replace("number:", "");
            var complements = req.body.complements;
            var detail = {
                name: name,
                price: price,
                beds: beds,
                status: status,
                rating: rating,
                complements: complements,
            }

            const result = await Room.update({
                _id: req.body.id
            }, {
                $set: detail
            });

            if (result) {
                const rooms = await Room.find({});
                res.status(200).send({
                    rooms: rooms
                });
            } else {
                res.status(500).send("Update failed try again");
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }


});

app.post('/saveNews', upload.single('img'), function(req, res, next) {
    // req.file is the `avatar` file
    console.log(req.body)
    var news = {};
    news.title = req.body.title;
    news.src = req.file.originalname;
    news.content = req.body.content;
    news.src = req.file.originalname;

    var room = new News(news);
    room.save(function(err) {
        if (err) {
            console.log(err)
        }
        res.send("saved")

    });

});

app.post('/header', upload.single('img'), function(req, res, next) {
    // req.file is the `avatar` file


    var line1 = req.body.line1;
    var line2 = req.body.line2;
    var src = req.file.originalname;


    var room = new Iheader({
        line1: line1,
        line2: line2,
        src: src
    });
    room.save();
    console.log("Iheader updated");
    res.render("dash.ejs");


    // req.body will hold the text fields, if there were any
});

app.post('/h2', upload.single('img'), function(req, res, next) {
    // req.file is the `avatar` file
    var title = req.body.title;
    var details = req.body.details;


    var welcomeinfo = new I2({
        title: title,
        details: details
    });
    welcomeinfo.save();
    console.log("welcome info changed");
    res.render("dash.ejs");

    // req.body will hold the text fields, if there were any
});

app.post('/hf', function(req, res, next) {
    console.log(req.body)
    Itab.update({
        _id: "5aee68fe134c1630ccb04865"
    }, {
        $set: req.body
    }, function(err, rez) {

        if (err) {
            console.log(err.message)
        }
        console.log(rez)
    })

    res.send("done")


    // req.body will hold the text fields, if there were any
});

app.get("/dash", (req, res) => {

    res.render('dash.ejs');

});

app.get("/getUsers", (req, res) => {
    User.find({}, function(err, result) {
        if (err) {
            console.log(err.message);
            res.send([])
        } else {
            res.send(result)
        }

    })
})

app.post("/viewDetails", function(req, res) {
    User.findById(req.body.sid, function(err, usr) {
        if (err) {
            usr = {}
            console.log(err.message);
        } else {
            Room.findById(req.body.rid, function(err, room) {
                res.send({
                    user: usr,
                    room: room
                });
            })
        }
    })
})

app.get("/ball", (req, res) => {
    Booking.find({}, function(err, result) {
        if (err) {
            console.log(err.message)
        } else {
            res.send(result);
        }
    })


});
app.get("/hfs", (req, res) => {
    Itab.findById("5aee68fe134c1630ccb04865", function(err, item) {
        if (err) {
            res.send({});

        } else {
            res.send(item);
        }
    })

});
app.get("/feedback", (req, res) => {
    Feedback.find({}, function(err, item) {
        if (err) {
            res.send({});

        } else {
            res.send(item);
        }
    })

});

app.post("/feedback", async(req, res) => {
    try {
        const result = await new Feedback(req.body).save()
        res.status(200).send({
            rooms: result
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
})


app.post("/deleteRep", function(req, res) {
    Feedback.findByIdAndRemove(req.body.id, function(err, ret) {
        if (err) {
            console.log(err.message)
        }
        res.send("ok")
    })

})



app.post("/reply", function(req, res) {
    sendEmail(req.body.email, req.body.message, "salientke feedback repy");
    res.send("ok")
})
app.post("/token", function(req, res, next) {
    var stripe = require("stripe")("sk_test_A98yWXNGWXcQZBMc3DkXLi3d");
    let token = req.body.token;
    console.log(token)
    stripe.charges.create({
        amount: 2000,
        currency: "usd",
        source: token, // obtained with Stripe.js
        description: "Booking room"
    }, function(err, charge) {
        if (err) {

            res.send("error")

        } else {
            console.log(charge);
            var book = req.body.book;
            book.paid = 1;
            book.sid = charge._id;
            new Booking(book).save(function(err, booking) {
                if (err) {
                    console.log(err);
                } else {
                    var subject = "booking room id#" + booking._id;
                    sendEmail(req.body.email, req.body.mail, subject);
                    Room.update({
                        _id: req.body.roomId
                    }, {
                        $set: {
                            status: 'no'
                        }
                    }, function(err, update) {
                        if (err) {

                            console.log(err.message)
                        } else {

                        }



                    });
                }


            })

            res.send("charged")
        }


    })
});
// user crud
app.post("/createUser", async(req, res) => {
    console.log(req.body)
    req.body.isAdmin = 0;
    new User(req.body).save(function(err, result) {
        if (err) {
            console.log(err)
            res.send({
                success: 0,
                message: err.name
            })
        } else {
            console.log(result);
            res.send({
                success: 1,
                id: result._id
            })
        }
    })

});

app.get("/getEmployees", function(req, res) {
    Employee.find({}, function(err, emp) {
        if (err) {
            console.log(err.message);
            res.send([])
        }
        res.send(emp)
    })
});
app.post("/saveEmployee", (req, res) => {
    if (req.body.password.length < 40) {
        req.body.password = bcrypt.hashSync(req.body.password);
    }

    console.log(req.body);
    var dd = req.body;
    var id = null;
    delete req.body["password2"]
    if (req.body._id) {
        id = req.body._id;
        delete req.body["_id"]
        Employee.update(id, {
            $set: req.body
        }, function(err, result) {
            if (err) {
                console.log(err.message);
                res.send({
                    success: 0,
                    message: err.message
                })
            } else {
                console.log(result);
                res.send({
                    success: 1,
                    id: result._id
                })
            }
        })

    } else {
        new Employee(req.body).save(function(err, result) {
            if (err) {
                console.log(err.message);
                res.send({
                    success: 0,
                    message: err.message
                })
            } else {
                console.log(result);
                res.send({
                    success: 1,
                    id: result._id
                })
            }
        })
    }
});

app.post("/updateBooking", (req, res) => {
    var id = null;
    if (req.body._id) {
        id = req.body._id;
        delete req.body["_id"];


        Booking.update({
            _id: id
        }, {
            $set: req.body
        }, function(err, update) {
            if (err) {

                console.log(err.message)
            } else {
                var status = null;
                if (req.body.paid = 1) {
                    status = 'no'
                } else {
                    status = 'yes'
                }
                Room.update({
                    _id: req.body.roomId
                }, {
                    $set: {
                        status: status
                    }
                }, function(err, update) {
                    if (err) {

                        console.log(err.message)
                    } else {

                    }

                    res.send("good")

                });
            }



        });
    }

});
app.get("/cancelBooking", (req, res) => {
    var id = null;
    var rid = req.param('rid');



    if (rid) {


        Booking.update({
            roomId: rid
        }, {
            $set: {
                paid: 0
            }
        }, function(err, update) {
            if (err) {

                console.log(err.message)
            } else {

                Room.update({
                    _id: rid
                }, {
                    $set: {
                        status: 'yes'
                    }
                }, function(err, update) {
                    if (err) {

                        console.log(err.message)
                    } else {

                    }

                    res.render("login.ejs")

                });
            }



        });
    }

});
app.post("/updateUser", (req, res) => {
    var id = null;
    if (req.body.user._id) {
        id = req.body.user._id;
        delete req.body.user["_id"];

        User.update({
            _id: id
        }, {
            $set: req.body.user
        }, function(err, update) {
            if (err) {

                console.log(err.message)
            } else {
                console.log(update);
            }

            res.send("good")

        });
    }

});
app.post("/deleteUser", (req, res) => {

    res.render('dash.ejs');

});
app.post("/saveBanner", upload.single('img'), function(req, res, next) {
    req.body.src = req.file.originalname;
    new Iheader(req.body).save(function(err) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("saved")
        }
    });
    res.send("done")

});

app.post("/saveWelcome", function(req, res, next) {
    console.log(req.body)
    new I2(req.body).save(function(err) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("saved")
        }
    });
    res.send("done")

});

app.post("/deleteRoom", async(req, res) => {

    try {
        const result = await Room.findByIdAndRemove(req.body.id);
        if (!result) {
            res.status(500).send('Not found');
            return;
        }
        const rooms = await Room.find({});
        res.status(200).send({
            rooms: rooms
        })

    } catch (error) {
        res.status(500).send(error.responseJSON.message);
    }
});

app.post("/booking", async(req, res) => {

    const data = req.body;
    try {
        const result = await Booking.save(data);
        if (!result) {
            res.status(500).send('Failed to save');
            return;
        }
        const room = await Room.findOneAndUpdate({
            _id: data.roomId
        }, {
            $set: {
                status: "Yes",
                nextFree: data.to
            }
        }, {
            new: true
        })
        const bookings = await Booking.find({});
        res.status(200).send({
            bookings: bookings
        })
    } catch (error) {
        res.status(500).send(error.responseJSON.message);
    }
});

app.post("/checkout", async(req, res) => {
    const data = req.body;
    try {
        const result = await Booking.findById(data.bookingId);
        if (!result) {
            res.status(500).send('Failed to find booking');
            return;
        }
        const room = await Room.findOneAndUpdate({
            _id: result.roomId
        }, {
            $set: {
                status: "No",
                nextFree: new Date()
            }
        }, {
            new: true
        })
        const bookings = await Booking.find({});
        res.status(200).send({
            bookings: bookings
        })


    } catch (error) {
        res.status(500).send(error.responseJSON.message);
    }
});

app.post("/checkroom", async(req, res) => {
    try {
        const result = await Room.find({
            nextFree: {
                $gte: req.body.from
            },
            status: "No"
        });
        res.status(200).send({
            rooms: result
        })
    } catch (error) {
        res.status(500).send(error.responseJSON.message);
    }
});
app.post("/loginUser", (req, res) => {

    res.render('dash.ejs');

});



app.get('/admin', function(req, res) {
    Room.find((err, rooms) => {
        if (err) return console.error(err);

        res.render('admin.ejs', {
                rooms: rooms
            })
            //res.render('index.ejs',{line1:item.line1,line2:item.line2,src:item.src,H2:I2Item});

    });
});



app.post('/maxbooking', function(req, res) {
    sendEmail("philmaxsnr@gmail.com", JSON.stringify(req.body), "salientke feedback repy");
    res.send("ok")
});
app.post('/contactmessage', function asyn(req, res) {
    console.log(req.body)

    res.send({
        success: 1
    })
});


//Start listening for requests
var port = process.env.PORT || 7080;
var server = app.listen(port, function() {

    console.log("app runinng -p 7080");

});


// //moment js
// var moment = require("moment");

// var clientInfo = {};

// //socket.io instantiation
// const io = require("socket.io")(server)


// // send current users to provided scoket
// function sendCurrentUsers(socket) { // loading current users
//   var info = clientInfo[socket.id];
//   var users = [];
//   if (typeof info === 'undefined') {
//     return;
//   }
//   // filte name based on rooms
//   Object.keys(clientInfo).forEach(function (socketId) {
//     var userinfo = clientInfo[socketId];
//     // check if user room and selcted room same or not
//     // as user should see names in only his chat room
//     if (info.room == userinfo.room) {
//       users.push(userinfo.name);
//     }

//   });
//   // emit message when all users list

//   socket.emit("message", {
//     name: "System",
//     text: "Current Users : " + users.join(', '),
//     timestamp: moment().valueOf()
//   });

// }


// // io.on listens for events
// io.on("connection", function (socket) {
//   console.log("User is connected");

//   //for disconnection
//   socket.on("disconnect", function () {
//     var userdata = clientInfo[socket.id];
//     if (typeof (userdata !== undefined)) {
//       socket.leave(userdata.room); // leave the room
//       //broadcast leave room to only memebers of same room
//       socket.broadcast.to(userdata.room).emit("message", {
//         text: userdata.name + " has left",
//         name: "System",
//         timestamp: moment().valueOf()
//       });

//       // delete user data-
//       delete clientInfo[socket.id];

//     }
//   });

//   // for private chat
//   socket.on('joinRoom', function (req) {
//     clientInfo[socket.id] = req;
//     socket.join(req.room);
//     //broadcast new user joined room
//     socket.broadcast.to(req.room).emit("message", {
//       name: "System",
//       text: req.name + ' has joined',
//       timestamp: moment().valueOf()
//     });

//   });

//   // to show who is typing Message

//   socket.on('typing', function (message) { // broadcast this message to all users in that room
//     socket.broadcast.to(clientInfo[socket.id].room).emit("typing", message);
//   });

//   // to check if user seen Message
//   socket.on("userSeen", function (msg) {
//     socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);
//     //socket.emit("message", msg);

//   });

//   socket.emit("message", {
//     text: "Welcome to Chat Appliction !",
//     timestamp: moment().valueOf(),
//     name: "System"
//   });

//   // listen for client message
//   socket.on("message", function (message) {
//     console.log("Message Received : " + message.text);
//     // to show all current users
//     if (message.text === "@currentUsers") {
//       sendCurrentUsers(socket);
//     } else {
//       //broadcast to all users except for sender
//       message.timestamp = moment().valueOf();
//       //socket.broadcast.emit("message",message);
//       // now message should be only sent to users who are in same room
//       socket.broadcast.to(clientInfo[socket.id].room).emit("message", message);
//       //socket.emit.to(clientInfo[socket.id].room).emit("message", message);
//     }

//   });
// });