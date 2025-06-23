const express = require('express')
const app = express()
const port = 3000
// const cors = require('cors') //i may have to return to later

// login system willl be here
//consr uders = []

app.set('view engine', 'ejs')

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

//logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`)
    next()
  })  

let blogposts = [];

app.get('/', (req, res) => {
    const filter = req.query.filter;
const filteredPosts = filter && filter !== ''
  ? blogposts.filter(post => post.category === filter)
  : blogposts;

  
  res.render('index', { posts: filteredPosts, filter });
  });
  

//Possible place for ID fucntion in the future

app.post('/create', (req, res) => {
    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        createdAt: new Date().toLocaleString()
    }; 
     
      
    // error check to see whats being submitted if so
    console.log('New post made:', newPost)

    blogposts.push(newPost);
     res.redirect('/');
  });  

  app.post("/delete/:id", (req, res) => {
    const postIndex = parseInt(req.params.id)

    if (!isNaN(postIndex)) {
        console.log('DELETE route hit for index:', postIndex); //Show delete button works
      blogposts.splice(postIndex, 1);
    }
    res.redirect('/');
  });  

  app.get('/edit/:id', (req, res) => {
    const index = parseInt(req.params.id);

    const post = blogposts[index]
      if (post) {
        res.render('edit', { post, index })
    } else {
        res.redirect('/');
    }
  });
  
  app.post('/edit/:id', (req, res) => {
    const index = parseInt(req.params.id)
      if (!isNaN(index)) {
        blogposts[index] = {
            author: req.body.author,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            createdAt: blogposts[index].createdAt //
          };          
    }
    res.redirect('/');
  });  

  // 
  app.use((req, res) => {
    res.status(404).send('404 - error');
  });

app.listen(port, () => {
  console.log(`Blog app server running at http://localhost:${port}`);
});
