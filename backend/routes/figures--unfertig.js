//const path = require('path');
//const { urlencoded, json } = require('express');
const express = require('express');
const multer = require('multer');
const Figure = require('./models/figure');
//const app = express();

const router = express.Router();

const db = require('./util/database');

// needed for search operators
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

bodyParser = require('body-parser');


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


router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {

    const url = req.protocol + '://' + req.get("host");

    Figure.create({
        name: req.body.name,
        description: req.body.description,
        franchise: req.body.franchise,
        imagePath: url + "/images/" + req.file.filename
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

router.put("/:id", (req, res, next) => {


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



router.get('/:id', (req, res, next) => {

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



router.get('', (req, res, next) => {

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

router.delete('/:id', (req, res, next) => {

    const figureId = req.params.id;
    Figure.destroy({ where: { id: figureId } })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Post deleted'
            });
        });

});


db.sync().then(result => {
    //console.log(result);
}).catch(err => {
    console.log(err);
});

module.exports = router;