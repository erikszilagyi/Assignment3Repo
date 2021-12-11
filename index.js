const app = require('express')();
const port = process.env.PORT || 8080;


const fs = require('fs');


let artist = fs.readFileSync('data/artists.json');
let artistJson = JSON.parse(artist);
//console.log(artist);

let painting = fs.readFileSync('data/paintings-nested.json');
let paintJson = JSON.parse(painting);

//console.log(paintJson);

let gallery = fs.readFileSync('data/galleries.json');
let galleryJson = JSON.parse(gallery);

//console.log(galleryJson);


/* artistJson = JSON.parse('data//artists.json');
galleriesJson = JSON.parse('data//galleries.json');
paintaingsJson = JSON.parse('data//paintings-nested.json');

console.log(artistJson); */




   


// works
app.get('/api/paintings', (req,res) =>
{
    res.send(paintJson);
});

// works
  app.get('/api/painting/:id', (req,res) =>
{
    let painting = findId(req.params.id,paintJson)

    
   
    if(painting == null)
    {
        res.send("No painting found");
    }
    else
    {
    res.send(painting);
    }
    
    
}); 


// works
app.get('/api/artists' ,(req,res) => 
{
    res.send(artistJson);
});


// works
app.get('/api/galleries' ,(req,res) => 
{
    res.send(galleryJson);
});

 function findId(id,paintings)
{
    for(let painting of paintings)
    {
        if(painting.paintingID == id)
        {
            return painting;
        }
    }
    return null;
} 


// works
 app.get('/api/painting/gallery/:id',(req,res) => 
{
    let galleries = findGallery(req.params.id,paintJson);
    
    console.log(galleries);
    

    if(galleries == [])
    {
       res.send("No item found");
    }    
    else
    {
    res.send(galleries);
    }
    
});

function findGallery(id,paintings)
{
    
    const galleryList =[];
    for(let gallery of paintings)
    {
        
        if(gallery.gallery.galleryID == id)
        {
            //console.log("found one");
            galleryList.push(gallery);
        }
    }
    return galleryList;
}

// works
app.get('/api/painting/artist/:id',(req,res) =>
{
    let artistPaintings = getPaintaingsByArtist(req.params.id,paintJson);
    if(artistPaintings == [])
    {
        res.status(404).send("Error occured");
    }
    else
    {
    res.send(artistPaintings);
    }


});

function getPaintaingsByArtist(id,paintingList)
{
    const authorPaintingList = [];

    for(let painting of paintingList)
    {
        if(painting.artist.artistID == id)
        {
            authorPaintingList.push(painting);
        }

    }

    return authorPaintingList;


}

// works
app.get('/api/painting/title/:text',(req,res) =>
{
    let listOfPaintings = getPaintingsByText(req.params.text,paintJson);
    if(listOfPaintings == [])
    {
        res.send("No painting titles contain the text");
    }
    else
    {
    res.send(listOfPaintings);
    }
});
;

 function getPaintingsByText(text,paintingList)
 {
    const paintingListByText = [];

    for(painting of paintingList)
    {
        if(painting.title.toLowerCase().includes(text.toLowerCase()))
        {
            paintingListByText.push(painting);
        }
    }

    return paintingListByText;
 }



 

 app.get('/api/artists/:country',(req,res) =>
 {
     let countryList = [];
     countryList = findArtistsInCountry(req.params.country,artistJson);
     if(countryList == [])
     {
         res.send("No artists for this country");
     }
     else
     {
     res.send(countryList);
     }
 });

// works
 function findArtistsInCountry(country,listOfArtists)
 {
    const artistList = [];
    //console.log(country);
    for(let artist of listOfArtists)
    {
        //console.log(artist.Nationality);
       if(artist.Nationality.toLowerCase().includes(country.toLowerCase()))
       {
           artistList.push(artist);
       }
    }
    return artistList;


 }


 app.get('/api/galleries/:country', (req,res) =>
{
    let galleriesCountry = galleriesFromCountry(req.params.country,galleryJson);
    
    if(galleriesCountry == [])
        {
            res.send("No galleries in this country");
        }
        else
        {
            res.send(galleriesCountry);
        }

    res.send(galleriesCountry);
    
});


function galleriesFromCountry(country,galleryOfCountries)
{
    const galleriesForCountry = [];

    for(let singleGallery of galleryOfCountries)
    {
        if(singleGallery.GalleryCountry.toLowerCase() == country.toLowerCase()) 
        {
            galleriesForCountry.push(singleGallery);
            console.log("Match");
        } 
    }

    return galleriesForCountry;

}



 
app.get('/api/painting/year/:min/:max',(req,res) =>
{
    
    let paintYearList = getPaintingsYearRange(req.params.min,req.params.max,paintJson);

    if(paintYearList == [])
    {
        res.send("No paintings found within specified years")
    }
    else{
        res.send(paintYearList);
    }
    

});

function getPaintingsYearRange(min,max,paintList)
{
    let paintingYear = [];

    for(paint of paintList)
    {
        if(paint.yearOfWork >= min && paint.yearOfWork <= max)
        {
            paintingYear.push(paint);
        }
    }
    return paintingYear;
}


app.get('/api/painting/color/:name',(req,res) =>
 {
    let colorArray = dominantColorFinder(req.params.name,paintJson);

    if(colorArray == [])
    {
        res.send("No paintings found with that color");
    }
    else
    {
        res.send(colorArray);
    }
        
 }); 


function dominantColorFinder(color,paintingColorArray)
{
    let coloredPaintingArray = [];
    
    console.log(paintingColorArray.dominantColors.color.web);
    for(individualPainting of paintingColorArray)
    {
        if(color.dominantColors.color.web == color)
        {
            coloredPaintingArray.push(color);
        }

    }
    return coloredPaintingArray;
}



app.listen(
    port,
    () => 
        console.log('Server running at port=', PORT)
    )






