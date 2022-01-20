# Arukereso.hu | pazaruvaj.com | compari.ro scraper

A Scraper for the Hungarian e-commerce / price comparison website Arukereso.hu and its sister sites:
- Romania: compari.ro
- Bulgaria: pazaruvaj.com

## Usage
Provide the product list url to scrape from to the actor. Use this to prefilter the results to your liking. Examples:
- `https://www.compari.ro/telefoane-mobile-c3277/apple/`
- `https://www.arukereso.hu/mobiltelefon-c3277/f:aiwa,alcatel,alcor,aligator,allview,asus,bea-fon,blaupunkt,caterpillar,cpa,cubot,doro,emporia,energizer,evolveo,gigaset,gionee,google,huawei,ilike,l8star,leagoo,lg,maxcom,myphone,navon,ruggear,samsung,sencor,sony,ulefone,umidigi,zopo,zte,hosszusag=0-151/`
- `https://www.pazaruvaj.com/prenosimi-kompjutri-c3100/f:8-gb,16-gb,cena=1/`

## Output format
The output for each product looks like this:
```json
{
  "url": "https://www.pazaruvaj.com/mobilni-telefoni-gsm-c3277/apple/iphone-13-128gb-p706181766/",
  "id": "p706181766",
  "name": "Apple iPhone 13 128GB   Мобилни телефони (GSM)",
  "recommendedPrice": 1660,
  "offers": [
    {
      "name": "Apple iPhone 13, 128GB",
      "price": 1699,
      "shop": "ofisitebg.com",
      "url": "https://www.pazaruvaj.com/Jump.php?ProductAttributeId=868627701"
    },
    {
      "name": "Apple iPhone 13 128GB White",
      "price": 1660,
      "shop": "gsm-bg.eu",
      "url": "https://www.pazaruvaj.com/Jump.php?ProductAttributeId=894591282"
    }
  ]
}
```
