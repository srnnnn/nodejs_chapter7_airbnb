const Place = require('../models/Place');

exports.getPlaces = async (req,res)=>{
    try {
        const places = await Place.find(); //place 컬렉션에 있는 거 다 가져옴
        res.status(200).json({
            places
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

exports.userPlaces = async (req,res)=>{
    try {
        const userData = req.user;
        const id = userData.id;
        res.status(200).json(await Place.find({owner: id})); //owner가 이유저 아이디인 것만

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

exports.singlePlace = async (req,res)=>{
    try {
        const {id } = req.params;
        const place = await Place.findById(id);
        
        if(!place){
            return res.status(400).json({
                message: 'Place Not Found',
            })
        }

        res.status(200).json({
            place
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        })   
    }
}

exports.searchPlaces = async (req,res)=>{
    try {
        const searchedWord = req.params.key;

        if(searchedWord === '') return res.status(200).json(await Place.find()); //만약 검색한 내용이 없다면 다 보여줌

        const searchMatches = await Place.find({address: {$regex: searchedWord, $options: 'i'}}) //검색한 내용과 비슷한 내용 가져오기../options는 Case Insensitive라고 해서 소문자와 대문자를 똑같이
        res.status(200).json(searchMatches);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

exports.addPlace = async (req,res)=>{
    try {
        const userData = req.user;

        const {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price
        } = req.body;

        const place = await Place.create({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price
        });

        res.status(200).json({
            place
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error...",
            error: error
        })
    }
}