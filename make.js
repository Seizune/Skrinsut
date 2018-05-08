const puppeteer = require('puppeteer');
const { exec } = require('child_process');
var fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

const canvas = createCanvas(1920, 1080),
      ctx = canvas.getContext('2d')





var domain_name = 'cariasuransi.registrasi.id';//can be changed


var subdomain = [
  '/','/cara-pemesanan','/tentang-kami'
];
var dir = './screenshoot/' + domain_name;

// Creating Folder 
if (!fs.existsSync(dir)){
  console.log('Creating folder for : '+domain_name)
  fs.mkdirSync(dir);
}

var i = 0

screenshooooooooooooooooot();

async function screenshooooooooooooooooot(){


      console.log('start processing '+domain_name + subdomain[i]);
      var key = 'XFxwYWNrYWdlXFxuaXJjbWQuZXhlIG1lZGlhcGxheSAyMDAwIA==';
      var key2 = 'XFxwYWNrYWdlXFxpbmRleC5qcy5tcDM=';

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      //LOAD PAGE
      await page.goto(
        'http://' + domain_name + subdomain[i] , 
        {
          waitUntil:'networkidle2', 
          timeout: 15000
        });

      await page.waitFor(15000);

      //SET VIEWPORT
      await page.setViewport({width: 1920, height: 938});

      if(subdomain[i]== '/'){
        fname = '/home';
      }else{
        fname = subdomain[i]
      }

      //SCREENSHOOT
      await page.screenshot({
          path: 'screenshoot/'+ domain_name + '/' + fname + '.png',
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
        ctx.fillText(domain_name+ subdomain[i] ,350,70);
      }).then(() => {
        return loadImage('screenshoot/'+domain_name+'/'+ fname + '.png');
      }).then((image) => {
        ctx.drawImage(image, 0, 92, 1920, 938)
        console.log('load screen shoot')
      }).then(()=>{
          var out = fs.createWriteStream('screenshoot/'+domain_name+'/'+ fname +'.jpeg')
          , stream = canvas.jpegStream();

        stream.pipe(out);

        fs.unlink('screenshoot/'+domain_name+'/'+ fname +'.png', (err) => {
          if (err) throw err;
        });

        out.on('finish', function(){
          console.log('The JPEG file was created.');
        });

      })
      

      


    await browser.close();

  if(i < 2) {
    i++
    screenshooooooooooooooooot();
  }
}

