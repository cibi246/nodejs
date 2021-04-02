const https = require("https");

const API_URL = 'https://jsonmock.hackerrank.com/api/articles?author=';

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout

});

readline.question('Enter the author name: ', name=>{
    getArticleTitles(name).then(result => console.log(result));
})

async function getArticleTitles(author){
    let arrayOfTitles = [], totalPages = 1, currentPage = 1, promises=[];
    let response = await fetchData(author);
    console.log(response);
    totalPages = response.total_pages;
    currentPage = response.page;

    arrayOfTitles = getTitles(response.data);

    for(let i = currentPage +1; i<=totalPages;i++){
        promises.push(fetchData(`${author}&page=${i}`));
    }
    let resp = await Promise.all(promises);
    arrayOfTitles.push(...getArticlesFromPromise(resp));
    return arrayOfTitles;
}

function getArticlesFromPromise(promisesResp){
    let arrayOfTitles = [];
    promisesResp.map(article => {
        arrayOfTitles.push(...getTitles(article.data));
    });
    return arrayOfTitles; 
}

function getTitles(articles){
    let arrayOfTitles= [];
    articles.map(article =>{
        if(article.title){
            arrayOfTitles.push(article.title)
        }else if(article.story_title){
            arrayOfTitles.push(article.story_title)
        }
    });
    return arrayOfTitles;
}

async function fetchData(query){
    return new Promise(function(resolve, reject){
        https.get(`${API_URL}${query}`, resp =>{
            let data = '';

            resp.on('data', (chunk) =>{
                data+=chunk;
            });

            resp.on('end', ()=>{
                resolve(JSON.parse(data));
            }).on('error', (err)=>{
                reject('Err: ');
            });
        })
    })
}