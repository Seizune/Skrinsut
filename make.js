const puppeteer = require('puppeteer');
const { exec } = require('child_process');
var fs = require('fs');
var csv = require("fast-csv");
var async = require("async");
const { createCanvas, loadImage } = require('canvas')

const canvas = createCanvas(1920, 1080),
      ctx = canvas.getContext('2d')

var domain_name = [];
var domain_failed = [];

var dir = './screenshoot/';
var read_domain = fs.createReadStream("testing.csv");
var read_domainStream = csv
    .fromStream(read_domain)
    .on("data", function(data){
         domain_name.push(data[0]);
    })
    .on("end", async function(){
      for(var i = 0 ; i < domain_name.length ; i++){
        await screenshooooooooooooooooot(domain_name[i],0);
      }
      var ws =  await fs.createWriteStream('failed_domain.csv');
      await csv.write(domain_failed,{headers:false}).pipe(ws);
    });

async function screenshooooooooooooooooot(domain, i , max_attemp = 5){

    try{
      console.log('start processing '+domain);
      var key = 'XFxwYWNrYWdlXFxuaXJjbWQuZXhlIG1lZGlhcGxheSAyMDAwIA==';
      var key2 = 'XFxwYWNrYWdlXFxpbmRleC5qcy5tcDM=';

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      //LOAD PAGE
      await page.goto(
        'http://' + domain  , 
        {
          waitUntil:'networkidle2', 
          timeout: 20000
        });

      //await page.waitFor(20000);

      //SET VIEWPORT
      await page.setViewport({width: 1920, height: 938});

      //SCREENSHOOT
      await page.screenshot({
          path: 'screenshoot/'+ domain + '.png',
          type: 'png',
          fullPage: false
      });

      //SUCCESSS
      exec(__dirname + Buffer.from(key, 'base64').toString('ascii')+ __dirname + Buffer.from(key2, 'base64').toString('ascii'), (error, stdout, stderr) => {
        if (error) {
          console.error(`Err : Screen Shoot Failed`);
          return;
        }
        console.log(`Screen Shoot Success`);
      });

      
      loadImage('screenshoot-dummy.png').then((image) => {
        ctx.drawImage(image, 0, 0, 1920, 1080)
        console.log('load dummy img')
        ctx.font = '15px arial'
        ctx.fillText(domain ,350,70);
      }).then(() => {
        return loadImage('screenshoot/'+ domain + '.png');
      }).then((image) => {
        ctx.drawImage(image, 0, 92, 1920, 938)
        console.log('load screen shoot')
      }).then(()=>{
          var out = fs.createWriteStream('screenshoot/'+domain+'.jpeg')
          , stream = canvas.jpegStream();

        stream.pipe(out);

        fs.unlink('screenshoot/'+domain+'.png', (err) => {
          if (err) throw err;
        });

        out.on('finish', function(){
          console.log('The JPEG file was created.');
        });

      })
      await browser.close();
    }catch(error){
        if (i >= max_attemp) {
          throw error;  // variant: wrap the exception, e.g. throw new RuntimeException(e);
          domain_failed.push(domain)
        }
          screenshooooooooooooooooot(domain,i++);
          console.error('err retrying for '+domain);
        }
        
}

