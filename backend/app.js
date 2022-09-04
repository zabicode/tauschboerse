const path = require('path');
const express = require('express');
const multer = require('multer');
const Figure = require('./models/figure');
bodyParser = require('body-parser');

const checkAuth = require('./middleware/check-auth')

//USER ROUTE
const userRoutes = require("./routes/users");

const app = express();
const db = require('./util/database');


// needed for search operators
const Sequelize = require('sequelize');
const User = require('./models/user');
const Op = Sequelize.Op;
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("/Users/Lulu/Documents/ProgZeugs/tauschboerse/backend/images")));

//console.log(express.static(path.join("backend/images")))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT , DELETE, OPTIONS");
    next();
});



const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "/Users/Lulu/Documents/ProgZeugs/tauschboerse/backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});



app.post("/api/figures", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {

    const url = req.protocol + '://' + req.get("host");

    console.log(req.userData.userId);

    Figure.create({
        name: req.body.name,
        description: req.body.description,
        franchise: req.body.franchise,
        imagePath: url + "/images/" + req.file.filename,
        userId: req.userData.userId
    })
    .then(createdFigure => {
            res.status(201).json({
                message: 'Figure created successfully',
                figure: {
                    ...createdFigure,  // JS nextGen Feature
                    id: createdFigure.id
                }
            }
            );
        });
});


// ORIGINAL UPDATE FUNCTION
/*
app.put("/api/figures/:id", (req, res, next) => {


    Figure.update({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        franchise: req.body.franchise,
        imagePath: req.body.imagePath
    },
        {
            where: { id: req.body.id }
        });

    res.status(201).json({
        message: 'Figure updated successfully'
    });
});
*/

app.put("/api/figures/:id", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {

    const url = req.protocol + '://' + req.get("host");

    Figure.update({
        name: req.body.name,
        description: req.body.description,
        franchise: req.body.franchise,
        imagePath: url + "/images/" + req.file.filename,
        userId: req.userData.userId
    },
        {
            where: {
                id: req.body.id, 
                userId: req.userData.userId }
        })
        .then(updatedFigure => {
            if(updatedFigure == true){
                res.status(201).json({
                    message: 'Figure updated successfully',
                    figure: {
                        ...updatedFigure,  // JS nextGen Feature
                        id: updatedFigure.id
                    }
                }
                );
            } else {
                res.status(401).json({message: 'Not authorized!'});
            }
            
        });

});

app.get('/api/figures/:id', (req, res, next) => {

    const figureId = req.params.id;
    Figure.findByPk(figureId)
        .then(figure => {
            if (!figure) {
                const error = new Error('Cound not find figure');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Figure fetched successfully!',
                figure: figure
            });
        })
        .catch(err => {
            console.log(err);
        });
});



// SECOND APPROACH
//
/*
app.get('/api/figures/:figureId',(req, res, next) => {

    let id = figureId;
    Figure.findAll({where: {id: id}})
    .then(products => {
        console.log(products[0]);

        res.status(200).json({
            message: 'Posts fetched successfully!',
            product: products[0]
        });
    })
    .catch(err =>{
        console.log(err);
    });
});
*/



app.get('/api/figures', (req, res, next) => {

    //PAGINATOR
    const pageSize = +req.query.pagesize;  // comes from URL so its always treated as string
    const currentPage = +req.query.page;   //  ""
    const searchParam = req.query.search;
    let figureCount = 0;
    let figures = [];


    if(searchParam){
        Figure.findAndCountAll(
            {
                where: {
                    name: {[Op.like]: `%${searchParam}%`
                }},
                limit: pageSize,
                offset: currentPage * pageSize
            })
            .then(products => {
                figures = products;
                //figureCount = figures.count;
                
                res.status(200).json({
                    message: 'Posts fetched successfully!',
                    figures: figures.rows,
                    count: figures.count
                });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        Figure.findAndCountAll(
            {
                limit: pageSize,
                offset: currentPage * pageSize
            })
            .then(products => {
                figures = products;
                //figureCount = figures.count;
                
                res.status(200).json({
                    message: 'Posts fetched successfully!',
                    figures: figures.rows,
                    count: figures.count
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

});

app.delete('/api/figures/:id', checkAuth, (req, res, next) => {

    const figureId = req.params.id;
    Figure.destroy({ where: { id: figureId, userId: req.userData.userId } })
        .then(result => {
            //console.log(result);
            if(result == true ){
                res.status(200).json({ message: 'Deletion successfully'});
            } else {
                res.status(401).json({ message: 'Not authorized!'});
            }
        })
});





// USING USERS ROUTE
app.use('/api/user', userRoutes)
////////////////////

// RELATION MANY TO ONE
Figure.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Figure);

db
.sync()
.then(result => {
    //console.log(result);
})
.catch(err => {
    console.log(err);
});



module.exports = app;