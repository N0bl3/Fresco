let express = require('express')
const router =  new express.Router()

/* GET home page. */
router.get("/", function (req, res, next) {
    const title = "Fresco";
    const HEIGHT = process.env.HEIGHT;
    const WIDTH = process.env.WIDTH;
    console.log(
      "Expected Dimensions:",
      WIDTH,
      HEIGHT,
      "Total pixels:",
      WIDTH * HEIGHT
    );
  
    let pixels;
    async function getPixels() {
      pixels = await req.collection.find({}).toArray();
      console.log("DB documents:", pixels.length);
      let renderedPixels = [];
      let counter = 0;
      for (let i = 0; i < HEIGHT; i++) {
        renderedPixels.push([]);
        for (let j = 0; j < WIDTH; j++) {
          if (counter >= pixels.length) {
            console.error("Going over db pixel count. Going back to the start.");
            counter = 0;
          }
          renderedPixels[i].push(pixels[counter++]);
        }
      }
      res.render("index", { title, pixels: renderedPixels });
    }
    getPixels();
  });
  
  /* POST a pixel change in color. */
  router.post("/change", function (req, res, next) {
    if (
      req.body.x >= 0 &&
      req.body.y >= 0 &&
      req.body.x < process.env.MAX_NUMBER_OF_PIXELS / req.body.y &&
      req.body.y < process.env.MAX_NUMBER_OF_PIXELS / req.body.x
    ) {
      const changedPixel = {
        r: parseInt(req.body.r),
        g: parseInt(req.body.g),
        b: parseInt(req.body.b),
        _id: req.body._id,
      };
      const changedPixelIndex = req.body.x * req.body.y;
      async function updateResult() {
        try {
          const updateResult = await req.collection.updateOne(
            { _id: changedPixel._id },
            { $set: { r: changedPixel.r, g: changedPixel.g, b: changedPixel.b } }
          );
          console.log("Updated documents =>", updateResult);
          pixels[changedPixelIndex] = changedPixel;
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
      updateResult();
    } else {
      res.sendStatus(500);
    }
  });

module.exports = router