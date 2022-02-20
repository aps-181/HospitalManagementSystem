const express = require('express');
const app = express();
const path = require('path')
var mysql = require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "aravind",
});

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});



const patients = { "John": "jon", "Bryann": "By", "Mark": "marco" }
const medicines = { "John": ["med1", "med2", "med3"], "Bryann": ["med1", "med4", "med5"], "Mark": ["med3", "med4"] };
var bodyParser = require('body-parser');
const res = require('express/lib/response');
const req = require('express/lib/request');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server is on!!")
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))


app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.render('login')
})
var usrname = "your name";

app.post('/', (req, res) => {
    usrname = req.body.usrname;
    let psw = req.body.psw;

    con.query('SELECT * FROM test.login WHERE usrname = ?', [usrname], (err, rows, fields) => {
        if (!err) {
            if (rows[0].password === psw) {
                con.query('SELECT * FROM test.patient WHERE fname = ?', [usrname], (err, rows, fields) => {
                    if (!err) {
                        const details = rows[0];
                        console.log(details)
                        res.render('patient', { details });

                    }
                    else {
                        console.log(err);
                        res.send("An unexpexted error has occurred.Please login again")
                    }
                })
            }
            else {
                res.render('login');
            }
        }
        else {
            console.log(err);
            res.render(login);
        }
    })

})


app.get('/patient', (req, res) => {

    con.query('SELECT * FROM test.patient WHERE fname = ?', [usrname], (err, rows, fields) => {
        if (!err) {
            const details = rows[0];
            console.log(details)
            res.render('patient', { details });

        }
        else {
            console.log(err);
            res.send("An unexpexted error has occurred.Please login again")
        }
    })
})

// app.get('/meidicines', (req, res) => {
//     // const arr = medicines[usrname];
//     // res.render('medicines', { usrname, arr });
//     let temp = 12;
//     var pname = "name"
//     var dname = "name"

//     let d = 1
//     try {
//         queryPromise('SELECT * FROM test.patient_medicine WHERE P_Id = ?', [temp])
//             .then(data => {
//                 const medicines = data;
//                 queryPromise('SELECT * FROM test.patient WHERE P_Id = ?', [temp])
//                     .then(data => {
//                         pname = data[0].fname;
//                         queryPromise('SELECT * FROM test.doctor WHERE D_Id = ?', [d])
//                             .then(data => {
//                                 dname = data[0].name
//                                 console.log(dname)
//                                 console.log(pname)
//                                 res.render('medicines', { medicines, pname, dname }, { async: true });
//                             }
//                             )
//                     })
//             })
//         //                 .catch(err => {
//         //                     console.log(err);
//         //                     res.send("An unexpexted error has occurred1.Please login again")

//         //                 })
//         //         })
//         //         .catch(err => {
//         //             console.log(err);
//         //             res.send("An unexpexted error has occurred.Please login again")

//         //         })
//         // })
//         // .catch(err => {
//         //     res.send("An unexpexted error has occurred.Please login again")

//         // })
//     }
//     catch (e) {
//         console.log(e)
//         res.send("An unexpexted error has occurred.Please login again")
//     }


// })






app.get('/medicines', (req, res) => {
    let temp = 12
    con.query('SELECT mname,qty,DoI,dname FROM ((test.patient_medicine INNER JOIN test.medicines ON patient_medicine.M_Id = medicines.M_Id) INNER JOIN test.doctor ON patient_medicine.D_Id = doctor.D_Id)', (err, rows, fields) => {
        if (!err) {
            const meds = rows;
            // res.send(rows);
            const dname = rows[0].dname
            res.render('medicines', { dname });

        }
        else {
            console.log(err);
            res.send("An unexpexted error has occurred.Please login again")
        }
    })
})









app.get('/appointment', (req, res) => {
    con.query('SELECT * FROM test.login', (err, rows, fields) => {
        if (!err)
            console.log(rows[0].usrname);
        else
            console.log(err);
    })
})


function queryPromise(str, params) {
    return new Promise((resolve, reject) => {
        con.query(str, params, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}



// async function queryPromise(str, params) {
//     return con.query(str, params, (err, result, fields))
// }

// async function queryhandle(str,params){
//     await queryPromise(str,params)
//     .then(data => {
//         return data;
//     })
//     .catch
// }

// async function queryhandle(str, params) {
//     const data = await con.query(str, params)
//     console.log(data)
//     return data;
// }